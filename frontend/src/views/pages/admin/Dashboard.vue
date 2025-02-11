<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';

// import { supabase } from '@/utils/supabase';

const toast = useToast();

const daftarSantri = ref([]);

const santriDialog = ref(false);
const deleteSantriDialog = ref(false);
const santri = ref({});
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const angkatan = ref([{ value: '2023' }, { value: '2022' }, { value: '2021' }, { value: '2020' }, { value: '2019' }, { value: '2018' }]);

const getBadgeSeverity = (grade) => {
    switch (grade.toLowerCase()) {
        case 'tercapai':
            return 'success';
        case 'tidak tercapai':
            return 'danger';
        default:
            return 'info';
    }
};

const getSantriGrades = async () => {
    const { data, error } = '';

    let mergedData = data.reduce((acc, curr) => {
        const { id_santri, hafalan, setoran, pentashih, date, santri, subject } = curr;

        if (!acc[id_santri]) {
            acc[id_santri] = {
                santri,
                subjects: {}
            };
        }

        const subjectData = {
            ...subject,
            grade_hafalan: hafalan,
            grade_setoran: setoran,
            pentashih,
            date
        };

        acc[id_santri].subjects[subject.name_slug] = subjectData;

        return acc;
    }, {});

    mergedData = Object.values(mergedData);

    console.log(mergedData);

    daftarSantri.value = [...mergedData];

    console.log(daftarSantri.value);
    console.log(daftarSantri.value[0]);
};

onBeforeMount(() => {
    initFilters();
    getSantriGrades();
});

onMounted(() => {});

const openNew = () => {
    santri.value = {};
    submitted.value = false;
    santriDialog.value = true;
};

const hideDialog = () => {
    santriDialog.value = false;
    submitted.value = false;
};

const saveSantri = async () => {
    submitted.value = true;
    if (santri.value.name && santri.value.name.trim()) {
        if (santri.value.code) {
            // update
            daftarSantri.value[findIndexById(santri.value.id)] = santri.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            santri.value.angkatan = santri.value.angkatan.value;
            santri.value.code = createId();

            console.log(santri.value);

            const newSantri = await supabase.from('santri').insert([santri.value]).select();

            let grades = [];

            for (var i = 1; i <= 13; i++) {
                var data = {
                    id_santri: newSantri.data[0].id,
                    id_subject: i,
                    hafalan: 'Tidak Tercapai',
                    setoran: 'Tidak Tercapai'
                };
                grades.push(data);
            }

            const newGrades = await supabase.from('grade').insert(grades).select();

            console.log(newGrades.value);

            location.reload();

            // daftarSantri.value.push(santri.value);
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        santriDialog.value = false;
        santri.value = {};
    }
};

const editSantri = (editSantri) => {
    santri.value = { ...editSantri };
    santriDialog.value = true;
};

const confirmDeleteSantri = (editSantri) => {
    santri.value = editSantri;
    deletesantriDialog.value = true;
};

const deleteSantri = () => {
    daftarSantri.value = daftarSantri.value.filter((val) => val.id !== santri.value.id);
    deleteSantriDialog.value = false;
    santri.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < daftarSantri.value.length; i++) {
        if (daftarSantri.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    const upperCaseLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);

    const firstDigit = Math.floor(Math.random() * 10);
    const secondDigit = Math.floor(Math.random() * 10);

    return upperCaseLetter + firstDigit + secondDigit;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>
<template>
    <div class="card border-slate-200 border pt-4">
        <div class="flex justify-between">
            <div class="flex flex-column justify-center items-center">
                <h3 class="text-2xl font-bold">Daftar Penilaian Santri</h3>
            </div>
            <Toolbar class="toolbar mb-4 !border-none">
                <template v-slot:start> </template>
                <template v-slot:end>
                    <div class="flex gap-4">
                        <IconField iconPosition="left" class="block mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Cari santri..." />
                        </IconField>
                        <Button label="Export" icon="pi pi-upload" severity="primary" @click="exportCSV($event)" />
                        <Button label="Baru" icon="pi pi-plus" class="mr-2" severity="primary" @click="openNew" />
                    </div>
                </template>
            </Toolbar>
        </div>

        <DataTable ref="dt" :value="daftarSantri" dataKey="santri.id" :filters="filters" showGridlines>
            <ColumnGroup type="header">
                <Row>
                    <Column header="Nama" :rowspan="3" />
                    <Column header="Angkatan" :rowspan="3" />
                    <Column header="Kode" :rowspan="3" />
                    <Column header="Al-Qur'an" :colspan="12" />
                    <Column header="Sholat dan Wudhu" :colspan="4" />
                    <Column header="Tahlil dan Wirid" :colspan="7" />
                    <Column header="Pentashih" :rowspan="3" />
                    <Column header="Tanggal" :rowspan="3" headerStyle="min-width:12rem" />
                    <Column header="" :rowspan="3" />
                </Row>
                <Row>
                    <Column header="Juz Amma" :colspan="2" />
                    <Column header="Al-Mulk" :colspan="2" />
                    <Column header="As-Sajdah" :colspan="2" />
                    <Column header="Al-Waqiah" :colspan="2" />
                    <Column header="Ar-Rahman" :colspan="2" />
                    <Column header="Yasin" :colspan="2" />
                    <Column header="Bacaan Sholat" :colspan="2" />
                    <Column header="Bacaan Wudhu" :colspan="2" />
                    <Column header="Tahlil" :colspan="2" />
                    <Column header="Wirid" :colspan="2" />
                    <Column header="Istighosah" />
                    <Column header="Ratibul Haddad" />
                    <Column header="Maulid Barzanjie" />
                </Row>
                <Row>
                    <Column header="Setoran" />
                    <!-- Juz Amma -->
                    <Column header="Hafalan" />
                    <Column header="Setoran" />
                    <!-- Al-Mulk -->
                    <Column header="Hafalan" />
                    <Column header="Setoran" />
                    <!-- As-Sajdah -->
                    <Column header="Hafalan" />
                    <Column header="Setoran" />
                    <!-- Al-Waqiah -->
                    <Column header="Hafalan" />
                    <Column header="Setoran" />
                    <!-- Ar-Rahman -->
                    <Column header="Hafalan" />
                    <Column header="Setoran" />
                    <!-- Yasin -->
                    <Column header="Hafalan" />
                    <Column header="Setoran" />
                    <!-- Bacaan Sholat -->
                    <Column header="Hafalan" />
                    <Column header="Setoran" />
                    <!-- Bacaan Wudhu -->
                    <Column header="Hafalan" />
                    <Column header="Setoran" />
                    <!-- Tahlil -->
                    <Column header="Hafalan" />
                    <Column header="Setoran" />
                    <!-- Wirid -->
                    <Column header="Hafalan" />
                    <Column header="Setoran" />
                    <!-- Istighosah -->
                    <Column header="Setoran" />
                    <!-- Ratibul Haddad -->
                    <Column header="Setoran" />
                    <!-- Maulid Barzanji -->
                </Row>
            </ColumnGroup>

            <Column field="santri.name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    {{ slotProps.data.santri.name }}
                </template>
            </Column>
            <Column field="santri.angkatan" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    {{ slotProps.data.santri.angkatan }}
                </template>
            </Column>
            <Column field="santri.code">
                <template #body="slotProps">
                    {{ slotProps.data.santri.code }}
                </template>
            </Column>
            <Column field="subjects.juz_amma.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.juz_amma.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.juz_amma.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.juz_amma.grade_hafalan">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.juz_amma.grade_hafalan" :severity="getBadgeSeverity(slotProps.data.subjects.juz_amma.grade_hafalan)" />
                </template>
            </Column>
            <Column field="subjects.al_mulk.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.al_mulk.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.al_mulk.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.al_mulk.grade_hafalan">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.al_mulk.grade_hafalan" :severity="getBadgeSeverity(slotProps.data.subjects.al_mulk.grade_hafalan)" />
                </template>
            </Column>
            <Column field="subjects.as_sajdah.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.as_sajdah.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.as_sajdah.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.as_sajdah.grade_hafalan">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.as_sajdah.grade_hafalan" :severity="getBadgeSeverity(slotProps.data.subjects.as_sajdah.grade_hafalan)" />
                </template>
            </Column>
            <Column field="subjects.al_waqiah.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.al_waqiah.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.al_waqiah.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.al_waqiah.grade_hafalan">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.al_waqiah.grade_hafalan" :severity="getBadgeSeverity(slotProps.data.subjects.al_waqiah.grade_hafalan)" />
                </template>
            </Column>
            <Column field="subjects.ar_rahman.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.ar_rahman.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.ar_rahman.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.ar_rahman.grade_hafalan">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.ar_rahman.grade_hafalan" :severity="getBadgeSeverity(slotProps.data.subjects.ar_rahman.grade_hafalan)" />
                </template>
            </Column>
            <Column field="subjects.yasin.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.yasin.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.yasin.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.yasin.grade_hafalan">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.yasin.grade_hafalan" :severity="getBadgeSeverity(slotProps.data.subjects.yasin.grade_hafalan)" />
                </template>
            </Column>
            <Column field="subjects.sholat.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.sholat.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.sholat.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.sholat.grade_hafalan">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.sholat.grade_hafalan" :severity="getBadgeSeverity(slotProps.data.subjects.sholat.grade_hafalan)" />
                </template>
            </Column>
            <Column field="subjects.wudhu.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.wudhu.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.wudhu.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.wudhu.grade_hafalan">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.wudhu.grade_hafalan" :severity="getBadgeSeverity(slotProps.data.subjects.wudhu.grade_hafalan)" />
                </template>
            </Column>
            <Column field="subjects.tahlil.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.tahlil.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.tahlil.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.tahlil.grade_hafalan">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.tahlil.grade_hafalan" :severity="getBadgeSeverity(slotProps.data.subjects.tahlil.grade_hafalan)" />
                </template>
            </Column>
            <Column field="subjects.wirid.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.wirid.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.wirid.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.wirid.grade_hafalan">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.wirid.grade_hafalan" :severity="getBadgeSeverity(slotProps.data.subjects.wirid.grade_hafalan)" />
                </template>
            </Column>
            <Column field="subjects.istighosah.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.istighosah.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.istighosah.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.ratibul_haddad.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.ratibul_haddad.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.ratibul_haddad.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.barzanji.grade_setoran">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.subjects.barzanji.grade_setoran" :severity="getBadgeSeverity(slotProps.data.subjects.barzanji.grade_setoran)" />
                </template>
            </Column>
            <Column field="subjects.juz_amma.pentashih">
                <template #body="slotProps">
                    {{ slotProps.data.subjects.juz_amma.pentashih }}
                </template>
            </Column>
            <Column field="subjects.juz_amma.date">
                <template #body="slotProps">
                    {{ slotProps.data.subjects.juz_amma.date }}
                </template>
            </Column>
            <Column headerStyle="min-width:10rem;">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editSantri(slotProps.data)" />
                    <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteSantri(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="santriDialog" :style="{ width: '450px' }" header="Santri" :modal="true" class="p-fluid">
            <div class="field">
                <label for="name">Nama</label>
                <InputText id="name" v-model.trim="santri.name" required="true" autofocus :invalid="submitted && !santri.name" />
                <small class="p-invalid" v-if="submitted && !santri.name">Mohon isikan nama santri.</small>
            </div>
            <div class="field">
                <label for="angkatan" class="mb-3">Angkatan</label>
                <Dropdown id="angkatan" v-model="santri.angkatan" :options="angkatan" optionLabel="value" placeholder="Pilih angkatan">
                    <template #value="slotProps">
                        <div v-if="slotProps.value">
                            <span :class="'santri-badge' + slotProps.value.value">{{ slotProps.value.value }}</span>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                </Dropdown>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" text="" @click="saveSantri" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteSantriDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="santri"
                    >Are you sure you want to delete <b>{{ santri.name }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteSantriDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSantri" />
            </template>
        </Dialog>
    </div>
</template>

<style>
.toolbar {
    border: none;
}

.p-column-title {
    width: 100%;
    text-align: center;
}
</style>

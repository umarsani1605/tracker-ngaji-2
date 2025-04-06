<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref, computed } from 'vue';
import { CategoryService } from '@/services/categoryService';
import { SubjectService } from '@/services/subjectService';
import { SantriService } from '@/services/santriService';
import { GradeService } from '@/services/gradeService';

const toast = useToast();

const daftarSantri = ref([]);

const santriDialog = ref(false);
const deleteSantriDialog = ref(false);
const santri = ref({});
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

// State untuk menyimpan data
const categories = ref([]);
const subjects = ref([]);
const loading = ref(false);
const error = ref(null);

const getSantriGrades = async () => {
    loading.value = true;
    try {
        const santriRes = await SantriService.getAll();
        const gradeRes = await GradeService.getAll();

        console.log('gradeRes: ' + JSON.stringify(gradeRes));

        // Transform data untuk tabel
        daftarSantri.value = santriRes.data.map((santri) => {
            // Inisialisasi objek subjects dengan semua subject yang ada
            const subjectsData = {};

            // Isi default value untuk semua subject
            subjects.value.forEach((subject) => {
                subjectsData[subject.name] = {
                    // Hanya set 'belum' jika subject memiliki tipe penilaian tersebut
                    grade_setoran: subject.has_setoran ? 'belum' : null,
                    grade_hafalan: subject.has_hafalan ? 'belum' : null,
                    pentashih: '-',
                    date: '-'
                };
            });

            // Filter grade untuk santri ini
            const santriGrades = gradeRes.data.filter((g) => g.id_santri === santri.id);

            console.log('santriGrades: ' + JSON.stringify(santriGrades));

            // Update nilai dari grade yang ada
            santriGrades.forEach((grade) => {
                const subjectName = grade.subject_name;

                // Update nilai sesuai data grade
                if (grade.setoran) {
                    subjectsData[subjectName].grade_setoran = grade.setoran;
                }
                if (grade.hafalan) {
                    subjectsData[subjectName].grade_hafalan = grade.hafalan;
                }

                // Update pentashih dan tanggal jika ada perubahan nilai
                if (grade.setoran !== 'belum' || grade.hafalan !== 'belum') {
                    subjectsData[subjectName].pentashih = grade.pentashih_name;
                    subjectsData[subjectName].date = grade.updated_at;
                }
            });

            // Ambil pentashih dan tanggal terakhir dari grade yang bukan 'belum'
            const latestGrade = santriGrades.filter((g) => g.setoran !== 'belum' || g.hafalan !== 'belum').sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];

            return {
                santri: {
                    id: santri.id,
                    name: santri.name,
                    code: santri.code,
                    angkatan: santri.angkatan
                },
                subjects: subjectsData,
                pentashih: latestGrade?.pentashih_name || '-',
                tanggal: latestGrade?.updated_at || '-'
            };
        });
    } catch (err) {
        console.error('Error fetching santri grades:', err);
        error.value = 'Gagal mengambil data penilaian';
    } finally {
        loading.value = false;
    }
};

onBeforeMount(() => {
    initFilters();
});

onMounted(async () => {
    await fetchData(); // Ambil kategori dan subject dulu
    await getSantriGrades(); // Kemudian ambil data santri dan grade
    console.log('columnGroups: ' + JSON.stringify(columnGroups.value));
    console.log('santri: ' + JSON.stringify(daftarSantri.value));
});

const hideDialog = () => {
    santriDialog.value = false;
    submitted.value = false;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

// Fungsi untuk fetch data
const fetchData = async () => {
    loading.value = true;
    try {
        const [categoriesRes, subjectsRes] = await Promise.all([CategoryService.getAll(), SubjectService.getAll()]);

        categories.value = categoriesRes.data;
        subjects.value = subjectsRes.data;
    } catch (err) {
        console.error('Error fetching data:', err);
        error.value = 'Gagal mengambil data';
    } finally {
        loading.value = false;
    }
};

const columnGroups = computed(() => {
    // Tingkat 1: Kategori
    const level1 = categories.value.map((category) => ({
        header: category.name,
        colspan: subjects.value.filter((s) => s.id_category === category.id).reduce((acc, subj) => acc + (subj.has_hafalan ? 1 : 0) + (subj.has_setoran ? 1 : 0), 0)
    }));

    // Tingkat 2: Subyek
    const level2 = categories.value
        .map((category) =>
            subjects.value
                .filter((s) => s.id_category === category.id)
                .map((subject) => ({
                    header: subject.name,
                    colspan: (subject.has_hafalan ? 1 : 0) + (subject.has_setoran ? 1 : 0)
                }))
        )
        .flat();

    // Tingkat 3: Setoran/Hafalan
    const level3 = subjects.value
        .map((subject) => {
            const columns = [];
            if (subject.has_setoran) {
                columns.push({
                    header: 'Setoran',
                    field: `${subject.id}_setoran`,
                    subject_name: subject.name
                });
            }
            if (subject.has_hafalan) {
                columns.push({
                    header: 'Hafalan',
                    field: `${subject.id}_hafalan`,
                    subject_name: subject.name
                });
            }
            return columns;
        })
        .flat();

    return { level1, level2, level3 };
});

const formatDate = (dateString) => {
    if (dateString === '-') return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getBadgeSeverity = (status) => {
    switch (status) {
        case 'sudah':
            return 'success';
        case 'proses':
            return 'warning';
        case 'belum':
            return 'danger';
        default:
            return null;
    }
};

const getSubjectName = (field) => {
    const subjectId = field.split('_')[0];
    const subject = subjects.value.find((s) => s.id === parseInt(subjectId));
    return subject?.name || '';
};

const getGradeType = (field) => {
    return field.split('_')[1];
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
                    <div v-for="col in columnGroups.level1" :key="col.header">
                        <Column :header="col.header" :colspan="col.colspan" />
                    </div>
                    <Column header="Pentashih" :rowspan="3" />
                    <Column header="Tanggal" :rowspan="3" />
                    <Column header="" :rowspan="3" />
                </Row>
                <Row>
                    <div v-for="col in columnGroups.level2" :key="col.header">
                        <Column :header="col.header" :colspan="col.colspan" />
                    </div>
                </Row>
                <Row>
                    <div v-for="col in columnGroups.level3" :key="col.field">
                        <Column :header="col.header" />
                    </div>
                </Row>
            </ColumnGroup>

            <Column field="santri.name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    {{ slotProps.data.santri.name }}
                </template>
            </Column>
            <Column field="santri.angkatan" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.santri.angkatan }}
                </template>
            </Column>
            <Column field="santri.code">
                <template #body="slotProps">
                    {{ slotProps.data.santri.code }}
                </template>
            </Column>

            <template v-for="subject in subjects" :key="subject.id">
                <Column v-if="subject.has_setoran" :field="`subjects.${subject.name}.grade_setoran`">
                    <template #body="slotProps">
                        <Tag
                            v-if="slotProps.data.subjects[subject.name]?.grade_setoran"
                            :value="slotProps.data.subjects[subject.name].grade_setoran"
                            :severity="getBadgeSeverity(slotProps.data.subjects[subject.name].grade_setoran)"
                            class="!border-none capitalize"
                        />
                        <span v-else>-</span>
                    </template>
                </Column>

                <Column v-if="subject.has_hafalan" :field="`subjects.${subject.name}.grade_hafalan`">
                    <template #body="slotProps">
                        <Tag
                            v-if="slotProps.data.subjects[subject.name]?.grade_hafalan"
                            :value="slotProps.data.subjects[subject.name].grade_hafalan"
                            :severity="getBadgeSeverity(slotProps.data.subjects[subject.name].grade_hafalan)"
                            class="!border-none capitalize"
                        />
                        <span v-else>-</span>
                    </template>
                </Column>
            </template>

            <Column field="pentashih">
                <template #body="slotProps">
                    {{ slotProps.data.pentashih }}
                </template>
            </Column>
            <Column field="tanggal" headerStyle="min-width:12rem">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.tanggal) }}
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

<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onBeforeMount, onMounted, ref } from 'vue';

// import { supabase } from '@/utils/supabase';

const toast = useToast();

const daftarSubyek = ref([]);

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

onBeforeMount(() => {
    initFilters();
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
                <h3 class="text-2xl font-bold">Daftar Santri</h3>
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

        <DataTable ref="dt" :value="daftarSubyek" dataKey="santri.id" :filters="filters" showGridlines>
            <Column field="nama" header="Nama"></Column>
            <Column field="kategori" header="Kategori"></Column>
            <Column field="hafalan" header="Hafalan"></Column>
            <Column field="setoran" header="Setoran"></Column>
            <Column headerStyle="min-width:10rem;">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editSantri(slotProps.data)" />
                    <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteSantri(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style></style>

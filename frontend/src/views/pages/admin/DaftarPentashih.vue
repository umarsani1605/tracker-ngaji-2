<script setup>
import { onMounted, ref, computed } from 'vue';
import { useDialog } from 'primevue/usedialog';
import { PentashihService } from '@/services/pentashihService';
import PentashihFormDialog from '@/components/dialogs/pentashih/PentashihFormDialog.vue';
import DeleteDialog from '@/components/dialogs/shared/DeleteDialog.vue';
import Tag from 'primevue/tag';
import Dropdown from 'primevue/dropdown';

const dialog = useDialog();
const dt = ref();
const daftarPentashih = ref([]);
const loading = ref(false);
const error = ref(null);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    pentashih_name: { value: null, matchMode: 'contains' },
    pentashih_gender: { value: null, matchMode: 'equals' }
});
const sortField = ref(null);
const sortOrder = ref(null);

const hasActiveFilters = computed(() => {
    return Object.keys(filters.value).some((key) => filters.value[key].value !== null && filters.value[key].value !== '');
});

const hasActiveSort = computed(() => {
    return sortField.value !== null && sortOrder.value !== null;
});

const showResetButton = computed(() => {
    return hasActiveFilters.value || hasActiveSort.value;
});

const clearTable = async () => {
    sortField.value = null;
    sortOrder.value = null;

    Object.keys(filters.value).forEach((key) => {
        filters.value[key].value = null;
    });
};

const fetchDaftarPentashih = async () => {
    loading.value = true;
    try {
        const data = await PentashihService.getAll();
        daftarPentashih.value = data.data;
    } catch (error) {
        console.error('Fetch Error: Gagal mengambil data pentashih, ', error);
        error.value = 'Fetch Error: Gagal mengambil data pentashih';
    } finally {
        loading.value = false;
    }
};

const addHandler = () => {
    dialog.open(PentashihFormDialog, {
        props: {
            header: 'Tambah Pentashih',
            style: {
                minWidth: '32rem'
            },
            modal: true
        },
        data: {},
        emits: {
            onSave: (data) => {
                saveData(data);
            },
            onCancel: () => {}
        }
    });
};

const editHandler = (pentashih) => {
    dialog.open(PentashihFormDialog, {
        props: {
            header: 'Edit Pentashih',
            style: {
                minWidth: '32rem'
            },
            modal: true
        },
        data: { ...pentashih },
        emits: {
            onSave: (data) => {
                updateData(data);
            },
            onDelete: (id) => {
                deleteData(id);
            },
            onCancel: () => {}
        }
    });
};

const saveData = async (data) => {
    try {
        await PentashihService.create(data);
        await fetchDaftarPentashih();
    } catch (error) {
        console.error('Error saving pentashih: ', error);
    }
};

const updateData = async (data) => {
    console.log('Data yang akan diupdate:', JSON.stringify(data, null, 2));
    try {
        await PentashihService.update(data.id_pentashih, data.santri_ids);
        await fetchDaftarPentashih();
    } catch (error) {
        console.error('Error updating pentashih: ', error);
    }
};

const deleteHandler = (pentashih) => {
    dialog.open(DeleteDialog, {
        props: {
            header: 'Hapus Pentashih',
            modal: true
        },
        data: pentashih,
        emits: {
            onConfirm: (data) => {
                console.log('masuk delete, data: ', data);
                deleteData(data.id_pentashih);
            },
            onCancel: () => {}
        }
    });
};

const deleteData = async (id) => {
    try {
        await PentashihService.delete(id);
        await fetchDaftarPentashih();
    } catch (error) {
        console.error('Error deleting pentashih: ', error);
    }
};

const genderOptions = [
    { label: 'Laki-laki', value: 'L' },
    { label: 'Perempuan', value: 'P' }
];

const getGenderLabel = (gender) => {
    return genderOptions.find((option) => option.value === gender)?.label || '';
};

const getGenderSeverity = (gender) => {
    return gender === 'L' ? 'info' : 'warning';
};

onMounted(() => {
    fetchDaftarPentashih();
});
</script>

<template>
    <div class="card border-slate-200 border pt-4">
        <div class="flex flex-col gap-2 pt-4">
            <h3 class="text-2xl font-bold">Daftar Pentashih</h3>
            <Toolbar class="toolbar !px-0 !border-none">
                <template #start>
                    <Button v-if="showResetButton" type="button" icon="pi pi-filter-slash" label="Bersihkan" outlined @click="clearTable()" />
                </template>
                <template #end>
                    <div class="flex gap-4">
                        <IconField iconPosition="left" class="block w-80 mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Cari pentashih..." class="w-full" />
                        </IconField>
                        <Button label="Tambah Pentashih" icon="pi pi-plus" severity="primary" @click="addHandler" />
                    </div>
                </template>
            </Toolbar>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-4">Loading...</div>

        <!-- Error State -->
        <div v-else-if="error" class="p-4 text-red-500">
            {{ error }}
        </div>

        <!-- Data Table -->
        <DataTable
            v-else
            ref="dt"
            :value="daftarPentashih"
            :filters="filters"
            removableSort
            dataKey="id"
            showGridlines
            stripedRows
            :globalFilterFields="['pentashih_name']"
            tableStyle="min-width: 50rem"
            filterDisplay="menu"
            class="p-datatable-hoverable"
        >
            <Column field="id" header="No." style="width: 2rem">
                <template #body="{ data }">
                    {{ data.id }}
                </template>
            </Column>

            <Column field="pentashih_name" header="Nama Pentashih" sortable style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.pentashih_name }}
                </template>
            </Column>

            <Column field="pentashih_gender" header="Gender" sortable style="width: 10rem">
                <template #body="{ data }">
                    <Tag :value="getGenderLabel(data.pentashih_gender)" :severity="getGenderSeverity(data.pentashih_gender)" />
                </template>
                <template #filter="{ filterModel }">
                    <Dropdown v-model="filterModel.value" :options="genderOptions" optionLabel="label" optionValue="value" placeholder="Pilih Gender" class="p-column-filter" :showClear="true">
                        <template #value="slotProps">
                            <Tag v-if="slotProps.value" :value="getGenderLabel(slotProps.value)" :severity="getGenderSeverity(slotProps.value)" />
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <Tag :value="slotProps.option.label" :severity="getGenderSeverity(slotProps.option.value)" />
                        </template>
                    </Dropdown>
                </template>
            </Column>

            <Column field="santri_list" header="Daftar Santri" style="min-width: 20rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-2">
                        <Chip v-for="santri in data.santri_list" :key="santri.id" :label="santri.name" class="!bg-[var(--p-primary-100)] !text-[var(--p-primary-800)] !px-4 !rounded-2xl font-medium" />
                    </div>
                </template>
            </Column>

            <Column style="width: 8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editHandler(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteHandler(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
        <DynamicDialog />
    </div>
</template>

<style>
.p-datatable-thead .p-datatable-column-title {
    font-weight: 800;
    margin-inline-end: auto;
}
.p-datatable-thead .p-datatable-column-title + span {
    display: inline-flex;
}
.p-datatable-thead .p-datatable-popover-filter {
    margin-inline-start: 0;
}
.p-datatable.p-datatable-hoverable .p-datatable-tbody > tr:not(.p-highlight):hover {
    background: #f4f4f4;
    color: #495057;
}

.p-datatable.p-datatable-hoverable .p-datatable-tbody > tr {
    transition: background-color 0.2s;
}
</style>

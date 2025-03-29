<script setup>
// import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref, computed } from 'vue';
import { useDialog } from 'primevue/usedialog';
import { SantriService } from '@/services/santriService';
import { useSantriStore } from '@/stores/santriStore';
import SantriFormDialog from '@/components/dialogs/santri/SantriFormDialog.vue';
import DeleteDialog from '@/components/dialogs/shared/DeleteDialog.vue';

const dialog = useDialog();
const dt = ref();
const daftarSantri = ref([]);
const loading = ref(false);
const error = ref(null);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    angkatan: { value: null, matchMode: 'contains' },
    gender: { value: null, matchMode: 'equals' },
    jurusan: { value: null, matchMode: 'contains' },
    role: { value: null, matchMode: 'contains' }
});
const sortField = ref(null);
const sortOrder = ref(null);

const santriStore = useSantriStore();

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

const fetchDaftarSantri = async () => {
    loading.value = true;
    try {
        const data = await SantriService.getAll();
        daftarSantri.value = data.data;
    } catch (error) {
        console.error('Fetch Error: Gagal mengambil data santri, ', error);
        error.value = 'Fetch Error: Gagal mengambil data santri';
    } finally {
        loading.value = false;
    }
};

const addHandler = () => {
    dialog.open(SantriFormDialog, {
        props: {
            header: 'Tambah Santri',
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

const editHandler = (santri) => {
    dialog.open(SantriFormDialog, {
        props: {
            header: 'Edit Santri',
            style: {
                minWidth: '32rem'
            },
            modal: true
        },
        data: { ...santri },
        emits: {
            onSave: (data) => {
                saveData(data);
            },
            onCancel: () => {}
        }
    });
};

const saveData = async (data) => {
    try {
        if (data.id) {
            console.log('masuk update, data', data);

            await SantriService.update(data.id, data);
        } else {
            console.log('masuk create, data', data);

            await SantriService.create(data);
        }
        await fetchDaftarSantri();
    } catch (error) {
        console.error('Error saving santri: ', error);
    }
};

const deleteHandler = (santri) => {
    dialog.open(DeleteDialog, {
        props: {
            header: 'Hapus Santri',
            modal: true
        },
        data: santri,
        onClose: (confirmed) => {
            if (confirmed) {
                deleteData(santri.id);
            }
        }
    });
};

const deleteData = async (id) => {
    try {
        await SantriService.delete(id);
        await fetchDaftarSantri();
    } catch (error) {
        console.error('Error deleting santri: ', error);
    }
};

// Lifecycle Hooks
onMounted(() => {
    fetchDaftarSantri();
});
</script>
<template>
    <div class="card border-slate-200 border pt-4">
        <div class="flex flex-col gap-2 pt-4">
            <h3 class="text-2xl font-bold">Daftar Santri</h3>
            <Toolbar class="toolbar !px-0 !border-none">
                <template #start>
                    <Button v-if="showResetButton" type="button" icon="pi pi-filter-slash" label="Bersihkan" outlined @click="clearTable()" />
                </template>
                <template #end>
                    <div class="flex gap-4">
                        <IconField iconPosition="left" class="block w-80 mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Cari santri, angkatan, jurusan..." class="w-full" />
                        </IconField>
                        <Button label="Tambah Santri" icon="pi pi-plus" severity="primary" @click="addHandler" />
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
            v-model:filters="filters"
            v-model:sortField="sortField"
            v-model:sortOrder="sortOrder"
            :value="daftarSantri"
            :filters="filters"
            dataKey="id"
            showGridlines
            stripedRows
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 25, 50, 100]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Menampilkan {first} hingga {last} dari {totalRecords} santri"
            :globalFilterFields="['name', 'angkatan', 'gender', 'jurusan', 'role']"
            tableStyle="min-width: 50rem"
            filterDisplay="menu"
            class="p-datatable-hoverable"
        >
            <Column field="index" header="No" sortable style="min-width: 2rem">
                <template #body="{ data }">
                    {{ data.index }}
                </template>
            </Column>
            <!-- Kolom-kolom dengan fitur sort -->
            <Column field="name" header="Nama" sortable style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
            </Column>

            <Column field="angkatan" header="Angkatan" :showFilterMatchModes="false" sortable style="min-width: 8rem">
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="santriStore.getAngkatanList" placeholder="Pilih Angkatan" class="p-column-filter" />
                </template>
            </Column>

            <Column field="gender" header="Jenis Kelamin" class="capitalize" :showFilterMatchModes="false" sortable>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="['laki-laki', 'perempuan']" placeholder="Pilih Jenis Kelamin" class="p-column-filter capitalize" />
                </template>
            </Column>

            <Column field="jurusan" header="Jurusan" :showFilterMatchModes="false" sortable style="min-width: 10rem">
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="santriStore.getJurusanList" placeholder="Pilih Jurusan" class="p-column-filter" />
                </template>
            </Column>

            <Column field="role" header="Role" class="capitalize" :showFilterMatchModes="false" sortable>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="santriStore.getRoleList" class="p-column-filter capitalize" placeholder="Pilih Role" />
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

/* Style untuk opsi dropdown role */
.p-select-list-container .p-select-option-label {
    text-transform: capitalize;
}
</style>

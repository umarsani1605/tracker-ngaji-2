<script setup>
// import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref, computed } from 'vue';
import { useDialog } from 'primevue/usedialog';
import { CategoryService } from '@/services/categoryService';
import CategoryFormDialog from '@/components/dialogs/category/CategoryFormDialog.vue';
import DeleteDialog from '@/components/dialogs/shared/DeleteDialog.vue';

const dialog = useDialog();
const dt = ref();
const daftarCategory = ref([]);
const loading = ref(false);
const error = ref(null);
const categoryDialog = ref(false);
const selectedCategory = ref({});
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
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

const fetchDaftarCategory = async () => {
    loading.value = true;
    try {
        const data = await CategoryService.getAll();
        daftarCategory.value = data.data;
        console.log('daftarCategory', daftarCategory.value);
    } catch (error) {
        console.error('Fetch Error: Gagal mengambil data kategori, ', error);
        error.value = 'Fetch Error: Gagal mengambil data kategori';
    } finally {
        loading.value = false;
    }
};

const addHandler = () => {
    dialog.open(CategoryFormDialog, {
        props: {
            header: 'Tambah Kategori',
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

const editHandler = (category) => {
    dialog.open(CategoryFormDialog, {
        props: {
            header: 'Edit Kategori',
            style: {
                minWidth: '32rem'
            },
            modal: true
        },
        data: { ...category },
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

            await CategoryService.update(data.id, data);
        } else {
            console.log('masuk create, data', data);

            await CategoryService.create(data);
        }
        await fetchDaftarCategory();
        categoryDialog.value = false;
        selectedCategory.value = {};
    } catch (error) {
        console.error('Error saving kategori: ', error);
    }
};

const deleteHandler = (category) => {
    dialog.open(DeleteDialog, {
        props: {
            header: 'Hapus Kategori',
            modal: true
        },
        data: category,
        emits: {
            onConfirm: (data) => {
                console.log('masuk delete, data: ', data);
                deleteData(data.id);
            },
            onCancel: () => {}
        }
    });
};

const deleteData = async (id) => {
    try {
        await CategoryService.delete(id);
        await fetchDaftarCategory();
    } catch (error) {
        console.error('Error deleting kategori: ', error);
    }
};

// Lifecycle Hooks
onMounted(() => {
    fetchDaftarCategory();
});
</script>
<template>
    <div class="card border-slate-200 border pt-4">
        <div class="flex flex-col gap-2 pt-4">
            <h3 class="text-2xl font-bold">Daftar Kategori Penilaian</h3>
            <Toolbar class="toolbar !px-0 !border-none">
                <template #start>
                    <Button v-if="showResetButton" type="button" icon="pi pi-filter-slash" label="Bersihkan" outlined @click="clearTable()" />
                </template>
                <template #end>
                    <div class="flex gap-4">
                        <IconField iconPosition="left" class="block w-80 mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Cari kategori..." class="w-full" />
                        </IconField>
                        <Button label="Tambah Kategori" icon="pi pi-plus" severity="primary" @click="addHandler" />
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
            :value="daftarCategory"
            :filters="filters"
            removableSort
            dataKey="id"
            showGridlines
            stripedRows
            :globalFilterFields="['name']"
            tableStyle="min-width: 50rem"
            filterDisplay="menu"
            class="p-datatable-hoverable"
        >
            <!-- Kolom-kolom dengan fitur sort -->
            <Column field="id" header="No." style="width: 2rem">
                <template #body="{ data }">
                    {{ data.id }}
                </template>
            </Column>
            <Column field="name" header="Nama" sortable style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.name }}
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

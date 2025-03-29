<script setup>
import { onMounted, ref, computed } from 'vue';
import { useDialog } from 'primevue/usedialog';
import { SubjectService } from '@/services/subjectService';
import SubjectFormDialog from '@/components/dialogs/subject/SubjectFormDialog.vue';
import DeleteDialog from '@/components/dialogs/shared/DeleteDialog.vue';

const dialog = useDialog();
const dt = ref();
const daftarSubject = ref([]);
const loading = ref(false);
const error = ref(null);
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

const fetchDaftarSubject = async () => {
    loading.value = true;
    try {
        const data = await SubjectService.getAll();
        daftarSubject.value = data.data;
    } catch (error) {
        console.error('Fetch Error: Gagal mengambil data subject, ', error);
        error.value = 'Fetch Error: Gagal mengambil data subject';
    } finally {
        loading.value = false;
    }
};

const addHandler = () => {
    dialog.open(SubjectFormDialog, {
        props: {
            header: 'Tambah Mata Pelajaran',
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

const editHandler = (subject) => {
    dialog.open(SubjectFormDialog, {
        props: {
            header: 'Edit Mata Pelajaran',
            style: {
                minWidth: '32rem'
            },
            modal: true
        },
        data: { ...subject },
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
            await SubjectService.update(data.id, data);
        } else {
            await SubjectService.create(data);
        }
        await fetchDaftarSubject();
    } catch (error) {
        console.error('Error saving subject: ', error);
    }
};

const deleteHandler = (subject) => {
    dialog.open(DeleteDialog, {
        props: {
            header: 'Hapus Mata Pelajaran',
            modal: true
        },
        data: subject,
        onClose: (confirmed) => {
            if (confirmed) {
                deleteData(subject.id);
            }
        }
    });
};

const deleteData = async (id) => {
    try {
        await SubjectService.delete(id);
        await fetchDaftarSubject();
    } catch (error) {
        console.error('Error deleting subject: ', error);
    }
};

onMounted(() => {
    fetchDaftarSubject();
});
</script>

<template>
    <div class="card border-slate-200 border pt-4">
        <div class="flex flex-col gap-2 pt-4">
            <h3 class="text-2xl font-bold">Daftar Mata Pelajaran</h3>
            <Toolbar class="toolbar !px-0 !border-none">
                <template #start>
                    <Button v-if="showResetButton" type="button" icon="pi pi-filter-slash" label="Bersihkan" outlined @click="clearTable()" />
                </template>
                <template #end>
                    <div class="flex gap-4">
                        <IconField iconPosition="left" class="block w-80 mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Cari mata pelajaran..." class="w-full" />
                        </IconField>
                        <Button label="Tambah Mata Pelajaran" icon="pi pi-plus" severity="primary" @click="addHandler" />
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
            :value="daftarSubject"
            :filters="filters"
            removableSort
            dataKey="id"
            showGridlines
            stripedRows
            :globalFilterFields="['name', 'category_name']"
            tableStyle="min-width: 50rem"
            filterDisplay="menu"
            class="p-datatable-hoverable"
        >
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

            <Column field="category_name" header="Kategori" sortable style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.category_name }}
                </template>
            </Column>

            <Column field="has_hafalan" header="Hafalan" style="min-width: 8rem">
                <template #body="{ data }">
                    <i :class="data.has_hafalan ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'"></i>
                </template>
            </Column>

            <Column field="has_setoran" header="Setoran" style="min-width: 8rem">
                <template #body="{ data }">
                    <i :class="data.has_setoran ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'"></i>
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

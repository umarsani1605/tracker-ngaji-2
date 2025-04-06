<script setup>
import { onMounted, ref, computed } from 'vue';
import { useDialog } from 'primevue/usedialog';
import { GradeService } from '@/services/gradeService';
import { SantriService } from '@/services/santriService';
import { CategoryService } from '@/services/categoryService';
import { SubjectService } from '@/services/subjectService';
import { useGradeStore } from '@/stores/gradeStore';
import GradeFormDialog from '@/components/dialogs/grade/GradeFormDialog.vue';
import DeleteDialog from '@/components/dialogs/shared/DeleteDialog.vue';

const dialog = useDialog();
const dt = ref();
const daftarGrade = ref([]);
const santriList = ref([]);
const pentashihList = ref([]);
const categoryList = ref([]);
const subjectList = ref([]);
const loading = ref(false);
const error = ref(null);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    santri_name: { value: null, matchMode: 'contains' },
    pentashih_name: { value: null, matchMode: 'contains' },
    category_name: { value: null, matchMode: 'contains' },
    subject_name: { value: null, matchMode: 'contains' },
    hafalan: { value: null, matchMode: 'equals' },
    setoran: { value: null, matchMode: 'equals' }
});

const gradeStore = useGradeStore();

const getStatusClass = (status) => {
    switch (status) {
        case 'sudah':
            return 'bg-green-100 text-green-700';
        case 'proses':
            return 'bg-yellow-100 text-yellow-700';
        case 'belum':
            return 'bg-red-100 text-red-700';
        default:
            return '';
    }
};

const fetchAllData = async () => {
    loading.value = true;
    try {
        const [gradesRes, santriRes, pentashihRes, categoryRes, subjectRes] = await Promise.all([GradeService.getAll(), SantriService.getAll(), SantriService.getAll({ role: 'pentashih' }), CategoryService.getAll(), SubjectService.getAll()]);

        daftarGrade.value = gradesRes.data;
        santriList.value = santriRes.data;
        pentashihList.value = pentashihRes.data;
        categoryList.value = categoryRes.data;
        subjectList.value = subjectRes.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        error.value = 'Gagal mengambil data';
    } finally {
        loading.value = false;
    }
};

const addHandler = () => {
    dialog.open(GradeFormDialog, {
        props: {
            header: 'Tambah Grade',
            style: {
                minWidth: '32rem'
            },
            modal: true
        },
        data: {
            santriList: santriList.value,
            pentashihList: pentashihList.value,
            categoryList: categoryList.value,
            subjectList: subjectList.value
        },
        emits: {
            onSave: (data) => {
                saveData(data);
            },
            onCancel: () => {}
        }
    });
};

const editHandler = (grade) => {
    dialog.open(GradeFormDialog, {
        props: {
            header: 'Edit Grade',
            style: {
                minWidth: '32rem'
            },
            modal: true
        },
        data: {
            ...grade,
            santriList: santriList.value,
            pentashihList: pentashihList.value,
            categoryList: categoryList.value,
            subjectList: subjectList.value
        },
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
            await GradeService.update(data.id, data);
        } else {
            await GradeService.create(data);
        }
        await fetchAllData();
    } catch (error) {
        console.error('Error saving grade: ', error);
    }
};

const deleteHandler = (grade) => {
    dialog.open(DeleteDialog, {
        props: {
            header: 'Hapus Grade',
            style: {
                width: '32rem'
            },
            modal: true
        },
        data: {
            message: `Apakah Anda yakin ingin menghapus grade untuk ${grade.santri_name}?`
        },
        emits: {
            onConfirm: async () => {
                try {
                    await GradeService.delete(grade.id);
                    await fetchAllData();
                } catch (error) {
                    console.error('Error deleting grade: ', error);
                }
            },
            onCancel: () => {}
        }
    });
};

onMounted(() => {
    fetchAllData();
});
</script>

<template>
    <div class="card border-slate-200 border pt-4">
        <div class="flex flex-col gap-2 pt-4">
            <h3 class="text-2xl font-bold">Daftar Grade</h3>
            <Toolbar class="toolbar !px-0 !border-none">
                <template #end>
                    <div class="flex gap-4">
                        <IconField iconPosition="left" class="block w-80 mt-2 md:mt-0">
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Cari grade..." class="w-full" />
                        </IconField>
                        <Button label="Tambah Grade" icon="pi pi-plus" severity="primary" @click="addHandler" />
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
            :value="daftarGrade"
            :filters="filters"
            dataKey="id"
            showGridlines
            stripedRows
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 25, 50, 100]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Menampilkan {first} hingga {last} dari {totalRecords} grade"
            :globalFilterFields="['santri_name', 'pentashih_name', 'category_name', 'subject_name', 'hafalan', 'setoran']"
            tableStyle="min-width: 50rem"
            filterDisplay="menu"
            class="p-datatable-hoverable"
        >
            <Column field="index" header="No." style="width: 4rem">
                <template #body="{ data }">
                    {{ data.index }}
                </template>
            </Column>

            <Column field="santri_name" header="Santri" sortable style="min-width: 12rem" />
            <Column field="pentashih_name" header="Pentashih" sortable style="min-width: 12rem" />
            <Column field="category_name" header="Kategori" sortable style="min-width: 10rem" />
            <Column field="subject_name" header="Mata Pelajaran" sortable style="min-width: 12rem" />

            <Column field="hafalan" header="Status Hafalan" class="capitalize" sortable>
                <template #body="{ data }">
                    <Tag :value="data.hafalan" :class="getStatusClass(data.hafalan)" />
                </template>
                <template #filter="{ filterModel }">
                    <Dropdown v-model="filterModel.value" :options="gradeStore.getHafalanStatusList" placeholder="Pilih Status" class="p-column-filter capitalize" showClear />
                </template>
            </Column>

            <Column field="setoran" header="Status Setoran" class="capitalize" sortable>
                <template #body="{ data }">
                    <Tag :value="data.setoran" :class="getStatusClass(data.setoran)" />
                </template>
                <template #filter="{ filterModel }">
                    <Dropdown v-model="filterModel.value" :options="gradeStore.getSetoranStatusList" placeholder="Pilih Status" class="p-column-filter capitalize" showClear />
                </template>
            </Column>

            <Column :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2 justify-end">
                        <Button icon="pi pi-pencil" rounded outlined aria-label="Edit" @click="editHandler(data)" />
                        <Button icon="pi pi-trash" rounded outlined severity="danger" aria-label="Delete" @click="deleteHandler(data)" />
                    </div>
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

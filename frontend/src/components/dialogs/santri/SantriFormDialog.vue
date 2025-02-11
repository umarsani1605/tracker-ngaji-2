<script setup>
import { ref, inject } from 'vue';
import { useSantriStore } from '@/stores/santriStore';

const santriStore = useSantriStore();

const dialogRef = inject('dialogRef');
const emit = defineEmits(['cancel', 'save']);

const santri = dialogRef.value.data;
const formData = ref({ ...santri });
const submitted = ref(false);

const onSave = () => {
    submitted.value = true;

    // Validasi semua field required
    if (!formData.value.name || !formData.value.angkatan || !formData.value.jurusan || !formData.value.gender || !formData.value.role) {
        return;
    }
    emit('save', formData.value);
    dialogRef.value.close();
};

const onCancel = () => {
    emit('cancel');
    dialogRef.value.close();
};

console.log('formData', formData.value);
</script>

<template>
    <div class="p-fluid">
        <div class="field flex flex-col gap-2">
            <label for="name">Nama <span class="text-red-500">*</span></label>
            <InputText id="name" v-model="formData.name" required autofocus :class="{ 'p-invalid': submitted && !formData.name }" />
        </div>
        <div class="field flex flex-col gap-2">
            <label for="angkatan">Angkatan <span class="text-red-500">*</span></label>
            <Select id="angkatan" v-model="formData.angkatan" :options="santriStore.getAllAngkatanList" class="capitalize" placeholder="Pilih Angkatan" required :class="{ 'p-invalid': submitted && !formData.angkatan }" />
        </div>
        <div class="field flex flex-col gap-2">
            <label for="jurusan">Jurusan <span class="text-red-500">*</span></label>
            <InputText id="jurusan" v-model="formData.jurusan" required :class="{ 'p-invalid': submitted && !formData.jurusan }" />
        </div>
        <div class="field flex flex-col gap-2">
            <label for="gender">Jenis Kelamin <span class="text-red-500">*</span></label>
            <Select id="gender" v-model="formData.gender" :options="santriStore.getGenderList" class="capitalize" placeholder="Pilih Jenis Kelamin" required :class="{ 'p-invalid': submitted && !formData.gender }" />
        </div>
        <div class="field flex flex-col gap-2">
            <label for="role">Role <span class="text-red-500">*</span></label>
            <Select id="role" v-model="formData.role" :options="santriStore.getRoleList" class="capitalize" placeholder="Pilih Role" required :class="{ 'p-invalid': submitted && !formData.role }" />
        </div>
        <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancel" icon="pi pi-times" outlined @click="onCancel" />
            <Button label="Save" icon="pi pi-check" @click="onSave" />
        </div>
    </div>
</template>

<style scoped>
.field {
    margin-bottom: 1.5rem;
}
</style>

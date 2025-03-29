import { defineStore } from 'pinia';
import { SantriService } from '@/services/santriService';

export const useSantriStore = defineStore('santri', {
    state: () => ({
        allAngkatanList: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
        genderList: ['laki-laki', 'perempuan'],
        roleList: ['admin', 'pentashih', 'santri'],
        angkatanList: [],
        jurusanList: [],
        loading: false,
        error: null
    }),

    getters: {
        getAllAngkatanList: (state) => state.allAngkatanList,
        getGenderList: (state) => state.genderList,
        getAngkatanList: (state) => state.angkatanList,
        getJurusanList: (state) => state.jurusanList,
        getRoleList: (state) => state.roleList
    },

    actions: {
        // Fetch semua data master sekaligus
        async setAllData(santriList) {
            this.loading = true;
            this.error = null;

            try {
                const uniqueAngkatan = new Set(santriList.map((santri) => santri.angkatan));
                const sortedAngkatan = Array.from(uniqueAngkatan).sort((a, b) => a - b);
                this.angkatanList = sortedAngkatan;

                const uniqueJurusan = new Set(santriList.map((santri) => santri.jurusan));
                this.jurusanList = Array.from(uniqueJurusan).sort();
            } catch (error) {
                this.error = 'Store Error: Gagal mengambil data master';
                console.error('Store Error: Gagal mengambil data master, ', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Set data angkatan
        setAngkatanList(santriList) {
            const uniqueAngkatan = new Set(santriList.map((santri) => santri.angkatan));
            this.angkatanList = Array.from(uniqueAngkatan).sort((a, b) => a - b);
        },

        // Set data jurusan
        setJurusanList(santriList) {
            const uniqueJurusan = new Set(santriList.map((santri) => santri.jurusan));
            this.jurusanList = Array.from(uniqueJurusan).sort();
        },

        // Set data role
        setRoleList(santriList) {
            const uniqueRole = new Set(santriList.map((santri) => santri.role));
            this.roleList = Array.from(uniqueRole).sort();
        },

        // Reset semua data
        resetState() {
            this.angkatanList = [];
            this.jurusanList = [];
            this.roleList = [];
            this.loading = false;
            this.error = null;
        }
    }
});

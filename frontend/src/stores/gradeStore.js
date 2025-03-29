import { defineStore } from 'pinia';

export const useGradeStore = defineStore('grade', {
    state: () => ({
        hafalanStatusList: ['belum', 'proses', 'sudah'],
        setoranStatusList: ['belum', 'proses', 'sudah'],
        loading: false,
        error: null
    }),

    getters: {
        getHafalanStatusList: (state) => state.hafalanStatusList,
        getSetoranStatusList: (state) => state.setoranStatusList
    }
});

import api from '@/config/axios';
import { useSantriStore } from '@/stores/santriStore';

export class SantriService {
    // Mengambil semua data santri
    static async getAll() {
        try {
            const response = await api.get('/santri');
            const santriStore = useSantriStore();

            santriStore.setAllData(response.data.data);

            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil data santri:', error);
            throw error;
        }
    }

    // Mengambil data santri berdasarkan ID
    static async getById(id) {
        try {
            const response = await api.get(`/santri/${id}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil detail santri:', error);
            throw error;
        }
    }

    // Menambah santri baru
    static async create(data) {
        try {
            const response = await api.post('/santri', data);
            console.log('response', response.data);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal menambah santri:', error);
            throw error;
        }
    }

    // Mengupdate data santri
    static async update(id, data) {
        try {
            const response = await api.put(`/santri/${id}`, data);
            console.log('response', response.data);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengupdate santri:', error);
            throw error;
        }
    }

    // Menghapus data santri
    static async delete(id) {
        try {
            const response = await api.delete(`/santri/${id}`);
            console.log('response', response.data);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal menghapus santri:', error);
            throw error;
        }
    }

    // Mencari santri berdasarkan nama
    static async search(name) {
        try {
            const response = await api.get(`/santri/search/${name}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mencari santri:', error);
            throw error;
        }
    }
}

import api from '@/config/axios';
import { useSantriStore } from '@/stores/santriStore';

export class SantriService {
    // Mengambil semua data santri dengan filter
    static async getAll(filters = {}) {
        try {
            // Buat query string dari filter
            const params = new URLSearchParams();
            if (filters.gender) params.append('gender', filters.gender);
            if (filters.assigned !== undefined) params.append('assigned', filters.assigned);
            if (filters.role) params.append('role', filters.role);

            const response = await api.get(`/santri${params.toString() ? `?${params.toString()}` : ''}`);
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

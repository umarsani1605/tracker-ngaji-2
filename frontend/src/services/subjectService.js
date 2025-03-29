import api from '@/config/axios';

export class SubjectService {
    // Mengambil semua data subject
    static async getAll() {
        try {
            const response = await api.get('/subjects');
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil data subject:', error);
            throw error;
        }
    }

    // Mengambil data subject berdasarkan ID
    static async getById(id) {
        try {
            const response = await api.get(`/subjects/${id}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil detail subject:', error);
            throw error;
        }
    }

    // Menambah subject baru
    static async create(data) {
        try {
            const response = await api.post('/subjects', data);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal menambah subject:', error);
            throw error;
        }
    }

    // Mengupdate data subject
    static async update(id, data) {
        try {
            const response = await api.put(`/subjects/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengupdate subject:', error);
            throw error;
        }
    }

    // Menghapus data subject
    static async delete(id) {
        try {
            const response = await api.delete(`/subjects/${id}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal menghapus subject:', error);
            throw error;
        }
    }

    // Mengambil data subject berdasarkan category
    static async getByCategory(category_id) {
        try {
            const response = await api.get(`/subjects/category/${category_id}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil data subject berdasarkan category:', error);
            throw error;
        }
    }
}

import api from '@/config/axios';

export class CategoryService {
    // Mengambil semua data kategori
    static async getAll() {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil data kategori:', error);
            throw error;
        }
    }

    // Mengambil data kategori berdasarkan ID
    static async getById(id) {
        try {
            const response = await api.get(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil detail kategori:', error);
            throw error;
        }
    }

    // Menambah kategori baru
    static async create(data) {
        try {
            const response = await api.post('/categories', data);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal menambah kategori:', error);
            throw error;
        }
    }

    // Mengupdate data kategori
    static async update(id, data) {
        try {
            const response = await api.put(`/categories/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengupdate kategori:', error);
            throw error;
        }
    }

    // Menghapus data kategori
    static async delete(id) {
        try {
            const response = await api.delete(`/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal menghapus kategori:', error);
            throw error;
        }
    }
}

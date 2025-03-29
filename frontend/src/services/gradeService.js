import api from '@/config/axios';

export class GradeService {
    // Mengambil semua data grade dengan filter
    static async getAll(filters = {}) {
        try {
            // Buat query string dari filter
            const params = new URLSearchParams();
            if (filters.id_santri) params.append('id_santri', filters.id_santri);
            if (filters.id_pentashih) params.append('id_pentashih', filters.id_pentashih);
            if (filters.id_category) params.append('id_category', filters.id_category);
            if (filters.id_subject) params.append('id_subject', filters.id_subject);

            const response = await api.get(`/grades${params.toString() ? `?${params.toString()}` : ''}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil data grade:', error);
            throw error;
        }
    }

    // Mengambil data grade berdasarkan ID
    static async getById(id) {
        try {
            const response = await api.get(`/grades/${id}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil detail grade:', error);
            throw error;
        }
    }

    // Menambah grade baru
    static async create(data) {
        try {
            const response = await api.post('/grades', data);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal menambah grade:', error);
            throw error;
        }
    }

    // Mengupdate data grade
    static async update(id, data) {
        try {
            const response = await api.put(`/grades/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengupdate grade:', error);
            throw error;
        }
    }

    // Menghapus data grade
    static async delete(id) {
        try {
            const response = await api.delete(`/grades/${id}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal menghapus grade:', error);
            throw error;
        }
    }
}

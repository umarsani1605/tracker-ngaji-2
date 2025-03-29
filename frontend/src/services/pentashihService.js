import api from '@/config/axios';

export class PentashihService {
    // Mengambil semua data pentashih
    static async getAll() {
        try {
            const response = await api.get('/pentashih');
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil data pentashih:', error);
            throw error;
        }
    }

    // Mengambil data pentashih berdasarkan ID
    static async getById(id) {
        try {
            const response = await api.get(`/pentashih/${id}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil detail pentashih:', error);
            throw error;
        }
    }

    // Menambah pentashih baru
    static async create(data) {
        try {
            const response = await api.post('/pentashih', data);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal menambah pentashih:', error);
            throw error;
        }
    }

    // Mengupdate data pentashih
    static async update(id_pentashih, santri_ids) {
        try {
            const response = await api.put(`/pentashih/${id_pentashih}`, santri_ids);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengupdate pentashih:', error);
            throw error;
        }
    }

    // Menghapus data pentashih
    static async delete(id) {
        try {
            const response = await api.delete(`/pentashih/${id}`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal menghapus pentashih:', error);
            throw error;
        }
    }

    // Mengambil daftar santri yang dibimbing oleh pentashih
    static async getSantriByPentashihId(id) {
        try {
            const response = await api.get(`/pentashih/${id}/santri`);
            return response.data;
        } catch (error) {
            console.error('Service Error: Gagal mengambil daftar santri:', error);
            throw error;
        }
    }
}

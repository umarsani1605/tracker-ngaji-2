import SantriModel from '../models/santriModel.js';

class SantriController {
  // Get all santri dengan pagination dan search
  static async getAllSantri(req, res) {
    try {
      const santri = await SantriModel.getAllSantri();

      res.status(200).json({
        status: 'success',
        data: santri,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  // Get single santri by ID
  static async getSantriById(req, res) {
    try {
      const { id } = req.params;

      const santri = await SantriModel.getSantriById(id);

      if (!santri) {
        return res.status(404).json({
          status: 'error',
          message: 'Santri tidak ditemukan',
        });
      }

      res.status(200).json({
        status: 'success',
        data: santri,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  // Create new santri
  static async createSantri(req, res) {
    try {
      // Validasi input
      const { name, gender, angkatan, jurusan, role } = req.body;

      if (!name || !gender || !angkatan || !jurusan || !role) {
        return res.status(400).json({
          status: 'error',
          message: 'Semua field harus diisi',
        });
      }

      // Validasi gender
      if (!['laki-laki', 'perempuan'].includes(gender)) {
        return res.status(400).json({
          status: 'error',
          message: 'Jenis kelamin harus laki-laki atau perempuan',
        });
      }

      // Validasi panjang nama
      if (name.length < 3) {
        return res.status(400).json({
          status: 'error',
          message: 'Nama harus minimal 3 karakter',
        });
      }

      const newSantri = await SantriModel.createSantri({ name, gender, angkatan, jurusan, role });

      res.status(201).json({
        status: 'success',
        message: 'Data santri berhasil ditambahkan',
        data: newSantri,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  // Update santri
  static async updateSantri(req, res) {
    try {
      const { id } = req.params;
      const { name, gender, angkatan, jurusan, role } = req.body;

      console.log('req.body', req.body);

      // Validasi input
      if (!name || !gender || !angkatan || !jurusan || !role) {
        return res.status(400).json({
          status: 'error',
          message: 'Semua field harus diisi',
        });
      }

      // Validasi gender
      if (!['laki-laki', 'perempuan'].includes(gender.toLowerCase())) {
        return res.status(400).json({
          status: 'error',
          message: 'Jenis kelamin harus laki-laki atau perempuan',
        });
      }

      // Cek apakah santri ada
      const existingSantri = await SantriModel.getSantriById(id);
      if (!existingSantri) {
        return res.status(404).json({
          status: 'error',
          message: 'Santri tidak ditemukan',
        });
      }

      const updatedSantri = await SantriModel.updateSantri(id, {
        name,
        gender: gender.toLowerCase(),
        angkatan,
        jurusan,
        role: role.toLowerCase(),
      });

      res.status(200).json({
        status: 'success',
        message: 'Data santri berhasil diperbarui',
        data: updatedSantri,
      });
      console.log('updatedSantri', updatedSantri);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  // Delete santri
  static async deleteSantri(req, res) {
    try {
      const { id } = req.params;

      // Cek apakah santri ada
      const existingSantri = await SantriModel.getSantriById(id);
      if (!existingSantri) {
        return res.status(404).json({
          status: 'error',
          message: 'Santri tidak ditemukan',
        });
      }

      await SantriModel.deleteSantri(id);

      res.status(200).json({
        status: 'success',
        message: 'Data santri berhasil dihapus',
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

export default SantriController;

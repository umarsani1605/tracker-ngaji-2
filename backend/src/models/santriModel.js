import { db } from '../config/database.js';

class SantriModel {
  // Mengambil semua data santri
  static async getAllSantri() {
    try {
      const [rows] = await db.query('SELECT * FROM santri');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Mengambil satu data santri berdasarkan ID
  static async getSantriById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM santri WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Menambah data santri baru
  static async createSantri(santriData) {
    try {
      const { name, gender, angkatan, jurusan, role } = santriData;
      const [result] = await db.query(
        'INSERT INTO santri (name, gender, angkatan, jurusan, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, gender, angkatan, jurusan, role, new Date(), new Date()]
      );
      return {
        id: result.insertId,
        name,
        gender,
        angkatan,
        jurusan,
        role,
      };
    } catch (error) {
      throw error;
    }
  }

  // Mengupdate data santri
  static async updateSantri(id, santriData) {
    try {
      const { name, gender, angkatan, jurusan, role } = santriData;
      const [result] = await db.query('UPDATE santri SET name = ?, gender = ?, angkatan = ?, jurusan = ?, role = ?, updated_at = ? WHERE id = ?', [
        name,
        gender,
        angkatan,
        jurusan,
        role,
        new Date(),
        id,
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Santri tidak ditemukan');
      }

      return {
        id,
        name,
        gender,
        angkatan,
        jurusan,
        role,
      };
    } catch (error) {
      throw error;
    }
  }

  // Menghapus data santri
  static async deleteSantri(id) {
    try {
      const [result] = await db.query('DELETE FROM santri WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        throw new Error('Santri tidak ditemukan');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Mencari santri berdasarkan nama
  static async searchSantri(searchTerm) {
    try {
      const [rows] = await db.query('SELECT * FROM santri WHERE name LIKE ?', [`%${searchTerm}%`]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default SantriModel;

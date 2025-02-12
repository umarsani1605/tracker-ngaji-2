import { db } from '../config/database.js';

class PentashihModel {
  // Mengambil semua data pentashih beserta data santri yang dibimbing
  static async getAllPentashih() {
    try {
      const [rows] = await db.query(`
        SELECT p.*, s.name as pentashih_name 
        FROM pentashih p
        LEFT JOIN santri s ON p.id_pentashih = s.id
      `);

      // Untuk setiap pentashih, ambil daftar santri yang dibimbing
      for (let pentashih of rows) {
        const [santriList] = await db.query(
          `
          SELECT s.* 
          FROM santri s
          JOIN pentashih ps ON s.id = ps.id_santri
          WHERE ps.id_pentashih = ?
        `,
          [pentashih.id]
        );

        pentashih.santri_list = santriList;
      }

      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Mengambil satu data pentashih berdasarkan ID
  static async getPentashihById(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT p.*, s.name as pentashih_name 
        FROM pentashih p
        LEFT JOIN santri s ON p.id_pentashih = s.id
        WHERE p.id = ?
      `,
        [id]
      );

      if (rows[0]) {
        const [santriList] = await db.query(
          `
          SELECT s.* 
          FROM santri s
          JOIN pentashih ps ON s.id = ps.id_santri
          WHERE ps.id_pentashih = ?
        `,
          [id]
        );

        rows[0].santri_list = santriList;
      }

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Menambah data pentashih baru
  static async createPentashih(pentashihData) {
    try {
      const { id_pentashih, santri_ids } = pentashihData;

      // Insert ke tabel pentashih
      const [result] = await db.query('INSERT INTO pentashih (id_pentashih, created_at, updated_at) VALUES (?, ?, ?)', [
        id_pentashih,
        new Date(),
        new Date(),
      ]);

      // Insert ke tabel pentashih untuk setiap santri
      if (santri_ids && santri_ids.length > 0) {
        const values = santri_ids.map((id_santri) => [result.insertId, id_santri]);
        await db.query('INSERT INTO pentashih (id_pentashih, id_santri) VALUES ? WHERE id_pentashih = ?', [values, id_pentashih]);
      }

      return {
        id: result.insertId,
        id_pentashih,
        santri_ids,
      };
    } catch (error) {
      throw error;
    }
  }

  // Mengupdate data pentashih
  static async updatePentashih(id, pentashihData) {
    try {
      const { id_pentashih, santri_ids } = pentashihData;

      // Update tabel pentashih
      const [result] = await db.query('UPDATE pentashih SET id_pentashih = ?, updated_at = ? WHERE id = ?', [id_pentashih, new Date(), id]);

      if (result.affectedRows === 0) {
        throw new Error('Pentashih tidak ditemukan');
      }

      // Update tabel pentashih
      // Hapus data lama
      await db.query('DELETE FROM pentashih WHERE id_pentashih = ?', [id]);

      // Insert data baru
      if (santri_ids && santri_ids.length > 0) {
        const values = santri_ids.map((id_santri) => [id, id_santri]);
        await db.query('INSERT INTO pentashih (id_pentashih, id_santri) VALUES ?', [values]);
      }

      return {
        id,
        id_pentashih,
        santri_ids,
      };
    } catch (error) {
      throw error;
    }
  }

  // Menghapus data pentashih
  static async deletePentashih(id) {
    try {
      // Hapus data dari tabel pentashih terlebih dahulu
      await db.query('DELETE FROM pentashih WHERE id_pentashih = ?', [id]);

      // Kemudian hapus dari tabel pentashih
      const [result] = await db.query('DELETE FROM pentashih WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        throw new Error('Pentashih tidak ditemukan');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Mengambil daftar santri yang dibimbing oleh pentashih tertentu
  static async getSantriByPentashihId(id_pentashih) {
    try {
      const [rows] = await db.query(
        `
        SELECT s.* 
        FROM santri s
        JOIN pentashih ps ON s.id = ps.id_santri
        WHERE ps.id_pentashih = ?
      `,
        [id_pentashih]
      );

      return rows;
    } catch (error) {
      throw error;
    }
  }
}

export default PentashihModel;

import { db } from '../config/database.js';

class SantriModel {
  // Mengambil semua data santri dengan filter gender, assigned, dan role
  static async getAllSantri(gender = null, assigned = null, role = null) {
    try {
      const queryBuilder = {
        baseQuery: 'SELECT s.* FROM santri s',
        params: [],
        conditions: [],

        addAssignedFilter(assigned) {
          if (assigned !== null) {
            if (assigned === 'true') {
              this.baseQuery += ' INNER JOIN pentashih p ON s.id = p.id_santri';
            } else {
              this.baseQuery += ' LEFT JOIN pentashih p ON s.id = p.id_santri';
              this.conditions.push('p.id_santri IS NULL');
            }
          }
          return this;
        },

        addGenderFilter(gender) {
          if (gender) {
            this.conditions.push('s.gender = ?');
            this.params.push(gender);
          }
          return this;
        },

        addRoleFilter(role) {
          if (role) {
            this.conditions.push('s.role = ?');
            this.params.push(role);
          }
          return this;
        },

        buildFinalQuery() {
          let finalQuery = this.baseQuery;

          if (this.conditions.length > 0) {
            finalQuery += ' WHERE ' + this.conditions.join(' AND ');
          }

          finalQuery += ' ORDER BY s.gender, s.name ASC';
          return { query: finalQuery, params: this.params };
        },
      };

      const { query, params } = queryBuilder.addRoleFilter(role).addAssignedFilter(assigned).addGenderFilter(gender).buildFinalQuery();

      const [rows] = await db.query(query, params);
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
        ...santriData,
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

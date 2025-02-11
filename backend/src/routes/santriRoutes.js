import express from 'express';
import SantriController from '../controllers/santriController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Santri:
 *       type: object
 *       required:
 *         - name
 *         - gender
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-generated untuk santri
 *         name:
 *           type: string
 *           description: Nama santri
 *         gender:
 *           type: string
 *           enum: [L, P]
 *           description: Jenis kelamin santri (L/P)
 *       example:
 *         id: 1
 *         name: Ahmad Fajar
 *         gender: L
 */

/**
 * @swagger
 * /santri:
 *   get:
 *     summary: Mengambil semua data santri
 *     tags: [Santri]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman untuk pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Berhasil mengambil data santri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Santri'
 */
router.get('/', SantriController.getAllSantri);

/**
 * @swagger
 * /santri/{id}:
 *   get:
 *     summary: Mengambil data santri berdasarkan ID
 *     tags: [Santri]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID santri
 *     responses:
 *       200:
 *         description: Berhasil mengambil data santri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Santri'
 *       404:
 *         description: Santri tidak ditemukan
 */
router.get('/:id', SantriController.getSantriById);

/**
 * @swagger
 * /santri:
 *   post:
 *     summary: Menambah santri baru
 *     tags: [Santri]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *               gender:
 *                 type: string
 *                 enum: [L, P]
 *     responses:
 *       201:
 *         description: Santri berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Data santri berhasil ditambahkan
 *                 data:
 *                   $ref: '#/components/schemas/Santri'
 *       400:
 *         description: Data tidak valid
 */
router.post('/', SantriController.createSantri);

/**
 * @swagger
 * /santri/{id}:
 *   put:
 *     summary: Mengupdate data santri
 *     tags: [Santri]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID santri
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [L, P]
 *     responses:
 *       200:
 *         description: Data santri berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Santri'
 *       404:
 *         description: Santri tidak ditemukan
 */
router.put('/:id', SantriController.updateSantri);

/**
 * @swagger
 * /santri/{id}:
 *   delete:
 *     summary: Menghapus data santri
 *     tags: [Santri]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID santri
 *     responses:
 *       200:
 *         description: Santri berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Data santri berhasil dihapus
 *       404:
 *         description: Santri tidak ditemukan
 */
router.delete('/:id', SantriController.deleteSantri);

/**
 * @route   GET /api/santri/search/:name
 * @desc    Cari santri berdasarkan nama
 * @access  Private (All roles)
 */
// router.get('/search/:name', SantriController.searchSantri);

export default router;

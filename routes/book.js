const { PrismaClient } = require('../generated/prisma/client');
const router = require('express').Router();
const prisma = new PrismaClient();

// ======================
// GET - Ambil data buku
// ======================
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    const where = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { publisher: { contains: search } }
      ];
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: {
        id: 'desc'
      }
    });

    return res.json({
      status: true,
      message: 'Berhasil mengambil data buku',
      data: books
    });

  } catch (error) {
    return res.json({
      status: false,
      message: error.message
    });
  }
});

// ============================
// POST - Tambah data buku baru
// ============================
router.post('/', async(req, res) => {
  try {
    const { title, author, publisher, year } = req.body;
    const exist = await prisma.book.findFirst({
      where: {
        title: title
      }
    });

    if(exist) {
      throw new Error('Buku sudah terdaftar');
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        publisher,
        year: Number(year)
      }
    });

    return res.json({
      status: true,
      message: 'Berhasil menambahkan data buku',
      data: book
    });

  } catch (error) {
    res.json({
      status: false,
      message: error.message
    });
  }
});

// =====================================
// PUT - Update data buku berdasarkan ID
// =====================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publisher, year } = req.body;

    const exist = await prisma.book.findUnique({
      where: { id: Number(id) },
    });

    if (!exist) {
      throw new Error('Buku tidak ditemukan');
    }

    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        title,
        author,
        publisher,
        year: Number(year),
      },
    });

    return res.json({
      status: true,
      message: 'Berhasil memperbarui data buku',
      data: updatedBook,
    });

  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
});

// ==================================
// DELETE - Hapus buku berdasarkan ID
// ==================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const exist = await prisma.book.findUnique({
      where: { id: Number(id) },
    });

    if (!exist) {
      throw new Error('Buku tidak ditemukan');
    }

    await prisma.book.delete({
      where: { id: Number(id) },
    });

    return res.json({
      status: true,
      message: 'Berhasil menghapus data buku',
    });

  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;

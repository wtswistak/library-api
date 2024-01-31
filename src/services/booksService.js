const { CustomError } = require("../utils/error");
const { prisma } = require("../utils/prisma");

const getBooks = async () => {
  try {
    const books = await prisma.books.findMany();
    return books;
  } catch (error) {
    throw error;
  }
};
const getBookById = async (bookId) => {
  try {
    const book = await prisma.books.findUnique({
      where: {
        id: Number(bookId),
      },
    });
    if (!book) throw new CustomError(400, "Book doesn't exist");
    return book;
  } catch (error) {
    throw error;
  }
};
const getBookByIsbn = async (isbn) => {
  try {
    const book = await prisma.books.findUnique({
      where: {
        isbn: isbn,
      },
    });
    if (book) throw new CustomError(400, "ISBN already exist");

    return book;
  } catch (error) {
    throw error;
  }
};
const getBooksByIsbn = async (isbn) => {
  try {
    const books = await prisma.books.findMany({
      where: {
        isbn: isbn,
      },
    });

    return books;
  } catch (error) {
    throw error;
  }
};

const getAvailableBooks = async () => {
  try {
    const books = await prisma.books.findMany({
      where: {
        isAvailable: true,
      },
    });
    return books;
  } catch (error) {
    throw error;
  }
};

const addBook = async (title, author, isbn) => {
  try {
    await prisma.books.create({
      data: {
        title: title,
        author: author,
        isbn: isbn,
        isAvailable: true,
      },
    });
    return;
  } catch (error) {
    throw error;
  }
};
const deleteBook = async (bookId) => {
  try {
    await prisma.books.delete({
      where: {
        id: Number(bookId),
      },
    });
    return;
  } catch (error) {
    throw error;
  }
};

const updateBook = async (bookId, title, author, isbn) => {
  try {
    await prisma.books.update({
      where: {
        id: Number(bookId),
      },
      data: {
        title: title,
        author: author,
        isbn: isbn,
      },
    });
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getBooks,
  getAvailableBooks,
  addBook,
  deleteBook,
  getBookById,
  updateBook,
  getBookByIsbn,
  getBooksByIsbn,
};

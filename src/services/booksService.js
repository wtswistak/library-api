const { CustomError } = require("../utils/error");
const { prisma } = require("../utils/prisma");

const getBooks = async () => {
  const books = await prisma.books.findMany();
  return books;
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
  const books = await prisma.books.findMany({
    where: {
      isbn: isbn,
    },
  });

  return books;
};

const getAvailableBooks = async () => {
  const books = await prisma.books.findMany({
    where: {
      isAvailable: true,
    },
  });
  return books;
};

const addBook = async (title, author, isbn) => {
  await prisma.books.create({
    data: {
      title: title,
      author: author,
      isbn: isbn,
      isAvailable: true,
    },
  });
  return;
};
const deleteBook = async (bookId) => {
  await prisma.books.delete({
    where: {
      id: Number(bookId),
    },
  });
  return;
};

const updateBook = async (bookId, title, author, isbn) => {
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

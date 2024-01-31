const { prisma } = require("../utils/prisma");

const borrowBook = async (bookId, userId) => {
  try {
    await prisma.transactions.create({
      data: {
        userId: Number(userId),
        bookId: Number(bookId),
        borrowDate: new Date(),
      },
    });
    return;
  } catch (error) {
    throw error;
  }
};

const returnBook = async (bookId, userId, transactionId) => {
  try {
    await prisma.transactions.update({
      where: {
        id: Number(transactionId),
        bookId: Number(bookId),
        userId: Number(userId),
        returnDate: null,
      },
      data: {
        returnDate: new Date(),
      },
    });
    return;
  } catch (error) {
    throw error;
  }
};

const updateAvailability = async (bookId, isAvailable) => {
  try {
    await prisma.books.update({
      where: {
        id: Number(bookId),
      },
      data: {
        isAvailable,
      },
    });
  } catch (error) {
    throw error;
  }
};

const getLastTransaction = async (bookId) => {
  try {
    const lastTransaction = await prisma.transactions.findFirst({
      where: {
        bookId: Number(bookId),
      },
      orderBy: {
        borrowDate: "desc",
      },
    });
    return lastTransaction;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getLastTransaction,
  updateAvailability,
};

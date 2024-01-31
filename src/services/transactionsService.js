const { prisma } = require("../utils/prisma");

const borrowBook = async (bookId, userId) => {
  await prisma.transactions.create({
    data: {
      userId: Number(userId),
      bookId: Number(bookId),
      borrowDate: new Date(),
    },
  });
  return;
};

const returnBook = async (bookId, userId, transactionId) => {
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
};

const updateAvailability = async (bookId, isAvailable) => {
  await prisma.books.update({
    where: {
      id: Number(bookId),
    },
    data: {
      isAvailable,
    },
  });
};

const getLastTransaction = async (bookId) => {
  const lastTransaction = await prisma.transactions.findFirst({
    where: {
      bookId: Number(bookId),
    },
    orderBy: {
      borrowDate: "desc",
    },
  });
  return lastTransaction;
};

module.exports = {
  borrowBook,
  returnBook,
  getLastTransaction,
  updateAvailability,
};

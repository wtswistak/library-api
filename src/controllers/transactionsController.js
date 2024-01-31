const { getBookById } = require("../services/booksService");
const {
  returnBook,
  borrowBook,
  getLastTransaction,
  updateAvailability,
} = require("../services/transactionsService");
const { CustomError, errorHandler } = require("../utils/error");

const borrowBookCtrl = async (req, res) => {
  const { id: bookId } = req.params;
  const userId = req.user.userId;

  try {
    const book = await getBookById(bookId);
    if (!book.isAvailable) throw new CustomError(400, "Book is not available");

    await updateAvailability(bookId, false);

    await borrowBook(bookId, userId);
    res.status(200).json({ status: "success", message: "Borrow book success" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const returnBookCtrl = async (req, res) => {
  const { id: bookId } = req.params;
  const userId = req.user.userId;

  try {
    const book = await getBookById(bookId);
    if (book.isAvailable)
      throw new CustomError(400, "Book is already returned");

    const lastTransaction = await getLastTransaction(bookId);
    if (lastTransaction.userId !== userId)
      throw new CustomError(400, "Book is borrowed by another user");

    await updateAvailability(bookId, true);
    await returnBook(bookId, userId, lastTransaction.id);

    res.status(200).json({ status: "success", message: "Return book success" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  borrowBookCtrl,
  returnBookCtrl,
};

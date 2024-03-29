const {
  getBooks,
  getAvailableBooks,
  deleteBook,
  addBook,
  getBookById,
  getBookByIsbn,
  updateBook,
  getBooksByIsbn,
} = require("../services/booksService");
const { errorHandler, CustomError } = require("../utils/error");

const getBooksCtrl = async (req, res) => {
  try {
    const booksList = await getBooks();
    res.status(200).json({ status: "success", data: booksList });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getAvailableBooksCtrl = async (req, res) => {
  try {
    const availableBooksList = await getAvailableBooks();
    res.status(200).json({ status: "success", data: availableBooksList });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addBookCtrl = async (req, res) => {
  const { title, author, isbn } = req.body;
  try {
    if (!title || !author || !isbn) {
      throw new CustomError(400, "Missing values");
    }

    if (isbn.length !== 13 || isNaN(isbn)) {
      throw new CustomError(400, "ISBN must be 13 digits number");
    }
    await getBookByIsbn(isbn);

    await addBook(title, author, isbn);
    res.status(200).json({ status: "success", message: "Add book success" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteBookCtrl = async (req, res) => {
  const { id: bookId } = req.params;
  try {
    await getBookById(bookId);

    await deleteBook(bookId);
    res.status(200).json({ status: "success", message: "Delete book success" });
  } catch (error) {
    errorHandler(error, res);
  }
};
const updateBookCtrl = async (req, res) => {
  const { id: bookId } = req.params;
  const { title, author, isbn } = req.body;
  try {
    if (!title || !author || !isbn)
      throw new CustomError(400, "Missing values");
    if (isbn.length !== 13 || isNaN(isbn))
      throw new CustomError(400, "ISBN must be 13 digits number");

    await getBookById(bookId);
    const booksByIsbn = await getBooksByIsbn(isbn);
    if (booksByIsbn.length > 0) {
      if (booksByIsbn[0].id !== Number(bookId)) {
        throw new CustomError(400, "ISBN already exist");
      }
    }

    updateBook(bookId, title, author, isbn);
    res.status(200).json({ status: "success", message: "Update book success" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addBookCtrl,
  deleteBookCtrl,
  updateBookCtrl,
  getBooksCtrl,
  getAvailableBooksCtrl,
};

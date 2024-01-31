const {
  getBooks,
  getAvailableBooks,
  deleteBook,
  addBook,
  getBookById,
  getBookByIsbn,
  updateBook,
} = require("../services/booksService");
const { errorHandler, CustomError } = require("../utils/error");

const getBooksCtrl = async (req, res) => {
  try {
    const booksData = await getBooks();
    res.status(200).json({ status: "success", data: booksData });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getAvailableBooksCtrl = async (req, res) => {
  try {
    const booksData = await getAvailableBooks();
    res.status(200).json({ status: "success", data: booksData });
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

  if (!title || !author || !isbn) return res.status(400).send("Missing values");
  if (isbn.length !== 13 || isNaN(isbn))
    return res.status(400).send("ISBN must be 13 digits number");

  try {
    await getBookById(bookId);
    await getBookByIsbn(isbn);

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

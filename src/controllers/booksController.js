const { queryDb, client } = require("../utils/queryDb");

const getBooks = async (req, res) => {
  try {
    const books = await queryDb(`SELECT * FROM books`, [], client);

    res.status(200).json({ status: "success", data: books });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getAvailableBooks = async (req, res) => {
  try {
    const books = await queryDb(
      `SELECT * FROM books WHERE is_available=$1`,
      ["TRUE"],
      client
    );
    res.status(200).json({ status: "success", data: books });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const addBook = async (req, res) => {
  const { title, author, isbn } = req.body;

  if (!title || !author || !isbn) return res.status(400).send("Missing values");
  if (isbn.length !== 13 || isNaN(isbn))
    return res.status(400).send("ISBN must be 13 digits number");

  try {
    const usedIsbn = await queryDb(
      `SELECT * FROM books WHERE isbn=$1`,
      [isbn],
      client
    );
    if (usedIsbn.length > 0) return res.status(400).send("ISBN is used");

    await queryDb(
      `INSERT INTO books(title, author, isbn, is_available) VALUES($1, $2, $3, $4)`,
      [title, author, isbn, "TRUE"],
      client
    );

    res.status(200).send("Add book success");
  } catch (error) {
    console.error(error);

    res.status(500).send("Internal Server Error");
  }
};

const deleteBook = async (req, res) => {
  const { id: bookId } = req.params;

  try {
    const isBookExist = await queryDb(
      `SELECT * FROM books WHERE id=$1`,
      [bookId],
      client
    );
    if (isBookExist.length === 0) return res.status(400).send("Book not found");

    await queryDb(
      `DELETE FROM transactions WHERE book_id=$1`,
      [bookId],
      client
    );
    await queryDb(`DELETE FROM books WHERE id=$1`, [bookId], client);

    res.status(200).send("Delete book success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateBook = async (req, res) => {
  const { id: bookId } = req.params;
  const { title, author, isbn } = req.body;

  if (!title || !author || !isbn) return res.status(400).send("Missing values");
  if (isbn.length !== 13 || isNaN(isbn))
    return res.status(400).send("ISBN must be 13 digits number");

  try {
    const isBookExist = await queryDb(
      `SELECT * FROM books WHERE id=$1`,
      [bookId],
      client
    );
    if (!isBookExist.length)
      return res.status(400).send("ID is not used by any book");

    const usedIsbn = await queryDb(
      `SELECT * FROM books WHERE isbn=$1 AND id != $2`,
      [isbn, bookId],
      client
    );

    if (usedIsbn.length > 0)
      return res.status(400).send("ISBN is already used");

    await queryDb(
      `UPDATE books SET title=$1, author=$2, isbn=$3 WHERE id=$4`,
      [title, author, isbn, bookId],
      client
    );

    res.status(200).send("Update book success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addBook,
  deleteBook,
  updateBook,
  getBooks,
  getAvailableBooks,
};

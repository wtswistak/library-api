const { queryDb, client } = require("../utils/queryDb");

const borrowBook = async (req, res) => {
  const { id: bookId } = req.params;
  const userId = req.user.userId;

  try {
    const isBookExist = await queryDb(
      `SELECT * FROM books WHERE id=$1`,
      [bookId],
      client
    );
    if (isBookExist.length === 0) return res.status(400).send("Book not found");
    if (!isBookExist[0].is_available)
      return res.status(400).send("Book is not available");

    await queryDb(
      `UPDATE books SET is_available=$1 WHERE id=$2`,
      ["FALSE", bookId],
      client
    );
    await queryDb(
      `INSERT INTO transactions(user_id, book_id,action) VALUES($1, $2,$3)`,
      [userId, bookId, "borrow"],
      client
    );

    res.status(200).send("Borrow book success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const returnBook = async (req, res) => {
  const { id: bookId } = req.params;
  const userId = req.user.userId;

  try {
    const isBookExist = await queryDb(
      `SELECT * FROM books WHERE id=$1`,
      [bookId],
      client
    );
    if (isBookExist.length === 0) return res.status(400).send("Book not found");
    if (isBookExist[0].is_available)
      return res.status(400).send("Book is already available");

    const lastBorrow = await queryDb(
      `SELECT * FROM transactions WHERE book_id=$1 AND action=$2 ORDER BY date DESC LIMIT 1`,
      [bookId, "borrow"],
      client
    );
    if (lastBorrow[0].user_id !== userId)
      return res.status(400).send("This book is not borrowed by you");

    await queryDb(
      `UPDATE books SET is_available=$1 WHERE id=$2`,
      ["TRUE", bookId],
      client
    );
    await queryDb(
      `INSERT INTO transactions(user_id, book_id,action) VALUES($1, $2,$3)`,
      [userId, bookId, "return"],
      client
    );

    res.status(200).send("Return book success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  borrowBook,
  returnBook,
};

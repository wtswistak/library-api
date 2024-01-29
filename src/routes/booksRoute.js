const {
  addBook,
  deleteBook,
  updateBook,
  getBooks,
  getAvailableBooks,
} = require("../controllers/booksController");
const {
  borrowBook,
  returnBook,
} = require("../controllers/transactionsController");
const {
  verifyAdmin,
  verifyUser,
  verifyToken,
} = require("../middlewares/validateToken");

const router = require("express").Router();

router.route("/add").post(verifyAdmin, addBook);
router.route("/remove/:id").delete(verifyAdmin, deleteBook);
router.route("/update/:id").put(verifyAdmin, updateBook);
router.route("/").get(verifyToken, getBooks);
router.route("/available").get(verifyToken, getAvailableBooks);

router.route("/borrow/:id").post(verifyUser, borrowBook);
router.route("/return/:id").post(verifyUser, returnBook);

module.exports = router;

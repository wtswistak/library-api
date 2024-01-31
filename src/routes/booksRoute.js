const {
  addBookCtrl,
  updateBookCtrl,
  getBooksCtrl,
  getAvailableBooksCtrl,
  deleteBookCtrl,
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

router.route("/add").post(verifyAdmin, addBookCtrl);
router.route("/remove/:id").delete(verifyAdmin, deleteBookCtrl);
router.route("/update/:id").put(verifyAdmin, updateBookCtrl);
router.route("/").get(verifyToken, getBooksCtrl);
router.route("/available").get(verifyToken, getAvailableBooksCtrl);

router.route("/borrow/:id").post(verifyUser, borrowBook);
router.route("/return/:id").post(verifyUser, returnBook);

module.exports = router;

require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/books", require("./routes/booksRoute"));

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});

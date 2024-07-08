require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

//Connecting to Mongoose
mongoose
 .connect(process.env.DATABASE_URL)
 .then(() => console.log("Connected"))
 .catch((err) => console.log(err));

//Middleware
app.use(cors());
app.use(express.json());

// Define routes
const blogsRouter = require("./routes/blogs");
app.use("/blogs", blogsRouter);

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

//Listem to server
app.listen(3000, () => console.log("Server connected"));
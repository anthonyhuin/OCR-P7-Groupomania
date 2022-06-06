const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const port = "8000";
const cors = require("cors");
require("./database");

//import routes

const userApi = require("./routes/user.api");
const authApi = require("./routes/auth.api");
const postApi = require("./routes/post.api");
const likeApi = require("./routes/like.api");
const commentApi = require("./routes/comment.api");
const profiltApi = require("./routes/profil.api");

app.use("/posts", express.static(path.join(__dirname, "uploads/posts")));
app.use("/profil", express.static(path.join(__dirname, "uploads/profil")));
app.use("/banner", express.static(path.join(__dirname, "uploads/banner")));
app.use("/default", express.static(path.join(__dirname, "uploads/default")));

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userApi);
app.use("/api/auth", authApi);
app.use("/api/post", postApi);
app.use("/api/like", likeApi);
app.use("/api/comment", commentApi);
app.use("/api/profil", profiltApi);

app.listen(8000, () => console.log("server up and running"));

module.exports = app;

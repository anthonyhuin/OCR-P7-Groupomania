const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
require("./database/models");

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

app.set("port", process.env.API_PORT);
app.listen(app.get("port"), () => console.log(`Server up and running on port ${process.env.API_PORT}`));

module.exports = app;

const db = require("../database/models");
const Post = db.Post;
const User = db.User;
const Like = db.Like;
const Comment = db.Comment;
const fs = require("fs");

exports.createPost = async (req, res) => {
  const data = {
    userId: req.user.id,
    post: req.body.post,
    picture: req.file !== undefined ? `${req.protocol}://${req.get("host")}/posts/${req.file.filename}` : null,
  };

  try {
    const post = await Post.create(data);
    const createdPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "id", "profilePicture"],
        },
        {
          model: Like,
          attributes: ["userId", "postId"],
        },
        {
          model: Comment,
          attributes: ["comment", "id", "createdAt"],
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "id", "profilePicture"],
            },
          ],
        },
      ],
    });

    res.status(201).json(createdPost);
  } catch (e) {
    res.status(400).json({ erreur: e });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "id", "profilePicture"],
        },
        {
          model: Like,
          attributes: ["userId", "postId"],
        },
        {
          model: Comment,
          attributes: ["comment", "id", "createdAt"],
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "id", "profilePicture"],
            },
          ],
        },
      ],
    });
    res.status(200).send(posts);
  } catch (e) {
    res.status(400).json({ erreur: e });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ raw: true, where: { id: req.params.id } });

    if (req.user.id !== post.userId) {
      if (req.user.roles != "admin") {
        return res.status(401).send({ erreur: "Action non autoris??e" });
      }
    }

    if (post.picture != null) {
      const filename = post.picture.split("/posts/")[1];
      fs.unlink(`uploads/posts/${filename}`, async () => {
        await Post.destroy({ where: { id: req.params.id } });
        return res.status(200).send("message supprim??");
      });
    } else {
      await Post.destroy({ where: { id: req.params.id } });
      return res.status(200).send("message supprim??");
    }
  } catch (e) {
    return res.status(401).json({ erreur: e });
  }
};

exports.editPost = async (req, res) => {
  try {
    const postUserId = await Post.findOne({ raw: true, attributes: ["userId"], where: { id: req.params.id } });

    if (req.user.id !== postUserId.userId) {
      if (req.user.roles != "admin") {
        return res.status(401).send({ erreur: "Action non autoris??e" });
      }
    }
    if (req.body.post.length <= 1) {
      return res.status(401).send({ erreur: "Veuillez renseigner ce champ" });
    }

    const postEdit = await Post.upsert({
      id: req.params.id,
      post: req.body.post,
    });

    res.status(201).send(postEdit[0].post);
  } catch (e) {
    res.status(404).json({ erreur: e });
  }
};

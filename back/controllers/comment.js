const db = require("../database/models");
const Post = db.Post;
const User = db.User;
const Like = db.Like;
const Comment = db.Comment;

exports.createComment = async (req, res) => {
  let data = {
    userId: req.user.id,
    postId: req.params.id,
    comment: req.body.comment,
  };

  try {
    const comment = await Comment.create(data);
    const user = await User.findOne({ attributes: ["firstName", "lastName", "profilePicture", "id"], where: { id: req.user.id } });
    data = { ...comment.dataValues, User: { ...user.dataValues } };

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ erreur: error });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ attributes: ["userId"], where: { id: req.params.id } });

    if (req.user.id !== comment.dataValues.userId) {
      if (req.user.roles != "admin") {
        return res.status(401).send({ erreur: "Action non autorisée" });
      }
    } else {
      await Comment.destroy({ where: { id: req.params.id } });
    }

    return res.status(200).send("commentaire supprimé");
  } catch (error) {
    return res.status(401).send(error);
  }
};

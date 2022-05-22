const db = require("../database/index");
const Post = db.post;
const User = db.user;
const Like = db.like;
const Comment = db.comment;

exports.createComment = async (req, res) => {
  let data = {
    userId: req.user.id,
    postId: req.params.id,
    comment: req.body.comment,
  };

  try {
    const comment = await Comment.create(data);
    const user = await User.findOne({ attributes: ["firstName", "lastName", "profilePicture"], where: { id: req.user.id } });
    data = { ...comment.dataValues, ...user.dataValues };

    res.status(201).json(data);
  } catch (error) {
    console.log(data);
    console.log(error);
    res.status(400).json({ error });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ attributes: ["userId"], where: { id: req.params.id } });

    if (req.user.id !== comment.dataValues.userId) {
      return res.status(400).send({
        error: "Action non autorisée",
      });
    } else {
      await Comment.destroy({ where: { id: req.params.id } });
    }

    return res.status(200).send("commentaire supprimé");
  } catch (error) {
    return res.status(401).send(error);
  }
};

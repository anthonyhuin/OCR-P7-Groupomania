const db = require("../database/models");
const User = db.User;
const Comment = db.Comment;

exports.createComment = async (req, res) => {
  let data = {
    userId: req.user.id,
    postId: req.params.id,
    comment: req.body.comment,
  };

  try {
    const comment = (await Comment.create(data)).get({ plain: true });
    const user = await User.findOne({ raw: true, attributes: ["firstName", "lastName", "profilePicture", "id"], where: { id: req.user.id } });
    data = { ...comment, User: { ...user } };

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ erreur: error });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ raw: true, attributes: ["userId"], where: { id: req.params.id } });

    if (req.user.id !== comment.userId) {
      if (req.user.roles != "admin") {
        return res.status(401).send({ erreur: "Action non autorisée" });
      }
    }

    await Comment.destroy({ where: { id: req.params.id } });

    return res.status(200).send("commentaire supprimé");
  } catch (error) {
    return res.status(401).json({ erreur: error });
  }
};

const db = require("../database/models");
const Like = db.Like;

exports.setLike = async (req, res) => {
  let data = {
    userId: req.user.id,
    postId: req.body.postId,
  };

  try {
    const alreadyLiked = await Like.findOne({ where: { userId: req.user.id, postId: req.body.postId } });

    if (alreadyLiked === null) {
      await Like.create(data);
      res.status(200).json({ liked: true, data });
    } else {
      await Like.destroy({ where: { userId: req.user.id, postId: req.body.postId } });
      res.status(200).json({ liked: false });
    }
  } catch (e) {
    res.status(400).json({ erreur: e });
  }
};

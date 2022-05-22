const db = require("../database/index");
const Like = db.like;

exports.setLike = async (req, res) => {
  let data = {
    userId: req.user.id,
    postId: req.body.postId,
  };

  try {
    const alreadyLiked = await Like.findOne({ where: { userId: req.user.id, postId: req.body.postId } });

    if (alreadyLiked === null) {
      await Like.create(data);
      let { count, rows } = await Like.findAndCountAll({ raw: true, distinct: true, where: { postId: req.body.postId } });
      res.status(200).json({ count, hasLiked: true });
    } else {
      await Like.destroy({ where: { userId: req.user.id, postId: req.body.postId } });
      let { count, rows } = await Like.findAndCountAll({ raw: true, distinct: true, where: { postId: req.body.postId } });
      res.status(200).json({ count, hasLiked: false });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

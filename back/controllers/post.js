const db = require("../database/index");
const Post = db.post;
const User = db.user;
const Like = db.like;
const Comment = db.comment;
const fs = require("fs");

exports.createPost = async (req, res) => {
  let data = {
    userId: req.user.id,
    post: req.body.post,
    picture: req.file !== undefined ? `${req.protocol}://${req.get("host")}/posts/${req.file.filename}` : null,
  };

  try {
    const post = await Post.create(data);
    const user = await User.findOne({ attributes: ["firstName", "lastName", "profilePicture"], where: { id: req.user.id } });
    data = { ...post.dataValues, ...user.dataValues, likeCount: 0, commentCount: 0, hasLiked: false, comments: [] };

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const post = await Post.findAll({ raw: true, order: [["id", "DESC"]], where: { active: 1 } });

    const postWithInfo = await Promise.all(
      post.map(async (post) => {
        const userInfos = await User.findOne({ attributes: ["id", "firstName", "lastName", "profilePicture"], where: { id: post.userId } });
        const likeCount = await Like.count({ where: { postId: post.id } });
        let hasLiked = await Like.findOne({ where: { postId: post.id, userId: req.user.id } });
        if (hasLiked === null) {
          hasLiked = false;
        } else {
          hasLiked = true;
        }
        const commentCount = await Comment.count({ where: { postId: post.id } });
        const commentContent = await Comment.findAll({ raw: true, order: [["id", "DESC"]], where: { postId: post.id, active: 1 } });

        const commentWithInfo = await Promise.all(
          commentContent.map(async (comment) => {
            const userInfos = await User.findOne({ attributes: ["id", "firstName", "lastName", "profilePicture"], where: { id: comment.userId, active: 1 } });
            return {
              ...comment,
              firstName: userInfos.firstName,
              lastName: userInfos.lastName,
              profilePicture: userInfos.profilePicture,
            };
          })
        );
        return {
          ...post,
          firstName: userInfos.firstName,
          lastName: userInfos.lastName,
          profilePicture: userInfos.profilePicture,
          likeCount: likeCount,
          commentCount: commentCount,
          hasLiked: hasLiked,
          comments: commentWithInfo,
          editMode: false,
          editPost: false,
        };
      })
    );

    res.status(201).json(postWithInfo);
  } catch (e) {
    res.status(403).json({ erreur: e });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });

    if (req.user.id !== post.dataValues.userId) {
      if (req.user.roles != "admin") {
        return res.status(401).send({ erreur: "Action non autorisée" });
      }
    }

    if (post.dataValues.picture != null) {
      const filename = post.dataValues.picture.split("/posts/")[1];

      fs.unlink(`uploads/posts/${filename}`, async () => {
        await Post.destroy({ where: { id: req.params.id } });
        //supprimer aussi les commentaires lié au post
        return res.status(200).send("message supprimé");
      });
    } else {
      await Post.destroy({ where: { id: req.params.id } });
      //supprimer aussi les commentaires lié au post
      return res.status(200).send("message supprimé");
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};
exports.editPost = async (req, res) => {
  try {
    const postUserId = await Post.findOne({ raw: true, attributes: ["userId"], where: { id: req.params.id } });

    if (req.user.id !== postUserId.userId) {
      return res.status(400).send({
        erreur: "Action non autorisée",
      });
    }

    let postEdit = await Post.upsert({
      id: req.params.id,
      post: req.body.post,
    });

    res.status(201).send(postEdit[0].post);
  } catch (e) {
    res.status(404).json({ erreur: e });
  }
};

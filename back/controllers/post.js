const db = require("../database/index");
const Post = db.post;
const User = db.user;
const Like = db.like;
const Comment = db.comment;
const fs = require("fs");

exports.createPost = async (req, res) => {
  let fileName;
  if (req.file !== undefined) {
    const MIME_TYPES = {
      "image/jpg": "jpg",
      "image/jpeg": "jpeg",
      "image/png": "png",
    };
  }

  let data = {
    userId: req.user.id,
    post: req.body.post,
    picture: req.file !== undefined ? `${req.protocol}://${req.get("host")}/posts/${req.file.filename}` : null,
  };

  try {
    const post = await Post.create(data);
    const user = await User.findOne({ attributes: ["firstName", "lastName", "profilePicture"], where: { id: req.user.id } });
    data = { ...post.dataValues, ...user.dataValues, likeCount: 0, commentCount: 0, hasLiked: false, comments: [] };
    console.log(data);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const post = await Post.findAll({ raw: true, order: [["id", "DESC"]] });

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
        const commentContent = await Comment.findAll({ raw: true, order: [["id", "DESC"]], where: { postId: post.id } });

        const commentWithInfo = await Promise.all(
          commentContent.map(async (comment) => {
            const userInfos = await User.findOne({ attributes: ["id", "firstName", "lastName", "profilePicture"], where: { id: comment.userId } });
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
    console.log(post.dataValues.picture);
    if (req.user.id !== post.dataValues.userId) {
      return res.status(400).send({
        erreur: "Action non autorisée",
      });
    } else {
      if (post.dataValues.picture != null) {
        const filename = post.dataValues.picture.split("/posts/")[1];
        console.log(filename);

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
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

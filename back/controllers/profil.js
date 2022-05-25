const db = require("../database/index");
const Post = db.post;
const User = db.user;
const Like = db.like;
const Comment = db.comment;

exports.getPostProfil = async (req, res) => {
  try {
    const post = await Post.findAll({ raw: true, order: [["id", "DESC"]], where: { userId: req.params.id } });

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
          errorMessage: "",
          hasLiked: hasLiked,
          comments: commentWithInfo,
          clickDelete: false,
        };
      })
    );

    res.status(201).json(postWithInfo);
  } catch (e) {
    res.status(403).json(e);
  }
};

exports.getProfil = async (req, res) => {
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
          errorMessage: "",
          hasLiked: hasLiked,
          comments: commentWithInfo,
          clickDelete: false,
        };
      })
    );

    res.status(201).json(postWithInfo);
  } catch (e) {
    res.status(403).json({ erreur: e });
  }
};

const db = require("../database/models");
const Post = db.Post;
const User = db.User;
const Like = db.Like;
const Comment = db.Comment;
const fs = require("fs");
exports.getPostProfil = async (req, res) => {
  try {
    const post = await Post.findAll({ raw: true, order: [["id", "DESC"]], where: { userId: req.params.id, active: 1 } });

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
        };
      })
    );

    res.status(201).json(postWithInfo);
  } catch (e) {
    res.status(403).json(e);
  }
};

exports.getInfoProfil = async (req, res) => {
  try {
    const user = await User.findOne({ attributes: { exclude: ["password"] }, raw: true, where: { id: req.params.id } });
    if (user === null) {
      throw null;
    }
    res.status(201).json(user);
  } catch (e) {
    res.status(403).json({ erreur: e });
  }
};

exports.modifyProfil = async (req, res) => {
  try {
    let user = await User.findOne({ where: { id: req.user.id } });

    user.set({
      bio: req.body.bio,
      birthdate: req.body.birthday,
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      location: req.body.location,
      poste: req.body.poste,
    });

    user = await user.save();

    res.status(201).json(user);
  } catch (e) {
    res.status(403).json({ erreur: e });
  }
};
exports.changeBanner = async (req, res) => {
  try {
    const user = await User.findOne({ raw: true, where: { id: req.user.id } });
    const filename = user.bannerPicture.split("/banner/")[1];

    fs.unlink(`uploads/banner/${filename}`, async () => {
      let bannerPicture = `${req.protocol}://${req.get("host")}/banner/${req.file.filename}`;

      let newBannerPicture = await User.upsert({
        id: req.user.id,
        bannerPicture: bannerPicture,
      });

      res.status(201).json(newBannerPicture[0].bannerPicture);
    });
  } catch (e) {
    res.status(403).json({ erreur: e });
  }
};

exports.changeProfilPicture = async (req, res) => {
  try {
    const user = await User.findOne({ raw: true, where: { id: req.user.id } });
    const filename = user.profilePicture.split("/profil/")[1];

    fs.unlink(`uploads/profil/${filename}`, async () => {
      let profilePicture = `${req.protocol}://${req.get("host")}/profil/${req.file.filename}`;

      let newprofilePicture = await User.upsert({
        id: req.user.id,
        profilePicture: profilePicture,
      });

      res.status(201).json(newprofilePicture[0].profilePicture);
    });
  } catch (e) {
    res.status(403).json({ erreur: e });
  }
};

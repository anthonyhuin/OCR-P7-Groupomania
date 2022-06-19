const db = require("../database/models");
const Post = db.Post;
const User = db.User;
const Like = db.Like;
const Comment = db.Comment;
const fs = require("fs");
exports.getPostProfil = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { userId: req.params.id },
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
    res.status(400).json(e);
  }
};

exports.getInfoProfil = async (req, res) => {
  try {
    const user = await User.findOne({ attributes: { exclude: ["password"] }, raw: true, where: { id: req.params.id } });
    if (user === null) {
      throw "Utilisateur introuvable";
    }
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ erreur: e });
  }
};

exports.modifyProfil = async (req, res) => {
  try {
    let user = await User.findOne({ attributes: { exclude: ["password"] }, where: { id: req.user.id } });

    if (req.body.birthday !== null) {
      let birthdate = req.body.birthday.split("-");
      let date = new Date();
      let year = date.getFullYear();
      if (year - birthdate[0] < 18) {
        throw "Âge minimum  : 18 ans";
      }
    }

    user.set({
      bio: req.body.bio,
      birthdate: req.body.birthday,
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      location: req.body.location,
      job: req.body.job,
    });

    user = await user.save();

    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ erreur: e });
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
    res.status(400).json({ erreur: e });
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
    res.status(400).json({ erreur: e });
  }
};

const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.getAll = (req, res, next) => {
  console.log("🏋🏼‍♀️ | Im in the controller, getAllFunction");
  Sauce.find()
    .then((sauces) => {
      console.log("sauces form backend", sauces);
      return res.status(200).json(sauces);
    })
    .catch((error) => res.status(400).json(error));
};
exports.createOne = (req, res, next) => {
  console.log("🏋🏼‍♀️🏋🏼‍♀️ | Im in the controller, createOne Function");
  const sauceObject = JSON.parse(req.body.sauce);

  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(200).json({ message: "Sauce has been created" }))
    .catch((error) => res.status(401).json(error));
};

exports.getOne = (req, res, next) => {
  console.log("🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️ | Im in the controller, getOne Function");
  const productId = req.params.id;
  Sauce.findOne({ _id: productId })
    .then((foundSauce) => res.status(200).json(foundSauce))
    .catch((error) => res.status(400).json(error));
};

exports.updateOne = (req, res, next) => {
  console.log("🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️ | Im in the controller, updateOne Function");
  console.log("🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️", req.body);
  // Retrieve the product ID
  const productId = req.params.id;

  // Create object from form
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  console.log(sauceObject);

  delete sauceObject._userId;

  Sauce.findOne({ _id: productId })
    .then((foundSauce) => {
      if (foundSauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Operation non authorisé" });
      }
      Sauce.updateOne(
        { _id: productId },
        {
          ...sauceObject,
        }
      )
        .then(() => {
          const filename = foundSauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            res.status(200).json({ message: "Object successfully deleted" });
          });
        })
        .catch((error) => res.status(401).json(error));
    })
    .catch((error) => res.status(400).json(error));
};

exports.deleteOne = (req, res, next) => {
  console.log("🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️ | Im in the controller, delete Function");
  const productId = req.params.id;
  Sauce.findOne({ _id: productId })
    .then((foundSauce) => {
      if (foundSauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Operation non authorisé" });
      } else {
        const filename = foundSauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: productId })
            .then(() =>
              res.status(200).json({ message: "Object successfully deleted" })
            )
            .catch((error) => res.status(401).json(error));
        });
      }
    })
    .catch((error) => res.status(400).json(error));
};

exports.handleLike = (req, res, next) => {
  console.log("🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️🏋🏼‍♀️ | Im in the controller, Handlelike Function");
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let usersLiked = [...sauce.usersLiked];
      let usersDisliked = [...sauce.usersDisliked];
      let likes = sauce.likes;
      let dislikes = sauce.dislikes;

      if (req.body.like === 1) {
        usersLiked = [...usersLiked, req.body.userId];
        likes++;
      }

      if (req.body.like === 0) {
        usersLiked.includes(req.body.userId) ? likes-- : dislikes--;
        usersLiked = usersLiked.filter((user) => user !== req.body.userId);
        usersDisliked = usersDisliked.filter(
          (user) => user !== req.body.userId
        );
      }

      if (req.body.like === -1) {
        usersDisliked = [...usersDisliked, req.body.userId];
        dislikes++;
      }

      Sauce.updateOne(
        { _id: req.params.id },
        { usersDisliked, usersLiked, likes, dislikes }
      )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

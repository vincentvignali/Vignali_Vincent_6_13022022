const express = require("express");
const auth = require("../middlewares/auth");
const sauceCtrl = require("../controllers/sauce");
const multer = require("../middlewares/multer");

const router = express.Router();

router.get("/", auth, sauceCtrl.getAll);
router.get("/:id", auth, sauceCtrl.getOne);
router.post("/", auth, multer, sauceCtrl.createOne);
router.post("/:id/like", auth, sauceCtrl.handleLike);
router.put("/:id", auth, multer, sauceCtrl.updateOne);
router.delete("/:id", auth, sauceCtrl.deleteOne);

module.exports = router;

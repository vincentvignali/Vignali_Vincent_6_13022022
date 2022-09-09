const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const authRouter = require("./routes/auth");
const saucesRouter = require("./routes/sauce");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tkgu7gb.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Cors authorization fixing Preflight
app.options("/*", (_, res) => {
  res.sendStatus(200);
});

app.use(express.json());

// App Router
app.use("/api/auth", authRouter);
app.use("/api/sauces", saucesRouter);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;

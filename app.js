//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//remember to not using "localhost" but "127.0.0.1"
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true })
  .then(() => console.log("Connected Successfully"))
  .catch(error => console.log('Failed to connect', error));

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema); //mongo will auto change into articles (lowercase and plural)
/*
//GET all
//async/await for callbacks
app.get("/articles", async function (req, res) {
  try {
    const articles = await Article.find();
    res.send(articles);
  } catch (err) {
    console.error(err);
  }
});

//POST a new
app.post("/articles", function (req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save()
    .then(() => res.send("Add successfully!"))
    .catch(error => res.send('Add failed!', error));
});

//DELETE all
app.delete("/articles", async function(req, res){
  try {
    const articles = await Article.deleteMany();
    res.send("Delete successfully!");
  } catch (err) {
    res.send("Delete failed!", err);
  }
});
*/

//can be shorter by combine using route of expressjs
app.route("/articles")
  .get(async function (req, res) {
    try {
      const articles = await Article.find();
      res.send(articles);
    } catch (err) {
      console.error(err);
    }
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save()
      .then(() => res.send("Add successfully!"))
      .catch(error => res.send('Add failed!', error));
  })
  .delete(async function(req, res){
    try {
      const articles = await Article.deleteMany();
      res.send("Delete successfully!");
    } catch (err) {
      res.send("Delete failed!", err);
    }
  });

//work with a specific resource
app.route("/articles/:articleTitle")
  .get(async function(req, res){
    await Article.findOne({title: req.params.articleTitle})
    .then(foundArticle => res.send(foundArticle))
    .catch(res.send("Cant find!"));
  })

//TODO

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
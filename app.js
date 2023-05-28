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
  .delete(async function (req, res) {
    try {
      const articles = await Article.deleteMany();
      res.send("Delete successfully!");
    } catch (err) {
      res.send("Delete failed!", err);
    }
  });

//work with a specific resource (here is name)
//GET 1
app.route("/articles/:articleTitle")
  .get(async function (req, res) {
    try {
      const foundArticle = await Article.findOne({ title: req.params.articleTitle });
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("Article not found!");
      }
    } catch (error) {
      res.status(500).send("An error occurred while retrieving the article.");
    }
  })
  //Update 1 resouce (with all fields required when input)
  .put(async function (req, res) {
    try {
      await Article.replaceOne(
        { title: req.params.articleTitle }, // condition
        { title: req.body.title, content: req.body.content } // updates
      );
      res.send("Successfully updated!");
    } catch (err) {
      res.status(500).send("Error occurred while updating the article." + err);
    }
  })
  //Update fields (1 or some) of a resource
  .patch(async function (req, res) {
    try {
      await Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body }
      );
      res.send("Successfully update fields!");
    } catch (err) {
      res.status(500).send("Error occurred while updating (patch) the article." + err);
    }
  })
  //Delete 1
  .delete(async function (req, res) {
    try {
      const articles = await Article.deleteOne({ title: req.params.articleTitle });
      res.send("Delete successfully!");
    } catch (err) {
      res.send("Delete failed!", err);
    }
  });

//TODO

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
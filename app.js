const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                console.error(err);
            }
        });
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully added a new article!");
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("Successfully deleted all the articles")
            } else {
                res.send(err);
            }
        });
    });

app.route("/articles/:articleTitle")

    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles of the given title were found.");
            }
        });
    })

    .put((req, res) => {
        Article.replaceOne({
            title: req.params.articleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, {
            overwrite: true
        }, (err, updationRes) => {
            if (!err) {
                console.log(updationRes.ok);
                console.log(updationRes.n);
                console.log(updationRes.nModified);
                res.send("Successfully updated the article!");
            } else {
                console.error(err);
            }
        });
    })

    .patch((req, res) => {
        Article.updateOne({
            title: req.params.articleTitle
        }, {
            $set: req.body
        }, (err, writeOpRes) => {
            if(err){
                console.error(err);
                res.status(404).send("Not found!");
            }
            else{
                console.log(writeOpRes)
                res.send("File field patched successfully");
            }

        });
    })

    .delete((req, res) =>{
        Article.deleteOne({
            title: req.params.articleTitle
        }, (err) => {
            if(err){
                console.error(err);
            }
            else{
                res.send("Article Deleted Successfully!");
            }
        });
    });


app.listen(3000, () => {
    console.log("Server started on port 3000");
});
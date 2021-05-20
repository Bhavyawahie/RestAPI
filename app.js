const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);

app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
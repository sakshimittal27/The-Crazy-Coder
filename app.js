

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose= require("mongoose");
const app = express();
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser:true});

const postsSchema ={
  title: String,
  content: String
};

const Post= mongoose.model("Post", postsSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      posts: posts
      });
  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/"); 
    }
  });
  
});


app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;

  Post.findOne({_id: requestedId}, function(err, foundPost){
    if(!err){
      if(foundPost){
        res.render("post",{
          title: foundPost.title,
          content: foundPost.content
        });
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

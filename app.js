const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const lodash = require("lodash");

const homeStartingContent =
    "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(express.static("public"));

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const postSchema = {
    postTitle: String,
    postBody: String,
};

const BlogPost = mongoose.model("BlogPost", postSchema);

let posts = [];

// home page
app.get("/", (req, res) => {
    BlogPost.find({}, (err, result) => {
        if (!err) {
            console.log(result);
            if (result.length === 0) {
                posts = [{ postTitle: "Home", postBody: homeStartingContent }];
            } else {
                posts = result;
            }
            console.log(posts);
            res.render("home", {
                posts: posts,
            });
        }
    });
});

// about page
app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent });
});

// contact page
app.get("/contact", (req, res) => {
    res.render("contact", { contactContent: contactContent });
});

// compose page
app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
    const newPost = new BlogPost({
        postTitle: req.body.postTitle,
        postBody: req.body.postBody,
    });
    newPost.save({}, (err) => {
        if (!err) {
            res.redirect("/");
        } else {
            console.log("\nCannot save post");
            console.log(err);
        }
    });
});

// posts page
app.get("/posts/:postID", (req, res) => {
    BlogPost.findOne({ postTitle: req.params.postID }, (err, post) => {
        if (!err) {
            res.render("post", { post: post });
        }
    });
});

connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server started on port 3000");
        console.log("listening for requests");
    });
});

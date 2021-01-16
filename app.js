//jshint esversion:6
require("dotenv").config();
const express= require("express");
const ejs= require("ejs");
const mongoose= require("mongoose");
const session = require("express-session");
const passport= require("passport");
const passportLocalMongoose= require("passport-local-mongoose");

const app= express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

app.use(session({
    secret:"This is our secret code.",
    resave: false,
    saveUninitialized:false,
    cookie:{secure:"auto"}
}));

app.use(passport.initialize());
app.use(passport.session());


/////////////////////////// Mongoose Setup ////////////////////////////////////////////////////////

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser:true, useUnifiedTopology:true});
mongoose.set('useCreateIndex', true);

const userSchema= new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("user", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////////////////// Handling HTTP requests /////////////////////////////////////////////

app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/login", function(req, res){
    res.render("login");
});


app.get("/submit", function(req, res){
    res.render("submit");
});

app.get("/secrets", function(req, res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.post("/register", function(req, res){
    User.register({username:req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", function(req, res){
    const user=new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
            res.redirect("/login");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });
});


////////////////////////// Listening on port 3000 ////////////////////////////
app.listen("3000", function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Server started successfully");
    }
})
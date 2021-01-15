//jshint esversion:6
require("dotenv").config();
const express= require("express");
const ejs= require("ejs");
const mongoose= require("mongoose");
const encrypt = require("mongoose-encryption");

const app= express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));

/////////////////////////// Mongoose Setup ////////////////////////////////////////////////////////

mongoose.connect("mongodb://localhost:27017/usersDB", {useNewUrlParser:true, useUnifiedTopology:true});

const userSchema= new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = mongoose.model("user", userSchema);

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

app.post("/register", function(req, res){
    
    const user={
        email: req.body.username,
        password: req.body.password
    };
    User.create(user, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });

});

app.post("/login", function(req, res){
    User.findOne({email:req.body.username}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser.password === req.body.password){
                
                res.render("secrets");
            }
            else{
                
            }
        }
    })
})


////////////////////////// Listening on port 3000 ////////////////////////////
app.listen("3000", function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Server started successfully");
    }
})
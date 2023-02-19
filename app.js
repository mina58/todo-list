//imports
const express = require("express");
const bodyParser = require("body-parser");
const { render } = require("ejs");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

//TODO:
//remove old storage
let workItems = [];

//express setup
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//mongoose setup
mongoose.connect("mongodb://127.0.0.1:27017/todoDB");

//schema setup
const itemSchema = new mongoose.Schema({
    name: String,
    type: String
});

//models setup
const TodoItem = mongoose.model("todoItem", itemSchema);


//routing
app.get("/", function (req, res) {
    const day = date();
    const query = TodoItem.find({type: "todo"});
    query.exec(function(err, items) {
        if (err) {
            console.log("query error");
        } else {
            res.render("list", {
                listTitle: day,
                items: items
            });
        }
    })
})

app.get("/work", function (req, res) {
    const query = TodoItem.find({type: "work"});
    query.exec(function(err, items) {
        if (err) {
            console.log("query error");
        } else {
            res.render("list", {
                listTitle: "Work",
                items: items
            });
        }
    })
})

app.get("/about", function(req, res) {
    res.render("about");
})

//posts responses
app.post("/", function (req, res) {
    const listType = req.body.list === "work" ? "work" : "todo";
    const item = new TodoItem({
        name: req.body.newTodoItem,
        type: listType
    });
    item.save();
    if (listType === "work") {
        console.log("listType");
        res.redirect("/work");
    } else {
        res.redirect("/");
    }
})

app.post("/delete", function(req, res) {
    const itemId = req.body.checkbox;
    TodoItem.findByIdAndDelete(itemId, function(err, docs) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/");
})

//server
app.listen(3000, function () {
    console.log("server up");
})
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
app.get("/:listName", function(req, res) {
    const customList = req.params.listName;
    const query = TodoItem.find({type: customList});
    query.exec(function(err, items) {
        if (err) {
            console.log("query error");
        } else {
            res.render("list", {
                listTitle: customList,
                items: items
            });
        }
    })
})

app.get("/about", function(req, res) {
    res.render("about");
})

//posts responses
app.post("/:listName", function (req, res) {
    const listType = req.params.listName;
    const item = new TodoItem({
        name: req.body.newTodoItem,
        type: listType
    });
    item.save();
    res.redirect("/" + req.params.listName);
})

app.post("/delete/:listName", function(req, res) {
    const itemId = req.body.checkbox;
    TodoItem.findByIdAndDelete(itemId, function(err, docs) {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/" + req.params.listName);
})

//server
app.listen(3000, function () {
    console.log("server up");
})
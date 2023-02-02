const express = require("express");
const bodyParser = require("body-parser");
const { render } = require("ejs");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let items = [];
let workItems = [];

app.get("/", function (req, res) {
    let day = date();
    res.render("list", {
        listTitle: day,
        items: items
    })
})

app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work",
        items: workItems
    })
})

app.get("/about", function(req, res) {
    res.render("about");
})


app.post("/", function (req, res) {
    console.log(req.body.list);
    let item = req.body.newTodoItem;
    if (req.body.list == "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
})

app.listen(3000, function () {
    console.log("server up");
})
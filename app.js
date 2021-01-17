const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/bankDB", {useNewUrlParser:true, useUnifiedTopology:true});

const usersSchema = {
    "name": String,
    "email": String,
    "balance": Number
};
const User = mongoose.model("User", usersSchema);

const defaultUserData = [
    new User({
        name: "Carys Riad",
        email: 'riadcarys@xyz.com',
        balance: 10000
    }),
    new User({
        name: "Bonita Madhuri",
        email: 'bonmad@xyz.com',
        balance: 7000
    }),
    new User({
        name: "Jeane Verônica",
        email: "jeanveron@xyz.com",
        balance: 10000
    }),
    new User({
        name: "Iunia Pema",
        email: "pemaiun@xyz.com",
        balance: 7000
    }),
    new User({
        name: "Rajesh George",
        email: "rajgeorge@xyz.com",
        balance: 12000
    }),
    new User({
        name: "Nynniaw Chidiebube",
        email: "nynnchid@xyz.com",
        balance: 15000
    }),
    new User({
        name: "Juurou Saori",
        email: 'jsaor@xyz.com',
        balance: 5000
    }),
    new User({
        name: "Nkechi Leopold",
        email: "nleopold@xyz.com",
        balance: 10000
    }),
    new User({
        name: "Carmela Flora",
        email: "floracarmela@xyz.com",
        balance: 4000
    }),
    new User({
        name: "Abe Maryna",
        email: "abemaryna@xyz.com",
        balance: 7000
    })
];


app.get('/', function(req, res){
    res.render("index", {});
})

app.get('/users', function(req, res){
    User.find({}, function(err, foundUsers){
        if(foundUsers.length === 0){
            User.insertMany(defaultUserData, function(err){
                if(err)
                    console.log(err);
                else
                    console.log("success!");
            })
            res.redirect("/users");
        }
        else
            res.render("userList", {listTitle: "Users", newListItems: foundUsers});
    })

})

app.post('/transaction', function(req, res){
    const lendee_id = req.body.new_transaction;

    User.findById(lendee_id, function(err, lendeeUser){
        if(err){
            console.log(err);
        }
        else{
            res.render('transaction', {title: "Transaction", lendee: lendeeUser});
        }
    })

})

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
  
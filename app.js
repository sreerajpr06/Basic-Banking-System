const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-kingAtlan:atlantis@cluster0.zo5pc.mongodb.net/bankDB?retryWrites=true&w=majority", {useNewUrlParser:true, useUnifiedTopology:true});

mongoose.set('useFindAndModify', false);

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
    const lender_id = req.body.new_transaction;

    User.findById(lender_id, function(err, lenderUser){
        if(err){
            console.log(err);
        }
        else{
            User.find({
                _id: {$ne : lender_id}
            }, function(err, restOfUsers){
                if(err){
                    console.log(err);
                }
                else{
                    res.render('transaction', {title: "Transaction", lender: lenderUser, otherUsers: restOfUsers});
                    // console.log(restOfUsers);
                }
            })
        }
    })
    // res.redirect('/users')

})

app.post('/processing', async function(req, res){
    const target_email = req.body.lendee;
    const amount = parseInt(req.body.amount);
    const lender_email = req.body.lender_details;

    // console.log(target_email);
    // console.log(amount);
    // console.log(lender_email);

    let target = await User.find({email: target_email});
    target = target[0];
    let target_balance = Number(target.balance + amount);

    let lender = await User.find({email: lender_email});
    lender = lender[0]
    let lender_balance = Number(lender.balance - amount);
    // console.log(lender);

    await User.findByIdAndUpdate(target._id, {"balance": target_balance}, function(err, docs){
        if(err){
            console.log(target_balance);
        }
        else{
            console.log("Target balance updated");
        }
    })

    await User.findByIdAndUpdate(lender._id, {balance: lender_balance}, function(err, docs){
        if(err){
            console.log(err);
        }
        else{
            console.log("lender balance updated");
        }
    })

    res.redirect('/users');
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(3000, function() {
    console.log("Server started successfully");
});
  
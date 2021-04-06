//jshint esversion: 6

// -- common text
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mongoose = require("mongoose");

// passport
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
//

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//passport
app.use(session({
  secret: "Our little secrets.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//p

// ---- database

mongoose.connect("mongodb://localhost:27017/loginDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true); //p

// A document or model
const personSchema = new mongoose.Schema ({
  username: String,
  password: String
});

personSchema.plugin(passportLocalMongoose); //p

const Person = new mongoose.model("Person", personSchema);
const Admin = mongoose.model("Admin", personSchema);

passport.use(Person.createStrategy()); //p

// passport.serializeUser(Person.serializeUser()); //p
// passport.deserializeUser(Person.deserializeUser()); //p

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Person.findById(id, function(err, user) {
    done(err, user);
  });
});

// app.use((req,res,next)=>{
//   res.locals.message=req.session.message;
//   delete req.session.message;
//   next();
// });

// -------------------------------------------------------------------

// tmp code
var suEmail = "";
// schema create

const profileSchema = {
  f_name: String,
  l_name: String,
  e_mail: String,
  p_num: String,
  c_add: String,
  height: String,
  weight: String,
  disease: String,
  dayy: String,
  month: String,
  year: String,
  gender: String
};

const Profile = mongoose.model("Profile", profileSchema);

app.get("/newProfile", function(req, res){
  res.sendFile(__dirname + "/Add_new_user.html");
});

app.post("/newProfile", function(req, res){

  const f_name1 = req.body.firstname;
  const l_name1 = req.body.lastname;
  // const e_mail1 = req.body.Enteremail;
  const p_num1 = req.body.MobileNumber;
  const c_add1 = req.body.address;
  const height1 = req.body.Height;
  const weight1 = req.body.Weight;
  const disease1 = req.body.diseases;
  const dayy1 = req.body.DOBDay;
  const month1 = req.body.DOBMonth;
  const year1 = req.body.DOBYear;
  const gender1 = req.body.gender;

  const profile = new Profile({
    f_name: f_name1,
    l_name: l_name1,
    // e_mail: e_mail1,
    e_mail: suEmail,
    p_num: p_num1,
    c_add: c_add1,
    height: height1,
    weight: weight1,
    disease: disease1,
    dayy: dayy1,
    month: month1,
    year: year1,
    gender: gender1
  });

  profile.save();
  console.log("Data is filled");
  res.redirect("/Home");
});

// ------------ end tmp code

// home page and appointment manage

app.get("/first", function(req, res){
  // console.log("only page running");
  res.sendFile(__dirname + "/index.html");
});

const contactSchema = {
  nameC: String,
  emailC: String,
  subC: String,
  diseaseC: String
};

const Appointment = mongoose.model("Appointment", contactSchema);

// appointment

app.post("/first", function(req, res){
  // res.redirect("/first");
  const appointment = new Appointment({
    nameC: req.body.name,
    emailC: req.body.email,
    subC: req.body.subject,
    diseaseC: req.body.message
  });

  appointment.save();
  console.log("appointment is sent.");
  res.redirect("/first");

});

// show appointment

app.get("/appointment", function(req, res){
  Appointment.find({}, function(err, foundItems){
    if(foundItems.length === 0) {
      res.redirect("/Home");
    } else {
      res.render("appo", {newListItems: foundItems});
    }
    // console.log(foundItems);
  });
});

// -- signup

app.get("/", function(req, res){
  // res.sendFile(__dirname + "/signup.html");
  res.render("register");
});

app.post("/", function(req, res){

  // const email_add = req.body.email;
  // const password_1 = req.body.password1;
  // const password_2 = req.body.password2;
  //
  // if(password_1 === password_2 ) {
  //   const person = new Person({
  //     email: email_add,
  //     password: password_1
  //   });
  //
  //   person.save();
  //   res.redirect("/newProfile");
  // } else {
  //   res.redirect("/");
  // }

  //passport uses here
  console.log("yaha tak to aa rha h :|");
  // console.log(req.body.username);
  Person.register(new Person({username: req.body.username}), req.body.password1, function(err, person){
    // if (err) {
    //   console.log(err);
    //   console.log("errror aa rhe h...");
    //   res.redirect("/");
    // } else {
    //   passport.authenticate("local")(req, res, function(){
    //     console.log("successfully signup.");
        suEmail = req.body.username;
        res.redirect("/newProfile");
    //   });
    // }
  });

});

// --------- login for admin

app.get("/login", function(req, res){
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", function(req, res){

  const email_add = req.body.email;
  const password_add = req.body.password;

  const admin = new Admin({
    email: req.body.email,
    password: req.body.password
  });

  Admin.find({email: email_add, password: password_add}, function(err, check){
    if(check.length === 0) {
      res.redirect("/login");
    } else {
      res.redirect("/Home");
    }
  });

  // passport uses here
  // req.login(admin, function(err){
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     passport.authenticate("local")(req, res, function(){
  //       res.redirect("/Home");
  //     });
  //   }
  // });

});


// login for user

var s_email = ""; //

app.get("/loginUser", function(req, res){
  // res.sendFile(__dirname + "/Userlogin.html");
  res.render("tmp");
});

app.post("/loginUser", function(req, res, next){

  const email_add = req.body.username;
  const password_add = req.body.password;
  s_email = req.body.username; //

  const person = new Person({
    username: req.body.username,
    password: req.body.password
  });

  // Person.find({email: email_add, password: password_add}, function(err, check){
  //   if(check.length === 0) {
  //     res.redirect("/loginUser");
  //   } else {
  //     res.redirect("/UserProfile");
  //   }
  // });

  // passport is using...
  req.login(person, function(err){
    console.log("Is anything ok ?");
    if (err) {
      console.log(err);
      console.log("login me bhi error aa rhe h :(");
    } else {
      // passport.authenticate("local")(req, res, function(){
        console.log("ho gya bhai login :)");
        console.log(s_email);
        // res.redirect("/");



        // res.redirect("/UserProfile");  //ok hai
      // });

      // passport.authenticate('local', function(err, person, info){
      //   if (err) { return next(err); }
      //
      //   req.logIn(person, function(err){
      //     if (err) { return next(err); }
      //     return res.redirect("/UserProfile");
      //   });
      // });
        // console.log("bhakk bsdk");

        // stack overflow
        // well, then its working properly.............
        // wuhuuuuuuuuuuuuuuuuuuu !!!
        passport.authenticate("local", function(err, person, info) {

            if (err) return next(err);
            if (!person) return res.redirect('/loginUser');

            req.logIn(person, function(err) {
                if (err)  return next(err);
                return res.redirect("/UserProfile");
            });

        })(req, res, next);

    }
  });

});

// logout for user
app.get("/logout", function(req, res){
  if(req.isAuthenticated())
  {
    console.log("ha, hua to h logout");
    req.logout();
    res.redirect("/loginUser");
  }
  else
  {
    res.redirect("/loginUser");
  }
});

// check security and authentication
app.get("/secrets", function(req, res){
  if (req.isAuthenticated()) {
    console.log("abhi tak to logout nahi hua h");
    // res.render("PatientEJS1");
    res.redirect("/UserProfile");
  } else {
    console.log("ok, logout ho chuka hai");
    res.redirect("/loginUser");
  }
});

// user watch this Page
app.get("/UserProfile", function(req, res){
  // res.sendFile(__dirname + "/Patient.html");
  console.log(s_email);

  // Profile.find({e_mail: s_email}, function(err, check){
  //   if(check.length === 0) {
  //     console.log("No user :(");
  //     // res.render("PatientEJS", {title: "No such user for this Email.", newListItems: ""});
  //     res.redirect("/loginUser");
  //   } else {
  //     console.log("ok done, go to print data");
  //     res.render("PatientEJS", {title: s_email, newListItems: check});
  //   }
  //   console.log(check);
  // });

  if (req.isAuthenticated()) {
    Profile.find({e_mail: s_email}, function(err, check){
      if(check.length === 0) {
        console.log("No user :(");
        // res.render("PatientEJS", {title: "No such user for this Email.", newListItems: ""});
        res.redirect("/loginUser");
      } else {
        console.log("ok done, go to print data");
        res.render("PatientEJS1", {title: s_email, newListItems: check});
      }
      // console.log(check);
    });
  } else {
    res.redirect("/loginUser");
  }

});

// delete a user
app.get("/delete", function(req, res){
  res.sendFile(__dirname + "/delete.html");
});

app.post("/delete", function(req, res){
  Profile.deleteOne({e_mail: req.body.userID}, function(err){
    if (err) {
      console.log(err);
      console.log("nahi gya sala :(");
      res.redirect("/Home");
    } else {

      Person.deleteOne({username: req.body.userID}, function(err){
        if (err) {
          console.log(err);
          console.log("nahi gya sala :(");
          res.redirect("/Home");
        } else {
          console.log("user deleted :)");
          res.redirect("/Home");
        }
      });
    }
  });
});

// Home page

app.get("/Home", function(req, res){
  res.sendFile(__dirname + "/Admin_landing_page.html");
});

// print all users on /users using .ejs file

app.get("/users", function(req, res){
  Profile.find({}, function(err, foundItems){
    if(foundItems.length === 0) {
      res.redirect("/users");
    } else {
      res.render("userList", {title: "All users", newListItems: foundItems});
    }
    // console.log(foundItems);
  });
});

// ending

app.listen(3000, function(){
  console.log("Server is running on the port 3000.");
});

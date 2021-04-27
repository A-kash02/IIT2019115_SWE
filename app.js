//jshint esversion: 6

// -- common text
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
var moment = require('moment'); // for date

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
// mongodb+srv://admin-aakash:<password>@healife.rl7lm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// mongoose.connect("mongodb://localhost:27017/loginDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://admin-aakash:aks2000@healife.rl7lm.mongodb.net/loginDB", {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.set("useCreateIndex", true);

// A document or model
const personSchema = new mongoose.Schema ({
  username: String,
  password: String
});

personSchema.plugin(passportLocalMongoose);

const Person = new mongoose.model("Person", personSchema);
const Admin = mongoose.model("Admin", personSchema);

passport.use(Person.createStrategy());

// passport.serializeUser(Person.serializeUser());
// passport.deserializeUser(Person.deserializeUser());

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
  level: String,
  heart: String,
  oxygen: String,
  blood: String,
  age: String,
  gender: String
};

const Profile = mongoose.model("Profile", profileSchema);


app.get("/newProfile", function(req, res){
  if (req.isAuthenticated()) {

  res.sendFile(__dirname + "/Add_new_user.html");
} else {
  res.redirect("/login");
}
});

app.post("/newProfile", function(req, res){

  const f_name1 = req.body.firstname;
  const l_name1 = req.body.lastname;
  // const e_mail1 = req.body.Enteremail;
  const p_num1 = req.body.MobileNumber;
  const c_add1 = req.body.address;
  const height1 = req.body.Height;
  const weight1 = req.body.Weight;
  const disease1 = req.body.diseases + req.body.diseasesS;
  // if ( disease1 === "" ) { disease1 = req.body.diseases; }
  const level1 = req.body.level;
  const heart1 = req.body.Hrate;
  const oxygen1 = req.body.Olevel;
  const blood1 = req.body.BloodP;
  const age1 = req.body.age;
  const gender1 = req.body.gender;

  // console.log(disease1);
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
    level: level1,
    heart: heart1,
    oxygen: oxygen1,
    blood: blood1,
    age: age1,
    gender: gender1
  });

  console.log(profile);

  if (suEmail === "") {
    res.redirect("/");
  } else {
    profile.save();
    console.log("Data is filled");
    res.redirect("/Home1");
  }
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
  diseaseC: String,
  date: String
};

const Appointment = mongoose.model("Appointment", contactSchema);

// appointment

app.post("/first", function(req, res){
  // res.redirect("/first");
  var nameC1 = req.body.name;
  var dt = moment().format('Do MMMM, YYYY');
  const appointment = new Appointment({
    nameC: req.body.name,
    emailC: req.body.email,
    subC: req.body.subject,
    diseaseC: req.body.message,
    date: dt
  });

  console.log(appointment);

  if(nameC1.length === 0) {
    console.log("No appointment is creating.");
  } else {
  appointment.save();
  console.log("appointment is sent.");
  }
  res.redirect("/first");

});



// show appointment

app.get("/appointment", function(req, res){
if (req.isAuthenticated()) {

  Appointment.find({}, function(err, foundItems){
    if(foundItems.length === 0) {
      res.redirect("/Home");
    } else {
      res.render("appo", {newListItems: foundItems});
    }
    // console.log(foundItems);
  });
} else {
  res.redirect("/login");
}
});

// remove appointment
app.post("/appointment", function(req, res){
  var aadesh = req.body.remove;
  console.log(aadesh);
  Appointment.deleteOne({emailC: aadesh}, function(err){
    if (err ) {
      console.log("appo not deleted");
    } else {
      console.log("appo deleted");
    }
    res.redirect("/appointment");
  });
});

// -- signup

app.get("/", function(req, res){
  // res.sendFile(__dirname + "/signup.html");
if (req.isAuthenticated()) {
  res.render("register");
} else {
  res.redirect("/login");
}
});

app.post("/", function(req, res){


  //passport uses here
  console.log("yaha tak to aa rha h :|");
  // console.log(req.body.username);
  Person.register(new Person({username: req.body.username}), req.body.password1, function(err, person){

// send email and pass to users
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   // host: 'smtp.gmail.com',
//   // port: 587,
//   // secure: false,
//   auth: {
//     user: 'ak4sh02@gmail.com',
//     pass: 'akku2021'
//   }
// });
//
// var mailOptions = {
//   from: 'ak4sh02@gmail.com',
//   to: req.body.username,
//   subject: 'Registration Completed',
//   text: 'Your registaration is completed. \nAnd this is your\nMailID: ' + req.body.username + '\nPassword: ' + req.body.password1 + '\nThank you.'
//   // attachDataUrls: true
//
// };
//
// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });


// mail sent



        suEmail = req.body.username;
        res.redirect("/newProfile");
    //   });
    // }
  });

});

// --------- login for admin

app.get("/login", function(req, res){
  // res.sendFile(__dirname + "/login.html");
  res.render("login");
});

var adID = "";
app.post("/login", function(req, res, next){

  adID = req.body.username;
  const admin = new Admin({
    username: req.body.username,
    password: req.body.password
  });

  // Admin.find({email: email_add, password: password_add}, function(err, check){
  //   if(check.length === 0) {
  //     res.redirect("/login");
  //   } else {
  //     res.redirect("/Home1");
  //   }
  // });

  // passport uses here
  req.login(admin, function(err){
    if (err) {
      console.log(err);
    } else {
      // passport.authenticate("local")(req, res, function(){
      //   res.redirect("/Home");
      // });
      console.log("login successful");
      passport.authenticate("local", function(err, admin, info) {

          if (err) return next(err);
          if (!admin) return res.redirect('/login');

          req.logIn(admin, function(err) {
              if (err)  return next(err);
              return res.redirect("/Home1");
          });

      })(req, res, next);

    }
  });

});


// create new admin [ sign up ]

const adminSchema = {
  nameA: String,
  idA: String
};
const Name = mongoose.model("Name", adminSchema);

app.get("/newA", function(req, res){
if (req.isAuthenticated()) {
  res.render("newAdmin");
} else {
  res.redirect("/login");
}
});

app.post("/newA", function(req, res){

  Person.register(new Person({username: req.body.username}), req.body.password1, function(err, member){

    const temp = new Name({
      nameA: req.body.nA,
      idA: req.body.username
    });
    temp.save();

    console.log(req.body.username);
    res.redirect("/Home1");
  });
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
    // console.log("Is anything ok ?");
    if (err) {
      console.log(err);
      console.log("login me bhi error aa rhe h :(");
    } else {
      // passport.authenticate("local")(req, res, function(){
        console.log("ho gya bhai login :)");
        // console.log(s_email);
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
    res.redirect("/UserProfile");
  }
  else
  {
    res.redirect("/loginUser");
  }
});

// logout for admin
app.get("/logout1", function(req, res){
  if(req.isAuthenticated())
  {
    console.log("ha, hua to h admin logout");
    req.logout();
    res.redirect("/Home1");
  }
  else
  {
    res.redirect("/login");
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



// admin click on full detail button and watch this page

app.post("/users", function(req, res){
  // res.sendFile(__dirname + "/Patient.html");
  // console.log(s_email);

  Profile.find({e_mail: req.body.full}, function(err, check){
    if(check.length === 0) {
      // console.log("No user :(");
      // res.redirect("/users");

      Profile.deleteOne({e_mail: req.body.userID}, function(err){
        if (err) {
          console.log(err);
          console.log("nahi gya sala :(");
          res.redirect("/users");
        } else {

          Person.deleteOne({username: req.body.userID}, function(err){
            if (err) {
              console.log(err);
              console.log("nahi gya sala :(");
              res.redirect("/users");
            } else {
              console.log("user deleted :)");
              res.redirect("/users");
            }
          });
        }
      });


    } else {
      console.log("ok done, go to watch data");
      res.render("full", {title: req.body.full, newListItems: check});
    }
    // console.log(check);
  });

});



// Home page

app.get("/Home", function(req, res){
  res.sendFile(__dirname + "/Admin_landing_page.html");
});

// print all users on /users using .ejs file

app.get("/users", function(req, res){
  if (req.isAuthenticated()) {
  Profile.find({}, function(err, foundItems){
    if(foundItems.length === 0) {
      res.redirect("/users");
    } else {
      res.render("userList", {title: "All users", newListItems: foundItems});
    }
    // console.log(foundItems);
  });
} else {
  res.redirect("/login");
}
});

// numeric stats part
app.get("/Home1", function(req, res){
  if (req.isAuthenticated()) {
  Profile.find({gender: "Male"}, function(err, found1){
    Profile.find({gender: "Female"}, function(err, found2){
      Profile.find({gender: "Other"}, function(err, found3){
      Profile.find({disease: "Atherosclerosis"}, function(err, d1){
        Profile.find({disease: "Heart disease"}, function(err, d2){
          Profile.find({disease: "Stroke"}, function(err, d3){
            Profile.find({disease: "Obesity"}, function(err, d4){
              Profile.find({disease: "Type 2 Diabetes"}, function(err, d5){
                Profile.find({disease: "Lung Cancer"}, function(err, d6){
                  Profile.find({disease: "Asthma"}, function(err, d7){
                    Profile.find({disease: "Blindness"}, function(err, d8){

                      Profile.find({age: { $gte: 0, $lte: 10}}, function(err, f1){
                        Profile.find({age: { $gte: 11, $lte: 20}}, function(err, f2){
                          Profile.find({age: { $gte: 21, $lte: 30}}, function(err, f3){
                            Profile.find({age: { $gte: 31, $lte: 40}}, function(err, f4){
                              Profile.find({age: { $gte: 41, $lte: 50}}, function(err, f5){
                                Profile.find({age: { $gte: 51, $lte: 60}}, function(err, f6){
                                  Profile.find({age: { $gte: 61, $lte: 70}}, function(err, f7){
                                    Profile.find({age: { $gte: 71, $lte: 80}}, function(err, f8){
                                      Profile.find({age: { $gte: 81, $lte: 90}}, function(err, f9){
                                        Profile.find({age: { $gte: 91, $lte: 100}}, function(err, f10){
                                          Name.find({idA: adID}, function(err, ad){
                                            res.render("adminPage", {total1: found1, total2: found2, total3: found3,
                                            ill1: d1, ill2: d2, ill3: d3, ill4: d4, ill5: d5, ill6: d6, ill7: d7, ill8: d8,
                                            item1: f1, item2: f2, item3: f3, item4: f4, item5: f5, item6: f6, item7: f7, item8: f8, item9: f9, item10: f10,
                                            ad1: ad});
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });

                    });
                  });
                });
              });
            });
          });
        });
      });
      });
    });
  });
} else {
  res.redirect("/login");
}
  // res.render("stats", {total1: found1, total2: found2});
});



// rough graph
app.get("/stats", function(req, res){
  if (req.isAuthenticated()) {
  Profile.find({disease: "Atherosclerosis", level: "level1"}, function(err, d1l1){
    Profile.find({disease: "Atherosclerosis", level: "level2"}, function(err, d1l2){
      Profile.find({disease: "Atherosclerosis", level: "level3"}, function(err, d1l3){

        Profile.find({disease: "Heart disease", level: "level1"}, function(err, d2l1){
          Profile.find({disease: "Heart disease", level: "level2"}, function(err, d2l2){
            Profile.find({disease: "Heart disease", level: "level3"}, function(err, d2l3){

              Profile.find({disease: "Stroke", level: "level1"}, function(err, d3l1){
                Profile.find({disease: "Stroke", level: "level2"}, function(err, d3l2){
                  Profile.find({disease: "Stroke", level: "level3"}, function(err, d3l3){

                    Profile.find({disease: "Obesity", level: "level1"}, function(err, d4l1){
                      Profile.find({disease: "Obesity", level: "level2"}, function(err, d4l2){
                        Profile.find({disease: "Obesity", level: "level3"}, function(err, d4l3){

                          Profile.find({disease: "Type 2 Diabetes", level: "level1"}, function(err, d5l1){
                            Profile.find({disease: "Type 2 Diabetes", level: "level2"}, function(err, d5l2){
                              Profile.find({disease: "Type 2 Diabetes", level: "level3"}, function(err, d5l3){

                                Profile.find({disease: "Lung Cancer", level: "level1"}, function(err, d6l1){
                                  Profile.find({disease: "Lung Cancer", level: "level2"}, function(err, d6l2){
                                    Profile.find({disease: "Lung Cancer", level: "level3"}, function(err, d6l3){

                                      Profile.find({disease: "Asthma", level: "level1"}, function(err, d7l1){
                                        Profile.find({disease: "Asthma", level: "level2"}, function(err, d7l2){
                                          Profile.find({disease: "Asthma", level: "level3"}, function(err, d7l3){

                                            Profile.find({disease: "Blindness", level: "level1"}, function(err, d8l1){
                                              Profile.find({disease: "Blindness", level: "level2"}, function(err, d8l2){
                                                Profile.find({disease: "Blindness", level: "level3"}, function(err, d8l3){
                                                  res.render("stats", {
                                                    total1l1: d1l1, total1l2: d1l2, total1l3: d1l3,
                                                    total2l1: d2l1, total2l2: d2l2, total2l3: d2l3,
                                                    total3l1: d3l1, total3l2: d3l2, total3l3: d3l3,
                                                    total4l1: d4l1, total4l2: d4l2, total4l3: d4l3,
                                                    total5l1: d5l1, total5l2: d5l2, total5l3: d5l3,
                                                    total6l1: d6l1, total6l2: d6l2, total6l3: d6l3,
                                                    total7l1: d7l1, total7l2: d7l2, total7l3: d7l3,
                                                    total8l1: d8l1, total8l2: d8l2, total8l3: d8l3
                                                  });
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  // Profile.find({disease: req.body.indi1, level: "level1"}, function(err, l1){
  //   Profile.find({disease: req.body.indi1, level: "level2"}, function(err, l2){
  //     Profile.find({disease: req.body.indi1, level: "level3"}, function(err, l3){
  //       console.log(l1);
  //       console.log(l2);
  //       console.log(l3);
  //       res.render("roughW", {total1: l1, total2: l2, total3: l3});
  //     });
  //   });
  // });
  // res.render("roughW");

  // res.render("stats", {total1: found1, total2: found2});
} else {
  res.redirect("/login");
}
});

// stats end

// app.get("/stats", function(req, res){
//   Profile.find({gender: "Female"}, function(err, found){
//     res.render("stats", {total2: found});
//   });
//
// });

// update trial successful
app.get("/up", function(req, res){
  // res.sendFile(__dirname + "/RoughWork1.html");
if (req.isAuthenticated()) {
  res.render("update", {item: ""});
} else {
  res.redirect("/login");
}
});

var e_id = "";
app.post("/up", function(req, res){
// console.log("ok, ye pehle thik h..");

  // Appointment.find({emailC: req.body.ID}, function(err, found){
  //   if(found.length === 0) { console.log("no"); } else {
    // Appointment.updateOne({emailC: req.body.ID}, {nameC: req.body.name, diseaseC: req.body.ill, subC: req.body.sub}, function(err){
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     // emailC: req.body.ID;
    //     // console.log(req.body.ID);
    //     // console.log(req.body.name);
    //     console.log("ok, done");
    //   }
    // });
  // }
    // res.redirect("/up");
  // });

  if (req.body.okk === "up" ) {

    Profile.updateOne({e_mail: e_id},
      {
        height: req.body.heightU,
        weight: req.body.weightU,
        level: req.body.levelU,
        heart: req.body.HrateU,
        oxygen: req.body.OlevelU,
        blood: req.body.BloodPU,
        age: req.body.ageU
      }, function(err){
      if (err) {
        console.log(err);
      } else {
        console.log(e_id);
        console.log(req.body.heightU);

        console.log("profile updated");
        res.redirect("/Home1");
      }
    });


  } else {
    Profile.find({e_mail: req.body.id}, function(err, found){
      if (err) {
        console.log("no user");
        console.log(err);
      } else {
        e_id = req.body.id;
        res.render("update", {item: found});
      }
    });
  }

});


//rough work
const date = new Date();
app.get("/rough", function(req, res){
  // res.render("roughW", {item: date});
  console.log(moment().format('Do MMMM, YYYY'));
  res.render('roughW', { moment: moment });
  // res.sendFile(__dirname + "/RoughWork1.html");

});

app.post("/rough", function(req, res){
  // console.log(req.body.name);

  res.redirect("/rough", { moment: moment });

});

// ending

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on the port 3000.");
});
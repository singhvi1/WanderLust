if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



const listingRouter=require("./routes/listings.js"); //for routes
const reviewRouter = require("./routes/review.js"); 
const userRouter = require("./routes/user.js"); 




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //to parse all data from htmlfo
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dburl=process.env.ATLASDB_URL;
const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24 * 3600 // time period in seconds
})
store.on("error",(err)=>{
  console.log("ERROR in MONGO SESSION STORE",err)
})
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() +  7*24*60*1000,
    maxAge: 7*24*60*1000,
    htttpOnly:true
  }
}
app.use(session(sessionOptions)); 
app.use(flash());

//creating uthen _56.7
app.use(passport.initialize());  //why ? 
app.use(passport.session());     //why ? 
passport.use(new LocalStrategy(User.authenticate()));   //why ? 

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());  //why ? 
passport.deserializeUser(User.deserializeUser());  //why ? 

//creating middleware for connect-flash middleware
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;           //57.3 for ejs cant use req.user ? 
  next();
})

//50.8: creating demo user: 
// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gamil.com",
//     username:"delta-student"   // we can add it bcz  pass-mod-mong add it auto
//   });
//   let newUser=await User.register(fakeUser,"helloworld");
//   res.send(newUser);
  
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)

// app.get("/", (req, res) => {
//   res.send("Hi i am root");
// });
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "random error" } = err;
  res.status(status).render("listings/error.ejs",{err});
  // res.status(status).send(message);
});

//connecting mongodb
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("err to connection to db",err.message);
  });
async function main() {
  await mongoose.connect(dburl);
}


app.listen(8080, () => {
  console.log("server is listeningto port 8080");
});


if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const listingRouter = require('./routes/listing');
const reviewsRouter = require('./routes/review');
const userRouter = require('./routes/user');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//databse setup
const dbUrl = process.env.ATLASDB_URL; 
const secret = process.env.SECRET;
main()
.then(()=>{
  console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

//sessions and cookies
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: secret
  },
  touchAfter: 24*3600,
});
store.on("error", ()=>{
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store: store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7,
    httpOnly: true
  }
};


//root
app.get("/",(req,res)=>{
  res.redirect("/listings");
})

//sessions
app.use(session(sessionOptions));
app.use(flash());


//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

//demo user
// app.get("/demouser", async (req,res) =>{
//   let fakeUser = new User({
//   email: "student@gmail.com",
//   username: "student",
//   });

//   let registerdUser = await User.register(fakeUser, "helloworld");//user,password,callback
//   res.send(registerdUser);
// })

//routers
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/", userRouter);

//error handling middleware
app.all("*", (req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})

//custom error handling
app.use((err,req,res,next)=>{
  let {statusCode=500, message="Something went wrong"} = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{err});
})
app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})
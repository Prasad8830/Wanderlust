
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
const helmet = require('helmet');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const listingRouter = require('./routes/listing');
const reviewsRouter = require('./routes/review');
const userRouter = require('./routes/user');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

// render runs the app behind a proxy, needed for secure cookies and real client ips
app.set('trust proxy', 1);

//security headers, the nonce lets the inline script on the show page run
app.use((req,res,next)=>{
  res.locals.cspNonce = crypto.randomBytes(16).toString("base64");
  next();
});
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://unpkg.com", (req,res)=>`'nonce-${res.locals.cspNonce}'`],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com", "https://unpkg.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com", "https://images.unsplash.com", "https://plus.unsplash.com", "https://api.maptiler.com"],
      connectSrc: ["'self'", "https://api.maptiler.com"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
    },
  },
}));

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
store.on("error", (err)=>{
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store: store,
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*60*24*7,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
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
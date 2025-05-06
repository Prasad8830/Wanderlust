const express = require('express');
const router = express.Router();
const multer  = require('multer');
const {storage} = require('../cloudConfig');
const upload = multer({ storage });
const wrapAsync = require('../utils/wrapAsync')
const {isLoggedIn, isOwner, validateListing} = require('../middleware');
//contollers
const listingController = require('../controllers/listings');

//router.route - used when there are request for same path
router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync (listingController.createListing));


//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

//Index route
// router.get("/", wrapAsync(listingController.index));


//show route
// router.get("/:id",wrapAsync(listingController.showListing));
//we write new route above of show route because /new is being search as id in db beacuse of show route 

//create route
// router.post("/",validateListing, isLoggedIn, wrapAsync (listingController.createListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//update route
// router.put("/:id",validateListing, isLoggedIn,isOwner, wrapAsync(listingController.updateListing));

//delete route 
// router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
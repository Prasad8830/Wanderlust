const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
//controllers
const reviewController = require('../controllers/reviews');
//Reviews
//Post review route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
  
//dalete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
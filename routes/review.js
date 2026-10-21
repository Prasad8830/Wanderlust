const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync')
const {validateReview, isLoggedIn, isReviewAuthor, validateId} = require('../middleware');
//controllers
const reviewController = require('../controllers/reviews');
//Reviews
// :id comes from the parent route, so router.param can't be used for it here
router.use((req, res, next) => validateId(req, res, next, req.params.id));
router.param("reviewId", validateId);
//Post review route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
  
//dalete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
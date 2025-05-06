const { response } = require('express');
const Listing = require('../models/listing');
const axios = require('axios');

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res)=>{
    return res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
      req.flash("error", "Listing does not exist!");
      return res.redirect("/listings");
    }
    return res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next)=>{
    // let {title, description, image, price, location, country} = req.body;
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send valid data for listing");
    // }
      let url = req.file.path;
      let filename = req.file.filename;

      let listing = req.body.listing;
      const newListing = new Listing(listing);
      // if(!newListing.title){
      //   throw new ExpressError(400,"Title is missing!");
      // }
      // if(!newListing.description){
      //   throw new ExpressError(400,"Description is missing!");
      // }
      newListing.owner = req.user._id;
      newListing.image = {url, filename};
      const locationQuery = newListing.location;
      const mapTokenKey = process.env.MAP_TOKEN_KEY;
      const geoURL = `https://api.maptiler.com/geocoding/${locationQuery}.json?key=${mapTokenKey}`;
      const response = await axios.get(geoURL);

      if (response.data.features && response.data.features.length > 0) {
        newListing.geometry = response.data.features[0].geometry;
      }

      await newListing.save();
      console.log(newListing);
      req.flash("success", "New Listing Created!");
      res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  let original_image_url = listing.image.url;
  original_image_url = original_image_url.replace("/upload/", "/upload/w_250/");

  return res.render("listings/edit.ejs", {listing, original_image_url});
};

module.exports.updateListing = async (req, res)=>{
  
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
      await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res)=>{
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
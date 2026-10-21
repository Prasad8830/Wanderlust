// one-time script: sets category on existing listings that don't have one yet
require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');

const extraCategories = {
  "Beach Place Resort Residence": "beachfront",
};

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);

  const categoryByTitle = { ...extraCategories };
  for (const obj of initData.data) {
    categoryByTitle[obj.title] = obj.category;
  }

  const listings = await Listing.find({ category: { $exists: false } });
  for (const listing of listings) {
    const category = categoryByTitle[listing.title];
    if (!category) {
      console.log(`no category found for "${listing.title}", skipping`);
      continue;
    }
    await Listing.updateOne({ _id: listing._id }, { $set: { category } });
    console.log(`${listing.title} -> ${category}`);
  }

  await mongoose.disconnect();
}

main().catch(err => console.log(err));

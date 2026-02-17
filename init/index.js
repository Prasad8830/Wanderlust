const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main()
.then(()=>{
  console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('url');
}


const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({
      ...obj,
      owner: "67fccaa775ebd2f1ed3c5cdd",
    }))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
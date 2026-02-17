const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

main()
.then(()=>{
  console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://prasadshinde10048_db_user:pWG3ZnMkPEGWGM9X@cluster0.itx67v3.mongodb.net/?appName=Cluster0');
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
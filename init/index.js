const mongoose= require ("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const { insertMany } = require("../models/listing");

MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";

main()
.then(()=>{
    console.log("connected to db");
})
.catch(()=>{
    console.log("err");
});

async function main(){
mongoose.connect(MONGO_URL);
}
const initDB=async()=>{
    await Listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({
    ...obj,
    owner:'68bdb3e91a111c3c04bedc7a'
   }));
    await Listing.insertMany(initData.data);
    console.log("data was initialize ");
};
initDB();
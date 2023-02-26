const mongoose = require("mongoose");

const PostSchema = {
  Username:{
    type:String 
  },
  Email:{
    type:String
  },
  type:{
    type:String
  },
  Password:{
    type:String
  }
};


const posts = mongoose.model("Business", PostSchema); //collection name, schema

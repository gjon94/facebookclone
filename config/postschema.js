const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')




const postSchema = new mongoose.Schema({
 
  _id:{type:ObjectId},
  content: {type:String},
  img: {type:String, default:'#'},
  time:  Date,
  like: [],
  author:{type:String},
  comment:[]


})


module.exports = mongoose.model("postSchema", postSchema)
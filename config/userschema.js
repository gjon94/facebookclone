const mongoose = require('mongoose')
const validator = require('validator');



const userSchema = new mongoose.Schema({

  name: { type: String, required: true },
  surname: { type: String, required: true },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  },
  bornOn:{type:Date,required:true},
  gender:{type:String,required:true},
  imgProfile: { type: String, default: "https://www.envivabiomass.com/wp-content/uploads/Jeffrey-Ubben.jpg" },
  imgBackground: { type: String, default: "https://cdn.i.haymarketmedia.asia/?n=campaign-asia%2fcontent%2fsocial_apps_shutterstock_1200x800.jpg&h=630&w=1200&q=75&v=20170226&c=1" },
  friends: [],
  posts: [],
  friendRequest: [],
  friendRequestSended: []


})


module.exports = mongoose.model("users", userSchema)
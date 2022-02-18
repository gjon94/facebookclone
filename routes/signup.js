const express = require('express');
const router = express.Router();
const {signUpFunction} = require('../mongo-connect/mongo-config')

router.get('/signup',(req,res)=>{
   
res.render('signup')

});


router.post('/signup',async(req,res)=>{
  

  const createdUser =await  signUpFunction(req.body);
  let message;

  
  console.log(await createdUser)
  

  if (createdUser.code == 11000) {
      message="email gia usata"
      return res.render('_signup',{user:req.body,message:message})
  }
 
  
 
  if (createdUser) {
    return  res.render('login')
      

  }

  

})






module.exports = router;
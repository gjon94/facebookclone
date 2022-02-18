const express = require('express');
const router = express.Router();
const { homePost, findManyUserSearch } = require('../mongo-connect/mongo-config')




router.get('/',async (req,res)=>{

  
  

    res.render('authhomepage/homepage',{user:await req.user});
    
    

});










router.post('/',async (req,res)=>{

 
  if (req.body.search || req.body.search==='') {
     const result =  await findManyUserSearch(req.body.search)
    
   return res.render('authhomepage/search',{user: req.user,search:result})
  }
 
  ////send post
  if (req.body.postsFrom) {
    const posts=await homePost(await req.user._id, req.body.postsFrom)

  
    return res.end(JSON.stringify(posts))
 }

 //send info data
 if (req.body.postsUserInfo) {
  

  return res.end(JSON.stringify(req.user))
}


});

module.exports = router;
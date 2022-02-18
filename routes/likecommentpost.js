const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { likeFunction, commentFunction, showComment, userWhoCommentFunction } = require('../mongo-connect/mongo-config')


// GET REQUEST show comment!!

router.get('/:id/:id', async (req, res) => {

   if (!req.isAuthenticated()) return res.send({ auth: "non sei autorizzato" })

   
   let userPost = req.url.split('/').splice(1)

   /////GGIUNGERE CONTROOLLO OBJECTID AI PARAEMTRI USERPOT
   if(!ObjectId.isValid(userPost[0]) || !ObjectId.isValid(userPost[1]))return console.log(':id param non validi')

   const result = await showComment(userPost[0], userPost[1])


   let obj = result.posts.find(element => element._id.toString() === userPost[1]);


   ////cerco chi ha commentato con la propria foto profilo
   if (obj.comment) {

      for (let i = 0; i < obj.comment.length; i++) {

         let _result = await userWhoCommentFunction({ _id: ObjectId(obj.comment[i].userComment) })

         if (!_result) {
            ///in caso di utenti cancellati
            obj.comment[i].imgProfile = 'https://180dc.org/wp-content/uploads/2017/11/profile-placeholder.png'
            obj.comment[i].nameUser = 'utente cancellato'
            
         }else{
           obj.comment[i].imgProfile = _result.imgProfile
         obj.comment[i].nameUser = _result.name + _result.surname 
         }
         
      }

   }





   res.send(obj)

})



















// POST RQUEST

router.post('/:id/:id', async (req, res) => {

   try {


      if (!req.isAuthenticated()) return console.log('non autorizzato')

      

      ////LIKE
      let userPost = req.url.split('/').splice(1)

      if (req.body.action === 'like') {

         

         ///controllo permesso like,se è amico o se sei tu stesso
         if (req.user.friends.includes(userPost[0]) || req.user._id.toString() === userPost[0]) {
            await likeFunction(req.user._id.toString(), userPost[0], userPost[1])
            return res.send()
         }


      }

      ////COMMENT
      if (req.body.action === 'comment') {

         ///controllo permesso commento,se è amico o se sei tu stesso
         if (req.user.friends.includes(userPost[0]) || req.user._id.toString() === userPost[0]) {
            await commentFunction({ _id: new ObjectId(), userComment: req.user._id.toString(), value: req.body.value.trim() }, userPost[0], userPost[1])
            return res.send({_id:req.user._id,name:req.user.name,imgProfile:req.user.imgProfile})
         }
      }





   } catch (error) {
      console.log(error)
   }




});


module.exports = router;
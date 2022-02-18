const express = require('express');
const { findUser } = require('../mongo-connect/mongo-config')
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const router = express.Router();



router.get('/:id', async (req, res) => {

  try {
    //objID valido?
    if (ObjectId.isValid(req.params.id)) {
      ///controllare proprio profilo
      if (req.user) {
        let { _id } = await req.user

        if (_id == req.params.id) {
                  
         return res.render('authhomepage/you', { user: await req.user })
        }
      }


      ///se non sei tu cerca l'utente
      const foundUser = await findUser({ _id: ObjectId(req.params.id) })


      if (!foundUser || foundUser == null) {
        return res.render('404')
      }




      if (!req.isAuthenticated()) {
        ///invia profilo senza essere loggati


        return res.render('usernoAuth', { foundUser: foundUser })

      }



      //in caso visiti profilo di un amico
      let { friends } = await req.user

      if (friends && friends.includes(foundUser._id.toString())) {
        res.render('userfriend/userfriend', { user: await req.user, foundUser: foundUser })
        


      } else {

        let hasSendRequest='add'
        
        if(req.user.friendRequestSended.includes(foundUser._id.toString())){
          ///scegliere se annulare l invio
          hasSendRequest='cancell'
        }

        if(req.user.friendRequest.includes(foundUser._id.toString())){
          ///scegliere se rifiutare o accetare richiesta
          hasSendRequest='choose'
        }

        res.render('usernofriend/usernofriend', { user: await req.user, foundUser: foundUser,hasSendRequest:hasSendRequest })
      }



    } else {


      ///in caso id non sia neanche idobj
      return res.render('404')

    }




  } catch (error) {
    console.log(error)
  }


}
)

module.exports = router
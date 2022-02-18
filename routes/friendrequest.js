const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { friendRequestFunction, removeMyRequestFriend, acceptRefuseRequestFriend,
    sendRequestFriend, findUser } = require('../mongo-connect/mongo-config')

router.get('/friendrequest', async (req, res) => {

    if (!req.isAuthenticated()) return console.log('no autorizzato a vedere le rciheste damiciciza');
    if (req.user.friendRequest.lenght < 1) return console.log('non hai amici');


    const requesTFriendObjectId = []
    req.user.friendRequest.forEach(element => {
        requesTFriendObjectId.push(ObjectId(element))
    });



    const result = await friendRequestFunction(requesTFriendObjectId)

    
    res.render('friendrequest', { user: req.user, result: result })
});





router.post('/friendrequest', async (req, res) => {

    ///return in caso non auth, IMPORTANTE  aggiungere filtro post body////
    if (!req.isAuthenticated()) return console.log('no autorizzato a inviare richeste damicizia');
    if (req.user._id.toString() === req.body.friendUrl) return console.log('non puoi inviarti richieste a te stesso');
    if(!ObjectId.isValid(req.body.friendUrl)) return console.log('objID invalido')

    try {

        // ANNULLA INVIO RICHIESTA AMICIZIA
        if (req.user.friendRequestSended.includes(req.body.friendUrl)) {

            console.log('hai tolto la richiest d amicizia')
            return await removeMyRequestFriend(req.user._id.toString(), req.body.friendUrl)

        }

        //se hai la richiesta di amicizia,ed il req.post è uguale a true false ''sistemare filtro boolean
        if (req.user.friendRequest.includes(req.body.friendUrl) && req.body.decision === true || req.body.decision === false) {

            return acceptRefuseRequestFriend(req.user._id.toString(), req.body.friendUrl, req.body.decision)


        }




        ///invia richiesta d'amicizia 
        if (!req.user.friends.includes(req.body.friendUrl)) {

            if (!findUser({_id:ObjectId(req.body.friendUrl)})) return console.log('richiesta non consentita utente non esistente');

            return sendRequestFriend(req.user._id.toString(), req.body.friendUrl)


        }










    } catch (error) {
        console.log(error)

    }




})






module.exports = router;
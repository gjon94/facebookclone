const express = require('express');
const { findUser, addPost, changeImgProfileFunction, changeimgBackgroundFunction, userPagePost } = require('../mongo-connect/mongo-config')
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const router = express.Router();



router.post('/:id', async (req, res) => {

    try {

        if (!req.isAuthenticated()) return console.log('post su userprofile senza aut')

        if (req.body.changeimgprofileurl) {

            changeImgProfileFunction(req.user._id, req.body.changeimgprofileurl)
            console.log(req.body)
            return res.redirect(`/${req.params.id}`)
        }

        if (req.body.content) {

            await addPost(req.user._id, ObjectId(req.params.id), req.body)

            console.log(req.body)
            return res.redirect(`/${req.params.id}`)
        }
        if (req.body.changeimgbackgroundurl) {

            await changeimgBackgroundFunction(req.user._id, req.body.changeimgbackgroundurl)

            console.log(req.body)
            return res.redirect(`/${req.params.id}`)
        }

        ////send post
        if (req.body.postsFrom) {

            const posts = await userPagePost(await req.user, req.body.postsFrom)
            return res.end(JSON.stringify(posts))

        }

        //send info data
        if (req.body.postsUserInfo) {

            const {password,...other} = req.user

            
            return res.end(JSON.stringify(other))
        }


    } catch (error) {
        console.log(error)
    }




})

module.exports = router
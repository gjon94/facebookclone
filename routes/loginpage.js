const express = require('express');
const router = express.Router();
const passport = require('../config/passport-config');

router.get('/login',(req,res)=>{       
    res.render('login',{message: req.flash('loginFallito')});
    
});


router.post('/login', passport.authenticate('local-login', { 
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true

}));



    router.get('/logout', (req,res) =>{
        req.logout();
        res.redirect('/login');
    })




module.exports = router;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {findUser} = require('../mongo-connect/mongo-config')

const { ObjectId } = require('mongodb');

const bcrypt = require('bcryptjs')



const database = [{ id: 1, username: 'gjon', password: 'pass1' }, { id: 2, username: 'gino', password: 'pass2' }, { id: 3, username: 'luca', password: 'pass3' }]

try {
    



passport.use(
    'local-login',
    new LocalStrategy({ passReqToCallback: true },
        async (req, email, password, done) => {
            

            const user = await findUser({email:email})
            

           

            if (!user) {
                
                return done(null, false, { message: req.flash('loginFallito', 'email sbagliata') });
            }
            

            if ( await bcrypt.compare(password,user.password)===false) {
                
                return done(null, false, { message: req.flash('loginFallito', 'password sbagliata') });
            }


           
            return done(null, user);


        })
);

passport.serializeUser((user, done) => {
   
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    //recuper utente nel db
    const user = findUser({_id: ObjectId(id)})
     const {password,...others} = await user

    done(null, others);


})





} catch (error) {
    console.log(error)
}




module.exports = passport;
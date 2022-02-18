require('dotenv').config()






const express = require('express');
const app = express();
const { findUser, connectDB, findManyUser } = require('./mongo-connect/mongo-config')



const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const checkUserLogin = require('./middlewares/check-login');

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.set('view engine', 'ejs');
app.use(flash());

app.use(express.static('public'));

app.use(session({
    secret: 'uuuuu',
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

const login = require('./routes/loginpage')
const signUp = require('./routes/signup')
const homePage = require('./routes/homepage')
const usersUrlGet = require('./routes/usersurlget');
const usersUrlPost = require('./routes/userurlpost');
const likeCommentPost = require('./routes/likecommentpost')
const friendrequest = require('./routes/friendrequest')

const port=process.env.PORT


app.use(login)
app.use(signUp)
app.use(friendrequest)
app.use(likeCommentPost)
app.use(usersUrlGet)
app.use(usersUrlPost)
app.use(checkUserLogin(),homePage)






async function run() {
   await connectDB();
   await app.listen( port || 3000);
    console.log('connesso')
    
}
run()
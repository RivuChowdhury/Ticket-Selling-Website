var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var path=require('path');
const dotenv = require("dotenv");
dotenv.config();
const cors=require("cors");
const session = require('express-session');
const cookieParser=require("cookie-parser");


const signuprouter=require('./src/routes/signup');
const loginrouter=require('./src/routes/login');
const paymentrouter=require('./src/routes/payment');
const {checkAuth}=require('./src/middlewares/auth');


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(session({
    secret: 'Rivu@12345',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine','ejs');

app.use('/',checkAuth,signuprouter);
app.use('/personal',loginrouter);
app.use('/payment',paymentrouter);


app.listen(3000);
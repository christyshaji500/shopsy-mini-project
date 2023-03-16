
require('dotenv').config()
const mongoose = require("mongoose");
const DB = process.env.DBURL
mongoose.set('strictQuery',true);
mongoose.connect(DB,()=>{
   
    console.log("Database connected");
     
});

const express = require('express')
const nocache = require('nocache')
const flash = require('connect-flash')
const app = express();
const userroute = require('./routes/userRoute')
 const adminroute  = require('./routes/adminRoute')
 



app.use('/',express.static('public'))
app.use('/',express.static('public/assets'))
app.use('/admin',express.static('public/admin'))
app.use(nocache());
app.use(flash());

app.set("view engine", "ejs");
app.set("views","./views");
app.set("views","./views/user")
//  app.set("views","./views/admin")

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });


app.use('/',userroute)
app.use('/admin',adminroute)
app.get('*',(req,res)=>{
  res.render('404') 
})

app.use('/',(err,req,res,next)=>{
  res.status(err.status|| 500)
  res.render('error',{error:err})
})

// app.use('/admin',(err,req,res,next)=>{
//   res.status(err.status|| 500)
//  res.render('adminerror')
// })

app.listen(7000,()=>{
    console.log('server is listening on port 7000')
})
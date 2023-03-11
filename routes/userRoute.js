const express = require('express')
const userroute = express();

const session = require('express-session')
const bodyParser = require("body-parser");
const cookieparser = require('cookie-parser')


userroute.set("view engine", "ejs");
userroute.set("views","./views/user");



userroute.use(
    session({
      secret: "thissgfhgjvhbmdbvfkasbdakfhgkiagvf",
      resave: false,
      saveUninitialized: true,
      cookie:({
        maxAge:1000*60*60*24
      })
    })
  );

userroute.use(bodyParser.json());
userroute.use(bodyParser.urlencoded({ extended: true }));
userroute.use(cookieparser())
userroute.use(express.static('public'))



const userController = require("../controllers/userController");



 userroute.get('/', userController.loadhome)

 userroute.get('/login',userController.isLogout,userController.loginpage)

userroute.get('/home',userController.loadhome)

userroute.get('/register',userController.isLogout,userController.loadRegister)

userroute.get('/logout',userController.isLogin,userController.logout)

userroute.get('/loaduserproducts',userController.loaduserproducts)

userroute.get('/loadusercart',userController.isLogin,userController.loadusercart)

userroute.get('/loaduserwishlist',userController.isLogin,userController.loaduserwishlist)

userroute.get('/loaddashboard',userController.isLogin,userController.loaddashboard)

userroute.get('/singleproduct',userController.productdetails)

userroute.get('/addtocart',userController.isLogin,userController.addToCart)

userroute.get('/deletecart',userController.deletecart)

userroute.get('/addtowishlist',userController.isLogin,userController.addtowishlist)

userroute.get('/addcartdeletewishlist',userController.isLogin,userController.addcartDeletewishlist)

userroute.get('/deletewishlist',userController.isLogin,userController.deletewishlist)

userroute.get('/loadusercheckout',userController.isLogin,userController.loadcheckout)

userroute.get('/loadordersuccess',userController.isLogin,userController.loadsuccess)

userroute.get('/loaddashboard',userController.isLogin,userController.loaddashboard)

userroute.get('/deletefullcart',userController.deleteallcart)

userroute.get('/verifyotp',userController.loadotp)

userroute.get('/deleteaddress',userController.isLogin,userController.deleteadress)

userroute.get('/loadOrderDetails',userController.isLogin,userController.loadorderdetails)

userroute.get('/loadNewAddress',userController.isLogin,userController.loadnewaddress)

userroute.get('/cancelOrder',userController.isLogin,userController.cancelorder)

userroute.get('/viewOrder',userController.isLogin,userController.vieworder)

userroute.get('/accountdetails',userController.isLogin,userController.loadAaccountDetails)

userroute.get('/returnProduct',userController.isLogin,userController.returnproduct)

userroute.get('/loadEditAddress',userController.isLogin,userController.loadEditAddress)

userroute.get('/loaduserdata',userController.isLogin,userController.loaduserdata)

userroute.get('/UserProfileOrder',userController.isLogin,userController.userProfileOrder)

userroute.get('/BuyAgain',userController.isLogin,userController.loadBuyAgain)

userroute.get('/loadPasswordSetting',userController.isLogin,userController.loadPasswordSetting)


//post Methods

userroute.post('/verifylogin',userController.verifylogin)

userroute.post('/verifyregister',userController.verifyregister)

userroute.post('/editcart',userController.isLogin,userController.editCart)

userroute.post('/verifyotp',userController.verifyotp)

userroute.post('/addaddress',userController.isLogin,userController.addaddress)

userroute.post('/storeCheckout',userController.isLogin,userController.storeOrder)

userroute.post('/addcoupon',userController.addcoupon)

userroute.post('/Editaddress',userController.editaddress)

userroute.post('/SaveUserAccount',userController.SaveAccountdetails)

userroute.post('/razorpay',userController.razorpayCheckout)

userroute.post('/UserPasswordSetting',userController.isLogin,userController.passwordSetting)

module.exports = userroute
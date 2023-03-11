const express = require('express')
const adminroute = express();
const multer = require('../util/multer')

const session = require('express-session')
const bodyParser = require("body-parser"); //express .json
const cookieparser = require('cookie-parser')


adminroute.set("view engine", "ejs");
adminroute.set("views","./views/admin");
adminroute.use(
    session({
      secret: "thissgfhndfcghgjvhbmdbvfkasbdakfhgkiagvf",
      resave: false,
      saveUninitialized: true,
      cookie:({
        maxAge:1000*60*60*24
      })
    })
  );

  

adminroute.use(bodyParser.json());
adminroute.use(bodyParser.urlencoded({ extended: true }));
adminroute.use(cookieparser());
adminroute.use(express.static('public'))

const adminController = require("../controllers/adminController");

//get methods

adminroute.get('/',adminController.islogin,adminController.landingpage)

adminroute.get('/login',adminController.islogin,adminController.loadadminlogin)

adminroute.get('/adminlogout',adminController.adminlogout)

adminroute.get('/dashboard',adminController.islogin,adminController.loaddashboard)

adminroute.get('/loadadminproduct',adminController.islogin,adminController.loadadminproduct)

adminroute.get('/loadaddproduct',adminController.islogin,adminController.loadaddproducts)

adminroute.get('/loadeditproduct',adminController.islogin,adminController.loadeditproduct)

adminroute.get('/deleteproduct',adminController.islogin,adminController.deleteproduct)

adminroute.get('/loadadminuser',adminController.islogin,adminController.loadadminuser)

adminroute.get('/blockuser',adminController.islogin,adminController.blockuser)

adminroute.get('/loadcategory',adminController.islogin,adminController.loadcategory)

adminroute.get('/deletecategory',adminController.islogin,adminController.deletecategory)

adminroute.get('/orderdetails',adminController.islogin,adminController.loadorderreport)

adminroute.get('/cancelOrder',adminController.islogin,adminController.cancelorder)

adminroute.get('/deliverOrder',adminController.islogin,adminController.adminDeilverorder)

adminroute.get('/confirmOrders',adminController.islogin,adminController.confirmedorders)

adminroute.get('/viewOrderDetails',adminController.islogin,adminController.adminOrderDetails)

adminroute.get('/stockReport',adminController.islogin,adminController.stockReport)

adminroute.get('/offer',adminController.islogin,adminController.loadOffer)

adminroute.get('/deleteOffer',adminController.islogin,adminController.deleteOffer)

adminroute.get('/loadBanner',adminController.islogin,adminController.loadBanner)

adminroute.get('/activeBanner',adminController.islogin,adminController.activeBanner)

adminroute.get('/salesReport',adminController.islogin,adminController.salesReport)

adminroute.get('/loadfullSales',adminController.islogin,adminController.loadfullSales)

adminroute.get('/loadAdminReturn',adminController.islogin,adminController.loadAdminReturn)

adminroute.get('/AdminReturnProduct',adminController.islogin,adminController.AdminReturnProduct)

adminroute.get('/AdminNoReturn',adminController.islogin,adminController.AdminNoReturn)

adminroute.get('/download',adminController.islogin,adminController.adminDownload)

adminroute.get('/datewisedownload',adminController.islogin,adminController.admindatwiseDownload)

//post methods

adminroute.post('/verifyadlogin',adminController.verifyadlogin)

adminroute.post('/addproduct',multer.upload.array('sImage') ,adminController.addproduct)

adminroute.post('/editproduct',multer.upload.array('sImage'),adminController.editproduct)

adminroute.post('/addcategory',adminController.addcategory)

adminroute.post('/offers',adminController.addOffer)

adminroute.post('/addBanner',multer.upload.array('bannerImage'),adminController.addBanner)

adminroute.post('/MonthlySales',adminController.monthlysales)

adminroute.post('/datewiseReport',adminController.datewiseReport)


module.exports = adminroute;
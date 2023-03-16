

const User = require("../models/usermodel.js");
const bcrypt=require('bcrypt');
const Product = require('../models/productmodel.js')
const Category = require('../models/categorymodel')
const Order = require('../models/ordersmodel')
const Address = require('../models/addressmodel')
const Banner = require('../models/bannermodel')
const Offer = require('../models/offermodel')
const fast2sms = require('fast-two-sms')
const RazorPay = require('razorpay');
const { UserDefinedMessageInstance } = require("twilio/dist/lib/rest/api/v2010/account/call/userDefinedMessage.js");

const { ObjectID, ObjectId } = require('bson');
const { log } = require("console");
const { update } = require("../models/productmodel.js");
const ordersmodel = require("../models/ordersmodel");

let isloggedin
isloggedin = false;
let userSession = false || {};

let newotp;
let newUser
 let offer = {
    name:"None",
    type:"None",
    discount:0,
    usedBy :false,
 };

 let coupontotal = 0;  
 let nocoupon;
 const isLogin = async(req,res,next)=>{
    try {
        userSession = req.session;
        if(userSession.user_id){
            userdata = await User.findById({_id:userSession.user_id})
            if(userdata.is_Verified){
                next();
            }else{
                userSession.user_id = null
                res.redirect('/login')
            }
        }
        else{
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message);
    }
}
    
    

const isLogout = (req,res,next)=>{
    try{
        userSession = req.session
    if (userSession.user_id) {
        isloggedin = false;
        res.redirect("/");
      }else{
      next();
      }
    } catch (error) {
      console.log(error.message);
    }
       
}



const sendMessage = function (mobile, res) {
    let randomOTP = Math.floor(Math.random() * 10000);
    var options = {
      authorization: process.env.API_KEY,
      message: `your OTP verification code is ${randomOTP}`,
      numbers: [mobile],
    };
    //send this message
    fast2sms
      .sendMessage(options)
      .then((response) => {
        console.log("otp send successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    return randomOTP;
  };





const loadhome = async(req,res)=>{

    try {
       
        console.log(req.session.user_id); 
            
            userSession = req.session;
            userSession.coupontotal = coupontotal;
            userSession.nocoupon = nocoupon;
            userSession.offer = offer;
            const banner = await Banner.findOne({is_active:1});
            const productdata = await Product.find()
            

        res.render('userhome.ejs',{isloggedin,products:productdata ,id:userSession.user_id,banners:banner})
    }
     catch (error) {
        console.log(error.message)
    }
}

const loginpage = async(req,res)=>{
    try{
        // if(req.session.user_id){
        //     res.redirect('/home')
        // }else{
        res.render('userlogin.ejs')
}
    catch(error){
        console.log(error.message)
    }
}

const securepassword = async(password)=>{
    try{
        const passwordhash = await bcrypt.hash(password,10)
        return passwordhash;
    }catch(error){
        console.log(error.message)
    }
}

const verifylogin = async(req,res)=>{
    try {
        
        const email = req.body.email
        const password = req.body.password
        const userdata = await User.findOne({email:email})

        if(userdata){
            const passwordmatch = await bcrypt.compare(password ,userdata.password)
            if(passwordmatch){
                if(userdata.is_admin==0){
                    if(userdata.is_Verified==1){                     
                        req.session.user_id = userdata._id
                    isloggedin = true
                    const banner = await Banner.findOne({is_active:1});
                 res.redirect('/home')
                 console.log('log in')
                    }else{
                        res.render('userlogin.ejs',{message:'user is not verified'})
                    }
                }
                else{
                    res.render('userlogin.ejs',{message:"NOT A USER"})
                }
            }else{
                res.render('userlogin.ejs',{message:"email or password is incorrect"})
            }
        }
        else{
            res.render('userlogin.ejs',{message:"USER doesnt exist"})
        
    }

    } catch (error) {
        console.log(error.message)
    }
}

const loadRegister = async(req,res)=>{
    try {
        
        res.render('userregister.ejs')
        
    } catch (error) {
        console.log(error.message)
    }
}

const verifyregister = async(req,res)=>{
    const email= req.body.email
    const isemail=await User.findOne({email:email})
    if(isemail){
        res.render('userregister.ejs',{message:"email already exist"})
    }else{
        if(req.body.password===req.body.password2){

    try {
        const spassword=await securepassword(req.body.password)
        const user = new User({
            name:req.body.name,
            mobile:req.body.mobile,
            email:req.body.email,
            password:spassword,
            is_admin:0,
        });
        const userdata = await user.save();
        newUser = userdata._id
        if(userdata){
            res.redirect('/verifyotp')
        }
        else{
            return res.render('userregister.ejs',{message:'registration failed'})
        }
    } catch (error) {
        console.log(error.message)
    }
}
else{
    return res.render('userregister.ejs',{message:"password must be same"})
}
}
}


const loadotp = async(req,res)=>{
    const userdata = await User.findById({_id:newUser})
    
    const oTp = sendMessage(userdata.mobile,res)
    newotp = oTp
    console.log('otp:',oTp);
    res.render('verifyotp',{otp:oTp,user:newUser})
}


const verifyotp  = async(req,res)=>{
    try {
        const otp = newotp;
        const userdata = await User.findById({_id:req.body.user})
        if(otp == req.body.otp){
            userdata.is_Verified = 1
            const user = await userdata.save()
            if(user){
                res.redirect('/login')
            
            }
        }else{
            res.render('verifyotp',{message:'Invalid OTP'})
            }
        }

     catch (error) {
        console.log(error.message);
    }
}


const logout = async(req,res)=>{
    try {   
        userSession = req.session;
        userSession.user_id = null;
        userSession.coupontotal = null;
        userSession.nocoupon = null;
        userSession.offer = null;
        userSession.currentorder = null;
        req.session.currentorder = null;
        userSession.offer.discount = null;
        userSession.offer.type = null;
        userSession.offer.name = null;
        isloggedin=false;
        return res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
}

const loaduserproducts = async(req,res)=>{
    try {
        userSession = req.session
        let search = ""
        if(req.query.search){
            search = req.query.search
        }
        let page = 1
        if(req.query.page){
            page = req.query.page
        }
        const limit = 9
        const productdata = await Product.find({
            isAvailable: 1,
            $or:[
                {name:{$regex:'.*' + search + '.*', $options: 'i'} },
                {name:{$regex:'.*' + search + '.*', $options: 'i'} }
            ],
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

        const count = await Product.find({
            isAvailable:1,
            $or:[
                {name:{$regex:'.*' + search + '.*', $options: 'i'} },
                {name:{$regex:'.*' + search + '.*', $options: 'i'} }
            ],
        }).countDocuments()

        const categorydata = await Category.find()
        const ID = req.query.id
        const data = await Category.findOne({_id:ID})

        let notfound = false;
        if(productdata.length === 0) {
            notfound = true;
        }

        if(data){
            const productdata = await Product.find({category: data.name})
           

        res.render('userproducts.ejs',
        {products:productdata,
            id:userSession.user_id,
            cat:categorydata,
            totalpages:Math.ceil(count / limit),
            currentpage:page,
            previouspage:new Number(page)-1,
            nextpage:new Number(page)+1,
            notfound:notfound
        })
        }else{
            res.render('userproducts.ejs',{
                products:productdata,
                cat:categorydata,
                id:userSession.user_id,
                totalpages:Math.ceil(count / limit),
                currentpage:page,
                previouspage:new Number(page) -1,
                nextpage:new Number(page) +1,
                notfound:notfound
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}



const productdetails = async(req,res)=>{
    try {
         userSession = req.session
        const id = req.query.id;
        
        const products = await Product.find()
        try{
        productdata = await Product.findById({_id:id})
        }catch(error){
            console.log(error.message)
        }

        if(productdata){
            res.render('singleproduct.ejs',{product:productdata,products:products,id:userSession.user_id})
        }else{
            res.redirect('/userhome')
        }
    } catch (error) {
        console.log(error.message);
    }
}   



const loadusercart = async(req,res,next)=>{
    try {
        userSession = req.session
        if(userSession.user_id){
           
            const userdata = await User.findById({_id:userSession.user_id})
           
            const completeuser = await userdata.populate('cart.item.productId')
           
        res.render('usercart.ejs',{
            id:userSession.user_id,
            cartproducts:completeuser.cart
        })   
    }else{
        res.render('usercart.ejs',{id:userSession.user_id})
    }
console.log(userSession.user_id);

    } catch (error) {
        next(error)
    }
}



const addToCart = async(req,res)=>{    
        try {
        const productId = req.query.id
        userSession = req.session
        const userdata  = await User.findById({_id:userSession.user_id})
        const productdata = await Product.findById({_id:productId})
        
            userdata.addToCart(productdata)  
            res.redirect('/loadusercart')
        } catch (error) {
       console.log(error.message);
    }
}



const editCart = async(req,res ) =>{
    try{
        const id = req.query.id
        
        userSession = req.session
        const userdata = await User.findById({_id:userSession.user_id})
        const foundproduct = userdata.cart.item.findIndex((objInItems)=> objInItems.productId == id);
        const qty = {a:parseInt(req.body.qty)};

        userdata.cart.item[foundproduct].qty = qty.a 
        userdata.cart.totalprice = 0
        const price = userdata.cart.item[foundproduct].price    
        const totalprice = userdata.cart.item.reduce((acc,curr)=>{
            return acc + curr.price* curr.qty   
        },0)
        userdata.cart.totalprice = totalprice
        await userdata.save()
        res.json({totalprice,price})
        
    }catch(error){
        console.log(error.message);
    }
}

const deletecart = async(req,res)=>{
    try {
        const productId = req.query.id
        userSession = req.session
        const userdata = await User.findById({_id:userSession.user_id})
        userdata.removefromCart(productId)
        res.redirect('/loadusercart')
    } catch (error) {
        console.log(error.message);
    }
}


const deleteallcart = async(req,res)=>{
    try {
        userSession = req.session
        const userdata = await User.findById({_id:userSession.user_id})
        const productdata = await Product.find()
        userdata.removefromCart(productdata)
        res.redirect('/loadusercart')
    } catch (error) {
        console.log(error.message);
    }
}


const loaduserwishlist = async(req,res)=>{
    try {
        userSession = req.session;
        if(userSession.user_id){
        const userdata = await User.findById({_id:userSession.user_id})
        const completeuser = await userdata.populate('wishlist.item.productId')
            res.render('userwishlist.ejs',{
                id:userSession.user_id,
                wishlistproducts:completeuser.wishlist
            })
        }else{
            res.render('userwishlist.ejs',{id:userSession.user_id})
        }
    } catch (error) {
        console.log(error.message);
    }
}


const addtowishlist = async(req,res)=>{
    try {
        const productId =req.query.id
        userSession = req.session
        const userdata = await User.findById({_id:userSession.user_id})
        const productdata = await Product.findById({_id:productId})
        userdata.addToWishlist(productdata)
        
        res.redirect('/loaduserproducts')
    } catch (error) {
        console.log(error.message);
    }
}



const addcartDeletewishlist = async(req,res)=>{
    try {
        userSession = req.session
        const productId = req.query.id
        const userdata = await User.findById({_id:userSession.user_id})
        const productdata = await Product.findById({_id:productId})
        const add = await userdata.addToCart(productdata)
        if(add){
        userdata.removefromWishlist(productId)
        }
        res.redirect('/loaduserwishlist')
    } catch (error) {
        console.log(error.message);
    }
}
   


const deletewishlist = async(req,res)=>{
    try {
        const productId = req.query.id
        userSession = req.session
        const userdata = await User.findById({_id:userSession.user_id})
        userdata.removefromWishlist(productId)
        res.redirect('/loaduserwishlist')
    } catch (error) {
        console.log(error.message);
    }
}



const loadcheckout  = async(req,res)=>{
    try {
        userSession = req.session
        
        const id = req.query.address_id;
        const userdata = await User.findById({_id:userSession.user_id})
        const completeuser = await userdata.populate('cart.item.productId')
        if(userSession.user_id && completeuser.cart.totalprice){
            const addressdata = await Address.find({userId:userSession.user_id})
            const selectaddress = await Address.findOne({_id:id});
            const offer = await Offer.findOne({_id:userSession.user_id})
            if(userSession.coupontotal == 0){
                userSession.coupontotal = userdata.cart.totalprice  
            }
            res.render('usercheckout.ejs',{
                id:userSession.user_id,
                cartproducts:completeuser.cart,
                qty:completeuser.cart.item.qty,
                addselect:selectaddress,
                useraddress:addressdata,
                offer:userSession.offer,
                coupontotal:userSession.coupontotal,
                nocoupon,
            })
            nocoupon = false;
        }
        else{
            res.redirect('/loadusercart')
        }
    } catch (error) {
        res.redirect(error.message)
    }
}




const storeOrder = async(req,res)=>{
    try {
        userSession = req.session
        if(userSession.user_id){
            const userdata = await User.findById({_id:userSession.user_id})
            
            const completeuser = await userdata.populate("cart.item.productId")
              userdata.cart.totalprice = userSession.coupontotal;
           
            const updatedtotal = await userdata.save();

            if(completeuser.cart.totalprice > 0){
                const order = Order({
                    userId:userSession.user_id,
                    payment:req.body.payment,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    country: req.body.country,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    zip: req.body.zip,
                    phone: req.body.phone,
                    products: completeuser.cart,
                    offer: userSession.offer,
                    discount:userSession.offer.discount,    
                })
                const orderproductstatus = []
                for(const key of order.products.item){
                    orderproductstatus.push(0)
                }
                
                order.productReturned = orderproductstatus
                console.log( order.productReturned);
                const orderdata = await order.save();
                userSession.currentorder = orderdata._id    
                req.session.currentorder = order._id

                const orders = await Order.findById({_id:userSession.currentorder})
                const productdetails = await Product.find({isAvailable:1})
                for(let i=0; i < productdetails.length; i++){
                    for(let j=0; j<orders.products.item.length ;j++){

                        if(productdetails[i]._id.equals(orders.products.item[j].productId)
                        ){

                            productdetails[i].sales+=orders.products.item[j].qty;
                        }
                    }
                    productdetails[i].save();
                }
                const offerupdate = await Offer.updateOne(
                    {name:userSession.offer.name},
                    {$push:{usedBy:userSession.user_id}}
                );  
                if(req.body.payment == 'cod'){
                    res.redirect('/loadordersuccess')
                }else if(req.body.payment =="RazorPay"){
                    res.render('razorpay',{
                        userId:userSession.user_id,
                        total: completeuser.cart.totalprice
                    })
                 }
                else{
                    res.redirect('/loadusercheckout')
                }
            }else{
                res.redirect('/loaduserproducts')
            }
        }
        else{
            res.redirect('/userlogin')
        }
    } catch (error) {
        console.log(error.message);
    }
};



const addcoupon = async(req,res)=>{
    try {
        userSession = req.session;
        if(userSession.user_id){
            const userdata = await User.findById({_id:userSession.user_id});
            const offerdata = await Offer.findOne({name:req.body.offer})
            if(offerdata){
                if(offerdata.expirydate < Date.now()){
                    res.status(404).json({ error: "coupon expires" });
                    res.redirect('/loadusercheckout')
                }
                if(offerdata.usedBy.includes(userSession.user_id)){
                    nocoupon = true;
                    res.redirect('/loadusercheckout');
                }
               else{   
                if(userdata.cart.totalprice < offerdata.maximumpurchase && userdata.cart.totalprice > offerdata.minimumpurchase){
                    userSession.offer.name = offerdata.name;
                    userSession.offer.type = offerdata.type;
                    userSession.offer.discount = offerdata.discount;
                    
                        let updatedtotal = 
                    userdata.cart.totalprice - (userdata.cart.totalprice * userSession.offer.discount)/100 ;
                    userSession.coupontotal = updatedtotal;

                    res.redirect('/loadusercheckout')
                    }
                    
                    else{
                        let updatedtotal = userdata.cart.totalprice;
                        userSession.coupontotal = updatedtotal
                         res.status(404).json({ error: "coupon didnt meet amount the criteria" });
                        res.redirect('/loadusercheckout')
                    }
                    
                    res.redirect('/loadusercheckout')
                }

                }else{
                    res.redirect('/loadusercheckout')
                }
            }else{
                res.redirect('/loadusercart')
            }
        }
     catch (error) {
        console.log(error.message);
    }
};



const addaddress = async(req,res)=>{
    try {
        userSession = req.session
        const addressdata = Address({
            userId:userSession.user_id,
            firstname: req.body.firstname,
            lastname:req.body.lastname,
            country:req.body.country,
            address:req.body.address,
            city:req.body.city,
            state:req.body.state,
            zip:req.body.zip,
            phone:req.body.phone
        })
        await addressdata.save();
        res.redirect('/loaddashboard')
    } catch (error) {
        console.log(error.message);
    }
}



const loadEditAddress = async(req,res)=>{
    try {
        userSession = req.session;
        const id = req.query.id
       
       
        const addressdata = await Address.findById({_id:id})
        res.render('usereditaddress',{address:addressdata,id:userSession.user_id})
    } catch (error) {
        console.log(error.message);
    }
}



const editaddress  = async(req,res)=>{
    try {
        userSession = req.session
        const id = req.body.id
       

        const userId = userSession.user_id
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const country = req.body.country
        const address = req.body.address
        const city = req.body.city
        const state = req.body.state
        const zip = req.body.zip
        const phone = req.body.phone
       
        await Address.updateOne({_id:id},
            {$set:{
                userId,
                firstname,
                lastname,
                country,
                address,
                city,
                state,
                zip,
                phone
            }})
        res.redirect('/loadNewAddress')

    } catch (error) {
        console.log(error.message);
    }
}

const deleteadress = async(req,res)=>{
    try {
        const id = req.query.id;
         await Address.deleteOne({_id:id})
        res.redirect('/loaddashboard')
    } catch (error) {
        console.log(error.message);
    }
}


const loadsuccess = async(req,res)=>{
    try {
        userSession = req.session
        if(userSession.user_id){
            const userdata = await User.findById({_id:userSession.user_id})
            const productdata = await Product.find();
            for(const key of userdata.cart.item){
                console.log(key.productId, " + ",key.qty);
                for(const prod of productdata){
                    if(new String(prod._id).trim() == new String(key.productId).trim()){
                        prod.quantity = prod.quantity-key.qty
                        await prod.save()
                    }
                }
            }
            await Order.find({
                userId:userSession.user_id
            })
            await Order.updateOne(
                {userId:userSession.user_id, _id:userSession.currentorder},
                {$set:{status:"Build"}}
            )
            await User.updateOne(
                {_id:userSession.user_id},
                {$set:{
                    "cart.item": [],
                    "cart.totalprice": "0"
                }
            },
            {multi:true}
            )
            console.log('order Built and cart is empty');
        }
         userSession.coupontotal = 0;
        res.render("ordersuccess",{
            orderId:userSession.currentorder,
            id:userSession.user_id
        })
    } catch (error) {
        console.log(error.message);
    }
}



const loaddashboard = async (req, res) => {
    try {
      userSession = req.session
      const userdata = await User.findById({ _id: userSession.user_id })
      const orderdata = await Order.find({ userId: userSession.user_id })
       const addressdata = await Address.find({ userId: userSession.user_id })
      
      res.render('userdashboard', {
        // isLoggedin,
        user: userdata,
        useraddress:addressdata,
        userorders: orderdata,
        id: userSession.user_id,
      })
    } catch (error) {
      console.log(error.message)
    }
  }


  const loadorderdetails = async(req,res)=>{
    try {
        userSession = req.session
        const userdata = await User.findById({_id:userSession.user_id})
        const orderdata = await Order.find({userId:userSession.user_id}).sort({createdAt :-1}) 
        res.render('userorderdetails',{
            id:userSession.user_id,
            user:userdata,
            userorders:orderdata
        })
    } catch (error) {
        console.log(error.message);
    }
  }


  const loadnewaddress = async(req,res)=>{
    try{
        userSession = req.session;
        const userdata = await User.findById({_id:userSession.user_id})
        
        const addressdata  = await Address.find({userId:userSession.user_id})
        res.render('usernewaddress',{
            user:userdata,
            id:userSession.user_id,
            useraddress:addressdata
        })
    }catch(error){
        console.log(error.message);
    }
  }


const cancelorder = async(req,res)=>{
    try {
        userSession = req.session;
        if(userSession.user_id){
            const id = req.query.id;
            await Order.deleteOne({_id:id})
            res.redirect('/loadorderdetails')
        }
        else{
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message);
    }
}



const returnproduct = async (req, res) => {
   try {
    userSession = req.session
        if(userSession = req.session){
            const id = req.query.id;

            await Order.updateOne({_id:id},{$set:{status:'Return request recieved'}})

            res.redirect('/loadOrderDetails')
   }
 } catch (error) {
    console.log(error.message);
   }
}



const vieworder = async(req,res)=>{
    try {
        userSession = req.session;     
           const id = req.query.id;
           userSession.currentorder = id;
           const userdata = await User.findById({_id:userSession.user_id})
           const orderdata = await Order.findById({_id:id})
           await orderdata.populate("products.item.productId");
           res.render('viewOrder',{
            order:orderdata,
            user:userdata,
            
            id:userSession.user_id
           })
        
    } catch (error) {
        console.log(error.message);
    }
}


const loadAaccountDetails = async(req,res)=>{
    try {
        userSession = req.session;
        
        const userdata = await User.findById({_id:userSession.user_id})
        const addressdata = await Address.find({userId:userSession.user_id})
        res.render('useraccount',{
            user:userdata,
            useraddress:addressdata,
            id:userSession.user_id
        })
    } catch (error) {
        console.log(error.message);
    }
}


const SaveAccountdetails = async(req,res)=>{
    try {
        userSession = req.session
        console.log(userSession.user_id)    
        const userdata =  await User.findById({_id:userSession.user_id})
        if(userdata){
                    await User.findByIdAndUpdate({_id:userSession.user_id},{
                        $set:{
                            name:req.body.name,
                            email:req.body.email,
                            mobile:req.body.mobile,
                                              
                        }
                    })
                    res.redirect('/loaduserdata')
                }

    } catch (error) {
        console.log(error.message)
    }
}

const loadPasswordSetting = async(req,res)=>{
    try {
        userSession = req.session
        res.render('userPasswordSetting',{id:userSession.user_id})
    } catch (error) {
        console.log(error.message);
    }
}


const passwordSetting = async(req,res)=>{
    try {
        userSession = req.session

        const password1 = req.body.password1;
        const password2 = req.body.password2;
        const password3 = req.body.password3;

        const userdata = await User.findById({_id:userSession.user_id})
        if(userdata){
            const passwordmatch = await bcrypt.compare(password1,userdata.password)
            if(passwordmatch){
                if(password2 == password3){
                    const spassword = await securepassword(req.body.password2)
                    await User.findByIdAndUpdate({_id:userSession.user_id},{$set:{password:spassword}})
                    res.redirect('/loadPasswordSetting')
                }
            }
               }


    } catch (error) {
        console.log(error.message);
    }
}



const loaduserdata = async(req,res)=>{
    try {
        userSession = req.session
        const userdata = await User.findById({_id:userSession.user_id})
        res.render('userdata',{user:userdata,id:userSession.user_id})
    } catch (error) {
       console.log(error.message);
    }
}

 const userProfileOrder = async(req,res)=>{
    try {
        userSession = req.session
        const id = userSession.user_id
        const userdata = await User.findById({_id:userSession.user_id})
        const orderdata = await Order.find({userId:userSession.user_id}).sort({createdAt:-1})
        console.log(orderdata);
        res.render('dataorders',{user:userdata,order:orderdata,id:id})
    } catch (error) {
       console.log(error.message)
    }
 }


const razorpayCheckout = async(req,res)=>{
    userSession = req.session;
    const userdata = await User.findById({_id:userSession.user_id});
    const completeuser = await userdata.populate('cart.item.productId');
    var instance = new RazorPay({
        key_id:process.env.key_id,
        key_secret:process.env.key_secret,
    })
    
    console.log(completeuser.cart.totalprice);
    let order = await instance.orders.create({
        amount:completeuser.cart.totalprice * 100,
        currency:"INR",
        receipt:"receipt#1"
    })
    res.status(201).json({
        success:true,
        order,
    });
};


const loadBuyAgain = async(req,res)=>{
    try {
        userSession = req.session
        const id = userSession.user_id
        const userdata = await User.findById({_id:id})
        
        const orderdata = await Order.find({$and:[{userId:id},{status:"Delivered"}]})
       
        res.render('buyAgain',{order:orderdata,id:userSession.user_id,user:userdata})
    } catch (error) {
        console.log(error.message);
    }
}



const loaduserprofile = async(req,res)=>{
    try {
        res.render('userprofile.ejs')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loginpage,
    isLogin,
    isLogout,
    securepassword,
    verifylogin,
    loadRegister,
    loadhome,
    verifyregister,
    logout,
    loaduserproducts,
    loadusercart,
    loaduserwishlist,
    loaduserprofile,
    productdetails,
    addToCart,
    addtowishlist,
    addcartDeletewishlist,
    deletewishlist,
    deletecart,
    editCart,
    loadcheckout,
    loaddashboard,
    addaddress,
    storeOrder,
    loadsuccess,
    deleteallcart,
    loadotp,
    verifyotp,
    deleteadress,
    loadorderdetails,
    loadnewaddress,
    cancelorder,
    returnproduct,
    vieworder,
    loadAaccountDetails,
     addcoupon,
     razorpayCheckout,
     loadEditAddress,
     editaddress,
     loaduserdata,
     userProfileOrder,
     SaveAccountdetails,
     loadBuyAgain,
     loadPasswordSetting,
     passwordSetting
}




























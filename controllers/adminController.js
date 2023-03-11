const User = require("../models/usermodel");
const Product = require("../models/productmodel");
const Category = require("../models/categorymodel");
const Order = require('../models/ordersmodel')
const Banner = require('../models/bannermodel')
const Offer = require('../models/offermodel')
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path')
const exceljs = require('exceljs')

const { ObjectID, ObjectId } = require('bson');
const { nextTick } = require("process");
const { findOne } = require("../models/usermodel");


let isAdminLoggedin
isAdminLoggedin = false
let orderType ='all'
let adminSession

const islogin = async(req,res,next)=>{
    try {
        if(!req.session.admin_id){
            res.render('adminlogin.ejs')
        }
        else{
            next();
        }
    } catch (error) {
        console.log(error.message);
    }
}

const islogout = async(req,res,next)=>{
    try {
        if(req.session.admin_id){
            res.redirect('/admin/admindashboard')
        }
    } catch (error) {
        console.log(error.message);
    }
}



const adminlogout = async(req,res)=>{
    try {
        req.session.destroy();
        isAdminloggedin=false;
        return res.render('adminlogin.ejs')
    } catch (error) {
        console.log(error.message)
    }
}


const landingpage = async(req,res)=>{
    try {
    
        if(req.session.admin_id){
            const admindata = await User.findOne({is_admin:1})

            res.render('admindashboard.ejs',{admin:admindata})
        }
        else{
            res.redirect('/admin/adminlogin')
        }
    } catch (error) {
        console.log(error.message);
    }
}



const loadadminlogin = async (req, res) => {
    try {
        if(res.session.admin_id){
            res.redirect('/admin/admindashboard.ejs')
        }else{
      res.render('adminlogin.ejs')
        }
    
    } catch (error) {
      console.log(error.message);
    }
  };

  const verifyadlogin = async(req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password
        const admindata = await User.findOne({email:email})
        if(admindata){
            const passwordmatch = await bcrypt.compare(password,admindata.password)
            if(passwordmatch){
                if(admindata.is_admin==1){
                    adminSession = req.session
                    adminSession.admin_id = admindata._id
                    isAdminLoggedin = true
                    res.redirect('/admin/dashboard')
                    console.log('admin is logged')
                }
                else{
                    res.render('adminlogin.ejs',{message:'please redirect to user page'})
                }
            }
            else{
                res.render('adminlogin.ejs',{message:'email or password is incorrect'})
            }
        }
        else{
            res.render('adminlogin.ejs',{message:"email or password is incorrect"})
        }
    } catch (error) {
        console.log(error.message)
    }
  }

  const loaddashboard = async(req,res,next)=>{
    try {
        
        if(req.session.admin_id){
            console.log(req.session.admin_id);
            isAdminLoggedin=true;
         const productData = await Product.find()
         const userdata = await User.find({is_admin:0})
        const adminData = await User.findOne({is_admin:1})
        const categorydata = await Category.find()
        

         const categoryArray = [];
         const ordercount = [];
         for(let key of categorydata){
            categoryArray.push(key.name)
            ordercount.push(0)
         }
         
         const completeorder = []
         const orderdata = await Order.find()
         for(let key of orderdata){
            const uppend = await key.populate('products.item.productId')
            completeorder.push(uppend)
         }

         const productName = [];
         const salesCount = [];
         const productnames = await Product.find();
         for(let key of productnames){
            productName.push(key.name);
            salesCount.push(key.sales)
         }

         for(let i=0; i<completeorder.length; i++){
            for(let j=0; j<completeorder[i].products.item.length; j++){
                const catdata = completeorder[i].products.item[j].productId.category
                const isexisting = categoryArray.findIndex(category=>{
                    return category === catdata
                })
                ordercount[isexisting]++
            }
         }

         const showCount = await Order.find().count()
         const productCount = await Product.count()
         const userCount = await User.count({is_admin:0})
         const totalCategory = await Category.count({isAvailable:1})

        res.render('admindashboard.ejs',{products:productData,
            users:userdata,
            admin:adminData,
            category:categoryArray,
            count:ordercount,
            pname:productName,
            pcount:salesCount,
            showCount,
            productCount,
            userCount,
            totalCategory
        })
        }else{
            res.redirect('/admin/adminLogin')
        }
    }
    catch (error) {
        next(error)
    }
}  


const loadadminproduct = async(req,res,next)=>{
    try {
        const productdata = await Product.find().sort({createdAt:-1})

        res.render('adminproduct.ejs',{products:productdata})
    } catch (error) {
        next(error)
    }
}


const loadaddproducts = async(req,res)=>{
    
    const categorydata = await Category.find()
    try{
        res.render('addproduct.ejs',{category:categorydata})
    }catch(error){
        console.log(error.message)
    }

}

const addproduct = async(req,res,next)=>{
    try {
        const images = req.files
        const product = Product({
            name:req.body.sName,
            category:req.body.sCategory,
            price:req.body.sPrice,
            quantity:req.body.sQuantity,
            description:req.body.sDescription,
            rating:req.body.sRating,
            image:images.map((x)=>x.filename)
        })

        const productdata = await product.save()
        const categorydata = await Category.find()
        if(productdata){
            res.render('addproduct.ejs',{category:categorydata ,message:'product adding successfull'})
        }else{
            res.render('addproduct.ejs',{category:categorydata  ,message:'product adding failed'})
        }
        
    } catch (error) {
        next(error);
    }
}

const loadeditproduct = async(req,res)=>{
    try {
        const id = req.query.id
        const productdata = await Product.findById({_id:id})
        const categorydata = await Category.find()
        if(productdata){
            res.render('editproduct.ejs',{product:productdata,category:categorydata})
        }else{
            res.redirect('/admin/adminproduct',{message:'product doesnt exist'})
        }

    } catch (error) {
        console.log(error.message);
    }
}

const editproduct = async(req,res)=>{

    try {
            const id = req.query.id
            const name = req.body.sName
            const category = req.body.sCategory
            const price = req.body.sPrice
            const quantity = req.body.sQuantity
            const description = req.body.sDescription
            const rating = req.body.sRating
            const files = req.files
            const image = files.map((x)=>x.filename)
             
            if(image.length == 0){
                await Product.updateOne(
                    {_id:req.body.id},
                    {$set:{
                        name,
                        category,
                        price,
                        quantity,
                        description,
                        rating
                    }
                    }
                )
            }else{
                await Product.updateOne(
                    {_id:req.body.id},{
                        $set:{
                            name,
                            category,
                            price,
                            quantity,
                            description,
                            rating,
                            image
                        }
                    }
                )
            }
            res.redirect('/admin/loadadminproduct')
    }
     catch (error) {
        console.log(error.message);
    }

}

const deleteproduct = async(req,res)=>{
    try {
        const id = req.query.id
        const productdata = await Product.findById({_id:id})
        if(productdata.isAvailable==true){
        
        await Product.findByIdAndUpdate({_id:id},{$set:{isAvailable:false}})
        res.redirect('/admin/loadadminproduct')
    }
    else{
        await Product.findByIdAndUpdate({_id:id},{$set:{isAvailable:true}})
        res.redirect('/admin/loadadminproduct')
    }
    } catch (error) {
        console.log(error.message)
    }
}


const loadOffer = async(req,res)=>{
    try {
        const offerdata = await Offer.find().sort({createdAt:-1})
        res.render('offer',{offer:offerdata})
    } catch (error) {
        console.log(error.message);
    }
}


const addOffer = async(req,res)=>{
    try {
        const offer = Offer({
            name:req.body.name,
            type:req.body.type,
            discount:req.body.discount,
            expirydate:req.body.expirydate,
            maximumpurchase:req.body.maximumpurchase,
            minimumpurchase:req.body.minimumpurchase
        })
        await offer.save()
        res.redirect('/admin/offer')
    } catch (error) {
        console.log(error.message);
    }
}


const deleteOffer = async(req,res)=>{
    try {
        const id = req.query.id;
        await Offer.deleteOne({_id:id});
        res.redirect('/admin/offer')
    } catch (error) {
        console.log(error.message);
    }
}


const loadBanner = async(req,res)=>{
    try {
        const bannerdata = await Banner.find()
        res.render('banner',{banners:bannerdata})
    } catch (error) {
        console.log(error.message);
    }
}


const addBanner = async(req,res)=>{
    try {
        const newBanner = req.body.banner;
        const file = req.files;
        const banner = new Banner({
            banner:newBanner,
            bannerImage:file.map((x)=>x.filename)
        })
        const bannerdata = await banner.save();
        if(bannerdata){
            res.redirect('/admin/loadBanner')
        }
    } catch (error) {
        console.log(error.message);
    }
}



const activeBanner = async(req,res)=>{
    try {
        const id = req.query.id;
        await Banner.findOneAndUpdate({is_active:1},{$set:{is_active:0}})
        await Banner.findByIdAndUpdate({_id:id},{$set:{is_active:1}})
        res.redirect('/admin/loadBanner')
    } catch (error) {
        console.log(error.message);
    }
}



const loadadminuser = async(req,res)=>{
    try {
        let search = "";
        if(req.query.search){
            search=req.query.search;
        }
        const userdata = await User.find({is_admin:0,
        $or:[
            {name:{ $regex:".*"+ search + ".*"} },
            {email:{ $regex:".*"+ search + ".*"} },
        ],
        });
        res.render('adminuser.ejs',{users:userdata})

    } catch (error) {
        console.log(error.message);
    }
}

const blockuser = async(req,res)=>{
    try {
    
        const id = req.query.id
        const userdata = await User.findById({_id:id})
        if(userdata.is_Verified){
            await User.findByIdAndUpdate({_id:id},{$set:{is_Verified:0}})
            if(userdata.is_Verified==0){
                req.session.destroy();
            }
        }
        else{
            await User.findByIdAndUpdate({_id:id},{$set:{is_Verified:1}})
        }
        res.redirect('/admin/loadadminuser')
    } catch (error) {
        console.log(error.message);
    }
}


const loadcategory = async(req,res)=>{
    try {
        const categorydata = await Category.find().sort({createdAt:-1})
        res.render('admincategory.ejs',{category:categorydata})

    } catch (error) {
        console.log(error.message);
    }
}


const addcategory = async(req,res)=>{
    try {
        const namecategory = req.body.category;
        const upper = namecategory.toLowerCase();
        const lower = namecategory.toUpperCase();
        const categorydata = await Category.find().sort({createdAt:-1})
        const categoryexist = await Category.findOne({name:lower,name:upper})
        
        if(categoryexist){
           return res.render('admincategory.ejs',{message:'category already exist',category:categorydata})
        }else{
            const category = Category({name:req.body.category})
        await category.save();
        res.redirect('/admin/loadcategory')
        }
    } catch (error) {
        console.log(error.message);
    }
}


const deletecategory = async(req,res)=>{
    try {
        const id = req.query.id
        await Category.deleteOne({_id:id})
        res.redirect('/admin/loadcategory')

    } catch (error) {
        console.log(error.message);
    }
}


const loadorderreport = async(req,res)=>{
    try {
        const productdata = await Product.find();
        const userdata = await User.find({is_admin:0})
        const orderdata = await Order.find({status:{$ne:'Attempted' && 'Cancelled'}}).sort({createdAt :-1})
        for(let key of orderdata){
            await key.populate('products.item.productId')
            await key.populate('userId')
        }
        if(orderType == undefined){
            res.render('orderreport',{
                users:userdata,
                product:productdata,
                order:orderdata
            })
        }else{
             id = req.query.id;
            res.render('orderreport',{
                users:userdata,
                product:productdata,
                order:orderdata,
                id:id,
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const cancelorder = async(req,res)=>{
    try {
        const id = req.query.id;
        await Order.findByIdAndUpdate({_id:id},{$set:{
            status:'Cancelled'
        }});
        res.redirect('/admin/orderdetails')
    } catch (error) {
        console.log(error.message);
    }
}


const confirmedorders = async(req,res)=>{
    try {
        const id = req.query.id;
        await Order.updateOne({_id:id},{$set:{status:'Confirmed'}})
        res.redirect('/admin/orderdetails')
    } catch (error) {
        console.log(error.message);
    }
}


const adminDeilverorder = async(req,res)=>{
    try {
        const id = req.query.id;
        await Order.updateOne({_id:id},{$set:{status:'Delivered'}})
        res.redirect('/admin/orderdetails')
    } catch (error) {
        console.log(error.message);
    }
}


const adminOrderDetails = async(req,res)=>{
    try {
        const id = req.query.id;
        const userdata = await User.find()
        const orderdata = await Order.findById({_id:id})
        await orderdata.populate('products.item.productId')
        await orderdata.populate('userId')
        res.render('adminViewOrder',{
            order:orderdata,
            users:userdata
        })
    } catch (error) {
        console.log(error.message);
    }
}


const stockReport = async(req,res)=>{
    try {
        const productdata = await Product.find()
        res.render('stockReport',{
            product:productdata,
            admin:true
        })
    } catch (error) {
        console.log(error.message);
    }
}


const salesReport = async(req,res)=>{
    try {
        const productdata = await Product.find()
        res.render('salesReport',{product:productdata})
    } catch (error) {
        console.log(error.message);
    }
}

const monthlysales = async(req,res)=>{
    try {
        const month = req.body.month;
        const startofmonth = new Date(month);
        const endofmonth = new Date(month);
        console.log(startofmonth);
        endofmonth.setMonth(endofmonth.getMonth()+1);
        const sales = await Order.aggregate([
            {
              $match: {
                createdAt: {
                  $gte: startofmonth,
                  $lte: endofmonth,
                },
                status: 'Delivered', // Only count completed orders
              },
            },
            {
              $unwind: '$products.item',
            },
            {
              $group: {
                _id: {
                  month: { $month: '$createdAt' },
                  year: { $year: '$createdAt' },
                  productId: '$products.item.productId',
                },
                quantity: { $sum: '$products.item.qty' },
                totalSales: { $sum: '$products.item.price' },
              },
            },
            {
              $lookup: {
                from: 'products',
                localField: '_id.productId',
                foreignField: '_id',
                as: 'product',
              },
            },
            {
              $project: {
                _id: 0,
                month: '$_id.month',
                year: '$_id.year',
                productId: '$_id.productId',
                name: '$product.name',
                category: '$product.category',
                quantity: 1,
                totalSales: 1,
              },
            },
          ])
        res.render('monthlySales',{sales:sales})
        
    } catch (error) {       
        console.log(error.message);
    }
}


const datewiseReport = async(req,res)=>{
    try {
        const startdate = new Date(req.body.Startingdate)
        const enddate = new Date(req.body.Endingdate)

        const sales = await Order.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte: startdate,
                        $lt: enddate
                    },
                    status:'Delivered',
                },
            },
            {
                $unwind:'$products.item',
            },
            {
                $group:{
                    _id:'$products.item.productId',
                    totalSales:{ $sum: '$products.item.price'},
                    quantity:{ $sum: '$products.item.qty'}
                },
            },
            {
                $lookup:{
                    from:'products',
                    localField:'_id',
                    foreignField:'_id',
                    as:'product'
                },
            },
            {
                $unwind:'$product',
            },
            {
                $project:{
                    _id:0,
                    name:'$product.name',
                    category:'$product.category',
                    price:'$product.price',
                    quantity:'$quantity',
                    sales:'$totalSales'
                },
            },
        ])
        
        res.render('datewisereport',{sales:sales});
    } catch (error) {
        console.log(error.message);
    }
}



const loadfullSales = async(req,res)=>{
    try {
        res.render('ALLSales')
    } catch (error) {
        console.log(error.message)
    }
}

const loadAdminReturn = async(req,res)=>{
    try {
        adminSession = req.session
        id = req.query.id
        adminSession.currentorder = id
        const orderdata = await Order.findById({_id:id})
        await orderdata.populate("products.item.productId");
        res.render('returnproducts',{order:orderdata})
    } catch (error) {
        console.log(error.message);
    }
}


const AdminReturnProduct = async(req,res,next)=>{
    try {
        adminSession = req.session
        const id = req.query.id;
       const gid = adminSession.currentorder
    
        const productorderdata = await Order.findById({_id:ObjectID(adminSession.currentorder)})
        
        const productdata = await Product.findById({_id:id})
        console.log(productorderdata);
        if(productorderdata){
            for( let i = 0;i<productorderdata.products.item.length;i++){
                if(new String(productorderdata.products.item[i].productId).trim() === new String(id).trim()){
                    productdata.quantity += productorderdata.products.item[i].qty;
                    
                    productorderdata.productReturned[i]=1;
                    await productdata.save().then(()=>{
                        console.log('productdata saved');
                    })

                    await Order.updateOne({_id:gid},{$set:{status:"Returned"}})

                    await productorderdata.save().then(()=>{
                        console.log('productorderdata saved');
                        res.redirect('/admin/deliverOrder')
                    })

                }else{
                    res.redirect('/admin/deliverOrder')
                }
            }
        }else{
            res.redirect('/admin/orderdetails')
        }
    } catch (error) {
        next(error)
    }
}


const AdminNoReturn = async(req,res)=>{
    try {
        adminSession = req.session;
        if(userSession = req.session){
        const id = req.query.id;

        await Order.updateOne({_id:id},{$set:{status:'Delivered'}})
        res.redirect('/admin/deliverOrder')
        }
    } catch (error) {
        console.log(error.message);
    }
}



const adminDownload= async(req,res)=>{
    try {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Stockreport")

        worksheet.columns = [
            { header:"Sl no.",key:"s_no" },
            { header:"Product",key:"name" },
            { header:"Category",key:"category" },
            { header:"Price",key:"price" },
            { header:"Quantity",key:"quantity" },
            { header:"Rating",key:"rating" },
            { header:"Sales",key:"sales" },
            { header:"isAvailable",key:"isAvailable" },
        ];

        let counter = 1;

        const productdata = await Product.find()

        productdata.forEach((product)=>{
            product.s_no = counter;
            worksheet.addRow(product)
            counter++;
        })

        worksheet.getRow(1).eachCell((cell)=>{
            cell.font = {bold:true}
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        res.setHeader("Content-Disposition","attachment; filename=products.xlsx")   
        
        return workbook.xlsx.write(res).then(()=>{
            res.status(200)
        })

    } catch (error) {
        console.log(error.message);
    }
}


const admindatwiseDownload= async(req,res)=>{
    try {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("datewisereport")

        worksheet.columns = [
            { header:"Sl no.",key:"s_no" },
            { header:"Product",key:"name" },
            { header:"Category",key:"category" },
            { header:"Price",key:"price" },
            { header:"Quantity",key:"quantity" },
            { header:"Sales",key:"sales" },
            { header:"isAvailable",key:"isAvailable" },
        ];

        let counter = 1;

        const sales = await Order.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte: startdate,
                        $lt: enddate
                    },
                    status:'Delivered',
                },
            },
            {
                $unwind:'$products.item',
            },
            {
                $group:{
                    _id:'$products.item.productId',
                    totalSales:{ $sum: '$products.item.price'},
                    quantity:{ $sum: '$products.item.qty'}
                },
            },
            {
                $lookup:{
                    from:'products',
                    localField:'_id',
                    foreignField:'_id',
                    as:'product'
                },
            },
            {
                $unwind:'$product',
            },
            {
                $project:{
                    _id:0,
                    name:'$product.name',
                    category:'$product.category',
                    price:'$product.price',
                    quantity:'$quantity',
                    sales:'$totalSales'
                },
            },
        ])

        sales.forEach((sale)=>{
            sale.s_no = counter;
            worksheet.addRow(sale)
            counter++;
        })

        worksheet.getRow(1).eachCell((cell)=>{
            cell.font = {bold:true}
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        res.setHeader("Content-Disposition","attachment; filename=products.xlsx")   
        
        return workbook.xlsx.write(res).then(()=>{
            res.status(200)
        })

    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    loadadminlogin,
    verifyadlogin,
    loaddashboard,
    loadaddproducts,
    loadadminproduct,
    addproduct,
    loadeditproduct,
    editproduct,
    deleteproduct,
    loadadminuser,
    blockuser,
    loadcategory,
    addcategory,
    deletecategory,
    islogin,
    islogout,
    landingpage,
    adminlogout,
    loadorderreport,
    cancelorder,
    adminDeilverorder,
    confirmedorders,
    adminOrderDetails,
    stockReport,
    loadOffer,
    addOffer,
    deleteOffer,
    loadBanner,
    addBanner,
    activeBanner,
    salesReport,
    monthlysales,
    loadfullSales,
    AdminReturnProduct,
    loadAdminReturn,
    adminDownload,
    datewiseReport,
    admindatwiseDownload,
    AdminNoReturn
}
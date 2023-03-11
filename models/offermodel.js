const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
    expirydate:{
        type:Date,
        required:true,
    },
    maximumpurchase:{
        type:Number,
        required:true,
    },
    minimumpurchase:{
        type:Number,
        required:true
    },
    usedBy:[{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }]
},{timestamps:true})

module.exports = mongoose.model('offer',offerSchema)
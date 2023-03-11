const mongoose = require('mongoose')

const filterSchema = new mongoose.Schema({

    filterId:{
        type:mongoose.Types.ObjectId,
        ref:'Category',
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    size:{
        type:Array,
        required:true,
    },
    isAvailable:{
        type:Number,
        default:1
    }


})
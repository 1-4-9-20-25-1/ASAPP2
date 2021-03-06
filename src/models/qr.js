const mongoose=require('mongoose')
const { bool } = require('sharp')

const otpSchema = new mongoose.Schema({
    value:{
        type:String,
        required:true,
        trim:true
    },
    placename:{
        type:String,
        required:true,
        trim:true
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },    
    placeid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    scanned:{
        type:Boolean,
        default:false
    }
})



otpSchema.pre('save',async function(next){
    const qr=this
    const there=await QR.findOneAndDelete({userid:qr.userid})
    next()
})

const QR = mongoose.model('QR',otpSchema)

    module.exports = QR
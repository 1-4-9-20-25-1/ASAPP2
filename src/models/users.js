const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
        minlength:6,
        default:"user"
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Not a valid email address')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    belongsTo:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Org'
        
    },
    access:{
        type:Boolean,
        default:false
    }
})


const User = mongoose.model('User',userSchema)

module.exports = User
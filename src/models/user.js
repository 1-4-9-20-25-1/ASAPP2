const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
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
    belongsto:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Org'
        
    },
    access:{
        type:Boolean,
        default:false
    }
})

userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.statics.findByCredentials=async(email,pass)=>{
    const user=await User.findOne({email})
    if(!user)
    {
        throw new Error("NO USER FOUND")
    }
    const isMatch=await bcrypt.compare(pass,user.password)
    if(!isMatch)
        throw new Error("PASSWORD DIDN'T MATCH")
    return user
}


const User = mongoose.model('User',userSchema)

module.exports = User
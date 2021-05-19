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
    avatar:{
        type: Buffer
    },
    location:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    }
})

userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()

    delete userObject.password
    delete userObject.avatar

    return userObject
}

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
        const emailErr=new Error("No user found.")
        emailErr.name="email"
        throw emailErr
    }
    const isMatch=await bcrypt.compare(pass,user.password)
    if(!isMatch)
    {
        const passErr=new Error("Password is incorrect.")
        passErr.name="pass"
        throw passErr
    }
    return user
}

userSchema.methods.changePassword=async function(pass)
{
    const user=this
    const match=await bcrypt.compare(pass.oldpass,user.password)   
    if(!match)
        throw new Error("Current password is incorrect")
    
    user.password=pass.newpass
}


const User = mongoose.model('User',userSchema)

module.exports = User
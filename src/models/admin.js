const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')


const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email Address")
            }
        }
    },
    places:[
        {
            name:{
                type:String,
                required:true,
            },
            count:{
                type:Number,
                default:0
            }
        }
    ]
})

adminSchema.pre('save',async function(next)
{
    const admin=this
    if(admin.isModified('password'))
    {
        admin.password=await bcrypt.hash(admin.password,8)
    }
    next()
})

adminSchema.statics.findByCredentials= async function(email,pass){
    const admin = await Admin.findOne({email})
    if(!admin)
    {
        throw new Error('Email/password is wrong')
    }
    const isMatch = await bcrypt.compare(pass,admin.password)
    if(!isMatch)
    {
        throw new Error('Email/password is wrong')
    }
    return admin
}


adminSchema.methods.addPlace=async function(x)
{
    const admin=this
    const place = x
    admin.places=admin.places.concat(place)
    await admin.save()
}



const Admin = mongoose.model('Admin',adminSchema)

module.exports=Admin
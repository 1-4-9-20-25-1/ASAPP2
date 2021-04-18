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
            },
            capacity:{
                type:Number,
                required:true
            }
        }
    ]
})


adminSchema.pre('save',async function(next){
    const admin=this

    if(admin.isModified('password'))
    {
        admin.password=await bcrypt.hash(admin.password,8)
    }
    next()
})


adminSchema.methods.addPlace=async function(x)
{
    const admin=this
    const place = x
    admin.places=admin.places.concat(place)
    await admin.save()
}

adminSchema.statics.findByCredentials=async(email,pass)=>{
    const admin=await Admin.findOne({email})
    if(!admin)
    {
        throw new Error("NO USER FOUND")
    }
    const isMatch=await bcrypt.compare(pass,admin.password)
    if(!isMatch)
        throw new Error("PASSWORD DIDN'T MATCH")
    return admin

}



const Admin = mongoose.model('Admin',adminSchema)

module.exports=Admin
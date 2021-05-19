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
    avatar:{
        type:Buffer
    },
    scanners:[
        {
            number:{
                type:String,
                required:true
            }
        }
    ],
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
            },
            pincode:{
                type:String,
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

adminSchema.methods.addNumber=async function(x)
{
    const admin=this
    const number = x
    admin.scanners=admin.scanners.concat(number)
    await admin.save()
}

adminSchema.statics.findByCredentials=async(email,pass)=>{
    const admin=await Admin.findOne({email})
    if(!admin)
    {
        var err=new Error("Invalid email address")
        err.name='mailError'
        throw err;
    }
    const isMatch=await bcrypt.compare(pass,admin.password)
    if(!isMatch)
    {
        var err=new Error("Invalid password")
        err.name="passError"
        throw err; 
    }

    return admin

}

adminSchema.methods.changePassword=async function(pass)
{
    const admin=this
    const match=await bcrypt.compare(pass.oldpass,admin.password)   
    if(!match)
        throw new Error("Current password is incorrect.")
    
    admin.password=pass.newpass
}


const Admin = mongoose.model('Admin',adminSchema)

module.exports=Admin
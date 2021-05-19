const User=require('./models/user')
const Admin=require('./models/admin')
const QR = require('./models/qr')

const getAdminsList=async()=>{
    try{
        const admins=await Admin.find()
        let list=[]
        admins.forEach(x=>{
            ({_id,name}=x)
            list.push({_id,name})
        })
        return list
    }
    catch(e)
    {
        console.log(e)
        return null;
    }
}

const verifyEmail=async(email)=>{
    const userPresent =await User.findOne({email})
    const adminPresent=await Admin.findOne({email})
    if(userPresent || adminPresent)
    {
        const dupErr=new Error("Email already exists.")
        dupErr.name="duplicate"
        throw dupErr
    }
}

const getPlaces=async(id)=>{
    const admin=await Admin.findById(id)
    if(admin)
        return admin.places
    return null
}

module.exports={getAdminsList,verifyEmail,getPlaces}
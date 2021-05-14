const express=require('express')
const multer=require('multer')
const sharp=require('sharp')
const QRCode = require('qrcode')
const User=require('../models/user')
const Admin=require('../models/admin')
const QR = require('../models/qr')
const {home,login}=require('../authentication/userauth')


const router= new express.Router()

//SIGNUP
router.get('/user/signup',home,async(req,res)=>{
    try{
        const admins=await Admin.find()
        let list=[]
        admins.forEach(x=>{
            ({_id,name}=x)
            list.push({_id,name})
        })
        res.render('usersignup',{list})
    }
    catch(e)
    {
        console.log(e)
    }
})

router.post('/user/signup',home,async(req,res)=>{
    try{
        const user=new User(req.body)
        user.save()
        req.session.userid=user._id
        req.session.name=user.name
        res.redirect("/user/signup")
    }catch(e)
    {
        console.log(e)
    }
})

// LOGIN
router.get('/user/login',home,(req,res)=>{
    res.render('userlogin')
})

router.post('/user/login',home,async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        if(!user)
            throw new Error()
        req.session.userid=user._id
        req.session.name=user.name
        res.redirect('/user/home')
    }catch(e)
    {
        console.log(e)
    }
})

// HOME PAGE
router.get('/user/home',login,async(req,res)=>{
    try{
        let qrcode="",placename=""
        const user=await User.findById(req.session.userid)
        //PLACES
        adminid=user.belongsto
        const admin=await Admin.findById(adminid)
        const places=admin.places
        // QR CODE
        const qr=await QR.findOne({userid:req.session.userid})
        if(qr!=null)
        {
            qrcode=qr.value
            placename=qr.placename
        }

        // RENDER
        if(qr!=null)
            res.render('userhome',{places,qr,user,disable:"disabled"})
        else
            res.render('userhome',{places,user})

    }catch(e)
    {
        console.log(e)
    }
})

router.get('/user/places',login,async(req,res)=>{
    try{
        const user=await User.findById(req.session.userid)
        adminid=user.belongsto
        const admin=await Admin.findById(adminid)
        res.send(admin.places)
    }catch(e)
    {
        console.log(e)
    }
})

// SETTINGS
router.get('/user/settings',login,async(req,res)=>{
    try{
        const user=await User.findById(req.session.userid)
        const admins=await Admin.find()
        let list=[]
        let curLocation=""
        admins.forEach(x=>{
            ({_id,name}=x)
            if(_id.equals(user.belongsto))
                curLocation=name
            else
                list.push({_id,name})
        })
        res.render('usersettings',{user,curLocation,list,title:'User | Settings'})
    }catch(e)
    {
        res.send(e)
    }
})

//update info
router.patch('/user/update',login,async(req,res)=>{
    try{
        const user=await User.findByIdAndUpdate(req.session.userid,req.body,{new:true,runValidators:true})
        if(!user)
            return res.status(404).send("ERROR")
        res.send(user)
    }catch(e)
    {
        res.status(404).send(e)
    }
})
//update password
router.patch('/user/updatepass/',login,async(req,res)=>{
    try{
        const user=await User.findById(req.session.userid)
        console.log(user)
        await user.changePassword(req.body)
        user.save()
        res.send("UPDATED")
    }
    catch(e)
    {
        console.log(e)
        res.send("FAILED")
    }
})

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(file.originalname.match(/\.(jpg|jpeg|png)$/))
            return cb(undefined,true)
        return cb(new Error("Please upload an image"))
    }
})
//upload pic
router.post('/user/me/avatar',upload.single('avatar'),async(req,res)=>{
    try{
        const buffer=await sharp(req.file.buffer).resize({width:128,heigh:128}).png().toBuffer()
        const user=await User.findById(req.session.userid)
        user.avatar=buffer
        await user.save()
        res.redirect('/user/settings')
    }catch(e)
    {
        res.send(e.message)
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//get pic
router.get('/user/:id/avatar',async(req,res)=>{
try{
    const user=await User.findById(req.params.id)
    if(!user || !user.avatar)
    {
        throw new Error()
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)
}catch(e)
{
    res.status(404).send()
}
})

//delete account
router.delete('/user/delete/:delid',async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.delid)
        await QR.findOneAndDelete({userid:req.params.delid})
        console.log("deleted")
        req.session.destroy()
        res.send("ok")
    }catch(e)
    {
        console.log(e)
    }
})

//GENERATE QR CODE
router.post('/generate/qrcode',async(req,res)=>{
    const data={userid:req.session.userid,placeid:req.body.id}
    try{
        await QRCode.toDataURL(JSON.stringify(data), function (err, url) {
            if(url)
            {
                const qr=new QR({value:url,userid:req.session.userid,placeid:req.body.id,placename:req.body.name}) 
                qr.save()
            }
        })
        res.status(200).send()
    }catch(e)
    {
        console.log(e)
    }
})

router.delete('/delete/qrcode/:id',async(req,res)=>{
    try{
        const code=QR.findOne({userid:req.params.id})
        if(code.scanned)
        {
            await Admin.updateOne({'places._id':code.placeid},{$dec:{
                'places.$.count':1}})
        }
        await QR.findOneAndDelete({userid:req.params.id})
        res.status(200).send()
    }catch(e)
    {
        res.status(500).send();
        console.log(e);
    }
})



module.exports=router
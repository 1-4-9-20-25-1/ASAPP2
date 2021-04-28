const express=require('express')
const User=require('../models/user')
const Admin=require('../models/admin')
const {home,login}=require('../authentication/userauth')
var QRCode = require('qrcode')
const QR = require('../models/qr')

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

router.post('/user/signup',async(req,res)=>{
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

router.post('/user/login',async(req,res)=>{
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
        // QR CODE
        const qr=await QR.findOne({userid:req.session.userid})
        if(qr!=null)
        {
            qrcode=qr.value
            placename=qr.placename
        }
        //PLACES
        adminid=user.belongsto
        const admin=await Admin.findById(adminid)
        const places=admin.places
        // RENDER
        if(qr!=null)
            res.render('userhome',{places,user,qrcode,placename})
        else
            res.render('userhome',{places,user})

    }catch(e)
    {
        console.log(e)
    }
})

router.get('/user/places',async(req,res)=>{
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
        res.render('usersettings',{user,title:'User | Settings'})
    }catch(e)
    {
        res.send(e)
    }
})

//update info
router.patch('/user/update/:uid',async(req,res)=>{
    try{
        const user=await User.findByIdAndUpdate(req.params.uid,req.body,{new:true,runValidators:true})
        if(!user)
            return res.status(404).send("ERROR")
        res.send(user)
    }catch(e)
    {
        res.status(404).send(e)
    }
})
//update password
router.patch('/user/updatepass/:uid',async(req,res)=>{
    try{
        const user=await User.findById(req.params.uid)
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

//delet account
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
router.post('/qrcode',async(req,res)=>{
    const data={userid:req.session.userid,placeid:req.body.id}
    try{
        await QRCode.toDataURL(JSON.stringify(data), function (err, url) {
            if(url)
            {
                const qr=new QR({value:url,userid:req.session.userid,placename:req.body.name}) 
                qr.save()
            }
        })
        res.status(200).send("ok")
    }catch(e)
    {
        console.log(e)
    }
})



module.exports=router
const express=require('express')
const User=require('../models/user')
const Admin=require('../models/admin')
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
        const user=await User.findById(req.session.userid)
        adminid=user.belongsto
        const admin=await Admin.findById(adminid)
        const places=admin.places
        res.render('userhome',{places})
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


router.patch('/user/update/:uid',async(req,res)=>{
    console.log(req.params.uid)
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

module.exports=router
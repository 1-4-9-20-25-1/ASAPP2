const express=require('express')
const User=require('../models/user')
const Admin=require('../models/admin')
const {home,login}=require('../authentication/userauth')

const router= new express.Router()

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

// router.get('/user/home',(req,res)=>{
    
// })

// router.get('/user/settings',async(req,res)=>{
    
// })

module.exports=router
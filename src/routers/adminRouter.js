const express=require('express')
const Admin=require('../models/admin')
const {home,login}=require('../authentication/auth')
const session = require('express-session')

const router= new express.Router()

//SIGNUP
router.get('/admin/signup',home,(req,res)=>{
    res.render('adminsignup')
})

router.post('/admin/signup',async (req,res)=>{
    const admin=new Admin(req.body)
    try{
        await admin.save()
        req.session.adminid=admin._id
        req.session.name=admin.name
        res.status(201).redirect("/admin/home")
    }catch(e)
    {
        res.status(400)
        console.log(e)
        res.redirect("/admin/signup")
    }
})

//LOGIN
router.get('/admin/login',home,async(req,res)=>{
    res.render('adminlogin')
})

router.post('/admin/login',async(req,res)=>{
    try{
        ({email,password}=req.body)
        const admin=await Admin.findByCredentials(email,password)
        req.session.adminid=admin._id
        req.session.name=admin.name
        res.status(200).redirect('/admin/home')
    }catch(e)
    {
        console.log(e);
        res.send("failed")
    }
})

//HOME PAGE
router.get('/admin/home',login,async(req,res)=>{
    const admin=await Admin.findOne({name:req.session.name})
    const places=admin.places
    res.render('adminhome',{places})
})

router.post('/admin/home',login,async(req,res)=>{
    try{
        const place=req.body
        const admin=await Admin.findOne({name:req.session.name})
        await admin.addPlace(place)
        res.status(201).redirect('/admin/home')
    }catch(e)
    {
        res.status(400).send(e)
    }
})

router.get('/admin/home/places',login,async(req,res)=>{
    try{
        const admin=await Admin.findOne({name:req.session.name})
        res.send(admin.places)
    }catch(e)
    {
        res.send("FAILED")
    }
})


//TEST ROUTES
router.patch('/count',async(req,res)=>{
    try{
        await Admin.updateOne({'places.name':'GYM'},{$inc:{
            'places.$.count':1}})
            console.log("updated")
            res.send("okkkk")
    }catch(e)
    {
        res.send(e)
    }
})


module.exports=router
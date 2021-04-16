const express=require('express')
const Admin=require('../models/admin')

const router= new express.Router()

//SIGNUP
router.get('/admin/signup',(req,res)=>{
    res.render('adminsignup')
})

router.post('/admin/signup',async (req,res)=>{
    const admin=new Admin(req.body)
    try{
        await admin.save()
        res.send("ok");
    }catch(e)
    {
        res.send("failed")
    }
})

//LOGIN
router.get('/admin/login',async(req,res)=>{
    res.render('adminlogin')
})

router.post('/admin/login',async(req,res)=>{
    try{
        ({email,password}=req.body)
        const admin=await Admin.findByCredentials(email,password)
        res.status(200).redirect('/admin/home')
    }catch(e)
    {
        console.log(e);
        res.send("failed")
    }
})


router.get('/admin/home',(req,res)=>{
    res.render('adminhome')
})

router.post('/admin/home',async(req,res)=>{
    console.log("good")
    const name='vit'
    try{
        const admin=await Admin.findOne({name})
        await admin.addPlace(req.body)
        res.redirect("/admin/home")
    }catch(e)
    {
        console.log(e)
        res.redirect("/admin/home")
    }
    
})


module.exports=router
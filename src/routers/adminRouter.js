const express=require('express')
const multer=require('multer')
const sharp=require('sharp')
const Admin=require('../models/admin')
const {home,login}=require('../authentication/adminauth')

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
    const admin=await Admin.findById(req.session.adminid)
    const places=admin.places
    res.render('adminhome',{places,admin,title:"Admin | Home"})
})

router.post('/admin/home',login,async(req,res)=>{
    try{
        const place=req.body
        const admin=await Admin.findById(req.session.adminid)
        await admin.addPlace(place)
        res.status(201).redirect('/admin/home')
    }catch(e)
    {
        res.status(400).send(e)
    }
})

router.get('/view/places',login,async(req,res)=>{
    try{
        const admin=await Admin.findById(req.session.adminid)
        res.send(admin.places)
    }catch(e)
    {
        res.send("FAILED")
    }
})

router.delete('/delete/places/:delid',async(req,res)=>{
    try{
        const deleted=await Admin.updateOne({'places._id':req.params.delid},{$pull:{
            'places':{"_id":req.params.delid}
        }})
        res.send(deleted)
    }
    catch(e)
    {
        console.log(e)
    }
})


//SETTINGS
router.get('/admin/settings',login,async(req,res)=>{
    try{
        const admin=await Admin.findById(req.session.adminid)
        res.render('adminsettings',{admin,title:"Admin | Settings"})
    }
    catch(e)
    {
        console.log(e)
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
//upload pic******************************************
router.post('/admin/me/avatar',upload.single('avatar'),async(req,res)=>{
    try{
        const buffer=await sharp(req.file.buffer).resize({width:128,height:128}).png().toBuffer()
        const admin=await Admin.findById(req.session.adminid)
        admin.avatar=buffer
        await admin.save()
        res.redirect('/admin/settings')
    }catch(e)
    {
        res.send(e.message)
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//get pic********************************************
router.get('/admin/:id/avatar',async(req,res)=>{
    try{
        const admin=await Admin.findById(req.params.id)
        if(!admin || !admin.avatar)
        {
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(admin.avatar)
    }catch(e)
    {
        res.status(404).send()
    }
})

//update info
router.patch('/admin/update/:uid',async(req,res)=>{
    try{
        const admin=await Admin.findByIdAndUpdate(req.params.uid,req.body,{new:true,runValidators:true})
        if(!admin)
            return res.status(404).send("ERROR")
            res.send(admin)
    }catch(e)
    {
        res.status(404).send(e)
    }
})

//update pass
router.patch('/admin/updatepass/:uid',async(req,res)=>{
    try{
        const admin=await Admin.findById(req.params.uid)
        await admin.changePassword(req.body)
        admin.save()
        res.send("UPDATED")
    }
    catch(e)
    {
        console.log(e)
        res.send("FAILED")
    }
})



//TEST ROUTES
router.patch('/count',async(req,res)=>{
    try{
        await Admin.updateOne({'places.name':'BAR'},{$inc:{
            'places.$.count':1}})
            res.send("okkkk")
    }catch(e)
    {
        res.send(e)
    }
})


module.exports=router
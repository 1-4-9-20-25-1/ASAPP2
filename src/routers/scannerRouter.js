const express=require('express')

const router= new express.Router()

router.get("/scan",async(req,res)=>{
    res.send("ok")
})




module.exports=router

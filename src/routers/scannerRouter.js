const express=require('express')

const router= new express.Router()

router.post("/scan",async(req,res)=>{
    res.send("from node");
})




module.exports=router

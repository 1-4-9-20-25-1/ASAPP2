const express=require('express')
const QR=require('../models/qr')
const router= new express.Router()

router.post("/scan",async(req,res)=>{
    try{
        const qrdata=await QR.findOne({userid:req.body.userid})
        if(qrdata && qrdata.placeid==req.body.placeid)
        {
            return res.send("GRANTED")
        }
        res.send('DENIED')
    }catch(e)
    {
        res.send("FAILED. TRY AGAIN")
    }
    
})




module.exports=router

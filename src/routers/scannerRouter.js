const express=require('express')
const QR=require('../models/qr')
const Admin=require('../models/admin')
const router= new express.Router()

router.post("/scan",async(req,res)=>{
    try{
        const qrdata=await QR.findOne({userid:req.body.userid})
        if(qrdata && qrdata.placeid==req.body.placeid)
        {
            await QR.findByIdAndUpdate(qrdata._id,{ $set: { scanned: true }})
            await Admin.updateOne({'places._id':req.body.placeid},{$inc:{
                'places.$.count':1}})
            return res.send("GRANTED")
        }
        res.send('DENIED')
    }catch(e)
    {
        res.send("FAILED. TRY AGAIN")
    }
    
})


router.post('/scannerlogin',async(req,res)=>{
    try{
        const admin=await Admin.findOne({'scanners.number':req.body.number,'places.pincode':req.body.pincode}) 
        if(admin)
        {
            const place=await Admin.findOne({'places.pincode':req.body.pincode})
            return res.send(place)
        }
        throw new Error()
    }catch(e)
    {
        res.status(404).send("Invalid")
    }
})




module.exports=router

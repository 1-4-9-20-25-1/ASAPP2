const express=require('express')
const path=require('path')
require('./db/connection')
const adminRouter=require('./routers/adminRouter')


const app=express()
const publicpath=path.join(__dirname,'../public')
app.set('view engine', 'hbs')
const port=process.env.PORT || 4444



app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(publicpath))
app.use(adminRouter)



app.get('/demo',(req,res)=>{
    res.render('demo')
})

app.listen(port, () => {
    console.log('Server is up on port '+port)
})
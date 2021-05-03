// require('dotenv').config()
require('./db/connection')
const express=require('express')
const session=require('express-session')
const expbs=require("express-handlebars")
const path=require('path')
const cors=require('cors')
const multer=require('multer')

const adminRouter=require('./routers/adminRouter')
const userRouter=require('./routers/userRouter')
const scannerRouter=require('./routers/scannerRouter')

const {colors}=require('./helpers')

const app=express()
const publicpath=path.join(__dirname,'../public')
const hbs =expbs.create({
    defaultLayout:'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    }, 
    helpers:{
        colors:colors
    }
})

app.engine('handlebars',hbs.engine)
app.set('view engine', 'handlebars')


app.use(session({
    secret:'secret key',
    resave:false,
    saveUninitialized:false
}))

app.use(cors())
app.use(express.static(publicpath))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(adminRouter)
app.use(userRouter)
app.use(scannerRouter)


const upload=multer({
    dest:'images'
})

const err=(req,res,next)=>{
    throw new Error("new error")
}

app.post('/upload',err,(req,res)=>{
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})



//LOGOUT
app.get('/logout',async(req,res)=>{
    let page=''
    if(req.session.adminid)
        page='admin'
    else if(req.session.userid)
        page='user'
    req.session.destroy()
    res.redirect(`/${page}/login`)
})

//
app.get('/',(req,res)=>{
    res.render('demo')
})

const port=process.env.PORT || 4004
app.listen(port, () => {
    console.log('Server is up on port '+port)
})
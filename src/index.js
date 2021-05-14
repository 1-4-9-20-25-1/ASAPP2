require('dotenv').config()
require('./db/connection')
const express=require('express')
const session=require('express-session')
const expbs=require("express-handlebars")
const path=require('path')
const cors=require('cors')


// IMPORTING HELPERS
const {colors}=require('./helpers')

// IMPORTING ROUTERS
const adminRouter=require('./routers/adminRouter')
const userRouter=require('./routers/userRouter')
const scannerRouter=require('./routers/scannerRouter')


// INITIALIZING APP
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

// SESSION
app.use(session({
    secret:'secret key',
    resave:false,
    saveUninitialized:false
}))

// STUFF
app.use(cors())
app.use(express.static(publicpath))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(adminRouter)
app.use(userRouter)
app.use(scannerRouter)


// COMMON ROUTES

// LOGOUT
app.get('/logout',async(req,res)=>{
    let page=''
    if(req.session.adminid)
        page='admin'
    else if(req.session.userid)
        page='user'
    req.session.destroy()
    res.redirect(`/${page}/login`)
})

// ROOT PAGE
app.get('/',(req,res)=>{
    res.render('demo')
})

const port=process.env.PORT || 4004
app.listen(port, () => {
    console.log('Server is up on port '+port)
})
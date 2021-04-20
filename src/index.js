const express=require('express')
const session=require('express-session')
const expbs=require("express-handlebars")
const path=require('path')
require('./db/connection')
const adminRouter=require('./routers/adminRouter')


const app=express()
const publicpath=path.join(__dirname,'../public')
const hbs =expbs.create({
    defaultLayout:'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    }, 
    helpers:{
        colors:function(count,cap)
        {
            if(count>=cap)
                return "danger"
            else if(count>=cap/2)
                return "warning"
            else if(count>0)
                return "success"
            else
                return "dark"
        }
    }
})

app.engine('handlebars',hbs.engine)
app.set('view engine', 'handlebars')


app.use(session({
    secret:'secret key',
    resave:false,
    saveUninitialized:false
}))

app.use(express.static(publicpath))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(adminRouter)



//LOGOUT
app.get('/logout',async(req,res)=>{
    req.session.destroy()
    res.redirect('/admin/login')
})


app.get('/',(req,res)=>{
    res.render('demo')
})

const port=process.env.PORT || 4004
app.listen(port, () => {
    console.log('Server is up on port '+port)
})
const express=require('express')
const session=require('express-session')
const path=require('path')
require('./db/connection')
const adminRouter=require('./routers/adminRouter')


const app=express()
const publicpath=path.join(__dirname,'../public')
app.set('view engine', 'hbs')

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
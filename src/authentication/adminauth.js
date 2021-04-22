const home=async(req,res,next)=>{
    if(req.session.userid){
        return res.redirect('/user/home')
    }
    else if(req.session.adminid){
        return res.redirect('/admin/home')
    }
    next()
}

const login=async(req,res,next)=>{
    if(!req.session.adminid)
    {
        return res.redirect('/admin/login')
    }
    next()
}

module.exports={login,home}
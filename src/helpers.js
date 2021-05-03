const colors=function(count,cap)
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




module.exports={colors}
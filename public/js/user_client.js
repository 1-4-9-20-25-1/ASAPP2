if(window.location.pathname==='/user/home')
{
    const abc=setInterval(function()
    {
        fetch('/user/places',{method:'GET'})
        .then(res=>{
            if(res.ok) return res.json()
            throw new Error("")
        })
        .then(res=>{
            const places=res
            if(!places || places.length===0)
                throw new Error()
            places.forEach(place => {
                const elem=document.getElementById(place._id.toString())
                const childnodes=elem.childNodes
                childnodes[3].textContent=place.count
                if(place.count>=place.capacity)
                {
                    elem.className="text-danger"
                    childnodes[5].childNodes[1].style.width="100%"
                    childnodes[5].childNodes[1].className="progress-bar progress-bar-striped bg-danger"
                }
                else if(place.count>=place.capacity/2)
                {
                    elem.className="text-warning"
                    childnodes[5].childNodes[1].style.width=`${(place.count/place.capacity)*100}%`
                    childnodes[5].childNodes[1].className="progress-bar progress-bar-striped bg-warning"
                }
                else if(place.count>0)
                {
                    elem.className="text-success"
                    childnodes[5].childNodes[1].style.width=`${(place.count/place.capacity)*100}%`
                    childnodes[5].childNodes[1].className="progress-bar progress-bar-striped bg-success"
                }
                else
                {
                    elem.className="text-dark"
                    childnodes[5].childNodes[1].style.width="0%"
                    childnodes[5].childNodes[1].className="progress-bar progress-bar-striped bg-secondary"
                }

            });
        })
        .catch(err=>{
            clearInterval(abc)
        })
    },1000)
}

const updateUserInfo=function(curLocation,curName,curEmail)
{
    const elem=document.getElementById('error')
    const lst=elem.classList

    const name=document.getElementById("username").value
    const email=document.getElementById("email").value
    const location=document.getElementById("location").value
    const data={}

    if(name==="" || email==="")
    {
        elem.innerHTML="Fields must not be empty."
        return;
    }
    if(name===curName && location===curLocation && curEmail===email)
        return;
    if(name!==curName)
        data['name']=name
    if(location!==curLocation)
        data['location']=location
    if(curEmail!==email)
        data['email']=email

    fetch("/user/update",
    {method:'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    body:JSON.stringify(data)})
    .then(res=>{
        if(res.ok)
        {
            return res.json()
        }
        throw new Error()
    }).then(res=>{
        if(res.code==1)
        {
            lst.remove("alert-danger")
            lst.add("alert-success")
            elem.innerHTML=res.msg
            setTimeout(()=>{
                window.location.reload()
            },1500)
        }else{
            lst.remove("alert-success")
            lst.add("alert-danger")
            elem.innerHTML=res.msg
        }
    }).catch(e=>{
        console.log(e)
    })
}

const updateUserPassword=function()
{
    const err=document.getElementById("passerr")

    const newpass=document.getElementById("new1").value
    const new2=document.getElementById("new2").value
    if(newpass!=new2)
    {
        err.className="alert alert-danger"
        err.textContent="New passwords don't match."
    }
    const oldpass=document.getElementById("old").value
    const data={oldpass,newpass}
    fetch("/user/updatepass",
    {
        method:'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)})
    .then(res=>{
        if(res.ok)
        { 
            return res.json()
        }
        else
            throw new Error()
    }).then(res=>{
        if(res.code===1)
            err.className="alert alert-success"
        else
            err.className="alert alert-danger"
        
        err.textContent=res.msg
    })
    .catch(e=>{
        window.alert("TRY AGAIN")
    })
}

const deleteUser=function(id)
{
    const res=window.confirm("Please click OK to DELETE your account.")
    if(!res)
        return;
    fetch(`/user/delete/${id}`,{method:'DELETE'})
    .then(res=>{
        if(res.ok){
            window.location.reload()
        }else{
            window.alert("TRY AGAIN.")
        }
    }).catch(e)
    {
        console.log(e)
    }
    
}


const genreateQrcode=function(id,name)
{
    const data={id,name}
    fetch("/generate/qrcode",
    {
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)})
    .then(res=>{
        if(res.ok)
            window.location.reload()
        else
            window.alert("Try again.")
    })    
}

const deleteQrcode=function(id)
{
    console.log(id)
    fetch(`/delete/qrcode/${id}`,{method:'delete'})
    .then(res=>{
        if(res.ok){
            window.location.reload()
        }else{
            window.alert("TRY AGAIN.")
        }
    }).catch(e=>{
        console.log(e)
    }) 
}







if(window.location.pathname === '/user/home')
{
    const item=document.getElementById('dashboarditem')
    item.className="sidebar-item active"
}

if(window.location.pathname === '/user/settings')
{
    const item=document.getElementById('settingsitem')
    item.className="sidebar-item active"
}
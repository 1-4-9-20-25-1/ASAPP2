
// admin home--fetching places
if(window.location.pathname==='/admin/home')
{
    setInterval(function()
    {
        fetch('/view/places',{method:'GET'})
        .then(res=>{
            if(res.ok) return res.json()
            throw new Error("FAILEIN CLIENT SIDE")
        })
        .then(res=>{
            const places=res
            places.forEach(place => {
               if(place.open)
               {
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
               }
            });
        })
        .catch(err=>{
            console.log(err)
        })
    },1000)
}

const addPlace=function()
{
    const name=document.getElementById('name').value
    const capacity=document.getElementById('capacity').value
    const pincode=document.getElementById('pincode').value
    const data={name,capacity,pincode}
    fetch('/admin/home',{
        method:"POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body:JSON.stringify(data)
    }).then(res=>{
        if(res.ok) return res.json()
        throw new Error()
    }).then(res=>{
        if(res.err)
        {
            const elem=document.getElementById("pinerr")
            elem.textContent="Pincode already exists. Choose a different one."
        }else{
            window.location.reload()
        }
    }).catch(e=>{
        window.alert("try again")
    })
}

const changePlaceStatus=function(id,b){
    var status= (b=="true")
    fetch(`/updatestatus/${id}`,
    {method:"POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body:JSON.stringify({status})
    }).then(res=>{
        if(res.ok)  return window.location.reload();
        throw new Error()
    }).catch(e=>{
        window.alert("TRY AGAIN")
    })
}

const addMessage=function(id)
{
    const info=document.getElementById("message-text").value
    fetch(`/addplaceinfo/${id}`,
    {method:"POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body:JSON.stringify({info})
}).then(res=>{
    if(!res.ok)throw new Error()
}).catch(e=>{
    window.alert("try again")
})

}

const deleteplace=function(id)
{
    fetch(`/delete/places/${id}`,{method:"DELETE"})
    .then(res=>{
        if(res.ok) window.location.reload()
        else
            throw new Error("FAILED TO DELETE")
    }).catch(e=>{
        console.log(e)
    })
}

const updateInfo=function(id,mail,username)
{
    const name=document.getElementById("username").value
    const email=document.getElementById("email").value
    const data={}
    if(mail===email && name==username)
        return;
    if(mail!==email)
        data['email']=email
    if(username!=name)
        data['name']=name;
    
    fetch(`/admin/update/${id}`,
    {method:'PATCH',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    body:JSON.stringify(data)})
    .then(res=>{
        if(res.status==200)
        {
            return res.json()
        }
        throw new Error()
    }).then(res=>{
        const elem=document.getElementById('mailerr')
        const lst=elem.classList
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

const updatepass=function(id)
{
    const newpass=document.getElementById("new1").value
    const new2=document.getElementById("new2").value
    const err=document.getElementById("passerr")
    const lst=err.classList
    if(newpass!=new2)
    {
        err.textContent="New passwords did not match."
        return;
    }
    const oldpass=document.getElementById("old").value
    const data={oldpass,newpass}
    fetch(`/admin/updatepass/${id}`,
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
        throw new Error("error")
    })
    .then(res=>{
        if(res.code===1)
        {
            lst.remove("alert-danger")
            lst.add("alert-success")
            err.textContent=res.msg
        }else{
            lst.remove("alert-success")
            lst.add("alert-danger")
            err.textContent=res.msg
        }
    })
    .catch(e=>{
        console.log(e)
    })
}

const deleteAccount=function(id)
{
    const res=window.confirm("Please click OK to DELETE your account.")
    if(!res)
        return;
    fetch(`/admin/delete/${id}`,{method:'DELETE'})
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

const addNumber=function()
{
    const e=document.getElementById("numerr")
    const lst=e.classList
    var phoneno = /^\d{10}$/;
    const number=document.getElementById('number').value
    if(!number.match(phoneno))
    {
        e.innerHTML="Not a valid number."
        return;
    }
    fetch('/addnumber',{
    method:'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body:JSON.stringify({number})})
    .then(res=>{
        if(res.ok) return res.json()
        else throw new Error()
    }).then(res=>{
        if(res.code==1)
        {
            lst.remove("alert-danger");
            lst.add("alert-success");
            e.textContent=res.msg
            setTimeout(()=>{
                window.location.reload()
            },1500)
        }
        else{
            lst.remove("alert-success")
            lst.add("alert-danger")
            e.textContent=res.msg
        }
    }).catch(e=>{
        window.alert('TRY AGAIN')
    })

}

const deleteNumber=function(id)
{
    fetch(`/deletenumber/${id}`,{method:"DELETE"})
    .then(res=>{
        if(res.ok) window.location.reload()
        else
            throw new Error("FAILED TO DELETE")
    }).catch(e=>{
        console.log(e)
    })
}




if(window.location.pathname === '/admin/home')
{
    const item=document.getElementById('dashboarditem')
    item.className="sidebar-item active"
}

if(window.location.pathname === '/admin/settings')
{
    const item=document.getElementById('settingsitem')
    item.className="sidebar-item active"
}


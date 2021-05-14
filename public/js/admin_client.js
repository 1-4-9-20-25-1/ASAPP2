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
            console.log(err)
        })
    },1000)
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

const updateone=function(id)
{
    const name=document.getElementById("username").value
    const email=document.getElementById("email").value
    const data={name,email}
    fetch(`/admin/update/${id}`,
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
        throw new Error("error")
    }).then(res=>{
        window.location.reload()
    }).catch(e=>{
        console.log(e)
    })
}

const updatepass=function(id)
{
    const newpass=document.getElementById("new1").value
    const new2=document.getElementById("new2").value
    if(newpass!=new2)
    {
        const err=document.getElementById("msgpass")
        err.className="alert alert-danger"
        err.textContent="New passwords did not match."
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
            const done=document.getElementById("msgpass")
            done.className="alert alert-success"
            done.textContent="Update successfully."
        }
        else
            throw new Error("error")
    })
    .catch(e=>{
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



//EXTRA
const incbtn=document.getElementById("inc")
if(incbtn!=null)
{
    incbtn.addEventListener('click',()=>{
        fetch('/count',{method:'PATCH'})
        .then(res=>{
            console.log(res)
            if(res.ok)
                return res.json()
            throw new Error("FAILED");
        })
        .then(res=>{
            console.log(res.data)
        })
        .catch(e=>{
            console.log(e)
        })
    })
}


//== in main page for colour
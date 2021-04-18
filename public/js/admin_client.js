// admin home--fetching places
if(window.location.pathname==='/admin/home')
{
    setInterval(function()
    {
        fetch('/admin/home/places',{method:'GET'})
        .then(res=>{
            if(res.ok) return res.json()
            throw new Error("FAILEIN CLIENT SIDE")
        })
        .then(res=>{
            const places=res
            places.forEach(place => {
                const elem=document.getElementById(place._id.toString())
                elem.textContent=place.count;
                if(place.count==place.capacity)
                    elem.className="text-danger"
                else if(place.count>place.capacity/2)
                    elem.className="text-warning"
                else if(place.count>0)
                    elem.className="text-success"
                else
                    elem.className="text-dark"
            });
        })
        .catch(err=>{
            console.log(err)
        })
    },1000)
}


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

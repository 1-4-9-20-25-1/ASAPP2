if(window.location.pathname==='/user/home')
{
    setInterval(function()
    {
        fetch('/user/places',{method:'GET'})
        .then(res=>{
            if(res.ok) return res.json()
            throw new Error("FAILED IN CLIENT SIDE")
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

            });
        })
        .catch(err=>{
            console.log(err)
        })
    },1000)
}
const socket = io();

const msgForm = document.querySelector("#message-form");
const msgInput = msgForm.querySelector("input");
const sendMessageBtn = msgForm.querySelector("button");
const sendLocation = document.querySelector("#send-location");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector("#sidebar");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
// const locationLink = document.querySelector("#location");
const locationTemplate = document.querySelector("#location-template").innerHTML;


const {userName,room} = Qs.parse(location.search,{ ignoreQueryPrefix : true })


msgForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    sendMessageBtn.setAttribute("disabled","disabled");

    const msg =e.target.elements.message.value;
    // socket.emit("sendMessage",msg,(message)=>{
    //     console.log("Message has been "+message)


    socket.emit("sendMessage",msg,(error)=>{
        
        sendMessageBtn.removeAttribute("disabled");
        msgInput.value="";
        msgInput.focus();

        if(error)
            return console.log(error)
        console.log("Message has been Delivered")

    });
})
// socket.on("updatedCount",(count )=>{
//     console.log(`Count has been updated to - ${count}`)
// })
socket.on("message",({userName,text,createdAt})=>{
    
    const html = Mustache.render(messageTemplate,{
        userName:userName,
        message:text,
        timeStamp:moment(createdAt).format("h:mm A"),
    });
    messages.insertAdjacentHTML("beforeend",html);
})

sendLocation.addEventListener("click",()=>{
    sendLocation.setAttribute("disabled","disabled");

   if( !navigator.geolocation)
   {
        return alert("Geolocation Not Supported by your browser");
   }
   navigator.geolocation.getCurrentPosition((position)=>{
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        socket.emit("sendLocation",{latitude,longitude},()=>{

            sendLocation.removeAttribute("disabled");

            console.log("Location Shared")
        })
   })
})


socket.on("sendLocationMessage",({userName,text,createdAt})=>{
    // console.log(`Location : ${location}`)
    const htmlLocation = Mustache.render(locationTemplate,{
        userName:userName,
        loc:text,
        time:moment(createdAt).format("h:mm A"),
    });
    messages.insertAdjacentHTML("beforeend",htmlLocation);
})


socket.on("roomUsersData",({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        users:users,
        room:room,
    })
    sidebar.innerHTML(html);
})


socket.emit("join",{userName,room},(error)=>{
    if(error)
    {
        alert(error)
        location.href = "/"
    }
})


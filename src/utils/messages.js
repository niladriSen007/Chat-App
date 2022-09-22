const generateMessage = (userName,text) =>{
    return{
        userName,
        text,
        createdAt:new Date().getTime(),
    }
}

const generateLocationMessage = (userName,url) =>{
    return{
        userName,
        text:url,
        createdAt:new Date().getTime(),
    }
}

export {generateMessage,generateLocationMessage}
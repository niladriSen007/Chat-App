const users=[];

const addUser = ({id,userName,room})=>{
    userName = userName.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!userName || !room)
    {
        return{
            error:"User Name or Room can't be empty!!"
        }
    }

    const existingUser = users.find((user)=>{
        return user.room === room && user.userName === userName
    })

    if(existingUser)
    {
        return{
            error:"Username already taken"
        }
    }

    const user = {id,userName,room};
    users.push(user);
    return {user}
}



const removeUser = (id) =>{
    const index = users.findIndex((user)=>id === user.id)
    if(index !== -1)
        return users.splice(index,1)[0];
}

const getUser = id =>{
    const user = users.find(user=>user.id === id)
    if(user)
        return {id:user.id,userName:user.userName,room:user.room}
    return undefined
}


const getUsersInRoom = room =>{
    room = room.trim().toLowerCase();
    const usersInRoom =users.filter(user=>user.room === room)
    return usersInRoom;
}


export {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
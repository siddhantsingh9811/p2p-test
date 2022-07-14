import { v4 as uuidv4 } from 'uuid';
class MyPeer{
  constructor(){
    this.peer = new Peer();
    this.connections = [];
    this.messages = [];
    this.peer.on('open', id=>{
      console.log("my id is", id);
      this.id = id;
    })
    this.peer.on('connection', conn=>{
      this.newConnection(conn);
      console.log("SOMEONE CONNECTED")
      console.log(this.connections);
    })

    document.addEventListener('message',(e)=>{
      console.log(e.detail.peer,": ",e.detail.message);
      if(!this.messages.includes(JSON.stringify(e.detail))){
        this.messages.push(JSON.stringify(e.detail));
        this.connections.forEach(conn => {
          if(conn.peer != e.detail.peer){
            conn.sendData(e.detail);
            console.log("propagated data");
          }
        })
      }
      console.log("MESSAGES",this.messages);
      console.log("MESSAGE",e.detail);
    })
  }
  newConnection(conn){
    this.connections.push(new MyConnection(conn));
  }
  createNewConnection(id){
    let conn = this.peer.connect(id);
    this.newConnection(conn); 
    console.log("connection created");
  }
  sendMessage(message){
    let data = {
      id:uuidv4(),
      type: "message",
      peer:this.id,
      message: message
    }
    const messageEvent = new CustomEvent('message',{detail:data})
    document.dispatchEvent(messageEvent);
  }
}
// const createMessageEvent= (peer,message)=>{
//   const event = new CustomEvent('messageRecieved', {
//     detail:{
//       peer: peer,
//       message: message
//     }
//   })
//   document.dispatchEvent(event);
// }
class MyConnection{
  constructor(conn){
    this.conn = conn;
    this.peer = conn.peer;
    
    this.conn.on('data', data=>{
      data = JSON.parse(data);
      // console.log(this.peer,":",data.message) noOOOO
      // what a message looks like
      // data = {
      //   id:uuidv4(),
      //   type: type,
      //   peer:peer_id,
      //   message: message
      // }
      if(data.type == "message"){
        const messageEvent = new CustomEvent('message',{detail:data})
        document.dispatchEvent(messageEvent);
      }
    })
  }
  sendData(data){
    data = JSON.stringify(data);
    this.conn.send(data);
  }
}

let peerConnection = new MyPeer;

let yourid = document.getElementById("userid");
peerConnection.peer.on('open',id=>{
  yourid.innerHTML = `<span>${peerConnection.id}</span>`;
})

let connectButton = document.getElementById("connect")
connectButton.addEventListener('click', connect);
function connect(){
  let id = document.getElementById("peerid").value;
  peerConnection.createNewConnection(id);
  
}

let sendButton = document.getElementById("send");
sendButton.addEventListener('click',sendMessage);
function sendMessage(){
  let message = document.getElementById("message");
  if(message.value != null){
    peerConnection.sendMessage(message.value);
  }
}
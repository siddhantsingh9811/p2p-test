let peer = new Peer();
let myId = "loading";
var conn = null;

peer.on('open',id=>{
  console.log(id);
  let yourid = document.getElementById("userid");
  yourid.innerHTML = `<span>${id}</span>`;
  myId = id;
});

let connectButton = document.getElementById("connect")
connectButton.addEventListener('click', connect);

function connect(){
  let peerId = document.getElementById("peerid").value;
  // console.log(text);
  conn = peer.connect(peerId);
  conn.on('open', function(){
    showMessage("CONNECTION SUCCESSFUL")
  }); 
  ready();
}
function showMessage(data){
  let ul = document.getElementById("messages");
  let li = document.createElement("li");
  li.appendChild(document.createTextNode(data));
  ul.appendChild(li);
}
peer.on('connection', function(connection) {
  showMessage("SOMEONE JUST CONNECTED "+connection.peer);
  // connection.on('data', function(data){
  //   console.log(data);
  //   showMessage(data);   
  // });
  conn = connection;
  ready();
});
function ready(){
  conn.on('data', function(data){
    console.log(data);
    showMessage(data);   
  })
  conn.on('close', function(){
    showMessage("yeah he gon")
  })
}
let sendButton = document.getElementById("send");
sendButton.addEventListener('click',sendMessage);
function sendMessage(){
  let message = document.getElementById("message");
  if(message.value != null){
    conn.send(message.value);
  }
  message.value = null;
}
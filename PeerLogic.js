export class MyPeer{
    constructor(){
        this.peerObject = new Peer();
        this.peerObject.on('open',id=>{
            this.id = id;
        })
        this.connections = [];
    }
    getId(){
        return this.id;
    }
}

import EventEmitter from "events";
import { io } from "socket.io-client";

export class SocketAPI extends EventEmitter{
    io: any;
    PlayoutBee: any;
    constructor(url: string,PlayoutBee:any){
    super();
    this.io = io(url);
    this.PlayoutBee = PlayoutBee;
    this.io.on("connect", () => {
        this.PlayoutBee.log("info", "Connected to PlayoutBee");
        this.PlayoutBee.updateStatus("ok", "Connected to PlayoutBee");
    })
    this.io.on("disconnect", () => {
        this.PlayoutBee.log("info", "Disconnected from PlayoutBee");
        this.PlayoutBee.updateStatus("disconnected", "Disconnected from PlayoutBee");
    })
    this.io.on("update",(player:any)=>{
        this.PlayoutBee.player = player;
        this.PlayoutBee.checkFeedbacks("selectedClip","stopped","paused","playing");
        this.PlayoutBee.updateVariables();
    })
    this.io.on("updateTimecode",(timecode:any)=>{
        this.PlayoutBee.updateTimecode(timecode);
    })
    }
}
import { InstanceBase, InstanceStatus, runEntrypoint, SomeCompanionConfigField, combineRgb,CompanionVariableValues } from '@companion-module/base'
import { PlayoutBeeConfig } from './config'
import { SocketAPI } from './socket'
import axios from 'axios';
import { sToTime } from './util';
import {PlayoutBeePresets} from './presets'
class PlayoutBee extends InstanceBase<PlayoutBeeConfig> {
    io: any
    player: any
    config: PlayoutBeeConfig = {}
    init(config: PlayoutBeeConfig): Promise<void> {
        this.config = config;
        this.io = new SocketAPI("http://"+config.host+":"+config.port,this);
        this.updateActions()
        this.updateFeedbacks()
        this.updateVariables()
        this.updatePresets()
        return Promise.resolve()
    }
    destroy(): Promise<void> {
        this.io.io.disconnect()
        delete this.io;
        return Promise.resolve()
    }
    configUpdated(config: PlayoutBeeConfig): Promise<void> {
        this.log("info", "Config updated" +config)
        this.config = config;
        this.io =new SocketAPI("http://"+config.host+":"+config.port,this);
        return Promise.resolve()
    }
    getConfigFields(): SomeCompanionConfigField[] {
        return [{
            	type: 'textinput',
            	id: 'host',
            	label: 'Target IP',
            	width: 12,
            },{
            	type: 'textinput',
            	id: 'port',
            	label: 'Target Port',
            	width: 6,
            }]
    }   
    constructor(internal: unknown) {
		super(internal)
        this.log("error","constructor")
        
        
        this.
        updateStatus(InstanceStatus.Connecting, "connecting")
	}
    remainingtimecode(){
        if(this.player.assets != undefined && this.player.assets.length != 0){
        let currentAsset = this.player.assets[this.player.currentAsset];
        return (currentAsset.outPoint - (this.player.timecode+currentAsset.inPoint)) >= 0 ? (currentAsset.outPoint - (this.player.timecode+currentAsset.inPoint)) : 0;
        }else{
            return(0)
        }
    }
    updateActions(): void {
        this.setActionDefinitions({
            "play": {
                name: "Play",
                options: [],
                callback: () => {
                    this.callAPI("/api/play")
                }
            },
            "pause": {
                name: "Pause",
                options: [],
                callback: () => {
                    this.callAPI("/api/pause")
                }
            },
            "stop": {
                name: "Stop",
                options: [],
                callback: () => {
                    this.callAPI("/api/stop")
                }
            },
            "next": {
                name: "Next",
                options: [],
                callback: () => {
                    this.callAPI("/api/next")
                }
            },
            "previous": {
                name: "Previous",
                options: [],
                callback: () => {
                    this.callAPI("/api/prev")
                }
            },
            "select": {
                name: "Select Clip",
                options: [{
                    type: "textinput",
                    id: "clip",
                    label: "Clip ID",
                    default: "0",
                    required: true,

                }],
                callback: async (action) => {
                    var id = await this.parseVariablesInString(action.options.clip?.toString() || "0" )
                    this.callAPI("/api/select/"+id)
                }
            },
            "goto": {
                name: "Go to",
                description: "Go to a specific time in ms",
                options: [{
                    type: "number",
                    id: "time",
                    label: "Time",
                    default: 0,
                    required: true,
                    min: 0,
                    max: 999999,
                }],
                callback: (action) => {
                    this.callAPI("/api/goto/"+action.options.time)
                }
            },
            "last": {
                name: "Go to last ",
                description: "Go to the point in time with x ms left",
                options: [{
                    type: "number",
                    id: "time",
                    label: "Time",
                    default: 0,
                    required: true,
                    min: 0,
                    max: 999999,
                }],
                callback: (action) => {
                    this.callAPI("/api/last/"+action.options.time)
                }
            },
            "setAction":{
                name: "Set Action of Asset",
                description: "Set the action of the Asset",
                options: [{
                    type: "textinput",
                    id: "clip",
                    label: "Clip",
                    default: "0",
                    regex: "/(current)*\d*(next)*(prev)*/g",
                    required: true,
                },
                {
                    type: "dropdown",
                    id: "action",
                    label: "Action",
                    default: "true",
                    choices: [{id:"0",label:"pause"},{id:"1",label:"playNext"},{id:"2",label:"next"},{id:"3",label:"loop"},{id:"4",label:"reset"}],
                }
            ],
            callback: async (action) => {
                this.callAPI("/api/asset/"+ action.options.clip+"/action/"+action.options.action)
            }
            },
            
            "rotate":{
                name: "Set Rotation of Asset",
                description: "Set the Rotation of the Asset",
                options: [{
                    type: "textinput",
                    id: "clip",
                    label: "Clip",
                    default: "0",
                    regex: "/(current)*\d*(next)*(prev)*/g",
                    required: true,
                },
                {
                    type: "dropdown",
                    id: "rotation",
                    label: "Rotation",
                    default: "0",
                    choices: [{id:"0",label:"0"},{id:"90",label:"90"},{id:"180",label:"180"},{id:"270",label:"270"},{id:"360",label:"360"}],
                }
            ],
            callback: async (action) => {
                this.callAPI("/api/asset/"+ action.options.clip+"/rotate/"+action.options.rotation)
            }
            },
            "volume":{
                name: "Set Volume of Asset",
                description: "Set the Rotation of the Asset",
                options: [{
                    type: "textinput",
                    id: "clip",
                    label: "Clip",
                    default: "0",
                    regex: "/(current)*\d*(next)*(prev)*/g",
                    required: true,
                },
                {
                    type: "textinput",
                    id: "volume",
                    label: "Volume",
                    default: "0",
                }
            ],
            callback: async (action) => {
                this.callAPI("/api/asset/"+ action.options.clip+"/volume/"+action.options.volume)
            }
            }


            })
    }
    updateFeedbacks(): void {	
        this.setFeedbackDefinitions({
            "playing": {
                type: "boolean",
                name: "Playing",
                description: "If the player is playing",
                options: [],
                defaultStyle:  {color: combineRgb(255,255,255), bgcolor: combineRgb(0,255,0)},
                callback: () => {
                    return this.player ?  this.player.state === 0 : false
                }
            },
            "paused": {
                type: "boolean",
                name: "Paused",
                description: "If the player is paused",
                options: [],
                defaultStyle:  {color: combineRgb(255,255,255), bgcolor: combineRgb(0,255,0)},
                callback: () => {
                    return this.player ? this.player.state === 1 : false
                }
            },
            "stopped": {
                type: "boolean",
                name: "Stopped",
                description: "If the player is stopped",
                options: [],
                defaultStyle:  {color: combineRgb(255,255,255), bgcolor: combineRgb(0,255,0)},
                callback: () => {
                    return this.player ?this.player.state === 2 : false
                }
            },
            "selectedClip": {
                type: "boolean",
                name: "Selected Clip",
                description: "If the selected clip is the one specified",
                options: [{
                    type: "number",
                    id: "clip",
                    label: "Clip ID",
                    default: 0,
                    required: true,
                    min: 0,
                    max: 9999,
                }],
                defaultStyle:  {color: combineRgb(255,255,255), bgcolor: combineRgb(0,255,0)},
                callback: (feedback) => {
                    
                    return this.player ? parseInt(this.player.currentAsset) === feedback.options.clip : false
                }
            },
            "ClipAction": {
                type: "boolean",
                name: "Action of Clip",
                description: "If the selected clip is the one specified",
                options: [{
                    type: "textinput",
                    id: "assetID",
                    label: "Asset ID",
                    default: "0",
                    required: true,
                },{
                    type: "dropdown",
                    id: "action",
                    label: "Action",
                    default: "true",
                    choices: [{id:"0",label:"pause"},{id:"1",label:"playNext"},{id:"2",label:"next"},{id:"3",label:"loop"},{id:"4",label:"reset"}],
                }],
                defaultStyle:  {color: combineRgb(255,255,255), bgcolor: combineRgb(0,255,0)},
                callback: (feedback) => {
                    let id:string = feedback.options.assetID as string;
                    return this.player ? this.player.assets[id].action === feedback.options.action : false
                }
            }

        })
    }
    updateVariables(): void {
        if(this.player){
           let variables= [];
           for(let i = 0; i < this.player.assets.length; i++){
                variables.push({
                    variableId: "asset_name_"+i,
                     label: "asset_name_"+i,
                     name: "asset_name_"+i
                })
              }
              variables.push({
                variableId: "state",
                label: "current Status of the player",
                name: "state"
                    })
            variables.push({
                variableId: "currentAsset",
                label: "current Asset",
                name: "currentAsset"
                    })
            variables.push({
                variableId: "currentAssetName",
                label: "current Asset Name",
                name: "currentAssetName"
            })
            variables.push({
                variableId: "timecode",
                label: "current Timecode",
                name: "currentTimecode"
            })
            variables.push({
                variableId: "timecode_hh",
                label: "Hour of the timecode",
                name: "hour"
            })
            variables.push({
                variableId: "timecode_mm",
                label: "Minute of the timecode",
                name: "minute"
            })
            variables.push({
                variableId: "timecode_ss",
                label: "Second of the timecode",
                name: "second"
            })
            variables.push({
                variableId: "timecode_ms",
                label: "Milisecond of the timecode",
                name: "milisecond"
            })
            variables.push({
                variableId: "remainingTimecode",
                label: "Timecode",
                name: "remainingTimecode"
            })
            variables.push({
                variableId: "remainingTimecode_hh",
                label: "Hour of the timecode",
                name: "remainingHour"
            })
            variables.push({
                variableId: "remainingTimecode_mm",
                label: "Minute of the timecode",
                name: "remainingMinute"
            })
            variables.push({
                variableId: "remainingTimecode_ss",
                label: "Second of the timecode",
                name: "remainingSecond"
            })
            variables.push({
                variableId: "remainingTimecode_ms",
                label: "Milisecond of the timecode",
                name: "remainingMilisecond"
            })
            console.log("variables")
              this.setVariableDefinitions(variables)
              let values: CompanionVariableValues = {};
              for(let i = 0; i < this.player.assets.length; i++){
                values["asset_name_"+i] = this.player.assets[i].name;

                }
                values["state"] = this.player.state;
                values["currentAsset"] = this.player.currentAsset;
                values["currentAssetName"] = this.player.assets[this.player.currentAsset].name;
               this.updateTimecode(this.player.timecode)
                this.setVariableValues(values)

        }
            
       
            }
        updateTimecode(timecode:number){
            this.player.timecode = timecode;
            let values: CompanionVariableValues = {};
                //get the timecode and split it into hours, minutes, seconds and frames
                let calcs = sToTime(timecode)
                values["timecode"] = calcs.timecode;
                values["timecode_hh"] = calcs.hours;
                values["timecode_mm"] = calcs.minutes;
                values["timecode_ss"] = calcs.seconds;
                values["timecode_ms"] = calcs.frames;
                
                //get the remaining timecode and split it into hours, minutes, seconds and frames
            	calcs = sToTime(this.remainingtimecode())
                values["remainingTimecode"] = calcs.timecode;
                values["remainingTimecode_hh"] = calcs.hours;
                values["remainingTimecode_mm"] = calcs.minutes;
                values["remainingTimecode_ss"] = calcs.seconds;
                values["remainingTimecode_ms"] = calcs.frames;
                this.setVariableValues(values)
        }

    callAPI(url:string){
        console.log("callAPI",url)
        axios.get("http://"+this.config.host+":"+this.config.port+url).then((res) => {
            this.log("info",res.data)
        }).catch((err) => {
            this.log("error",err)
            console.log(err)
        })
    }
    updatePresets(){
        this.setPresetDefinitions(PlayoutBeePresets);
    }
}


runEntrypoint(PlayoutBee, [])
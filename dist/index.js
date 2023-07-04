"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("@companion-module/base");
const socket_1 = require("./socket");
const axios_1 = __importDefault(require("axios"));
const util_1 = require("./util");
const presets_1 = require("./presets");
class PlayoutBee extends base_1.InstanceBase {
    io;
    player;
    config = {};
    init(config) {
        this.config = config;
        this.io = new socket_1.SocketAPI("http://" + config.host + ":" + config.port, this);
        this.updateActions();
        this.updateFeedbacks();
        this.updateVariables();
        this.updatePresets();
        return Promise.resolve();
    }
    destroy() {
        this.io.io.disconnect();
        delete this.io;
        return Promise.resolve();
    }
    configUpdated(config) {
        this.log("info", "Config updated" + config);
        this.config = config;
        this.io = new socket_1.SocketAPI("http://" + config.host + ":" + config.port, this);
        return Promise.resolve();
    }
    getConfigFields() {
        return [{
                type: 'textinput',
                id: 'host',
                label: 'Target IP',
                width: 12,
            }, {
                type: 'textinput',
                id: 'port',
                label: 'Target Port',
                width: 6,
            }];
    }
    constructor(internal) {
        super(internal);
        this.log("error", "constructor");
        this.
            updateStatus(base_1.InstanceStatus.Connecting, "connecting");
    }
    updateActions() {
        this.setActionDefinitions({
            "play": {
                name: "Play",
                options: [],
                callback: () => {
                    this.callAPI("/api/play");
                }
            },
            "pause": {
                name: "Pause",
                options: [],
                callback: () => {
                    this.callAPI("/api/pause");
                }
            },
            "stop": {
                name: "Stop",
                options: [],
                callback: () => {
                    this.callAPI("/api/stop");
                }
            },
            "next": {
                name: "Next",
                options: [],
                callback: () => {
                    this.callAPI("/api/next");
                }
            },
            "previous": {
                name: "Previous",
                options: [],
                callback: () => {
                    this.callAPI("/api/prev");
                }
            },
            "select": {
                name: "Select Clip",
                options: [{
                        type: "number",
                        id: "clip",
                        label: "Clip ID",
                        default: 0,
                        required: true,
                        min: 0,
                        max: 9999,
                    }],
                callback: (action) => {
                    this.callAPI("/api/select/" + action.options.clip);
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
                    this.callAPI("/api/goto/" + action.options.time);
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
                    this.callAPI("/api/last/" + action.options.time);
                }
            },
        });
    }
    updateFeedbacks() {
        this.setFeedbackDefinitions({
            "playing": {
                type: "boolean",
                name: "Playing",
                description: "If the player is playing",
                options: [],
                defaultStyle: { color: (0, base_1.combineRgb)(255, 255, 255), bgcolor: (0, base_1.combineRgb)(0, 255, 0) },
                callback: () => {
                    return this.player ? this.player.state === 0 : false;
                }
            },
            "paused": {
                type: "boolean",
                name: "Paused",
                description: "If the player is paused",
                options: [],
                defaultStyle: { color: (0, base_1.combineRgb)(255, 255, 255), bgcolor: (0, base_1.combineRgb)(0, 255, 0) },
                callback: () => {
                    return this.player ? this.player.state === 1 : false;
                }
            },
            "stopped": {
                type: "boolean",
                name: "Stopped",
                description: "If the player is stopped",
                options: [],
                defaultStyle: { color: (0, base_1.combineRgb)(255, 255, 255), bgcolor: (0, base_1.combineRgb)(0, 255, 0) },
                callback: () => {
                    return this.player ? this.player.state === 2 : false;
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
                defaultStyle: { color: (0, base_1.combineRgb)(255, 255, 255), bgcolor: (0, base_1.combineRgb)(0, 255, 0) },
                callback: (feedback) => {
                    return this.player ? this.player.currentAsset === feedback.options.clip : false;
                }
            },
        });
    }
    updateVariables() {
        if (this.player) {
            let variables = [];
            for (let i = 0; i < this.player.assets.length; i++) {
                variables.push({
                    variableId: "asset_name_" + i,
                    label: "asset_name_" + i,
                    name: "asset_name_" + i
                });
            }
            variables.push({
                variableId: "state",
                label: "current Status of the player",
                name: "state"
            });
            variables.push({
                variableId: "currentAsset",
                label: "current Asset",
                name: "currentAsset"
            });
            variables.push({
                variableId: "currentAssetName",
                label: "current Asset Name",
                name: "currentAssetName"
            });
            variables.push({
                variableId: "timecode",
                label: "current Timecode",
                name: "currentTimecode"
            });
            variables.push({
                variableId: "timecode_hh",
                label: "Hour of the timecode",
                name: "hour"
            });
            variables.push({
                variableId: "timecode_mm",
                label: "Minute of the timecode",
                name: "minute"
            });
            variables.push({
                variableId: "timecode_ss",
                label: "Second of the timecode",
                name: "second"
            });
            variables.push({
                variableId: "timecode_ms",
                label: "Milisecond of the timecode",
                name: "milisecond"
            });
            this.setVariableDefinitions(variables);
            let values = {};
            for (let i = 0; i < this.player.assets.length; i++) {
                values["asset_name_" + i] = this.player.assets[i].name;
            }
            values["state"] = this.player.state;
            values["currentAsset"] = this.player.currentAsset;
            values["currentAssetName"] = this.player.assets[this.player.currentAsset].name;
            this.updateTimecode(this.player.timecode);
            this.setVariableValues(values);
        }
    }
    updateTimecode(timecode) {
        let values = {};
        //get the timecode and split it into hours, minutes, seconds and frames
        let calcs = (0, util_1.sToTime)(timecode);
        values["timecode"] = calcs.timecode;
        values["timecode_hh"] = calcs.hours;
        values["timecode_mm"] = calcs.minutes;
        values["timecode_ss"] = calcs.seconds;
        values["timecode_ms"] = calcs.frames;
        this.setVariableValues(values);
    }
    callAPI(url) {
        axios_1.default.get("http://" + this.config.host + ":" + this.config.port + url).then((res) => {
            this.log("info", res.data);
        }).catch((err) => {
            this.log("error", err);
        });
    }
    updatePresets() {
        this.setPresetDefinitions(presets_1.PlayoutBeePresets);
    }
}
(0, base_1.runEntrypoint)(PlayoutBee, []);
//# sourceMappingURL=index.js.map
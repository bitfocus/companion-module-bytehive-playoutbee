"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketAPI = void 0;
const events_1 = __importDefault(require("events"));
const socket_io_client_1 = require("socket.io-client");
class SocketAPI extends events_1.default {
    io;
    PlayoutBee;
    constructor(url, PlayoutBee) {
        super();
        this.io = (0, socket_io_client_1.io)(url);
        this.PlayoutBee = PlayoutBee;
        this.io.on("connect", () => {
            this.PlayoutBee.log("info", "Connected to PlayoutBee");
            this.PlayoutBee.updateStatus("ok", "Connected to PlayoutBee");
        });
        this.io.on("disconnect", () => {
            this.PlayoutBee.log("info", "Disconnected from PlayoutBee");
            this.PlayoutBee.updateStatus("disconnected", "Disconnected from PlayoutBee");
        });
        this.io.on("update", (player) => {
            this.PlayoutBee.player = player;
            this.PlayoutBee.checkFeedbacks("selectedClip", "stopped", "paused", "playing", "ClipAction");
            this.PlayoutBee.updateVariables();
        });
        this.io.on("updateTimecode", (timecode) => {
            this.PlayoutBee.updateTimecode(timecode);
        });
    }
}
exports.SocketAPI = SocketAPI;
//# sourceMappingURL=socket.js.map
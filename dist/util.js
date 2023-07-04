"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sToTime = void 0;
function sToTime(s) {
    return (msToTime(s * 1000));
}
exports.sToTime = sToTime;
function msToTime(ms) {
    let fps = 30;
    let frames = Math.round(ms / 1000 * fps) % fps;
    let seconds = Math.round(ms / 1000) % 60;
    let minutes = Math.round(ms / (1000 * 60)) % 60;
    let hours = Math.round(ms / (1000 * 60 * 60)) % 24;
    let Stringhours = (hours < 10) ? "0" + hours : hours;
    let Stringminutes = (minutes < 10) ? "0" + minutes : minutes;
    let Stringseconds = (seconds < 10) ? "0" + seconds : seconds;
    let Stringframes = (frames < 10) ? "0" + frames : frames;
    return { hours: Stringhours, minutes: Stringminutes, seconds: Stringseconds, frames: Stringframes, timecode: Stringhours + ":" + Stringminutes + ":" + Stringseconds + ":" + Stringframes };
}
//# sourceMappingURL=util.js.map
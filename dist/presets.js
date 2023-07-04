"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayoutBeePresets = void 0;
exports.PlayoutBeePresets = {};
//add Butttons for Transport
exports.PlayoutBeePresets["play"] = {
    name: "Play",
    category: "Transport",
    type: "button",
    style: {
        text: "Play",
        size: "auto",
        color: 16777215,
        bgcolor: 0,
        alignment: "center:center"
    },
    feedbacks: [{ feedbackId: "playing", options: {}, style: { bgcolor: 0x00ff00 } }],
    steps: [{ down: [{ actionId: "play", options: {} }], up: [] }]
};
exports.PlayoutBeePresets["pause"] = {
    name: "Pause",
    category: "Transport",
    type: "button",
    style: {
        text: "Pause",
        size: "auto",
        color: 16777215,
        bgcolor: 0,
        alignment: "center:center"
    },
    feedbacks: [{ feedbackId: "paused", options: {}, style: { bgcolor: 0x00ff00 } }],
    steps: [{ down: [{ actionId: "pause", options: {} }], up: [] }]
};
exports.PlayoutBeePresets["stop"] = {
    name: "Stop",
    category: "Transport",
    type: "button",
    style: {
        text: "Stop",
        size: "auto",
        color: 16777215,
        bgcolor: 0,
        alignment: "center:center"
    },
    feedbacks: [{ feedbackId: "stopped", options: {}, style: { bgcolor: 0x00ff00 } }],
    steps: [{ down: [{ actionId: "stop", options: {} }], up: [] }]
};
//add Buttons for Clip Selection
for (let i = 0; i < 50; i++) {
    exports.PlayoutBeePresets["select_" + i] = {
        name: "Select Clip " + i,
        category: "Clips",
        type: "button",
        style: {
            text: "$(playoutbee:asset_name_" + i + ")	 ",
            size: "auto",
            color: 16777215,
            bgcolor: 0,
            alignment: "center:center"
        },
        previewStyle: {
            text: "Clip " + i,
            size: "auto",
            color: 16777215,
            bgcolor: 0,
            alignment: "center:center"
        },
        feedbacks: [{ feedbackId: "selectedClip", options: { clip: i }, style: { bgcolor: 0x00ff00 } }],
        steps: [{ down: [{ actionId: "select", options: { clip: i } }], up: [] }]
    };
}
//# sourceMappingURL=presets.js.map
const {
    contextBridge,
    ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld(
    "contextBridgeApi", {
        send: (channel, data) => {
            let validChannels = ['trafficlight-channel', 'export-profiles-channel'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ['error-channel'];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        invoke: (channel, args) => {
            let validChannels = ['duplex-profiles-channel'];
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, args);
}}});

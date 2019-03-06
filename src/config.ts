import { Red, Node, NodeProperties } from "node-red";
import TwitchJs from "twitch-js";

export interface TwitchJsClientConfig extends NodeProperties {
    name: string;
    username: string;
    token: string;
    clientId: string;
}
export interface TwitchJsClientNode extends Node {
    twitchjs: TwitchJs;
}

module.exports = function (RED: Red) {
    function TwitchJsClient(this: TwitchJsClientNode, config: TwitchJsClientConfig) {
        RED.nodes.createNode(this, config);
        this.twitchjs = new TwitchJs({
            username: config.username,
            token: config.token,
            clientId: config.clientId,
            log: {
                level: 0
            }
        })
        this.on("close", () => {
            this.twitchjs.chat.removeAllListeners();
            this.twitchjs.chat.disconnect();
        })
    }
    RED.nodes.registerType("twitchjs-config", TwitchJsClient);
};

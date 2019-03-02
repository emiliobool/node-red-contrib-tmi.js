import { Red, Node, NodeProperties } from "node-red";
import TwitchJs from "twitch-js";

export interface TwitchJsClientConfig extends NodeProperties {
  username: string;
  token: string;
  clientId: string;
}
export interface TwitchJsClientNode extends Node {
  twitchjs: TwitchJs;
}

let twitchjs: TwitchJs;

module.exports = function(RED: Red) {
  function TwitchJsClient(
    this: TwitchJsClientNode,
    config: TwitchJsClientConfig
  ) {
    RED.nodes.createNode(this, config);
    if (twitchjs) {
      twitchjs.chat.removeAllListeners();
      twitchjs.chat.disconnect();
    }
    this.twitchjs = new TwitchJs({
      token: config.token,
      clientId: config.clientId,
      username: config.username
    });
    twitchjs = this.twitchjs;
  }
  RED.nodes.registerType("twitchjs-client", TwitchJsClient);
};

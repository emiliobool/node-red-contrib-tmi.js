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

interface TwitchJsInstances{
    [key :string]: TwitchJs
}
let twitchjs_instances: TwitchJsInstances = {};

module.exports = function(RED: Red) {
  function TwitchJsClient(
    this: TwitchJsClientNode,
    config: TwitchJsClientConfig
  ) {
    RED.nodes.createNode(this, config);
    if (twitchjs_instances[this.id]) {
        twitchjs_instances[this.id].chat.removeAllListeners();
        twitchjs_instances[this.id].chat.disconnect();
        delete twitchjs_instances[this.id]
    }
    this.twitchjs = new TwitchJs({
      token: config.token,
      clientId: config.clientId,
      username: config.username
    })
    twitchjs_instances[this.id] = this.twitchjs
  }
  RED.nodes.registerType("twitchjs-client", TwitchJsClient);
};

import { Red, NodeProperties, Node } from "node-red";
import { TwitchJsClientNode } from "./config";
// import TwitchJs from "twitch-js";
const TwitchJs = require("twitch-js")

interface TwitchJsCommandConfig extends NodeProperties {
  client: string;
  topic: string;
  payload: string;
  auto: boolean;
}
enum CommandMsgType {
  None = "None",
  Payload = "Payload",
  Topic = "Topic"
}
enum CommandTypes {
  connect = "connect",
  disconnect = "disconnect",
  reconnect = "reconnect",
  send = "send",
  join = "join",
  part = "part",
  broadcast = "broadcast",
  say = "say",
  whisper = "whisper"
}

function stringify(payload: any) {
  if (typeof payload === "string") {
    return payload;
  } else {
    return JSON.stringify(payload);
  }
}
module.exports = function(RED: Red) {
  function registerType(command: CommandTypes, msgType: CommandMsgType) {
    function node(this: Node, config: TwitchJsCommandConfig): void {
      RED.nodes.createNode(this, config);
      const clientNode = RED.nodes.getNode(config.client) as TwitchJsClientNode;
      const chat = clientNode.twitchjs.chat
      let input = (msg: any) => {
        let args: any[] = [];
        if (msgType === CommandMsgType.Payload) {
          let payload = stringify(msg.payload || config.payload);
          args = [payload];
        } else if (msgType === CommandMsgType.Topic) {
          let payload = stringify(msg.payload || config.payload);
          let topic = msg.topic || config.topic;
          args = [topic, payload];
        }
        let returnValue: any = chat[command as string].apply(chat, args);
        Promise.resolve(returnValue)
            .then(payload => this.send({ payload }))
            .catch(this.error);
      }
      this.on("input", input);
      if (command === "join") {
          if(config.auto){
            chat.on(TwitchJs.ChatConstants.EVENTS.CONNECTED, () => input({}))
          }
      }else if(command === "connect"){
          if(config.auto){
            chat.connect()
          }
      }
    }
    RED.nodes.registerType(`twitchjs-${command}`, node);
  }

  registerType(CommandTypes.connect, CommandMsgType.None);
  registerType(CommandTypes.disconnect, CommandMsgType.None);
  registerType(CommandTypes.reconnect, CommandMsgType.None);
  registerType(CommandTypes.send, CommandMsgType.Payload); // raw message
  registerType(CommandTypes.join, CommandMsgType.Payload); //
  registerType(CommandTypes.part, CommandMsgType.Payload);
  registerType(CommandTypes.broadcast, CommandMsgType.Payload);
  registerType(CommandTypes.say, CommandMsgType.Topic);
  registerType(CommandTypes.whisper, CommandMsgType.Topic);
};

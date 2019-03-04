import { Red, NodeProperties, Node } from "node-red";
import { TwitchJsClientNode } from "./config";
const TwitchJs = require("twitch-js")

export interface TwitchJsEventConfig extends NodeProperties {
    client: string;
    event: string;
    filter_active: boolean;
    filter_type: "AND" | "OR";
    filter_channel: string;
    filter_username: string;
    filter_command: string;
    filter_message: string;
    filter_timestamp: string;
    filter_raw: string;
}
interface Filter{
    prop: string;
    regex: RegExp;
}

module.exports = function(RED: Red) {
    function TwitchJsEvent(this: Node, config: TwitchJsEventConfig) {
        RED.nodes.createNode(this, config);
        const clientNode = RED.nodes.getNode(config.client) as TwitchJsClientNode;
        const filters:Filter[] = [];
        let filtering = config.filter_active
        for(let key in config){
            if(key.startsWith("filter_")){
                let filter = (config as any)[key]
                if(filter){
                    let prop = key.split("_")[1]
                    if(prop === "active" || prop === "type") continue
                    if(prop === "raw") prop = "_raw"
                    filters.push({ prop: prop, regex: new RegExp(filter)})
                }
            }
        }
        // this.log(JSON.stringify(clientNode))
        clientNode.twitchjs.chat.on(TwitchJs.ChatConstants.EVENTS[config.event], payload => {
            if(filtering){
                if(config.filter_type === "OR"){
                    if(filters.some((filter: any) => payload[filter.prop] && payload[filter.prop].match(filter.regex))){
                        this.send({ payload })
                    }
                }else{
                    if(filters.every((filter: any) => payload[filter.prop] && payload[filter.prop].match(filter.regex))){
                        this.send({ payload })
                    }
                }
            }else{
                this.send({ payload })
            }
        })
    }
    RED.nodes.registerType("twitchjs-event", TwitchJsEvent);
}
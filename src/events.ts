import { Red, NodeProperties, Node } from "node-red";
import { TwitchJsClientNode } from "./config";
const TwitchJs = require("twitch-js")

export interface TwitchJsEventConfig extends NodeProperties {
    name: string;
    client: string;
    event: string;
    [key: string]: string | boolean;
    filter_active: boolean;
    filter_type: string;
    filter_channel: string;
    filter_username: string;
    filter_command: string;
    filter_message: string;
    filter_timestamp: string;
    filter_raw: string;
}

module.exports = function(RED: Red) {
    function TwitchJsEvent(this: Node, config: TwitchJsEventConfig) {
        RED.nodes.createNode(this, config);
        const clientNode = RED.nodes.getNode(config.client) as TwitchJsClientNode;
        const filters:any = [];
        let filtering = config.filter_active
        for(let key in config){
            if(key.startsWith("filter_")){
                let filter = config[key]
                if(filter){
                    let prop = key.split("_")[1]
                    if(prop === "active" || prop === "type") continue
                    if(prop === "raw") prop = "_raw"
                    filters.push({ prop: prop, regex: new RegExp(filter as string)})
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
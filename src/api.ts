import { Red, NodeProperties, Node } from "node-red";
import { TwitchJsClientNode } from "./config";
import { FetchOptions } from "twitch-js/utils/fetch";

export interface TwitchJsAPIConfig extends NodeProperties {
    client: string;
    method: string;
    topic: string;
    payload: string;
}

module.exports = function(RED: Red) {
    function TwitchJsAPI(this: Node, config: TwitchJsAPIConfig) {
        RED.nodes.createNode(this, config);
        const clientNode = RED.nodes.getNode(config.client) as TwitchJsClientNode;
        this.on("input", msg => {
            let method = (msg.method || config.method).toLowerCase()
            let topic = msg.topic || config.topic
            let payload = msg.payload || config.payload || {}
            let options:FetchOptions = { method }
            if(method === "get"){
                options.search = payload
            }else if(method === "post" || method === "put"){
                options.body = payload
            }
            options.headers = msg.headers || {}
            // this.log(JSON.stringify(clientNode.twitchjs.api.options))
            clientNode.twitchjs.api.get(topic, options)
                .then(payload => this.send({ payload }))
                .catch(error => this.error(JSON.stringify(error)))
        })
    }
    RED.nodes.registerType("twitchjs-api", TwitchJsAPI);
}
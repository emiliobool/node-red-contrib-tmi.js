import { Red, NodeProperties, Node } from "node-red";
import { TwitchJsClientNode } from "./config";
const TwitchJs = require("twitch-js");

interface TwitchJsCommandConfig extends NodeProperties {
    client: string;
    name: string;
    channels: string;
    users: string;
    isRegular: boolean;
    isMod: boolean;
    isSub: boolean;
    isBroadcaster: boolean; // true
    badges: string; // admin, bits/100000, broadcaster/1, global_mod/1, moderator/1, subscriber/12,
    //staff/1, turbo/1, vip/1, twitchcon2018/1, partner/1, bitsLeader/1, bitsCharity/1
    // sub-gifter/1, premium/1
    badgesType: "ALL" | "ANY"; // default any
    rawFilter: string; // color=#6441A4
    command: string;
}

module.exports = function (RED: Red) {
    function TwitchJsCommand(this: Node, config: TwitchJsCommandConfig) {
        RED.nodes.createNode(this, config);
        const clientNode = RED.nodes.getNode(config.client) as TwitchJsClientNode;
        const channels = config.channels.split(",").map(channel => channel.trim()).filter(channel => channel);
        const users = config.users.split(",").map(user => user.trim()).filter(user => user);
        const badges = config.badges.split(",").map(badge => badge.trim()).filter(badge => badge);
        const badgesRegExp = /@badges=([^;]);/;
        const rawFilterRegExp = new RegExp(config.rawFilter)
        clientNode.twitchjs.chat.on(TwitchJs.ChatConstants.EVENTS.PRIVATE_MESSAGE, event => {
            // check if command is present first
            if (event.message.toLowerCase().startsWith(config.command)) {
                // check for channels
                if (!channels.length || channels.includes(event.channel)) {
                    // check for users
                    if (!users.length || users.includes(event.username)) {
                        // check for user type
                        if (!users.length || users.includes(event.username)) {
                            const userTypeCondition = (config.isRegular && (!event.tags.mod && !event.tags.badges.subscriber && !event.tags.badges.broadcaster)) ||
                                (config.isMod && event.tags.mod) == true ||
                                (config.isSub && event.tags.badges.subscriber) == true ||
                                (config.isBroadcaster && event.tags.badges.broadcaster) == true

                            if (userTypeCondition) {
                                // check for badges
                                let badgesCondition = true;
                                if (badges.length) {
                                    let messageBadges = event._raw.match(badgesRegExp)[1];
                                    if (config.badgesType === "ALL") {
                                        badgesCondition = badges.every(badge => messageBadges.includes(badge))
                                    } else {
                                        badgesCondition = badges.some(badge => messageBadges.includes(badge))
                                    }
                                }
                                if (badgesCondition) {
                                    if (event._raw.match(rawFilterRegExp)) {
                                        this.send({ payload: event })
                                    }
                                }

                            }
                        }
                    }
                }
                // broadcaster is also mod
                // isAdmin
                // should parse the command and verify if it is valid for the command
                // check for: channel, is mod? is subscriber months, sub tier, mod status, vip, broadcaster, username
                // hours, currency?
            }
        });
    }
    RED.nodes.registerType("twitchjs-command", TwitchJsCommand);
};

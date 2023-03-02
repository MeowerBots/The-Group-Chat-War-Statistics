// @ts-nocheck
import Bot from "meowerbot";
import * as dotenv from "dotenv";
import { exit } from "node:process";
import * as fs from "fs";

dotenv.config();

const chats: string[] = [
    "282440ad-1976-4102-81c7-ecbffa9db1cb", // Meowchat
    "076c9677-1b2a-4530-a44f-0e54f4a02daa", // Add Everyone
    "38c851a6-1d49-4daa-8ec5-8595e3a0a505", // Shmidts
    "23476d7d-3201-4c24-af18-887d2de1e3d7" // Meower Sings
];

const username = process.env["TGCWS_USERNAME"];
const password = process.env["TGCWS_PASSWORD"];
const bot = new Bot(username, password);

bot.onMessage((data) => {
    let data_json: Object = JSON.parse(data.toString());
    let members: Object[] = [];
    let quote: string = "";

    if (data_json.val.mode == "chats") {
        fs.appendFile("README.md", `### ${new Date()}`, () => { return; });

        for(let i in data_json.val.payload.all_chats) {
            if (chats.includes(data_json.val.payload.all_chats[i]._id)) {
                members[i] = JSON.parse(`{ "nickname": "${data_json.val.payload.all_chats[i].nickname}", "count": ${data_json.val.payload.all_chats[i].members.length} }`);
            }
        }

        for(let i in members) {
            if (i == members.length - 1) {
                quote = `${quote}, and ${members[i].nickname} has ${members[i].count} users added!`;
            } else if (i == 0) {
                quote = `${members[i].nickname} has ${members[i].count} users added`;
            } else {
                quote = `${quote}, ${members[i].nickname} has ${members[i].count} users added`;
            }
        }
        
        fs.appendFile("README.md", quote, () => { return; });

        bot.send(JSON.stringify({
            "cmd": "direct",
		    "val": {
                "cmd": "update_config",
                "val": {
                    "quote": quote
			    }
            }
        }));

        exit(0);
    }
});

bot.onLogin(() => {
    bot.send(JSON.stringify({
		"cmd": "direct",
			"val": {
				"cmd": "get_chat_list",
				"val": {
					"page": 1
				},
			}
    }));
});

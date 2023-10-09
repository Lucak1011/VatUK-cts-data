import { browserInit, browserKill, getMonth } from "./index.js";
import fs from "fs";
await browserInit();

let data: any = [];
for (let year = 2006; year <= new Date().getFullYear(); year++) {
	for (let month = 1; month <= 12; month++) {
		console.log(`Getting data for ${year}-${month}, data length: ${data.length}`);
		data = [...data, ...(await getMonth(year, month))];
	}
}
await browserKill();
console.log(data.length);

fs.writeFileSync("../dist/raw/data.json", JSON.stringify(data, null, 4));

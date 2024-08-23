import { dumpToCsv } from "./csv.js";
import { browserInit, browserKill, getMonth } from "./index.js";

await browserInit();

let data: any = [];
for (let year = 2006; year <= new Date().getFullYear(); year++) {
	for (let month = 1; month <= 12; month++) {
		console.log(`Getting data for ${year}-${month}`);
		const data = await getMonth(year, month);
		if (data.length === 0) {
			console.log(`No data for ${year}-${month}`);
			continue;
		}
		dumpToCsv(data, `./data/${year}-${month}.csv`);
		console.log(`Data saved to ./data/${year}-${month}.csv`);
	}
}
await browserKill();

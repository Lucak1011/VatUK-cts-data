import { dumpToCsv } from "./csv.js";
import { browserInit, browserKill, getMonth } from "./index.js";

// get node system arguments
const args = process.argv.slice(2);

console.log(args[0]);

if (!args[0].match(/^\d{4}-\d{2}$/)) {
	console.error('Please provide year and month as arguments in the format "YYYY-MM", npm ... 2021-01');
	process.exit(1);
}

console.log("Fetching data for", args[0]);
const [year, month] = args[0].split("-").map(Number);

await browserInit();
const newData = await getMonth(year, month);
await browserKill();

dumpToCsv(newData, `./data/${year}-${month}.csv`);
console.log("Data saved to", `./data/${year}-${month}.csv`);

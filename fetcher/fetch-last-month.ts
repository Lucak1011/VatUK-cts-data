import { dumpToCsv } from "./csv.js";
import { browserInit, browserKill, getMonth } from "./index.js";

await browserInit();
console.log(new Date().getFullYear(), new Date().getMonth());
const newData = await getMonth(new Date().getFullYear(), new Date().getMonth());
await browserKill();

console.log(newData.length);
console.log(newData);
dumpToCsv(newData, `./data/${new Date().getFullYear()}-${new Date().getMonth()}.csv`);

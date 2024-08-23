import { dumpToCsv } from "./csv.js";
import { browserInit, browserKill, getMonth } from "./index.js";

await browserInit();
const newData = await getMonth(new Date().getFullYear(), new Date().getMonth());
await browserKill();

dumpToCsv(newData, `./data/${new Date().getFullYear()}-${new Date().getMonth()}.csv`);

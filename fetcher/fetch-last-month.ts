import { browserInit, browserKill, getMonth } from "./index.js";
import { DB } from "./db.js";

await browserInit();
console.log(new Date().getFullYear(), new Date().getMonth());
const newData = await getMonth(new Date().getFullYear(), new Date().getMonth());
await browserKill();

console.log(newData.length);
await DB.appendData(newData);

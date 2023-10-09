import fs from "fs";
import { browserInit, browserKill, getMonth } from "./index.js";

await browserInit();
console.log(new Date().getFullYear(), new Date().getMonth());
const newData = await getMonth(new Date().getFullYear(), new Date().getMonth());
await browserKill();

console.log(newData.length);

fs.writeFileSync("../dist/raw/data.json", JSON.stringify(newData, null, 4));

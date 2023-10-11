import fs from "fs";
import { browserInit, browserKill, getMonth } from "./index.js";

await browserInit();
console.log(new Date().getFullYear(), new Date().getMonth());
const newData = await getMonth(new Date().getFullYear(), new Date().getMonth());
await browserKill();

fs.writeFileSync("./dist/raw/data.json", JSON.stringify([...JSON.parse(fs.readFileSync("./dist/raw/data.json").toString()), ...newData], null, 4));

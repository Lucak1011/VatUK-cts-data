import { browserInit, browserKill, getMonth } from ".";

const currentData = await Bun.file("./data.json").json();

await browserInit();
console.log(new Date().getFullYear(), new Date().getMonth());
const newData = await getMonth(new Date().getFullYear(), new Date().getMonth());
await browserKill();

console.log(newData.length);

Bun.write("../dist/raw/data.json", JSON.stringify(newData, null, 4));

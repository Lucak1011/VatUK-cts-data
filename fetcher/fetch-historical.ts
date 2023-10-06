import { browserInit, browserKill, getMonth } from ".";

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

Bun.write("../dist/raw/data.json", JSON.stringify(data, null, 4));

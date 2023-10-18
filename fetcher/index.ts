import puppeteer from "puppeteer";
import { BaseBookingOptions, Booking, MentoringBookingOptions, bookingTypes } from "../types.js";
import { DB } from "./db.js";

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();

export async function browserInit() {
	await page.goto("https://cts.vatsim.uk/bookings/calendar.php");
	await page.click("#filter_old");
	await page.click("input[value='Show me selected bookings only']");
}

export async function browserKill() {
	await browser.close();
}

export async function getMonth(year: number, month: number): Promise<(BaseBookingOptions | MentoringBookingOptions)[]> {
	await page.goto(`https://cts.vatsim.uk/bookings/calendar.php?year=${year}&month=${month}`);

	let weeks = await page.$$(".cal_grid");
	weeks = await weeks[0].$$("tbody");
	weeks = await weeks[0].$$("tr");

	weeks.shift();
	weeks.pop();

	let data = [];

	for (const week of weeks) {
		const days = await week.$$("td");
		for (const day of days) {
			const bookings = await day.$$("a");
			bookings.shift();

			for (const booking of bookings) {
				let onMouseOver = await booking.evaluate((el) => el.getAttribute("onmouseover"));

				if (onMouseOver) {
					onMouseOver = onMouseOver.replace("overlib(", "");
					onMouseOver = onMouseOver.replace(");", "");

					onMouseOver = onMouseOver.replace(/<br \/>/g, " ");
					onMouseOver = onMouseOver.replace(/<[^>]*>/g, "");

					const bookingType = onMouseOver.match(/Booking Type: (.*) Position:/)?.[1];
					const baseData: BaseBookingOptions = {
						id: parseInt((await booking.evaluate((el) => el.getAttribute("href")))?.match(/cb=(\d+)/)?.[1] ?? "-1"),
						type: bookingType as keyof typeof bookingTypes,
						position: onMouseOver?.match(/Position: (.*) Date:/)?.[1] ?? "",
						bookedBy: {
							name: onMouseOver?.match(/Booked By: ([^\(]*)/)?.[1]?.trim() ?? "",
							cid: parseInt((onMouseOver.match(/Booked By: ([A-Za-z\s]+) \((\d+)\)/) ?? [])[2] ?? "-1"),
						},
						startTime: Booking.booktimeToDate(
							`${onMouseOver?.match(/Date: (.*) Book Time:/)?.[1] ?? ""} ${onMouseOver?.match(/Book Time: (.*) -/)?.[1] ?? ""}`
						),
						endTime: Booking.booktimeToDate(
							`${onMouseOver?.match(/Date: (.*) Book Time:/)?.[1] ?? ""} ${onMouseOver?.match(/Book Time: .* - (.*)/)?.[1] ?? ""}`
						),
					};

					let finalData: BaseBookingOptions | MentoringBookingOptions = baseData;
					switch (bookingType) {
						case bookingTypes.Mentoring: {
							finalData = {
								...baseData,
								bookedOn: Booking.timestampToDate(onMouseOver.match(/Date requested: (.*) Mentor:/)?.[1] ?? ""),
								requestedOn: Booking.timestampToDate(onMouseOver.match(/Date requested: (.*) Mentor:/)?.[1] ?? ""),
								mentor: {
									name: onMouseOver.match(/Mentor: ([^\(]*)/)?.[1].trim() ?? "",
									cid: parseInt(onMouseOver.match(/Mentor: .* \((.*)\)/)?.[1] ?? "-1"),
								},
								acceptedOn: Booking.timestampToDate(onMouseOver.match(/Accepted on: (.*)/)?.[1] ?? ""),
							};
							break;
						}
					}
					data.push(finalData);
				}
			}
		}
	}

	return data;
}

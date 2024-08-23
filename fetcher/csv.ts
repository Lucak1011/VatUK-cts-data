import { BaseBookingOptions, bookingTypes, MentoringBookingOptions } from "../types.js";
import fs from "fs";

export function dumpToCsv(bookings: (BaseBookingOptions | MentoringBookingOptions)[], path: string) {
	// header is id, url, type, position, bookedBy.name, bookedBy.cid, startTime, endTime, bookedOn, requestedOn, mentor.name, mentor.cid, acceptedOn
	let csvString =
		"id,url,type,position,bookedBy (name),bookedBy (cid),startTime,endTime,bookedOn,requestedOn,mentor (name),mentor (cid),acceptedOn\n";

	for (const booking of bookings) {
		if ((booking as MentoringBookingOptions).mentor) {
			const mB = booking as MentoringBookingOptions;
			csvString += `${mB.id},${mB.url},${bookingTypes.Mentoring},${mB.position},${mB.bookedBy.name},${mB.bookedBy.cid},${JSON.stringify(
				mB.startTime
			)},${JSON.stringify(mB.endTime)},${JSON.stringify(mB.bookedOn)},${JSON.stringify(mB.requestedOn)},${mB.mentor.name},${
				mB.mentor.cid
			},${JSON.stringify(mB.acceptedOn)}\n`;
		} else {
			const bB = booking as BaseBookingOptions;
			csvString += `${bB.id},${bB.url},${bB.type},${bB.position},${bB.bookedBy.name},${bB.bookedBy.cid},${JSON.stringify(
				bB.startTime
			)},${JSON.stringify(bB.endTime)},,,,\n`;
		}
	}

	// create the file if it doesn't exist
	fs.writeFileSync(path, csvString);
}

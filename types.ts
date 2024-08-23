export const bookingTypes = {
	Mentoring: "Confirmed mentoring session",
	Exam: "Practical exam",
	Position: "Position booking",
	Event: "Event booking",
};

interface VatsimUser {
	name: string;
	cid: number;
}

export interface BaseBookingOptions {
	id: number;
	url: string;
	type: keyof typeof bookingTypes;
	position: string;
	bookedBy: VatsimUser;
	startTime: Date;
	endTime: Date;
}

export interface MentoringBookingOptions extends BaseBookingOptions {
	bookedOn: Date;
	requestedOn: Date;
	mentor: VatsimUser;
	acceptedOn: Date;
}

export class Booking {
	static booktimeToDate(date: string): Date {
		// Sun 1st Oct 2023 08:30 -> Date, time is in Zulu
		const dateArray = date.split(" ");
		const day = parseInt(dateArray[1].replace(/\D/g, ""));
		const month = new Date(Date.parse(dateArray[2] + " 1, 2012")).getMonth();
		const year = parseInt(dateArray[3]);
		const hours = parseInt(dateArray[4].split(":")[0]);
		const minutes = parseInt(dateArray[4].split(":")[1]);

		const dateObj = new Date(Date.UTC(year, month, day, hours, minutes));

		if (isNaN(dateObj.getTime())) {
			return new Date(0);
		}

		return dateObj;
	}

	static timestampToDate(timestamp: string): Date {
		// 18/09/2023 18:14:27  -> Date
		const dateArray = timestamp.split(" ");
		const date = dateArray[0].split("/");
		const time = dateArray[1].split(":");
		const day = parseInt(date[0]);
		const month = parseInt(date[1]);
		const year = parseInt(date[2]);
		const hours = parseInt(time[0]);
		const minutes = parseInt(time[1]);
		const seconds = parseInt(time[2]);

		const dateObj = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

		if (isNaN(dateObj.getTime())) {
			return new Date(0);
		}

		return dateObj;
	}
}

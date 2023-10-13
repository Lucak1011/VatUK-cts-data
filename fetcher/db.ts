import env from "dotenv";
import { MongoClient } from "mongodb";
import { BaseBookingOptions } from "../types.js";

export class DB {
	private static uri = "";
	private static async getCredentials(): Promise<void> {
		if (!process.env.MONGO_USER || !process.env.MONGO_PASSWORD || !process.env.MONGO_ADDRESS) {
			env.config();
		}

		this.uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ADDRESS}:27017/cts?directConnection=true&serverSelectionTimeoutMS=5000`;
	}

	static async appendData(data: BaseBookingOptions[]) {
		if (this.uri === "") await this.getCredentials();
		if (data.length === 0) return;
		const client = new MongoClient(this.uri);

		await client.connect();

		const database = client.db("cts");
		const collection = database.collection("bookings");

		for (const booking of data) {
			await collection.updateOne(
				{ startTime: booking.startTime, endTime: booking.endTime, position: booking.position },
				{ $set: booking },
				{ upsert: true }
			);
		}

		await client.close();
	}

	static async overwrite(data: BaseBookingOptions[]) {
		if (this.uri === "") await this.getCredentials();
		if (data.length === 0) return;
		const client = new MongoClient(this.uri);

		await client.connect();

		const database = client.db("cts");
		const collection = database.collection("bookings");
		await collection.deleteMany({});
		await collection.insertMany(data);

		await client.close();
	}
}

await DB.appendData([]);

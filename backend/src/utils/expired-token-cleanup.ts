import cron from "node-cron";
import Users from "../models/user-model";
import type { Model } from "mongoose";
import type { IUser } from "../types/user";

const expiredTokenCleanup = (model: Model<IUser>, field: keyof IUser, fieldExpiry: keyof IUser) => {
  cron.schedule("9 * * * * * *", async () => {
		try {
			const result = await model.updateMany(
			 {
				 [fieldExpiry]: { $lte: Date.now() },
			 },
			 {
				 $unset: {
					 [field]: 1,
					 [fieldExpiry]: 1,
				 },
			 }
		 );

		 if(result.modifiedCount > 0) console.log(`Modified ${result.modifiedCount} document${result.modifiedCount !== 1 ? "s" : ""}.`);
		  
		} catch (error) {
			console.error(`Error during ${field} cleanup:`, error);
		}
  });
};

export default expiredTokenCleanup;

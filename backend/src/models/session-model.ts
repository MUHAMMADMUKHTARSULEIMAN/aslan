import { Schema, model, Document } from "mongoose";

export interface ISession extends Document {
  _id: string;
  expires: Date;
  session: string;
}

const sessionSchema = new Schema<ISession>(
  {
    _id: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    session: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const Sessions = model<ISession>("Session", sessionSchema);
export default Sessions;

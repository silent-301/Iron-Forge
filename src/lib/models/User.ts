import { Document } from "../local-db";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  avatar?: string;
}

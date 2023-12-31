import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { createNewToken } from "../../utils/token";
import { UserProps } from "./User.types";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please inform your name"],
      minLength: [1, "Name must be at least 1 characters length"],
      maxLength: [50, "Name must be less than 50 characters length"],
    },
    email: {
      type: String,
      required: [true, "Please inform an email"],
      minLength: [5, "Email must be at least 5 characters length"],
      maxLength: [50, "Email must be less than 50 characters length"],
      unique: true,
    },
    quota: {
      type: Number,
      required: true,
    },
    sended: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
    },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        delete returnedObject.loginCount;
        delete returnedObject.updatedAt;
        delete returnedObject.createdAt;
        delete returnedObject.lastLoginIP;
      },
    },
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("email")) {
    return next();
  }
  const token = await createNewToken(this?.email || "");
  this.token = token;
  next();
});

UserSchema.plugin(mongoosePaginate);

UserSchema.path("email").validate(
  async (email: string) => {
    const emailRegex = new RegExp("[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]{2,3}");
    return emailRegex.test(email);
  },
  "This email is invalid",
  "INVALID"
);

UserSchema.path("email").validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  "This email is already registered!",
  "DUPLICATED"
);

export const User = mongoose.model<UserProps, mongoose.PaginateModel<UserProps>>("User", UserSchema);

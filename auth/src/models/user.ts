import mongoose from "mongoose";
import { toHash } from "../utils/password";

interface UserAttr {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface UserDoc extends mongoose.Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface UserModal extends mongoose.Model<UserDoc> {
  build: (userDoc: UserAttr) => UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      }
    }
  }
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.set("password", toHash(this.password));
  }
});

userSchema.statics.build = function (userDoc: UserAttr): UserDoc {
  return new User(userDoc);
};

export const User = mongoose.model<UserDoc, UserModal>("User", userSchema);

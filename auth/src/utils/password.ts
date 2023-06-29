import { scryptSync, randomBytes } from "crypto";

export const toHash = (password: string) => {
  const salt = randomBytes(8).toString("hex");
  const buf = scryptSync(password, salt, 64);

  return `${buf.toString("hex")}.${salt}`;
};

export const compare = (storedPassword: string, suppliedPassword: string) => {
  const [hashedPassword, salt] = storedPassword.split(".");
  const buf = scryptSync(suppliedPassword, salt, 64);

  return buf.toString("hex") === hashedPassword;
};

import bcrypt from "bcrypt";
import { SALT } from "../constant";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = SALT || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePasswords = async (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

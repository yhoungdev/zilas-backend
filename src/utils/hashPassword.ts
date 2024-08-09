import { hash, compare } from "bcrypt";
import { SALT } from "../constant";

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
};

export const comparePasswords = async (
  hashedPassword: string,
  providedPassword: string,
): Promise<boolean> => {
  const isMatch = await compare(providedPassword, hashedPassword);
  return isMatch;
};

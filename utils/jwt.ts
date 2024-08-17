import jsonwebtoken from "jsonwebtoken";
import { JWT_HASH } from "../constant";

interface IData {
  id: string;
  username?: string;
  email?: string;
}

export const signJwt = (data: IData) => {
  //@ts-ignore
  const token = jsonwebtoken.sign(data, JWT_HASH, { expiresIn: "1d" });
  return token;
};

export const decodeJwt = (token: string): IData | null => {
  try {
    //@ts-ignore
    const decoded = jsonwebtoken.verify(token, JWT_HASH) as unknown as IData;
    return decoded;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
};

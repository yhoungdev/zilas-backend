import type { JwtPayload } from "jsonwebtoken";
interface IExtendJwtPayload extends JwtPayload {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: IExtendJwtPayload;
}

export type { IExtendJwtPayload };

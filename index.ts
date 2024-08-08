import express, { type Request, type Response } from "express";
import cors from "cors";
import { ROUTES_CONSTANT } from "./src/constant/routeConstant";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "server for zilas project" });
});

ROUTES_CONSTANT.map((_) => {
  //@ts-ignore
  app.use("/api/v1", _.route);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express, { type Request, type Response } from "express";
import cors from "cors";
import { ROUTES_CONSTANT } from "./src/constant/routeConstant";

const PORT = process.env.PORT || 3000;
const app = express();

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsConfig));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "server for zilas project" });
});

ROUTES_CONSTANT.forEach((routeConfig) => {
  if (routeConfig.route) {
    //@ts-ignore
    app.use(`/api/v1/`, routeConfig.route);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

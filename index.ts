import express, { type Request, type Response } from "express";
import cors from "cors";
import { ROUTES_CONSTANT } from "./src/constant/routeConstant";
const PORT = process.env.PORT || 3000;
import env from "dotenv";
const app = express();
app.use(express.json());
import { prismaInstance } from "./utils/prisma";

env.config();

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

app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).json({ message: "server for zilas project" });
});

ROUTES_CONSTANT.forEach((routeConfig) => {
  if (routeConfig.route) {
    //@ts-ignore
    app.use(`/api/v1/`, routeConfig.route);
  }
});

const logError = (error: any, location: string) => {
  console.error(`Error at ${location}:`, {
    message: error.message,
    stack: error.stack,
  });
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await prismaInstance.$connect();
    console.log("Connected to database");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    logError(error, "Error from application");
  }
});

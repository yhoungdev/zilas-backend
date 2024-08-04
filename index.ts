import express, { type Request, type Response } from "express";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "server for zilas project" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

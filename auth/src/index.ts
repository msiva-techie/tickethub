import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) =>
  res.jsonp({
    message: "success"
  })
);

app.get("/abc", (req: Request, res: Response) =>
  res.jsonp({
    message: "abc"
  })
);

app.listen(port, () => console.log(`Server running  the port ${port}`));

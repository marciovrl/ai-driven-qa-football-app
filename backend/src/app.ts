import express from "express";
import { TeamController } from "./controllers/teamController";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [/^http:\/\/localhost:\d+$/],
  })
);

// versioned route
app.get("/api/v1/teams", TeamController.getAll);

export default app;

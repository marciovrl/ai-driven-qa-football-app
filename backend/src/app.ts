import express from "express";
import { TeamController } from "./controllers/teamController";

const app = express();

app.use(express.json());

// versioned route
app.get("/api/v1/teams", TeamController.getAll);

export default app;

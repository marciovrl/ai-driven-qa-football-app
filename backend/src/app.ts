import express from "express";
import { TeamController } from "./controllers/teamController";
import cors from "cors";
import { teamRoutes } from "./routes/teamRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [/^http:\/\/localhost:\d+$/],
  })
);

app.use("/api/v1/teams", teamRoutes);
app.use(errorHandler);

export default app;

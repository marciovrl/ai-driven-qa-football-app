import express from "express";
import { TeamController } from "./controllers/teamController";
import cors from "cors";
import { teamRoutes } from "./routes/teamRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const allowedOriginRegex =
  process.env.CORS_ORIGIN_REGEX != null
    ? new RegExp(process.env.CORS_ORIGIN_REGEX)
    : /^http:\/\/(localhost|frontend):\d+$/;

app.use(express.json());
app.use(
  cors({
    origin: [allowedOriginRegex],
  })
);

app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/teams", teamRoutes);
app.use(errorHandler);

export default app;

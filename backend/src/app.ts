import express from "express";
import { teamRoutes } from "./routes/teamRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use("/api/v1/teams", teamRoutes);
app.use(errorHandler);

export default app;

import app from "./app";
import { resetTeamsData } from "./utils/resetTeamsData";

const PORT = 3000;

// Always start from the committed seed so local/E2E runs do not depend on a dirty teams.json.
resetTeamsData();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import { startDb } from "../db/start-db";
import app from "./server";

const port = 3000;

app.listen(port, async () => {
  const db = startDb();
  await db.sync({ force: true });

  console.log(`Server running on port ${port}`);
});

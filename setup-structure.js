import { mkdirSync } from "fs";
import { join } from "path";

const baseDir = "./src";
const directories = [
  "components/Auth",
  "components/User",
  "components/Events",
  "components/Teams",
  "components/Notifications",
  "components/Feedback",
  "components/Reports",
  "components/Admin",
  "pages/Auth",
  "pages/User",
  "pages/Events",
  "pages/Teams",
  "pages/Feedback",
  "pages/Reports",
  "pages/Admin",
  "contexts",
  "hooks",
  "utils",
];

// Create directories
directories.forEach((dir) => {
  mkdirSync(join(baseDir, dir), { recursive: true });
});

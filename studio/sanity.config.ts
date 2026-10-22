import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

// This placeholder makes local schema checks/builds possible. It is not a provisioned project.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "placeholder";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "legacy",
  title:
    projectId === "placeholder"
      ? "Legacy archive · configure a Sanity project"
      : "Legacy archive",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});

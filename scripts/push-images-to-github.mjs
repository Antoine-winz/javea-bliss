import { ReplitConnectors } from "@replit/connectors-sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const connectors = new ReplitConnectors();
const OWNER = "Antoine-winz";
const REPO = "javea-bliss";

const imageFiles = [
  "after-load.png",
  "generated-icon.png",
  "qr-code.jpg",
  "qr-code.png",
  "client/public/favicon.svg",
  "client/public/logo.png",
  "client/public/og-hero.jpg",
  "client/public/qr-code.jpg",
  "client/public/flyer-images/bathroom.jpg",
  "client/public/flyer-images/bedroom.jpg",
  "client/public/flyer-images/kitchen.jpg",
  "client/public/flyer-images/living.jpg",
  "client/public/flyer-images/terrace.jpg",
  "client/public/assets/IMG_2580.jpeg",
  "client/public/assets/IMG_2581.jpeg",
  "client/public/assets/IMG_2582.jpeg",
  "client/public/assets/IMG_2583.jpeg",
  "client/public/assets/optimized/large/Bathroom1_1749116725138.jpeg",
  "client/public/assets/optimized/large/Bedroom1.1_1749116725138.jpeg",
  "client/public/assets/optimized/large/Bedroom1_1749116725138.jpeg",
  "client/public/assets/optimized/large/Bedroom1.2_1749116725138.jpeg",
  "client/public/assets/optimized/large/Bedroom2.1_1749116725138.jpeg",
  "client/public/assets/optimized/large/Bedroom2_1749116725138.jpeg",
  "client/public/assets/optimized/large/Bedroom2.3_1749116725138.jpeg",
  "client/public/assets/optimized/large/Entrance_1749116725138.jpeg",
  "client/public/assets/optimized/large/Hall_1749116725138.jpeg",
  "client/public/assets/optimized/large/IMG_2580.jpeg",
  "client/public/assets/optimized/large/IMG_2581.jpeg",
  "client/public/assets/optimized/large/IMG_2582.jpeg",
  "client/public/assets/optimized/large/IMG_2583.jpeg",
  "client/public/assets/optimized/large/Kitchen1_1749116725138.jpeg",
  "client/public/assets/optimized/large/Kitchen1.2_1749116725138.jpeg",
  "client/public/assets/optimized/large/Kitchen1.3_1749116725138.jpeg",
  "client/public/assets/optimized/large/Livingroom1.1_1749116725138.jpeg",
  "client/public/assets/optimized/large/Livingroom1_1749116725138.jpeg",
  "client/public/assets/optimized/large/Livingroom1.2_1749116725138.jpeg",
  "client/public/assets/optimized/large/Terasse1.2_1749116725138.jpeg",
  "client/public/assets/optimized/large/Terasse1.3_1749116725138.jpeg",
  "client/public/assets/optimized/large/Terasse1.4_1749116725138.jpeg",
  "client/public/assets/optimized/large/TV1_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Bathroom1_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Bedroom1.1_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Bedroom1_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Bedroom1.2_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Bedroom2.1_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Bedroom2_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Bedroom2.3_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Bedroom2.4_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Entrance_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Hall_1749116725138.jpeg",
  "client/public/assets/optimized/medium/IMG_2580.jpeg",
  "client/public/assets/optimized/medium/IMG_2581.jpeg",
  "client/public/assets/optimized/medium/IMG_2582.jpeg",
  "client/public/assets/optimized/medium/IMG_2583.jpeg",
  "client/public/assets/optimized/medium/Kitchen1_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Kitchen1.2_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Kitchen1.3_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Livingroom1.1_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Livingroom1_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Livingroom1.2_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Terasse1.2_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Terasse1.3_1749116725138.jpeg",
  "client/public/assets/optimized/medium/Terasse1.4_1749116725138.jpeg",
  "client/public/assets/optimized/medium/TV1_1749116725138.jpeg",
  "client/public/assets/optimized/small/Bathroom1_1749116725138.jpeg",
  "client/public/assets/optimized/small/Bedroom1.1_1749116725138.jpeg",
  "client/public/assets/optimized/small/Bedroom1_1749116725138.jpeg",
  "client/public/assets/optimized/small/Bedroom1.2_1749116725138.jpeg",
  "client/public/assets/optimized/small/Bedroom2.1_1749116725138.jpeg",
  "client/public/assets/optimized/small/Bedroom2_1749116725138.jpeg",
  "client/public/assets/optimized/small/Bedroom2.3_1749116725138.jpeg",
  "client/public/assets/optimized/small/Bedroom2.4_1749116725138.jpeg",
  "client/public/assets/optimized/small/Entrance_1749116725138.jpeg",
  "client/public/assets/optimized/small/Hall_1749116725138.jpeg",
  "client/public/assets/optimized/small/IMG_2580.jpeg",
  "client/public/assets/optimized/small/IMG_2581.jpeg",
  "client/public/assets/optimized/small/IMG_2582.jpeg",
  "client/public/assets/optimized/small/IMG_2583.jpeg",
  "client/public/assets/optimized/small/Kitchen1_1749116725138.jpeg",
  "client/public/assets/optimized/small/Kitchen1.2_1749116725138.jpeg",
  "client/public/assets/optimized/small/Kitchen1.3_1749116725138.jpeg",
  "client/public/assets/optimized/small/Livingroom1.1_1749116725138.jpeg",
  "client/public/assets/optimized/small/Livingroom1_1749116725138.jpeg",
  "client/public/assets/optimized/small/Livingroom1.2_1749116725138.jpeg",
  "client/public/assets/optimized/small/Terasse1.2_1749116725138.jpeg",
  "client/public/assets/optimized/small/Terasse1.3_1749116725138.jpeg",
  "client/public/assets/optimized/small/Terasse1.4_1749116725138.jpeg",
  "client/public/assets/optimized/small/TV1_1749116725138.jpeg",
  "client/src/assets/images/IMG_2580.jpeg",
  "client/src/assets/images/IMG_2581.jpeg",
  "client/src/assets/images/IMG_2582.jpeg",
  "client/src/assets/images/IMG_2583.jpeg",
  "client/src/assets/images/logo.png",
  "client/src/assets/images/Xabia_playa_la_Grava_7H9A3912_20171206.jpg",
];

async function ghProxy(endpoint, options = {}) {
  const res = await connectors.proxy("github", endpoint, options);
  return res;
}

async function main() {
  // Get current HEAD
  const refRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/ref/heads/main`);
  const refData = await refRes.json();
  const parentSha = refData.object?.sha;
  console.log("Parent SHA:", parentSha);

  // Get parent commit to find base tree
  const parentCommitRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/commits/${parentSha}`);
  const parentCommit = await parentCommitRes.json();
  const baseTreeSha = parentCommit.tree?.sha;
  console.log("Base tree SHA:", baseTreeSha);

  // Create blobs
  const treeEntries = [];
  let done = 0, errors = 0;

  for (const file of imageFiles) {
    const fullPath = path.join(ROOT, file);
    if (!fs.existsSync(fullPath)) {
      console.log("Missing:", file);
      errors++;
      continue;
    }

    const content = fs.readFileSync(fullPath).toString("base64");
    const blobRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content, encoding: "base64" }),
      headers: { "Content-Type": "application/json" },
    });
    const blob = await blobRes.json();

    if (blob.sha) {
      treeEntries.push({ path: file, mode: "100644", type: "blob", sha: blob.sha });
      done++;
    } else {
      console.log("Blob error for", file, ":", blob.message);
      errors++;
    }

    if (done % 10 === 0) process.stdout.write(`  ${done}/${imageFiles.length} blobs...\n`);
  }

  console.log(`\nBlobs: ${done} ok / ${errors} errors`);

  // Create new tree on top of existing
  const treeRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
    headers: { "Content-Type": "application/json" },
  });
  const tree = await treeRes.json();
  console.log("Tree SHA:", tree.sha);

  // Create commit
  const commitRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: "Add all apartment photos and image assets",
      tree: tree.sha,
      parents: [parentSha],
    }),
    headers: { "Content-Type": "application/json" },
  });
  const commit = await commitRes.json();
  console.log("Commit SHA:", commit.sha);

  // Update main branch
  const updateRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: true }),
    headers: { "Content-Type": "application/json" },
  });
  const updated = await updateRes.json();
  console.log("Branch updated:", updated.ref);
  console.log("Points to:", updated.object?.sha);
  console.log("\nDone! All images pushed to GitHub.");
}

main().catch(console.error);

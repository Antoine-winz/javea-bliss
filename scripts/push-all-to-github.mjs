import { ReplitConnectors } from "@replit/connectors-sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OWNER = "Antoine-winz";
const REPO = "javea-bliss";

const connectors = new ReplitConnectors();

async function ghProxy(endpoint, options = {}) {
  return connectors.proxy("github", endpoint, options);
}

// Collect every file, excluding things that should never be in git
function getAllFiles(dir, base = dir) {
  const skip = new Set([
    path.join(base, "node_modules"),
    path.join(base, "dist"),
    path.join(base, ".git"),
    path.join(base, ".local"),
    path.join(base, ".cache"),
    path.join(base, "attached_assets"),
  ]);
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (skip.has(full)) continue;
    if (entry.isDirectory()) {
      results.push(...getAllFiles(full, base));
    } else {
      results.push(path.relative(base, full));
    }
  }
  return results;
}

async function main() {
  const allFiles = getAllFiles(ROOT);
  console.log(`Total files to push: ${allFiles.length}`);

  // Get current HEAD
  const refRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/ref/heads/main`);
  const refData = await refRes.json();
  const parentSha = refData.object?.sha;
  console.log("Parent SHA:", parentSha);

  const parentCommitRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/commits/${parentSha}`);
  const parentCommit = await parentCommitRes.json();
  const baseTreeSha = parentCommit.tree?.sha;
  console.log("Base tree SHA:", baseTreeSha);

  // Upload all files as blobs
  const treeEntries = [];
  let done = 0, errors = 0;

  for (const file of allFiles) {
    const fullPath = path.join(ROOT, file);
    let content;
    try {
      content = fs.readFileSync(fullPath).toString("base64");
    } catch (e) {
      console.log("Read error:", file, e.message);
      errors++;
      continue;
    }

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
      console.log("Blob error:", file, blob.message);
      errors++;
    }

    if (done % 20 === 0) process.stdout.write(`  ${done}/${allFiles.length} files...\n`);
  }

  console.log(`\nBlobs: ${done} ok / ${errors} errors`);

  // Build new tree on top of existing
  const treeRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
    headers: { "Content-Type": "application/json" },
  });
  const tree = await treeRes.json();
  if (!tree.sha) { console.error("Tree error:", tree); process.exit(1); }
  console.log("Tree SHA:", tree.sha);

  // Create commit
  const commitRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: "Sync all files from Replit — source code, images, and assets",
      tree: tree.sha,
      parents: [parentSha],
    }),
    headers: { "Content-Type": "application/json" },
  });
  const commit = await commitRes.json();
  if (!commit.sha) { console.error("Commit error:", commit); process.exit(1); }
  console.log("Commit SHA:", commit.sha);

  // Update main branch
  const updateRes = await ghProxy(`/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: true }),
    headers: { "Content-Type": "application/json" },
  });
  const updated = await updateRes.json();
  console.log("\nDone! Branch:", updated.ref, "→", updated.object?.sha);
}

main().catch(console.error);

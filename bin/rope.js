#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function usage() {
  console.log(`rope

Usage:
  rope add [--target <dir>]

Installs bundled rope skills into an agent skills directory.
Default target: ~/.agents/skills
`);
}

function homeDir() {
  return process.env.HOME || process.env.USERPROFILE;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      // ponytail: user-local skill config must survive reinstall; ship *.example.json for defaults.
      if (entry.name === "settings.json" && fs.existsSync(destPath)) continue;
      fs.copyFileSync(srcPath, destPath);
    }
  }
  // mirror: a reinstall must retire files the bundle no longer ships,
  // or deleted kernels/templates linger in the target forever.
  for (const entry of fs.readdirSync(dest, { withFileTypes: true })) {
    const destPath = path.join(dest, entry.name);
    if (entry.name === "settings.json") continue;
    if (!fs.existsSync(path.join(src, entry.name))) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }
  }
}

function installSkills(args) {
  const targetIndex = args.indexOf("--target");
  const target =
    targetIndex >= 0 && args[targetIndex + 1]
      ? args[targetIndex + 1]
      : path.join(homeDir(), ".agents", "skills");
  const skillsDir = path.resolve(__dirname, "..", "skills");
  const shipped = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const name of shipped) {
    copyDir(path.join(skillsDir, name), path.join(target, name));
  }
  // mirror at the top level too: a skill dropped from the bundle must not
  // survive in the target. Only rope-* dirs are ever touched.
  if (fs.existsSync(target)) {
    for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
      if (!entry.isDirectory() || !entry.name.startsWith("rope-")) continue;
      if (!shipped.includes(entry.name)) {
        fs.rmSync(path.join(target, entry.name), { recursive: true, force: true });
      }
    }
  }

  console.log(`Installed rope skills to ${target}`);
}

const [, , command, ...args] = process.argv;

if (!command || command === "--help" || command === "-h") {
  usage();
} else if (command === "add" || command === "install-skills") {
  installSkills(args);
} else {
  console.error(`Unknown command: ${command}`);
  usage();
  process.exit(1);
}

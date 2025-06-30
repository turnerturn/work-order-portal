#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const version = packageJson.version;
const buildDate = new Date().toISOString();
const buildDateShort = buildDate.split('T')[0];

// Update index.html with version and build date
const indexPath = path.join(__dirname, '../dist/index.html');

if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');

  // Replace version meta tag
  indexContent = indexContent.replace(
    /<meta name="version" content="[^"]*"/,
    `<meta name="version" content="${version}"`
  );

  // Replace build-date meta tag
  indexContent = indexContent.replace(
    /<meta name="build-date" content="[^"]*"/,
    `<meta name="build-date" content="${buildDate}"`
  );

  // Add a comment with build info
  const buildComment = `<!-- Built: ${buildDate} | Version: ${version} -->`;
  indexContent = indexContent.replace(
    /<\/head>/,
    `  ${buildComment}\n</head>`
  );

  fs.writeFileSync(indexPath, indexContent);
  console.log(`✓ Injected version ${version} and build date ${buildDateShort} into index.html`);
} else {
  console.warn('⚠ dist/index.html not found, skipping version injection');
}

// Create a version.json file for runtime access
const versionInfo = {
  version,
  buildDate,
  buildDateShort,
  timestamp: Date.now()
};

const versionJsonPath = path.join(__dirname, '../dist/version.json');
fs.writeFileSync(versionJsonPath, JSON.stringify(versionInfo, null, 2));
console.log(`✓ Created version.json with build information`);

console.log(`📦 Build completed: v${version} (${buildDateShort})`);

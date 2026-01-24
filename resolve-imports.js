const fs = require("fs");
const path = require("path");

// Code Generated with Gemini

// Constraint: The output directory to process
const TARGET_DIR = path.join(__dirname, "my_code");

function addJsExtensions(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} not found. Run tsc first.`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      addJsExtensions(fullPath); // Recurse into subdirectories
    } else if (file.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");

      // Regex looks for:
      // 1. import/export keywords
      // 2. relative paths starting with ./ or ../
      // 3. specifically ignores packages (like 'react') or paths that
      //    already have extensions
      //
      // BUG: it may match things that aren't imports but it may not be
      // worth it to make it more complex since `from` is a reserved
      // keyword to begin with
      const regex = /(from|import\s+)\s*['"](\.{1,2}\/[^'"]+?)['"]/g;

      const newContent = content.replace(regex, (match, p1, p2) => {
        // If it already has an extension, leave it alone
        if (path.extname(p2) !== "") return match;

        // Otherwise, append .js
        // Note: If you import directories (e.g. ./utils), you might need manually check
        // if it should be /utils/index.js, but standard ESM prefers explicit paths.
        return `${p1} "${p2}.js"`;
      });

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, "utf8");
        console.log(`Fixed imports in: ${file}`);
      }
    }
  });
}

console.log("Resolving imports...");
addJsExtensions(TARGET_DIR);
console.log("Done.");

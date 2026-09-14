CLEANED BY RELL — site files
=============================

Everything in this folder goes at the TOP LEVEL of the repo,
next to the existing index.html.

IMPORTANT: drag the CONTENTS of this folder, not the folder itself.
If you drag the folder, GitHub nests everything inside
"cleanedbyrell-site/" and nothing will load.

So: open this folder, press Cmd+A to select all, drag that into
GitHub's upload box.

STEPS
-----
1. github.com/DaedarusDegen/CleanedByRell-Site
2. Add file  ->  Upload files
3. Open this folder, Cmd+A, drag everything in
4. Scroll DOWN and press the green "Commit changes" button
   (files are only staged until you press it — this is the step
    that gets missed)

ALSO DELETE FROM THE REPO
-------------------------
  .DS_Store
  Photos/.DS_Store

ABOUT .gitignore
----------------
It starts with a dot, so macOS hides it and some uploaders skip it.
Press Cmd+Shift+. in Finder to reveal hidden files.
If it still won't upload, make it on GitHub instead:
  Add file -> Create new file -> name it  .gitignore  -> paste:

.DS_Store
**/.DS_Store
Photos/*.PNG
Photos/*.JPG
Photos/*.jpeg

THEN TURN PAGES ON
------------------
Settings -> Pages -> Source: Deploy from a branch
           -> Branch: main / (root) -> Save

Check it at:
  https://daedarusdegen.github.io/CleanedByRell-Site/

First thing to test: open /quote.html and confirm the total
reads $50. If it reads $0, a file did not upload.

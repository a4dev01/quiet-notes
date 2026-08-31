# Quiet Notes

A simple notes web application. It runs entirely in the browser and stores every user's notes in that user's own browser storage—no account or server required.

Open `index.html` in a browser to use it locally. You can create, edit, delete, search, tag, and pin notes. Press `N` to create a note quickly.

## Publish with GitHub and Netlify

1. Create a new empty GitHub repository, for example `quiet-notes`.
2. In this folder, run the following commands in a terminal (replace the URL with your repository URL):

   ```powershell
   git add .
   git commit -m "Create Quiet Notes app"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/quiet-notes.git
   git push -u origin main
   ```

3. Sign in to [Netlify](https://app.netlify.com/) using GitHub.
4. Choose **Add new site** → **Import an existing project** → **GitHub**, then select the `quiet-notes` repository.
5. Leave the build command empty and set the publish directory to `.` (the included `netlify.toml` configures this automatically). Select **Deploy site**.

Netlify will give you a public `netlify.app` address. Every future push to the `main` branch will update the live site automatically.

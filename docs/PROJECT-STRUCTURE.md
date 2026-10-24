# Quiet Notes — Project Structure

```text
notes/
├── index.html              # Application layout and accessible controls
├── styles.css              # Responsive light, dark, and sepia styling
├── app.js                  # Notes, IndexedDB, search, organization, and note locks
├── manifest.webmanifest    # PWA metadata
├── sw.js                   # Offline cache worker
├── netlify.toml            # Netlify static-site configuration
├── README.md               # Project and publishing instructions
└── docs/
    ├── PROJECT-STRUCTURE.md
    └── CODE-GUIDE.md
```

The app files deliberately remain in the repository root because Netlify publishes this directory directly. The `docs` folder contains developer documentation only and is not required at runtime.

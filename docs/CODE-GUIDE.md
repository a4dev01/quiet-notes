# Quiet Notes — Code Guide

## Overview

Quiet Notes is a dependency-free, static browser application. It uses vanilla HTML, CSS, and JavaScript, so Netlify can host it without a build step.

## Runtime flow

1. `index.html` loads the visual layout, dialogs, and `app.js`.
2. `app.js` opens IndexedDB and safely migrates notes from the original `quiet-notes-v1` localStorage key if it exists.
3. Notes are loaded into memory, rendered in the middle list, and edited in the right-hand pane.
4. Edits debounce before saving to IndexedDB. The editor shows Saving, Saved, or Offline state.
5. `sw.js` caches application assets for offline use and replaces old cache versions on activation.

## Files

### `index.html`

Defines the three-column interface:

- Sidebar: navigation, folders, tags, and settings.
- Note list: search and note previews.
- Editor: title, body, tags, actions, dialogs, and status display.

The markup uses native buttons, labels, dialogs, and inputs for keyboard and screen-reader support.

### `styles.css`

Contains the visual design, responsive breakpoints, focus states, and theme CSS variables.

- Light is the default theme.
- Dark and sepia are selected in Settings.
- At narrow widths, the sidebar becomes an overlay and the editor switches to a focused mobile view.

### `app.js`

Contains all application behavior.

#### Storage

- IndexedDB database: `quiet-notes`
- `notes` store: note records
- `meta` store: preferences and migration metadata
- The original localStorage notes are copied to IndexedDB before that old key is removed.

#### Note lifecycle

- `make()` creates a new note.
- `edit()` debounces changes.
- `persist()` writes note data to IndexedDB.
- `move()` sends a note to Trash; pressing Trash again while viewing a trashed note asks for permanent deletion.
- `archive()`, `pin()`, and `favorite()` update organization state.

#### Organization

- Search checks titles, content, tags, and folders.
- Tags are entered as comma-separated values.
- Folders, favorites, and reminders are attached to individual note objects.
- Navigation filters notes by All Notes, Pinned, Favorites, Reminders, Archive, and Trash.

#### Individual note protection

The whole app never requires a password at launch. A user can choose the lock action for a specific note only.

- A password is converted into a non-extractable AES-GCM key via PBKDF2 with a random salt and 250,000 SHA-256 iterations.
- Each protected note uses a fresh random AES-GCM IV.
- The encrypted record stores only encrypted content plus the salt, IV, and minimal timestamps.
- The password and raw key are not stored.
- A forgotten note password cannot be recovered.

This is local, browser-side at-rest protection. It is not server authentication and cannot protect against a compromised device or malicious browser extension.

#### Backup

The Settings dialog exports currently loaded notes as JSON. It is a portable browser download; it is not cloud synchronization.

### `manifest.webmanifest`

Provides installable PWA metadata: name, display mode, start URL, and theme/background color.

### `sw.js`

Implements a cache-first offline fallback with a versioned cache. On activation it removes previous cache versions and claims browser clients so updated application assets replace stale versions.

### `netlify.toml`

Tells Netlify to publish the repository root and sends basic protective HTTP headers.

## Current limitations

- No accounts, server authentication, or cross-device sync: the app is browser-local.
- Attachments, rich-text formatting controls, and import/restore are not implemented yet.
- Reminder dates are stored locally but do not currently create operating-system/browser notifications.
- JSON export should be kept in a safe location; it is not an automatic backup service.

const storageKey = "quiet-notes-v1";
const initialNotes = [
  { id: crypto.randomUUID(), title: "Welcome to Quiet Notes", body: "A small, calm space for ideas, plans, and everything worth remembering.\n\nUse the New note button or press N to start.", tags: ["Getting started"], pinned: true, updatedAt: Date.now() },
  { id: crypto.randomUUID(), title: "A place for loose thoughts", body: "Good notes do not need to be perfect. Capture the spark, then return when you need it.", tags: ["Ideas"], pinned: false, updatedAt: Date.now() - 86400000 }
];
let notes = JSON.parse(localStorage.getItem(storageKey) || "null") || initialNotes;
let selectedFilter = "all", selectedTag = null, editingId = null;
const $ = (selector) => document.querySelector(selector);
const grid = $("#noteGrid"), emptyState = $("#emptyState"), dialog = $("#editorDialog"), form = $("#noteForm");

function persist() { localStorage.setItem(storageKey, JSON.stringify(notes)); }
function formatDate(timestamp) { return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(timestamp); }
function visibleNotes() {
  const query = $("#searchInput").value.trim().toLowerCase();
  return notes.filter(note => (selectedFilter !== "pinned" || note.pinned) && (!selectedTag || note.tags.includes(selectedTag)) && (!query || [note.title, note.body, ...note.tags].join(" ").toLowerCase().includes(query))).sort((a,b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);
}
function renderTags() {
  const tags = [...new Set(notes.flatMap(n => n.tags))].sort();
  $("#tagList").innerHTML = tags.map(tag => `<button class="tag-button ${tag === selectedTag ? "active" : ""}" data-tag="${encodeURIComponent(tag)}">${escapeHtml(tag)}</button>`).join("");
  document.querySelectorAll(".tag-button").forEach(button => button.onclick = () => { selectedTag = decodeURIComponent(button.dataset.tag); selectedFilter = "all"; render(); });
}
function escapeHtml(value) { const element = document.createElement("div"); element.textContent = value; return element.innerHTML; }
function render() {
  const shown = visibleNotes(); grid.innerHTML = "";
  shown.forEach(note => {
    const fragment = $("#noteTemplate").content.cloneNode(true), card = fragment.querySelector(".note-card");
    card.classList.toggle("pinned", note.pinned); card.querySelector("h2").textContent = note.title; card.querySelector(".excerpt").textContent = note.body;
    card.querySelector("time").textContent = formatDate(note.updatedAt); card.querySelector(".card-tags").textContent = note.tags.map(t => `#${t}`).join("  ");
    card.querySelector(".card-body").onclick = () => openEditor(note); card.querySelector(".pin").onclick = () => { note.pinned = !note.pinned; persist(); render(); };
    grid.append(fragment);
  });
  emptyState.hidden = shown.length > 0; $("#allCount").textContent = notes.length; $("#pinnedCount").textContent = notes.filter(n => n.pinned).length;
  $("#pageTitle").textContent = selectedTag ? `#${selectedTag}` : selectedFilter === "pinned" ? "Pinned notes" : "All notes";
  document.querySelectorAll(".filter").forEach(button => button.classList.toggle("active", button.dataset.filter === selectedFilter && !selectedTag)); renderTags();
}
function openEditor(note) {
  editingId = note?.id || null; $("#dialogLabel").textContent = note ? "Edit note" : "New note"; $("#noteTitle").value = note?.title || ""; $("#noteBody").value = note?.body || ""; $("#noteTags").value = note?.tags.join(", ") || ""; $("#deleteButton").hidden = !note; dialog.showModal(); setTimeout(() => $("#noteTitle").focus(), 50);
}
function closeEditor() { dialog.close(); form.reset(); editingId = null; }
form.onsubmit = event => { event.preventDefault(); const data = new FormData(form), note = editingId ? notes.find(n => n.id === editingId) : { id: crypto.randomUUID(), pinned: false }; Object.assign(note, { title: data.get("title").trim(), body: data.get("body").trim(), tags: data.get("tags").split(",").map(t => t.trim()).filter(Boolean), updatedAt: Date.now() }); if (!editingId) notes.push(note); persist(); closeEditor(); render(); };
$("#newNoteButton").onclick = () => openEditor(); $("#emptyNewNote").onclick = () => openEditor(); $("#closeDialog").onclick = closeEditor; $("#cancelButton").onclick = closeEditor;
$("#deleteButton").onclick = () => { if (confirm("Delete this note?")) { notes = notes.filter(n => n.id !== editingId); persist(); closeEditor(); render(); } };
$("#searchInput").oninput = render; document.querySelectorAll(".filter").forEach(button => button.onclick = () => { selectedFilter = button.dataset.filter; selectedTag = null; render(); });
document.addEventListener("keydown", event => { if (event.key.toLowerCase() === "n" && !dialog.open && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) { event.preventDefault(); openEditor(); } });
render();

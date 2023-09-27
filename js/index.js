import { NotesManager, NoteComponent } from "./notes.js";

const notesContainer = document.getElementById("notes-container");
const addNoteBtn = document.getElementById("add-note-btn");

const notesManager = new NotesManager();

const onDelete = (id) => notesManager.deleteNote(id);
const onUpdate = (note) => notesManager.updateNote(note);

notesManager.collection.forEach(function (note) {
  const component = new NoteComponent({
    text: note.text,
    id: note.id,
    onDelete,
    onUpdate,
  });

  notesContainer.appendChild(component.root);
});

addNoteBtn.addEventListener("click", function () {
  const component = new NoteComponent({
    focusOnCreate: true,
    onDelete,
    onUpdate,
  });

  notesManager.addNote(component.note);
  notesContainer.appendChild(component.root);
});
class Note {
  constructor({ text, id }) {
    this.text = text ?? "";
    this.id = id ?? crypto.randomUUID();
  }

  setText(value) {
    this.text = value;
  }
}

export class NotesManager {
  constructor() {
    this.collection = JSON.parse(localStorage.getItem("NOTES") || "null") ?? [];
    localStorage.setItem("NOTES", JSON.stringify(this.collection));
  }

  addNote(note) {
    this.collection = [...this.collection, note];
    localStorage.setItem("NOTES", JSON.stringify(this.collection));
  }

  updateNote(note) {
    this.collection = this.collection.map((item) => {
      if (note.id === item.id) return note;
      return item;
    });

    localStorage.setItem("NOTES", JSON.stringify(this.collection));
  }

  deleteNote(id) {
    this.collection = this.collection.filter((note) => note.id !== id);
    localStorage.setItem("NOTES", JSON.stringify(this.collection));
  }
}

export class NoteComponent {
  constructor({ text = "", id, onDelete, onUpdate, focusOnCreate = false }) {
    this.onDelete = onDelete;
    this.onUpdate = onUpdate;
    this.note = new Note({ text, id });
    this.root = this.createRoot();
    if (focusOnCreate) this.enableEditMode();
  }

  createRoot() {
    const rootEl = document.createElement("div");
    rootEl.classList.add("note");

    const noteHeader = document.createElement("div");
    noteHeader.classList.add("note-header");

    noteHeader.addEventListener("click", ({ target: { dataset } }) => {
      const { action } = dataset;

      if (action === "save") this.save();
      if (action === "edit") this.enableEditMode();
      if (action === "delete") this.delete();
    });

    const actions = [
      { name: "save", classname: "fa-check" },
      {
        name: "edit",
        classname: "fa-edit",
      },
      {
        name: "delete",
        classname: "fa-trash-alt",
      },
    ];

    noteHeader.innerHTML = actions
      .map(({ name, classname }) => {
        return `
        <button data-action="${name}" class="note-btn">
          <i class="fas ${classname}"></i>
        </button>
      `;
      })
      .join("");

    const noteContent = document.createElement("div");
    noteContent.classList.add("note-content");

    const textarea = document.createElement("textarea");
    textarea.setAttribute("maxlength", "256");
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("placeholder", "Your text here...");
    textarea.value = this.note.text;

    textarea.addEventListener("blur", () => this.disableEditMode());
    textarea.addEventListener("click", () => this.enableEditMode());

    noteContent.appendChild(textarea);
    rootEl.append(noteHeader, noteContent);

    return rootEl;
  }

  delete() {
    this.root.remove();
    this.onDelete?.(this.note.id);
  }

  save() {
    this.note.setText(this.root.querySelector("textarea").value.trim());
    this.onUpdate?.(this.note);
    this.disableEditMode();
  }

  enableEditMode() {
    const textarea = this.root.querySelector("textarea");
    textarea.removeAttribute("readonly");

    this.root.classList.add("note-editing");
    setTimeout(() => textarea.focus(), 0);
  }

  disableEditMode() {
    const textarea = this.root.querySelector("textarea");

    setTimeout(() => {
      textarea.value = this.note.text;
      textarea.setAttribute("readonly", "");
      this.root.classList.remove("note-editing");
    }, 100);
  }
}

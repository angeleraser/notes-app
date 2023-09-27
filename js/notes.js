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

    const actions = [
      { name: "save", iconClass: "fa-check", handler: () => this.save() },
      {
        name: "edit",
        iconClass: "fa-edit",
        handler: () => this.enableEditMode(),
      },
      {
        name: "delete",
        iconClass: "fa-trash-alt",
        handler: () => this.delete(),
      },
    ];

    noteHeader.append(
      ...actions.map(({ name, iconClass, handler }) => {
        const btn = document.createElement("button");
        const icon = document.createElement("i");

        icon.classList.add("fas", iconClass);
        btn.classList.add("note-btn");

        btn.setAttribute("data-action", name);
        btn.append(icon);

        btn.addEventListener("click", handler);

        return btn;
      })
    );

    const noteTextarea = document.createElement("div");
    noteTextarea.classList.add("note-textarea");

    const textareaInput = document.createElement("textarea");
    textareaInput.setAttribute("maxlength", "256");
    textareaInput.setAttribute("readonly", "");
    textareaInput.setAttribute("placeholder", "Your text here...");
    textareaInput.value = this.note.text;

    textareaInput.addEventListener("blur", () => this.disableEditMode());
    textareaInput.addEventListener("click", () => this.enableEditMode());

    noteTextarea.appendChild(textareaInput);
    rootEl.append(noteHeader, noteTextarea);
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
let editor;

const tools = {
  header: {
    class: Header,
    inlineToolbar: ["link"],
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        coub: true,
        instagram: true,
        vimeo: true,
      },
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Entre com a citação",
      captionPlaceholder: "Autor",
    },
  },
  delimiter: Delimiter,
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+M",
  },
  Marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
        byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
      },
    },
  },
};

const handleEditorJS = (event, postKey, data = {}) => {
  editor = new EditorJS({
    holder: "editorjs",
    data,
    onReady: () => {
      handleEventSaveButton(event, postKey);
    },
    tools,
  });
};

const handleEventSaveButton = (event, postKey) => {
  console.log("Editor.js is ready to work!");
  const saveButton = document.getElementById("save-button");
  saveButton.addEventListener("click", () => {
    editor
      .save()
      .then((outputData) => {
        event.source.postMessage(
          { type: "save", outputData, postKey },
          event.origin
        );
      })
      .catch((error) => {
        console.error("Saving failed: ", error);
      });
  });
  saveButton.style.display = "inline-block";

  const cancelButton = document.getElementById("cancel-button");
  cancelButton.addEventListener("click", () => {
    event.source.postMessage({ type: "cancel", postKey }, event.origin);
  });
  cancelButton.style.display = "inline-block";
};

const receiveMessage = (event) => {
  if (
    event.origin.startsWith("http://localhost:4200") &&
    event.data &&
    event.data.postKey
  ) {
    if (event.data.content) {
      handleEditorJS(event, event.data.postKey, event.data.content);
      return;
    }
    handleEditorJS(event, event.data.postKey);
  }
};

window.addEventListener("message", receiveMessage);
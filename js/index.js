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
        vimeo: true,
        instagram: true,
        'instagram-tv': {
          regex: /https?:\/\/www\.instagram\.com\/tv\/([^\/\?\&]+)\/?/,
          embedUrl: "https://www.instagram.com/tv/<%= remote_id %>/embed",
          html:
            '<iframe width="400" height="505" style="margin: 0 auto;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
          height: 505,
          width: 400,
        },
        // twitter: true,
        // codepen: true,
        // coub: true,
        // vine: true,
        // imgur: true,
        // gfycat: true,
        // "twitch-channel": true,
        // "twitch-video": true,
        // "yandex-music-album": true,
        // "yandex-music-track": true,
        // "yandex-music-playlist": true,
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
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: process.env.LINK_PREVIEW_URL,
    },
  },
  // image: {
  //   class: ImageTool,
  //   config: {
  //     endpoints: {
  //       byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
  //       byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
  //     },
  //   },
  // },
};

const handleEditorJS = (event, postKey, data) => {
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
  // console.log("Editor.js is ready to work!");
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

const verifyUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return event.origin.startsWith("http://localhost:4200");
  }
  return event.origin.startsWith(process.env.DOMAIN);
};

const receiveMessage = (event) => {
  if (verifyUrl() && event.data && event.data.postKey) {
    handleEditorJS(event, event.data.postKey, event.data.content || {});
  }
};

window.addEventListener("message", receiveMessage);

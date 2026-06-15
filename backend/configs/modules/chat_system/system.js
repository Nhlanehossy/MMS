exports.chat_system = [
  {
    name: "chat",
    path: "chat",
    icon: "pi pi-comments",
    label: "Chat",
    menuGroup: "Chat",
    menuGroupIcon: "pi pi-comments",
    schema: [
      {
        name: "name",
        type: "text",
      },
      {
        name: "status",
        type: "select",
        options: [
          { label: "Active", value: "active" },
          { label: "Archived", value: "archived" },
        ],
      },
    ],
    renderMode: "chat",
  },
  {
    name: "chat-conversations",
    path: "chat-conversations",
    icon: "pi pi-comments",
    label: "Chat Conversations",
    menuGroup: "Chat",
    menuGroupIcon: "pi pi-comments",
    schema: [
      {
        name: "title",
        type: "text",
      },
      {
        name: "participants",
        type: "tags",
        tagInputType: "refs",
        resource: "users",
        field: "fullname",
      },
      {
        name: "status",
        type: "select",
        options: [
          { label: "Active", value: "active" },
          { label: "Archived", value: "archived" },
        ],
      },
    ],
    renderMode: "crud",
  },
  {
    name: "chat-messages",
    path: "chat-messages",
    icon: "pi pi-send",
    label: "Chat Messages",
    menuGroup: "Chat",
    menuGroupIcon: "pi pi-comments",
    schema: [
      {
        name: "conversation",
        type: "ref",
        resource: "chat-conversations",
        field: "title",
      },
      {
        name: "sender",
        type: "ref",
        resource: "users",
        field: "fullname",
      },
      {
        name: "message",
        type: "richtext",
      },
      {
        name: "sentAt",
        type: "datetime",
      },
      {
        name: "status",
        type: "select",
        options: [
          { label: "Sent", value: "sent" },
          { label: "Delivered", value: "delivered" },
          { label: "Read", value: "read" },
        ],
      },
    ],
    renderMode: "crud",
  },
];

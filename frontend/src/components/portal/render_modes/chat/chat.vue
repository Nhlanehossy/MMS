<template>
  <div class="chat-app" :class="{ 'mobile': isMobile }">
    <!-- Sidebar for User/Group Selection -->
    <a-drawer
      v-if="isMobile"
      placement="left"
      :closable="false"
      :visible="drawerVisible"
      @close="closeDrawer"
    >
      <div class="user-list">
        <a-input-search placeholder="Search users" style="margin-bottom: 20px;" />
        <a-list item-layout="horizontal" :data-source="users">
          <template #renderItem="{ item }">
            <a-list-item @click="selectChat(item)" class="user-item">
              <a-avatar :src="item.avatar" />
              <div class="user-info">
                <span class="user-name">{{ item.name }}</span>
                <span v-if="item.isGroup" class="group-indicator">(Group)</span>
              </div>
              <action_dispatcher :resource="{
                name: 'chat',
                actions:[
                  {
                    name: 'view_profile',
                    icon: 'pi pi-user',
                    label: 'View Profile',
                  },
                  {
                    name: 'mute_notifications',
                    icon: 'fa fa-bell-slash',
                    label: 'Mute Notifications',
                  },
                  {
                    name: 'clear_chat',
                    icon: 'pi pi-trash',
                    label: 'Clear Chat',
                  }
                ]}
              " :item="item" />
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-drawer>

    <div v-else class="sidebar">
    <div class="user-list">
      <a-input-search placeholder="Search users" style="margin-bottom: 20px;" />
      <a-list item-layout="horizontal" :data-source="users">
        <template #renderItem="{ item }">
          <a-list-item 
            @click="selectChat(item)" 
            class="user-item" 
            @mouseenter="item.isHovered = true" 
            @mouseleave="item.isHovered = false"
          >
            <a-avatar :src="item.avatar" />
            <div class="user-info">
              <span class="user-name">{{ item.name }}</span>
              <span v-if="item.isGroup" class="group-indicator">(Group)</span>
            </div>
            <span class="z-20 right-0">
              <action_dispatcher 
                v-if="item.isHovered" 
                :resource="{
                  name: 'chat',
                  actions: [
                    {
                      name: 'view_profile',
                      icon: 'pi pi-user',
                      label: 'View Profile',
                    },
                    {
                      name: 'mute_notifications',
                      icon: 'fa fa-bell-slash',
                      label: 'Mute Notifications',
                    },
                    {
                      name: 'clear_chat',
                      icon: 'pi pi-trash',
                      label: 'Clear Chat',
                    }
                  ]
                }" 
                :item="item" 
                orientation="icons"
              />
            </span>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>

    <!-- Chat Area -->
    <div class="chat-area">
      <!-- Chat Header -->
      <div class="chat-header">
        <a-button v-if="isMobile" icon="menu" @click="openDrawer" />
        <a-avatar :src="currentChat?.avatar" />
        <span class="chat-name">{{ currentChat?.name }}</span>
   
          <action_dispatcher :resource="{
            name: 'chat',
            actions:[
              {
                name: 'view_profile',
                icon: 'pi pi-user',
                label: 'View Profile',
              },
              {
                name: 'mute_notifications',
                icon: 'fa fa-bell-slash',
                label: 'Mute Notifications',
              },
              {
                name: 'clear_chat',
                icon: 'pi pi-trash',
                label: 'Clear Chat',
              }
            ]
          }" :item="currentChat" />
         

       
      </div>

      <!-- Message Display Area -->
      <div class="messages" ref="messageContainer">
        <div v-for="(msg, index) in currentChat?.messages" :key="index"
             :class="['message', { 'own-message': msg.senderId === currentUserId }]">
          <a-avatar :src="msg.avatar" class="message-avatar" />
          <div class="message-content">
            <action_dispatcher :resource="{
              name: 'chat',
              actions:[
                {
                  name: 'reply',
                  icon: 'pi pi-reply',
                  label: 'Reply',
                },
                {
                  name: 'edit',
                  icon: 'pi pi-pencil',
                  label: 'Edit',
                },
                {
                  name: 'delete',
                  icon: 'pi pi-trash',
                  label: 'Delete',
                },
                {
                  name: 'react',
                  icon: 'pi pi-thumbs-up',
                  label: 'React',
                },
                {
                  name: 'forward',
                  icon: 'pi pi-share-alt',
                  label: 'Forward'
                }
              ]}"
              :item="msg"
               />
            <div v-if="msg.file" class="message-file">
              <a-icon type="file" />
              <span>{{ msg.file.name }}</span>
              <img v-if="isImageFile(msg.file.name)" :src="msg.file.url" class="file-preview" />
            </div>
            <span v-else-if="msg.voiceNote" class="message-voice-note" @click="playVoiceNote(msg.voiceNote)">
              <a-icon type="sound" /> Voice Note
            </span>
            <span v-else v-html="formatMessage(msg.text)"></span>
            <div class="message-timestamp">{{ formatTimestamp(msg.timestamp) }}</div>
          </div>
        </div>
      </div>

      <!-- Message Input Area -->
      <div class="chat-input">

        <action_dispatcher :resource="{
          name: 'chat',
          actions:[
            {
              name: 'choose-emoji',
              icon: 'fa fa-smile',
              label: 'Choose Emoji',
            },
            {
              name: 'record_voice_note',
              icon: 'pi pi-microphone',
              label: 'Record Voice Note',
            },
            {
              name: 'upload_file',
              icon: 'pi pi-paperclip',
              label: 'Upload File',
            }
          ]
        }" :item="currentChat" orientation="icons" />

        <div class="flex items-center my-2">
          <input
            v-model="newMessage"
            class="w-full px-3 py-2 rounded-md"
            placeholder="Type a message..."
            @pressEnter="sendMessage"
          />
          <action_dispatcher :resource="{
            name: 'chat',
            actions:[
              {
                name: 'send_message',
                icon: 'pi pi-send',
                label: 'Send',
              }
            ]
          }" :item="currentChat" orientation="buttons" />
        </div>

        <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />

        <!-- Emoji Picker -->
        <div v-if="showEmojiPicker" class="emoji-picker">
          <emoji-picker @emoji-click="addEmojiToMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import chatData from "@/data/chat.json";
import EmojiPicker from 'vue3-emoji-picker';
import UserList from './UserList.vue';
import action_dispatcher from "../../../action_dispatcher.vue";
import { icon } from "leaflet";

export default {
  components: {
    EmojiPicker,
    UserList,
    action_dispatcher
  },
  data() {
    return {
      users: [],
      currentChat: null,
      newMessage: "",
      showEmojiPicker: false,
      isMobile: false,
      currentUserId: 1,
      isRecording: false,
      mediaRecorder: null,
      drawerVisible: false,
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.users = chatData.users;
      this.initializeChats();
    },
    initializeChats() {
      if (this.users.length > 0) {
        this.currentChat = this.users[0];
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    selectChat(user) {
      this.currentChat = user;
      this.newMessage = "";
      if (this.isMobile) {
        this.closeDrawer();
      }
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;

      const message = {
        text: this.newMessage,
        avatar: this.currentChat.avatar,
        senderId: this.currentUserId,
        file: null,
        timestamp: new Date().toISOString(),
      };

      this.currentChat.messages.push(message);
      this.newMessage = "";
      this.updateDataSource();
      this.scrollToBottom();
    },
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    addEmojiToMessage(emoji) {
      this.newMessage += emoji.unicode;
      this.showEmojiPicker = false;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const message = {
          text: "",
          file: {
            name: file.name,
            url: e.target.result,
          },
          avatar: this.currentChat.avatar,
          senderId: this.currentUserId,
          timestamp: new Date().toISOString(),
        };
        this.currentChat.messages.push(message);
        this.updateDataSource();
        this.scrollToBottom();
      };
      reader.readAsDataURL(file);
    },
    openFilePicker() {
      this.$refs.fileInput.click();
    },
    updateDataSource() {
      console.log("Updated chat data:", this.users);
    },
    formatMessage(text) {
      return text.replace(/:\w+:/g, match => {
        const emoji = match.replace(/:/g, '');
        return `<span class="emoji">${emoji}</span>`;
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    },
    startRecording() {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.start();
          this.isRecording = true;

          const audioChunks = [];
          this.mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
          });

          this.mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            this.sendVoiceNote(audioUrl);
          });
        });
    },
    stopRecording() {
      this.mediaRecorder.stop();
      this.isRecording = false;
    },
    sendVoiceNote(audioUrl) {
      const message = {
        voiceNote: audioUrl,
        avatar: this.currentChat.avatar,
        senderId: this.currentUserId,
        timestamp: new Date().toISOString(),
      };
      this.currentChat.messages.push(message);
      this.updateDataSource();
      this.scrollToBottom();
    },
    playVoiceNote(audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    },
    isImageFile(filename) {
      return /\.(jpeg|jpg|gif|png)$/i.test(filename);
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    openDrawer() {
      this.drawerVisible = true;
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkMobile);
  },
};
</script>

<style scoped>
.user-item {
  position: relative; /* Add this to position the action dispatcher correctly */
}

.user-item:hover {
  background-color: #f0f0f0; /* Optional: change background color on hover */
}
.chat-app {
  display: flex;
  height: 80vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-app.mobile {
  flex-direction: column;
}

.sidebar {
  width: 300px;
  background-color: #f0f2f5;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.chat-header {
  padding: 15px;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
}

.chat-header .ant-avatar {
  margin-right: 15px;
}

.chat-name {
  font-size: 18px;
  font-weight: 600;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #e5ddd5;
}

.message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.message.own-message {
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 10px;
}

.message-content {
  background-color: #ffffff;
  padding: 12px;
  border-radius: 8px;
  max-width: 70%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.own-message .message-content {
  background-color: #dcf8c6;
}

.message-file, .message-voice-note {
  color: #075e54;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.message-file .anticon, .message-voice-note .anticon {
  margin-right: 5px;
}

.file-preview {
  max-width: 200px;
  max-height: 200px;
  margin-top: 10px;
  border-radius: 4px;
}

.chat-input {
  padding: 15px;
  background-color: #f0f2f5;
  border-top: 1px solid #e0e0e0;
}

.emoji-picker {
  position: absolute;
  bottom: 80px;
  right: 20px;
  z-index: 1000;
}

.emoji {
  font-size: 1.2em;
}

.message-timestamp {
  font-size: 0.75em;
  color: #999;
  margin-top: 5px;
}

/* Mobile styles */
.mobile .chat-header {
  padding: 10px;
}

.mobile .chat-input {
  padding: 10px;
}

.mobile .emoji-picker {
  bottom: 70px;
  right: 10px;
}


.user-list {
  padding: 20px;
}

.user-item {
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-item:hover {
  background-color: #e6f7ff;
}

.user-info {
  margin-left: 10px;
}

.user-name {
  font-weight: 500;
}

.group-indicator {
  font-size: 0.8em;
  color: #999;
  margin-left: 5px;
}
</style>
<template>
    <div class="user-list">
      <div class="search-container">
        <a-input-search
          v-model="searchQuery"
          placeholder="Search conversations"
          style="width: 100%"
          @change="filterUsers"
        >
          <template #prefix>
            <a-icon type="search" style="color: rgba(0,0,0,.45)" />
          </template>
        </a-input-search>
      </div>
      <a-list
        class="chat-list"
        :data-source="filteredUsers"
        :loading="loading"
      >
        <template #renderItem="{ item }">
          <a-list-item @click="selectChat(item)" :class="{ 'active': currentChat?.id === item.id }">
            <div class="chat-item">
              <a-badge :count="item.unreadCount" :offset="[-5, 5]">
                <a-avatar :src="item.avatar" :size="50" />
              </a-badge>
              <div class="chat-info">
                <div class="chat-name">
                  {{ item.name }}
                  <span v-if="item.isGroup" class="group-indicator">
                    <a-icon type="team" />
                  </span>
                </div>
                <div class="chat-preview">{{ item.lastMessage }}</div>
              </div>
              <div class="chat-meta">
                <div class="chat-time">{{ formatTime(item.lastMessageTime) }}</div>
                <a-icon v-if="item.muted" type="sound" class="mute-icon" />
              </div>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </template>
  
  <script>
  import { formatDistanceToNow } from 'date-fns';
  
  export default {
    name: 'UserList',
    props: {
      users: {
        type: Array,
        required: true
      },
      currentChat: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        searchQuery: '',
        filteredUsers: [],
        loading: false
      };
    },
    created() {
      this.filteredUsers = this.users;
      console.log(this.users);
    },
    methods: {
      selectChat(chat) {
        this.$emit('select-chat', chat);
      },
      filterUsers() {
        this.loading = true;
        setTimeout(() => {
          this.filteredUsers = this.users.filter(user =>
            user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
          this.loading = false;
        }, 300);
      },
      formatTime(time) {
        return formatDistanceToNow(new Date(time), { addSuffix: true });
      }
    }
  };
  </script>
  
  <style scoped>
  .user-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f7f7f7;
  }
  
  .search-container {
    padding: 16px;
    background-color: #ffffff;
    border-bottom: 1px solid #e8e8e8;
  }
  
  .chat-list {
    flex-grow: 1;
    overflow-y: auto;
  }
  
  .chat-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .chat-item:hover {
    background-color: #f0f0f0;
  }
  
  .chat-info {
    flex-grow: 1;
    margin-left: 12px;
    overflow: hidden;
  }
  
  .chat-name {
    font-weight: 600;
    font-size: 16px;
    color: #262626;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  }
  
  .group-indicator {
    margin-left: 8px;
    color: #8c8c8c;
  }
  
  .chat-preview {
    font-size: 14px;
    color: #8c8c8c;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .chat-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 65px;
  }
  
  .chat-time {
    font-size: 12px;
    color: #8c8c8c;
    margin-bottom: 4px;
  }
  
  .mute-icon {
    color: #bfbfbf;
  }
  
  .active {
    background-color: #e6f7ff;
  }
  
  .active:hover {
    background-color: #e6f7ff;
  }
  
  /* Custom scrollbar styles */
  .chat-list::-webkit-scrollbar {
    width: 6px;
  }
  
  .chat-list::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .chat-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
  
  .chat-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  </style>
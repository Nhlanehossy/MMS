<template>
    <div class="m-3">
      <ResourceRenderer :resource="profileResource" :displayData="profileData" :layout="profileLayout"
        :showHeading="false" class="card" />
      <div class="flex justify-between items-center">
        <h2 class="heading">Posts</h2>
        <action_dispatcher :resource="{
          actions: [
            { name: 'add post', icon: 'fa fa-plus', label: 'Add Post' },
            { name: 'export', icon: 'fa fa-download', label: 'Export' },
            { name: 'deleteall', icon: 'fa fa-trash', label: 'Delete All' }
          ]
        }" :item="{}" :orientation="'dropdown'" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-4 md:gap-y-10">
        <div class="card" v-for="(post, index) in postData" :key="index">
          <ResourceRenderer :resource="postResource" :displayData="post" :layout="postLayout" :showHeading="false" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ResourceRenderer from '../components/Object/objectrenderer.vue';
  import action_dispatcher from '../components/action_dispatcher.vue';
  
  export default {
    name: 'App',
    components: {
      ResourceRenderer,
      action_dispatcher
    },
    data() {
      return {
  
        profileResource: {
          name: 'profile',
          label: 'Profile',
          icon: 'pi pi-user',
          schema: [
            { name: 'image', type: 'image', label: 'Image' },
            { name: 'fullname', type: 'text', label: 'Fullname' },
            { name: 'email', type: 'email', label: 'Email' },
          ],
        },
        profileData: {
          image: 'https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          fullname: 'John Doe',
          email: 'john.doe@example.com',
        },
        profileLayout: {
          rows: 2,
          columns: 4,
          fields: {
            image: { rowStart: 1, rowSpan: 2, colStart: 1, colSpan: 1, isAvatar: true },
            fullname: { rowStart: 1, rowSpan: 1, colStart: 2, colSpan: 2 },
            email: { rowStart: 2, rowSpan: 1, colStart: 2, colSpan: 2 },
          },
          actions: [
            {
              name: 'profile_actions',
              rowStart: 1,
              rowSpan: 2,
              colStart: 4,
              colSpan: 1,
              alignment: 'top-right',
              actions: [
                { name: 'edit', icon: 'fa fa-edit', label: 'Edit' },
                { name: 'delete', icon: 'fa fa-trash', label: 'Delete' },
                { name: 'send tip', icon: 'fa fa-send', label: 'Send Tip' },
                { name: 'message', icon: 'fa fa-envelope', label: 'Message' },
              ],
              orientation: 'dropdown'
            },
            {
              name: 'follow_action',
              rowStart: 2,
              rowSpan: 1,
              colStart: 4,
              colSpan: 1,
              alignment: 'top-right',
              actions: [
                { name: 'follow', icon: 'fa fa-user-plus', label: 'Follow' },
              ],
              orientation: 'buttons'
            }
          ]
        },
        postResource: {
          name: 'post',
          label: 'Post',
          icon: 'pi pi-file',
          schema: [
            { name: 'image', type: 'image', label: 'Image' },
            { name: 'title', type: 'text', label: 'Title' },
            { name: 'content', type: 'richtext', label: 'Content' },
          ],
        },
        postData: [
          {
            image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            title: 'The Enchanted Forest',
            content: 'Discover the magical world hidden within the ancient trees, where fairies dance and mythical creatures roam.',
          },
          {
            image: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            title: 'Culinary Adventures',
            content: 'Embark on a gastronomic journey through exotic flavors and innovative cooking techniques from around the globe.',
          },
          {
            image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            title: 'Tech Revolution',
            content: 'Explore the cutting-edge innovations shaping our future, from AI to quantum computing and beyond.',
          },
          {
            image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            title: 'Mindful Living',
            content: 'Learn the art of mindfulness and discover how to find peace and balance in our fast-paced modern world.',
          },
          {
            image: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            title: 'Urban Exploration',
            content: 'Uncover the hidden gems and forgotten histories of bustling metropolises around the world.',
          },
          {
            image: 'https://images.pexels.com/photos/3621344/pexels-photo-3621344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            title: 'Sustainable Fashion',
            content: 'Dive into the world of eco-friendly fashion and learn how to look fabulous while reducing your environmental impact.',
          },
          {
            image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            title: 'Cosmic Wonders',
            content: 'Journey through the cosmos and explore the latest discoveries in astronomy and space exploration.',
          },
          {
            image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            title: 'The Art of Collaboration',
            content: 'Unlock the power of teamwork and learn how to foster creativity and innovation in group settings.',
          },
        ],
        postLayout: {
          rows: 8,
          columns: 4,
          actions: [
            {
              name: 'top_end_actions',
              rowStart: 1,
              rowSpan: 1,
              colStart: 4,
              colSpan: 1,
              alignment: 'bottom-right',
              actions: [
                { name: 'do_not_recommend', icon: 'fa fa-thumbs-down', label: 'Do Not Recommend' },
                { name: 'report', icon: 'fa fa-flag', label: 'Report' },
              ],
              orientation: 'dropdown',
              style: 'position: absolute; top: 0.5rem; right: 0.5rem; z-index: 10;'
            },
            {
              name: 'bottom_start_actions',
              rowStart: 8,
              rowSpan: 1,
              colStart: 1,
              colSpan: 3,
              actions: [
                { name: 'like', icon: 'fa fa-thumbs-up', label: 'Like' },
                { name: 'comment', icon: 'fa fa-comment', label: 'Comment' },
                { name: 'share', icon: 'fa fa-share', label: 'Share' },
              ],
              orientation: 'icons'
            },
            {
              name: 'bottom_end_actions',
              rowStart: 8,
              rowSpan: 1,
              colStart: 4,
              colSpan: 1,
              actions: [
                { name: 'see more', icon: 'pi pi-arrow-right', label: 'See More' },
              ],
              orientation: 'buttons'
            }
          ],
          fields: {
            image: { rowStart: 2, rowSpan: 3, colStart: 1, colSpan: 4 },
            title: { rowStart: 5, rowSpan: 1, colStart: 1, colSpan: 4 },
            content: { rowStart: 6, rowSpan: 2, colStart: 1, colSpan: 4 }
          },
        },
      };
    },
  };
  </script>
  
  
  <style scoped>
  button {
    color: aliceblue;
  }
  </style>
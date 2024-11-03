<template>
    <!-- profile card -->
    <div>
      <div class="card m-16">
        <div class="flex p-0 m-0 justify-between">
          <i></i>
          <action_dispatcher :resource="{
            actions: [
              {
                name: 'ArchiveAction',
                icon: 'fa fa-archive',
                label: 'Archive'
              },
              {
                name: 'FavoriteAction',
                icon: 'pi pi-star',
                label: 'Favorite',
              }
            ]
          }" :item="{}" />
        </div>
        <GridLayout :rows="5" :columns="4" :items="gridItems2" />
      </div>
    </div>
  </template>
  
  <script>
  
  import NestedGrid from '../components/NestedGrid.vue';
  import Action_dispatcher from '../components/action_dispatcher.vue';
  
  export default {
    name: 'App',
    components: {
      GridLayout: NestedGrid,
      Action_dispatcher
    },
    data() {
      return {
        gridItems2: [
          { content: 'https://picsum.photos/536/354', type: 'image', rowSpan: 6, colSpan: 2, color: '#ff9999' }, // Image spans all 3 columns
          { content: 'Gift Mkyelu', type: 'title', rowSpan: 1, colSpan: 2, color: '#99ff99' }, // Title spans all columns
          { content: 'Lead developer', type: 'subtitle', rowSpan: 1, colSpan: 2, color: '#ff99ff' }, // Subtitle spans all columns
          { content: '200k followers', type: 'subtitle', rowSpan: 1, colSpan: 1, color: '#9999ff' }, // Subtitle in 1st column
          { content: '20k following', type: 'subtitle', rowSpan: 1, colSpan: 1, color: '#ffff99' }, // Subtitle in 2nd column
          {
            content: '', type: 'actions', actions: [
              {
                name: 'Follow',
                icon: 'pi pi-user-plus',
                label: 'Follow',
              },
              {
                name: 'like',
                icon: 'pi pi-heart',
                label: 'Like',
              },
              {
                name: 'subscribe',
                icon: 'pi pi-bell',
                label: 'Subscribe',
              },
              {
                name: 'sendTip',
                icon: 'pi pi-credit-card',
                label: 'Send Tip',
              }
            ], orientation: 'icons', rowSpan: 2, colSpan: 2, color: '#99ffff'
          }, // Actions spans all columns
        ],
  
        gridItems: [
          { content: 'https://picsum.photos/536/354', type: 'image', rowSpan: 4, colSpan: 3, color: '#ff9999' },
          { content: 'Cool Air conditioner', type: 'title', rowSpan: 2, colSpan: 2, color: '#99ff99' },
          { content: 'MK40000', type: 'subtitle', rowSpan: 1, colSpan: 1, color: '#ff99ff' },
          { content: 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', type: 'subtitle', rowSpan: 3, colSpan: 3, color: '#9999ff' },
          {
            content: 'hi there, how are you', type: 'actions', actions: [
              {
                name: 'addToWishlist',
                icon: 'pi pi-heart',
                label: 'Add to Wishlist',
              },
              {
                name: 'review',
                icon: 'pi pi-star',
                label: 'Review',
              },
              {
                name: 'comment',
                icon: 'pi pi-comment',
                label: 'Comment',
              }
            ], orientation: 'icons', rowSpan: 1, colSpan: 3, color: '#99ffff'
          },
          {
            content: 'hi there, how are you', type: 'actions', actions: [
              {
                name: 'addToCart',
                icon: 'fa fa-shopping-cart',
                label: 'Add to Cart',
              },
              {
                name: 'view more',
                icon: 'fa fa-eye',
                label: 'View More',
              }
            ], orientation: 'buttons', rowSpan: 1, colSpan: 3, color: '#99ccff'
          },

        ]
  
  
  
      }
    }
  }
  </script>
  

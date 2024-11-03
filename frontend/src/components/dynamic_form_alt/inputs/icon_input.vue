<template>
    <div class="icon-input">
        <label :for="name">{{ title }}</label>
        <div class="input-wrapper">
            <input :id="name" type="text" v-model="searchTerm" @input="searchIcons" @focus="showDropdown = true"
                :placeholder="`Search for an ${title}...`" class="w-full px-3 py-2 rounded-md" />
            <i v-if="value" :class="value" class="selected-icon"></i>
        </div>
        <div v-if="showDropdown" class="icon-dropdown">
            <!-- Rest of the dropdown content remains the same -->
            <div class="category-tabs">
                <span v-for="category in categories" :key="category" @click="selectCategory(category)"
                    :class="{ active: currentCategory === category }">
                    {{ category }}
                </span>
            </div>
            <div class="icons-grid">
                <div v-for="icon in filteredIcons" :key="icon.class" @click="selectIcon(icon)" class="icon-option"
                    :title="icon.name">
                    <i :class="icon.class"></i>
                    <span class="icon-name">{{ icon.name }}</span>
                </div>
            </div>
            <div v-if="filteredIcons.length === 0" class="no-results">
                No icons found. Try a different search term.
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const allIcons = {
    'General': [
        { name: 'Home', class: 'fas fa-home' },
        { name: 'User', class: 'fas fa-user' },
        { name: 'Cog', class: 'fas fa-cog' },
        { name: 'Sign Out', class: 'fas fa-sign-out-alt' },
        { name: 'Info', class: 'fas fa-info-circle' },
        { name: 'Check', class: 'fas fa-check' },
        { name: 'Times', class: 'fas fa-times' },
        { name: 'Search', class: 'fas fa-search' },
        { name: 'Plus', class: 'fas fa-plus' },
        { name: 'Minus', class: 'fas fa-minus' },
        { name: 'T shirt', class: 'fas fa-tshirt' },
        { name: 'electronics', class: 'fas fa-laptop' },
        { name: 'bank', class: 'fas fa-university' },
    ],

    'Communication': [
        { name: 'Bell', class: 'pi pi-bell' },
        { name: 'Envelope', class: 'fas fa-envelope' },
        { name: 'Phone', class: 'fas fa-phone' },
        { name: 'Comment', class: 'fas fa-comment' },
        { name: 'Comments', class: 'fas fa-comments' },
        { name: 'Video', class: 'fas fa-video' },
        { name: 'Microphone', class: 'fas fa-microphone' },
        { name: 'Chat', class: 'pi pi-comment' },
        { name: 'Message', class: 'pi pi-envelope' },
        { name: 'At', class: 'fas fa-at' },
        { name: 'Link', class: 'fas fa-link' },
        { name: 'Paperclip', class: 'fas fa-paperclip' },
        { name: 'like', class: 'pi pi-thumbs-up' },
        { name: 'dislike', class: 'pi pi-thumbs-down' },
        { name: 'heart', class: 'pi pi-heart' },
        { name: 'heart-fill', class: 'pi pi-heart-fill' },
        { name: 'heart-empty', class: 'pi pi-heart-empty' },
        { name: 'heart-half', class: 'pi pi-heart-half' },
        { name: 'star', class: 'pi pi-star' },
        { name: 'star-fill', class: 'pi pi-star-fill' },
        { name: 'star-half', class: 'pi pi-star-half' },
        { name: 'star-empty', class: 'pi pi-star-empty' },
        { name: 'star-off', class: 'pi pi-star-off' },
        { name: 'star-half-filled', class: 'pi pi-star-half-filled' },
        { name: 'upvote', class: 'pi pi-arrow-up' },
        { name: 'downvote', class: 'pi pi-arrow-down' },
    ],

    'Actions': [
        { name: 'Archive', class: 'fas fa-archive' },
        { name: 'Unarchive', class: 'fas fa-box-open' },
        { name: 'Approve', class: 'fas fa-check-circle' },
        { name: 'Activate', class: 'fas fa-toggle-on' },
        { name: 'Deactivate', class: 'fas fa-toggle-off' },
        { name: 'Send Message', class: 'fas fa-paper-plane' },
        { name: 'Reply', class: 'fas fa-reply' },
        { name: 'Forward', class: 'fas fa-share' },
        { name: 'Cancel', class: 'fas fa-times-circle' },
        { name: 'Edit', class: 'fas fa-edit' },
        { name: 'Delete', class: 'fas fa-trash' },
        { name: 'Save', class: 'fas fa-save' },
        { name: 'Download', class: 'fas fa-download' },
        { name: 'Upload', class: 'fas fa-upload' },
        { name: 'Print', class: 'fas fa-print' },
        { name: 'Share', class: 'fas fa-share-alt' },
        { name: 'Pin', class: 'fas fa-thumbtack' },
        { name: 'Bookmark', class: 'fas fa-bookmark' },
        { name: 'Lock', class: 'fas fa-lock' },
        { name: 'Unlock', class: 'fas fa-unlock' }
    ],


    'Miscellaneous': [
        { name: 'Anchor', class: 'fas fa-anchor' },
        { name: 'Atom', class: 'fas fa-atom' },
        { name: 'Award', class: 'fas fa-award' },
        { name: 'Balance Scale', class: 'fas fa-balance-scale' },
        { name: 'Bell Slash', class: 'fas fa-bell-slash' },
        { name: 'Bong', class: 'fas fa-bong' },
        { name: 'Bug', class: 'fas fa-bug' },
        { name: 'Bullhorn', class: 'fas fa-bullhorn' },
        { name: 'Cactus', class: 'fas fa-cactus' },
        { name: 'Camera Retro', class: 'fas fa-camera-retro' },
        { name: 'Chess', class: 'fas fa-chess' },
        { name: 'Cocktail', class: 'fas fa-cocktail' },
        { name: 'Compass Slash', class: 'fas fa-compass-slash' },
        { name: 'Crow', class: 'fas fa-crow' },
        { name: 'Dragon', class: 'fas fa-dragon' },
        { name: 'Dice', class: 'fas fa-dice' },
        { name: 'Earth', class: 'fas fa-globe' },
        { name: 'Fire', class: 'fas fa-fire' },
        { name: 'Fist Raised', class: 'fas fa-fist-raised' },
        { name: 'Gavel', class: 'fas fa-gavel' },
        { name: 'Ghost', class: 'fas fa-ghost' },
        { name: 'Guitar', class: 'fas fa-guitar' },
        { name: 'Hand Holding', class: 'fas fa-hand-holding' },
        { name: 'Horse', class: 'fas fa-horse' },
        { name: 'Infinity', class: 'fas fa-infinity' },
        { name: 'Jedi', class: 'fas fa-jedi' },
        { name: 'Lemon', class: 'fas fa-lemon' },
        { name: 'Meteor', class: 'fas fa-meteor' },
        { name: 'Mountain', class: 'fas fa-mountain' },
        { name: 'Ninja', class: 'fas fa-user-ninja' },
        { name: 'Paint Brush', class: 'fas fa-paint-brush' },
        { name: 'Puzzle Piece', class: 'fas fa-puzzle-piece' },
        { name: 'Robot', class: 'fas fa-robot' },
        { name: 'Skull', class: 'fas fa-skull' },
        { name: 'Smile Beam', class: 'fas fa-smile-beam' },
        { name: 'Spider', class: 'fas fa-spider' },
        { name: 'Sun', class: 'fas fa-sun' },
        { name: 'Theater Masks', class: 'fas fa-theater-masks' },
        { name: 'Tooth', class: 'fas fa-tooth' },
        { name: 'Trophy', class: 'fas fa-trophy' },
        { name: 'Umbrella Beach', class: 'fas fa-umbrella-beach' },
        { name: 'User Secret', class: 'fas fa-user-secret' },
        { name: 'Water', class: 'fas fa-water' },
        { name: 'Wind', class: 'fas fa-wind' },
        { name: 'Wrench', class: 'fas fa-wrench' },

        // PrimeIcons
        { name: 'Cloud', class: 'pi pi-cloud' },
        { name: 'Power', class: 'pi pi-power-off' },
        { name: 'Shield', class: 'pi pi-shield' },
        { name: 'Sitemap', class: 'pi pi-sitemap' },
        { name: 'Smile', class: 'pi pi-smile' },
        { name: 'Sort', class: 'pi pi-sort' },
        { name: 'Undo', class: 'pi pi-undo' },
        { name: 'Redo', class: 'pi pi-redo' },
        { name: 'Ticket', class: 'pi pi-ticket' },
        { name: 'Trash', class: 'pi pi-trash' },
        { name: 'Tree', class: 'pi pi-tree' },
        { name: 'Trophy', class: 'pi pi-trophy' },
        { name: 'Unlock', class: 'pi pi-unlock' },
        { name: 'User', class: 'pi pi-user' },
        { name: 'Users', class: 'pi pi-users' },
        { name: 'Wifi', class: 'pi pi-wifi' },
        { name: 'Wrench', class: 'pi pi-wrench' },
        { name: 'Key', class: 'pi pi-key' },
        { name: 'Info', class: 'pi pi-info-circle' },
        { name: 'Gift', class: 'pi pi-gift' },
        { name: 'Heart', class: 'pi pi-heart' },
        { name: 'Music', class: 'pi pi-music' }
    ],
    'Navigation': [
        { name: 'Arrow Up', class: 'fas fa-arrow-up' },
        { name: 'Arrow Down', class: 'fas fa-arrow-down' },
        { name: 'Arrow Left', class: 'fas fa-arrow-left' },
        { name: 'Arrow Right', class: 'fas fa-arrow-right' },
        { name: 'Step Forward', class: 'fas fa-step-forward' },
        { name: 'Step Backward', class: 'fas fa-step-backward' },
        { name: 'Compass', class: 'fas fa-compass' },
        { name: 'Location Pin', class: 'fas fa-map-marker-alt' },
        { name: 'Map', class: 'fas fa-map' },
        { name: 'Sync', class: 'fas fa-sync' }
    ],

    'Media': [
        { name: 'Play', class: 'fas fa-play' },
        { name: 'Pause', class: 'fas fa-pause' },
        { name: 'Stop', class: 'fas fa-stop' },
        { name: 'Volume Up', class: 'fas fa-volume-up' },
        { name: 'Volume Down', class: 'fas fa-volume-down' },
        { name: 'Volume Mute', class: 'fas fa-volume-mute' },
        { name: 'Music', class: 'fas fa-music' },
        { name: 'Image', class: 'fas fa-image' },
        { name: 'Video', class: 'fas fa-video' },
        { name: 'Camera', class: 'fas fa-camera' }
    ],

    'E-commerce': [
        { name: 'Shopping Cart', class: 'fas fa-shopping-cart' },
        { name: 'Tag', class: 'fas fa-tag' },
        { name: 'Tags', class: 'fas fa-tags' },
        { name: 'Wallet', class: 'fas fa-wallet' },
        { name: 'Credit Card', class: 'fas fa-credit-card' },
        { name: 'Dollar Sign', class: 'fas fa-dollar-sign' },
        { name: 'Money Bill', class: 'fas fa-money-bill' },
        { name: 'Barcode', class: 'fas fa-barcode' },
        { name: 'Bag', class: 'fas fa-shopping-bag' },
        { name: 'Gift', class: 'fas fa-gift' }
    ],

    'Social Media': [
        { name: 'Facebook', class: 'fab fa-facebook' },
        { name: 'Twitter', class: 'fab fa-twitter' },
        { name: 'Instagram', class: 'fab fa-instagram' },
        { name: 'LinkedIn', class: 'fab fa-linkedin' },
        { name: 'YouTube', class: 'fab fa-youtube' },
        { name: 'Pinterest', class: 'fab fa-pinterest' },
        { name: 'Snapchat', class: 'fab fa-snapchat' },
        { name: 'TikTok', class: 'fab fa-tiktok' },
        { name: 'Reddit', class: 'fab fa-reddit' },
        { name: 'WhatsApp', class: 'fab fa-whatsapp' }
    ],

    'Documents': [
        { name: 'File', class: 'fas fa-file' },
        { name: 'File Alt', class: 'fas fa-file-alt' },
        { name: 'Folder', class: 'fas fa-folder' },
        { name: 'Folder Open', class: 'fas fa-folder-open' },
        { name: 'Copy', class: 'fas fa-copy' },
        { name: 'Paste', class: 'fas fa-paste' },
        { name: 'Save', class: 'fas fa-save' },
        { name: 'Download', class: 'fas fa-download' },
        { name: 'Upload', class: 'fas fa-upload' },
        { name: 'Print', class: 'fas fa-print' }
    ],

    'Devices': [
        { name: 'Desktop', class: 'fas fa-desktop' },
        { name: 'Laptop', class: 'fas fa-laptop' },
        { name: 'Mobile', class: 'fas fa-mobile-alt' },
        { name: 'Tablet', class: 'fas fa-tablet-alt' },
        { name: 'TV', class: 'fas fa-tv' },
        { name: 'Watch', class: 'fas fa-clock' },
        { name: 'Battery Full', class: 'fas fa-battery-full' },
        { name: 'Battery Half', class: 'fas fa-battery-half' },
        { name: 'Plug', class: 'fas fa-plug' },
        { name: 'Wifi', class: 'fas fa-wifi' }
    ],

    'Health & Fitness': [
        { name: 'Heartbeat', class: 'fas fa-heartbeat' },
        { name: 'Running', class: 'fas fa-running' },
        { name: 'Dumbbell', class: 'fas fa-dumbbell' },
        { name: 'Apple Alt', class: 'fas fa-apple-alt' },
        { name: 'Bicycle', class: 'fas fa-bicycle' },
        { name: 'Weight', class: 'fas fa-weight' },
        { name: 'First Aid', class: 'fas fa-first-aid' },
        { name: 'Medkit', class: 'fas fa-medkit' },
        { name: 'Prescription', class: 'fas fa-prescription' },
        { name: 'Stethoscope', class: 'fas fa-stethoscope' }
    ],

    'Statistics': [
        { name: 'Chart Line', class: 'fas fa-chart-line' },
        { name: 'Chart Bar', class: 'fas fa-chart-bar' },
        { name: 'Chart Pie', class: 'fas fa-chart-pie' },
        { name: 'Chart Area', class: 'fas fa-chart-area' },
        { name: 'Arrow Up', class: 'fas fa-arrow-up' },
        { name: 'Arrow Down', class: 'fas fa-arrow-down' },
        { name: 'Percentage', class: 'fas fa-percentage' },
        { name: 'Analytics', class: 'pi pi-chart-line' },
        { name: 'Report', class: 'fas fa-file-alt' },
        { name: 'Calculator', class: 'fas fa-calculator' }
    ]
};
export default {
    name: 'IconInput',
    props: {
        name: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    },
    emits: ['update:value'],
    setup(props, { emit }) {
        const searchTerm = ref('');
        const showDropdown = ref(false);
        const currentCategory = ref('All');

        const categories = computed(() => ['All', ...Object.keys(allIcons)]);

        const filteredIcons = computed(() => {
            let icons = currentCategory.value === 'All'
                ? Object.values(allIcons).flat()
                : allIcons[currentCategory.value] || [];

            if (searchTerm.value) {
                icons = icons.filter(icon =>
                    icon.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                    icon.class.toLowerCase().includes(searchTerm.value.toLowerCase())
                );
            }

            return icons;
        });

        function searchIcons() {
            showDropdown.value = true;
        }

        function selectIcon(icon) {
            emit('update:value', icon.class);
            searchTerm.value = icon.name;
            showDropdown.value = false;
        }

        function selectCategory(category) {
            currentCategory.value = category;
        }

        function handleClickOutside(event) {
            if (!event.target.closest('.icon-input')) {
                showDropdown.value = false;
            }
        }

        // Watch for external value changes
        watch(() => props.value, (newValue) => {
            // Find the icon name for the selected class
            const allIconsList = Object.values(allIcons).flat();
            const selectedIcon = allIconsList.find(icon => icon.class === newValue);
            if (selectedIcon) {
                searchTerm.value = selectedIcon.name;
            }
        });

        onMounted(() => {
            document.addEventListener('click', handleClickOutside);
        });

        onUnmounted(() => {
            document.removeEventListener('click', handleClickOutside);
        });

        return {
            searchTerm,
            showDropdown,
            filteredIcons,
            categories,
            currentCategory,
            searchIcons,
            selectIcon,
            selectCategory,
        };
    }
};
</script>

<style scoped>
.icon-input {
    position: relative;
    width: 100%;
}

button {
    background-color: var(--primary);
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.selected-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2em;
}

.icon-dropdown {
    position: absolute;
    font-size: small;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    min-width: 500px;
    overflow-y: auto;
    background: var(--cardDark);
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.category-tabs {
    display: flex;
    overflow-x: auto;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.category-tabs span {
    padding: 5px 10px;
    margin-right: 5px;
    border: none;
    color: var(--primary);
    cursor: pointer;
    white-space: nowrap;
}

.category-tabs span.active {
    border-bottom: 2px solid var(--secondary);
    font-weight: bold;
}

.icons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
    padding: 15px;
}

.icon-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.icon-option:hover {
    background-color: #f0f0f0;
}

.icon-option i {
    font-size: 1.5em;
    margin-bottom: 5px;
    color: var(--secondary);
}

.icon-name {
    font-size: 0.8em;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}

.no-results {
    padding: 20px;
    text-align: center;
    color: #666;
}
</style>
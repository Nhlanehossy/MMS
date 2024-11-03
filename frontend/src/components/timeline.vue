<template>
    <div v-if="items.length" class="timeline">
        <div v-for="item in items" :key="item.id" class="timeline-item" :class="{ unread: !item.read }">
            <div class="timeline-icon">
                <i class="pi pi-bell"></i>
            </div>
            <div class="timeline-content">
                <div class="flex justify-between">
                    <h3 class="timeline-title">{{ item.title }}</h3>
                    <action_dispatcher :resource="{
                        actions: [
                            { name: 'ArchiveAction', icon: 'fa fa-archive', label: 'Archive' },
                            { name: 'FavoriteAction', icon: 'pi pi-star', label: 'Favorite' }
                        ]
                    }" :item="{}" />
                </div>
                <p class="timeline-body">{{ item.body }}</p>
                <span class="timeline-date">{{ formatTimeAgo(item.createdAt) }}</span>
            </div>
        </div>
    </div>
    <a-empty v-else description="No items available" />
</template>

<script>
import action_dispatcher from './action_dispatcher.vue';
import { Empty } from 'ant-design-vue';

export default {
    components: {
        'a-empty': Empty,
        action_dispatcher,
    },
    props: {
        items: Array,
    },
    methods: {
        formatTimeAgo(dateStr) {
            // Time formatting logic as in the original component
            const now = new Date();
            const date = new Date(dateStr);
            const diffInSeconds = Math.floor((now - date) / 1000);
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            const diffInHours = Math.floor(diffInMinutes / 60);
            const diffInDays = Math.floor(diffInHours / 24);
            const diffInWeeks = Math.floor(diffInDays / 7);
            const diffInMonths = Math.floor(diffInDays / 30);

            if (diffInSeconds < 60) return 'Just now';
            if (diffInMinutes < 60) return `${diffInMinutes} minute(s) ago`;
            if (diffInHours < 24) return `${diffInHours} hour(s) ago`;
            if (diffInDays < 7) return `${diffInDays} day(s) ago`;
            if (diffInWeeks < 4) return `${diffInWeeks} week(s) ago`;
            return date.toLocaleDateString();
        },
    },
};
</script>

<style scoped>
.timeline {
    position: relative;
    padding: 20px 0;
}

.timeline::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50px;
    width: 2px;
    background: #ccc;
}

.timeline-item {
    position: relative;
    margin-bottom: 40px;
}

.timeline-icon {
    position: absolute;
    left: 35px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #007bff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.timeline-content {
    margin-left: 80px;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
}

.timeline-item.unread .timeline-content {
    background: #e6f7ff;
}

.timeline-title {
    margin-top: 0;
    color: #333;
}

.timeline-body {
    margin: 10px 0;
}

.timeline-date {
    font-size: 0.8rem;
    color: #888;
}
</style>
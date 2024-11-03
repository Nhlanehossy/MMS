
<template>
    <WidgetRenderer :widgets="resource.widgets" />
   
</template>
<script>
import Action_dispatcher from '../../../action_dispatcher.vue';
import WidgetRenderer from '../../../widgets/widget_renderer.vue';
export default {
    components: {
        WidgetRenderer,
        Action_dispatcher
    },
    props: {
        resource: {
            type: Object,
            required: true,
        },
    }
}
</script>
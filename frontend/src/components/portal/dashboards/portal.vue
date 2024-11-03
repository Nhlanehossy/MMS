<template>
<h1>{{ path }}</h1>
</template>

<script>
import { e_commerce_management_system } from '../../../modules/e_commerce_system/system';

export default{
data(){
    path:null
},

mounted(){
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    const firstPathSegment = currentPath.split('/')[1];
    console.log('First path segment:', firstPathSegment);

    this.path=firstPathSegment
}
}

</script>
<template>
    <div class="header-with-options">
        <span>{{header}}</span>
        <div @click="$emit('headerClicked', {event: $event, header})" class="arrow-down"></div>
    </div>
</template>

<script>

    export default {
        name: "HeaderCell",
        props: ['header'],
        components: {}
    }
</script>

<style scoped>

    .header-with-options {
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex: 1;
        position: relative;
    }

    .arrow-down {
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 7px solid black;
        transform: rotate(180deg);
    }

</style>

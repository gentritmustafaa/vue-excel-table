<template>
    <div v-click-outside="hide" class="mouse-dropdown" :style="style">
        <div @click="$emit('manipulateRows', 'insert-row-up')">Insert row above</div>
        <div @click="$emit('manipulateRows', 'insert-row-down')">Insert row below</div>
        <div @click="$emit('manipulateRows', 'insert-column-right')">Insert column right</div>
        <div @click="$emit('manipulateRows', 'insert-column-left')">Insert column left</div>
    </div>
</template>

<script>
    import ClickOutside from 'vue-click-outside'
    export default {
        name: "MouseDropdown",
        props: ['clickDetails'],
        mounted() {
        },
        computed: {
            style() {
                return {
                    left: `${this.clickDetails.clientX}px`,
                    top: `${this.clickDetails.clientY}px`,
                }
            }
        },
        methods: {
            hide() {
                this.$emit('closeMouseDropdown')
            }
        },
        directives: {
            ClickOutside
        }
    }
</script>

<style scoped lang="scss">
    .mouse-dropdown {
        position: absolute;
        width: 160px;
        height: 150px;
        border: 2px solid #dadada;
        display: flex;
        flex-direction: column;
        background: white;
        z-index: 10;
        div {
            padding: 10px;
            font-size: 13px;
            cursor: pointer;
        }
    }
</style>

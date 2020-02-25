<template>
    <textarea @mouseleave="hide" @input="$emit('change', model)" v-model="model"
              class="container" :style="style"
              cols="5" rows="5"></textarea>
</template>

<script>
    import ClickOutside from 'vue-click-outside'

    export default {
        name: "commentPopup",
        props: ['value'],
        data() {
            return {
                model: null
            }
        },
        mounted() {
            this.model = this.value.comment
        },
        computed: {
            style() {
                return {
                    left: `${this.value.event.clientX}px`,
                    top: `${this.value.event.clientY}px`,
                }
            }
        },
        methods: {
            hide() {
                this.$emit('hideCommentSection')
            }
        },
        directives: {
            ClickOutside
        }
    }
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        position: absolute;
        width: 140px;
        border: 2px solid #4b88ff;
        background: whitesmoke;
        height: 100px;
        overflow: scroll;
        -webkit-box-align: start;
        -ms-flex-align: start;
        align-items: start;
        z-index: 1000;
    }

    .dropdown-header {
        display: flex;
        font-size: 11px;
        color: #999;
        font-family: Arial, sans-serif;
    }
</style>

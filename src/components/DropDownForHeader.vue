<template>
    <div class="mouse-dropdown" :style="style">
        <div @click="$emit('manipulateRows', 'insert-column-right')">Insert column right</div>
        <div @click="$emit('manipulateRows', 'insert-column-left')">Insert column left</div>
        <div @click="$emit('manipulateRows', 'delete-column')">Delete column</div>
        <div @click="$emit('manipulateRows', 'clear-column')">Clear column</div>
        <div @click="$emit('manipulateRows', 'copy')">Copy</div>
        <div class="select">
            <select v-model="filter" name="filter">
                <option v-for="f in filter_options" :value="f">{{f.name}}</option>
            </select>
        </div>
        <div v-if="showInputFiled">
            <input v-model="filter_text" type="text">
        </div>
        <div class="flexed justify-between">
            <button @click="save">Save</button>
            <button @click="hide">Cancel</button>
        </div>
    </div>
</template>

<script>

    export default {
        name: "DropDownForHeader",
        props: ['value', 'rows', 'headers', 'selectedHeaders'],
        data() {
            return {
                filter: {name: 'None', value: 'none'},
                filter_text: null,
                filter_options: [{
                    name: 'None',
                    value: 'none'
                }, {
                    name: 'Is empty',
                    value: 'empty'
                }, {
                    name: 'Is not empty',
                    value: 'not-empty'
                }, {
                    name: 'Is not equal to',
                    value: 'not-equal-to'
                }, {
                    name: 'Starts with',
                    value: 'starts-with'
                }, {
                    name: 'Ends with',
                    value: 'ends-with'
                }, {
                    name: 'Contains',
                    value: 'contains'
                }, {
                    name: 'Does not contain',
                    value: 'not-contain'
                }]
            }
        },
        mounted() {
        },
        computed: {
            style() {
                return {
                    left: `${this.value.event.clientX}px`,
                    top: `${this.value.event.clientY}px`,
                }
            },
            showInputFiled() {
                return this.filter_options.findIndex(f => f.value === this.filter.value) > 2
            }
        },
        methods: {
            hide() {
                this.$emit('closeMouseDropdown')
            },
            save() {
                let filteredRows = []
                switch (this.filter.value) {
                    case 'none': {
                        this.$emit('updatedRows', this.rows)
                        this.hide()
                        return;
                    }
                    case 'empty': {
                        filteredRows = this.rows.filter(r => {
                            return !r[this.value.header_key]
                        })
                        this.$emit('updatedRows', filteredRows)
                        this.hide()
                        return;
                    }
                    case 'not-empty': {
                        filteredRows = this.rows.filter(r => {
                            return r[this.value.header_key]
                        })
                        this.$emit('updatedRows', filteredRows)
                        this.hide()
                        return;
                    }
                    case 'not-equal-to': {
                        filteredRows = this.rows.filter(r => {
                            return r[this.value.header_key] !== this.filter_text
                        })
                        this.$emit('updatedRows', filteredRows)
                        this.hide()
                        return;
                    }
                    case 'starts-with': {
                        filteredRows = this.rows.filter(r => {
                            return r[this.value.header_key] && (r[this.value.header_key]).toString().startsWith(this.filter_text)
                        })
                        this.$emit('updatedRows', filteredRows)
                        this.hide()
                        return;
                    }
                    case 'ends-with': {
                        filteredRows = this.rows.filter(r => {
                            return r[this.value.header_key] && (r[this.value.header_key]).toString().endsWith(this.filter_text)
                        })
                        this.$emit('updatedRows', filteredRows)
                        this.hide()
                        return;
                    }
                    case 'contains': {
                        filteredRows = this.rows.filter(r => {
                            return r[this.value.header_key] && (r[this.value.header_key]).toString().includes(this.filter_text)
                        })
                        this.$emit('updatedRows', filteredRows)
                        this.hide()
                        return;
                    }
                    case 'not-contain': {
                        filteredRows = this.rows.filter(r => {
                            return r[this.value.header_key] && !(r[this.value.header_key]).toString().includes(this.filter_text)
                        })
                        this.$emit('updatedRows', filteredRows)
                        this.hide()
                        return;
                    }
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .mouse-dropdown {
        position: absolute;
        width: 160px;
        height: auto;
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

    .select {
        select {
            width: 100%;
        }
    }
</style>

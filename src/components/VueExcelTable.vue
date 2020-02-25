<template>
    <div class="excel" v-if="copiedRows.length > 0" @mouseup="mouseIsDownInSelectedCell && mouseDown(false), mouseIsDownOnCell = false"
         :style="cssProps">
        <div class="flexed">
            <div class="static-cell">
                <button @click="undoFunction()">Undo</button>
            </div>
            <div class="excel__headers" ref="headers">
                <div class="excel__header--cell"
                     :class="{'active-column-row': activeCell ? activeCell.column === header : false}"
                     v-for="header in copiedHeaders">
                    <HeaderCell :header="header" @headerClicked="selectedHeaderCell($event)"></HeaderCell>
                </div>
            </div>
        </div>
        <div class="excel__body">
            <div class="excel__rows-identifier" ref="rows_identifier">
                <div class="excel__body--row-identifier"
                     :class="{'active-column-row': activeCell ? activeCell.row === key : false}"
                     v-for="key in copiedRows.length">{{key}}
                </div>
            </div>
            <div class="excel__body-rows-container"
                 ref="body"
                 @scroll="handleScroll">
                <div class="excel__body--row" v-for="(row, rowKey) in copiedRows">
                    <!--@click="selectCell(copiedHeaders[cellKey], rowKey+1)"-->
                    <div class="excel__body--cell"
                         @dblclick="editingCell = {column: cellKey, row: row}"
                         :id="`${copiedHeaders[cellKey]}-${rowKey+1}`"
                         @contextmenu="rightMouseClick($event, cellKey, rowKey + 1)"
                         @mousedown="mouseDownOnCell(copiedHeaders[cellKey], rowKey + 1, row[cellKey])"
                         @mousemove="mouseIsMoving(copiedHeaders[cellKey], rowKey+1, $event), mouseIsMovingForMultiRows(copiedHeaders[cellKey], rowKey + 1, $event)"
                         :class="[isMainCellSelected(copiedHeaders[cellKey], rowKey + 1) ? 'selected-main-cell': '',
                         isCellDisabled(cellKey, rowKey) ? 'disabled-main-cell': '',
                         isCellInMultiselect(copiedHeaders[cellKey], rowKey + 1) ? 'selected-cell' : '']"
                         v-for="(cell, cellKey) in longestArray">

                        <input v-model="row[cellKey]"
                               v-click-outside="stopEditingCell"
                               autofocus
                               v-if="editingCell && editingCell.column === cellKey && editingCell.row === row"
                               class="edit-input"
                               type="text">
                        <span v-else>
                            {{row[cellKey]}}
                        </span>
                        <div>
                            <div class="arrow-up" @click="showDropdown(cellKey, rowKey, $event)"
                                 v-if="hasComment(copiedHeaders[cellKey], rowKey + 1)"></div>
                        </div>

                        <div v-if="showButtonForCopy(copiedHeaders[cellKey], rowKey + 1) && !editingCell"
                             @mousedown="mouseDown(true)"
                             :style="styleOfCopyButton"
                             class="small-button"></div>
                    </div>
                </div>
                <div :style="leftVerticalLine"></div>
                <div :style="rightVerticalLine"></div>
                <div :style="topHorizontalLine"></div>
                <div :style="bottomHorizontalLine"></div>
            </div>
        </div>
        <MouseDropDown v-if="cellPopup" @manipulateRows="manipulateRows($event)" @closeMouseDropdown="cellPopup = null"
                       :cell="cellPopup"
                       :numberOfRows="copiedRows.length"
                       :numberOfCols="longestArray"
                       :clickDetails="cellPopup.event"></MouseDropDown>
        <CommentPopup v-if="showDropDown.column"
                      :value="showDropDown"
                      @hideCommentSection="showDropDown = {column: null, row: null}"
                      @change="valueChanged($event)"></CommentPopup>
        <DropDownForHeader v-if="selectedHeader"
                           :rows="rows"
                           @manipulateRows="manipulateRows($event)"
                           @updatedRows="copiedRows=$event"
                           @closeMouseDropdown="selectedHeader = null"
                           :value="selectedHeader"></DropDownForHeader>
    </div>
</template>

<script>
    import CommentPopup from './CommentPopup'
    import MouseDropDown from './MouseDropdown'
    import HeaderCell from './HeaderCell'
    import DropDownForHeader from './DropDownForHeader'
    import ClickOutside from 'vue-click-outside'

    export default {
        name: "VueExcelTable",
        components: {
            CommentPopup,
            MouseDropDown,
            HeaderCell,
            DropDownForHeader
        },
        directives: {
            ClickOutside
        },
        props: {
            cellHeight: {
                type: Number,
                default: 30
            },
            cellWidth: {
                type: Number,
                default: 70
            },
            headers: {
                type: Array,
                default: () => [],
                required: false
            },
            readOnlyCells: {
                type: Array,
                default: () => []
            },
            readOnlyRows: {
                type: Array,
                default: () => []
            },
            readOnlyColumns: {
                type: Array,
                default: () => []
            },
            rows: {
                type: Array,
                default: () => [
                    [1, 2, 3, 4, null, 6, 7, 8, 9],
                    [11, 10, 11, 12, 13, 14, 15, 16, 17],
                    [18, 19, 20, 21, 22, 23, 24, 25, 26, 23, 23, 32, 12, 12, 12, 1, 1, 1, 1, 1],
                    [27, 28, 29, 30, 31, 32, 33, 34, 35],
                    [36, 37, 38, 39, 40, 41, 42, 43, 44],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                    [45, 46, 47, 48, 49, 50, 51, 52, 53],
                ],
                required: false
            },
            cellsWithComments: {
                type: Array,
                default: () => [
                    {row: 1, column: 1, comment: '11'},
                    {row: 5, column: 3, comment: '53'},
                ]
            }
        },
        data() {
            return {
                copiedHeaders: [],
                copiedRows: [],
                showDropDown: {column: null, row: null},
                activeCell: null,
                cellWhereCopyButtonIs: null,
                mouseIsDownInSelectedCell: false,
                selectedRowsToBeChanged: [],
                mouseIsDownOnCell: false,
                selectedRowsToBeSelected: [],
                longestArray: 0,
                cellPopup: null,
                selectedHeader: null,
                undo: [],
                editingCell: null
            }
        },
        mounted() {

            this.copiedRows = JSON.parse(JSON.stringify(this.rows))


            this.calculateHeaders()

            window.addEventListener('keydown', this.keyDownEventListener);
        },
        computed: {
            cssProps() {
                return {
                    '--var-cell-height': `${this.cellHeight}px`,
                    '--var-cell-width': `${this.cellWidth}px`,
                    '--var-cell-width-plus-one': `${this.cellWidth + 1}px`,
                }
            },
            leftVerticalLine() {
                if (this.selectedRowsToBeChanged.length === 0 || this.mouseIsDownOnCell) {
                    return {
                        'display': 'none'
                    }
                }

                let lowerColumn = this.copiedHeaders.indexOf(this.activeCell.column) <= this.selectedRowsToBeChanged[this.selectedRowsToBeChanged.length - 1].header

                if (this.selectedRowsToBeChanged.every(x => x.row === this.activeCell.row)) {

                    let left = this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[0].header) * this.cellWidth - 1

                    return {
                        'position': 'absolute',
                        'left': `${left + (lowerColumn ? this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[0].header) : 0)}px`,
                        'top': `${(this.selectedRowsToBeChanged[0].row - 1) * this.cellHeight}px`,
                        'border': '1px solid red',
                        'height': `${this.cellHeight}px`
                    }
                }

                return {
                    'position': 'absolute',
                    'left': `${this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[0].header) * this.cellWidth - 1}px`,
                    'top': `${(this.selectedRowsToBeChanged[0].row - 1) * this.cellHeight}px`,
                    'border': '1px solid red',
                    'height': `${this.selectedRowsToBeChanged.length * this.cellHeight}px`
                }
            },
            rightVerticalLine() {
                if (this.selectedRowsToBeChanged.length === 0 || this.mouseIsDownOnCell) {
                    return {
                        'display': 'none'
                    }
                }

                if (this.selectedRowsToBeChanged.every(x => x.row === this.activeCell.row)) {

                    let lowerColumn = this.copiedHeaders.indexOf(this.activeCell.column) > this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[0].header)
                    let left = lowerColumn ? this.copiedHeaders.indexOf(this.activeCell.column) * this.cellWidth : this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[this.selectedRowsToBeChanged.length - 1].header) * this.cellWidth


                    return {
                        'position': 'absolute',
                        'left': `${left + this.cellWidth - 1}px`,
                        'top': `${(this.selectedRowsToBeChanged[0].row - 1) * this.cellHeight}px`,
                        'border': '1px solid red',
                        'height': `${this.cellHeight}px`
                    }
                }

                return {
                    'position': 'absolute',
                    'left': `${(this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[0].header) + 1) * this.cellWidth - 1}px`,
                    'top': `${(this.selectedRowsToBeChanged[0].row - 1) * this.cellHeight}px`,
                    'border': '1px solid red',
                    'height': `${this.selectedRowsToBeChanged.length * this.cellHeight + 1}px`
                }
            },
            topHorizontalLine() {
                if (this.selectedRowsToBeChanged.length === 0 || this.mouseIsDownOnCell) {
                    return {
                        'display': 'none'
                    }
                }

                if (this.selectedRowsToBeChanged.every(x => x.row === this.activeCell.row)) {
                    return {
                        'position': 'absolute',
                        'left': `${this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[0].header) * this.cellWidth - 1}px`,
                        'top': `${(this.selectedRowsToBeChanged[0].row - 1) * this.cellHeight}px`,
                        'border': '1px solid red',
                        'width': `${this.cellWidth * this.selectedRowsToBeChanged.length}px`
                    }
                }

                return {
                    'position': 'absolute',
                    'left': `${this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[0].header) * this.cellWidth - 1}px`,
                    'top': `${(this.selectedRowsToBeChanged[0].row - 1) * this.cellHeight}px`,
                    'border': '1px solid red',
                    'width': `${this.cellWidth}px`
                }
            },
            bottomHorizontalLine() {
                if (this.selectedRowsToBeChanged.length === 0 || this.mouseIsDownOnCell) {
                    return {
                        'display': 'none'
                    }
                }

                let lowerColumn = this.copiedHeaders.indexOf(this.activeCell.column) > this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[0].header)

                if (this.selectedRowsToBeChanged.length > 1 && this.selectedRowsToBeChanged.every(x => x.row === this.activeCell.row)) {
                    return {
                        'position': 'absolute',
                        'left': `${this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[0].header) * this.cellWidth}px`,
                        'top': `${(this.selectedRowsToBeChanged[0].row) * this.cellHeight}px`,
                        'border': '1px solid red',
                        'width': `${this.cellWidth * this.selectedRowsToBeChanged.length - 1}px`
                    }
                }
                return {
                    'position': 'absolute',
                    'left': `${this.copiedHeaders.indexOf(this.selectedRowsToBeChanged[0].header) * this.cellWidth}px`,
                    'top': `${(this.selectedRowsToBeChanged[this.selectedRowsToBeChanged.length - 1].row) * this.cellHeight + (lowerColumn ? +1 : 0)}px`,
                    'border': '1px solid red',
                    'width': `${this.cellWidth - 1}px`
                }
            },
            styleOfCopyButton() {
                if (!this.cellWhereCopyButtonIs) {
                    return;
                }

                if (!this.cellWhereCopyButtonIs.placeButtonOnLeft) {
                    return {
                        right: '-3px',
                        bottom: '-3px'
                    }
                }
                return {
                    left: '-3px',
                    top: '-3px'
                }
            }
        },
        methods: {
            rightMouseClick(event, column, row) {
                event.preventDefault()
                this.cellPopup = {column, row, event}
            },
            calculateHeaders() {
                this.longestArray = Math.max(...this.copiedRows.map(r => r.length))

                if (!this.headers || this.headers.length === 0) {

                    if (this.longestArray <= 26) {
                        this.copiedHeaders = [...Array(this.longestArray)].map((_, y) => String.fromCharCode(y + 65))
                    } else {
                        let alphabetRepeated = Math.ceil(this.longestArray / 26)
                        this.copiedHeaders = [...Array(26)].map((_, y) => String.fromCharCode(y + 65))

                        for (let i = 1; i < alphabetRepeated; i++) {
                            let anotherCombinationOfAlphabet = [...Array(26)].map((_, y) => `${this.copiedHeaders[i - 1]}${String.fromCharCode(y + 65)}`)
                            this.copiedHeaders.push(...anotherCombinationOfAlphabet)
                        }
                    }
                } else {
                    this.copiedHeaders = JSON.parse(JSON.stringify(this.headers))
                }
            },
            isCellDisabled(column, row) {
                if (this.readOnlyColumns.length === 0 && this.readOnlyRows.length === 0 && this.readOnlyCells.length === 0) {
                    return false
                }

                let cellDisabled = this.readOnlyCells.find(rc => rc.row === row && rc.column === column)

                if (cellDisabled) {
                    return true
                }

                let rowDisabled = this.readOnlyRows.find(rc => rc === row)

                if (rowDisabled !== undefined) {
                    return true
                }

                let columnDisabled = this.readOnlyColumns.find(rc => rc === column)

                if (columnDisabled !== undefined) {
                    return true
                }
            },
            keyDownEventListener(event) {
                if (event.alt && event.keyCode === 67) {
                    this.copy()
                    event.preventDefault()
                }
            },
            copy() {
                let copiedText = ''
                this.selectedRowsToBeSelected.forEach((cell, key) => {
                    if (key === 0) {
                        copiedText = this.copiedRows[cell.row - 1][this.copiedHeaders.indexOf(cell.header)] || null
                        return;
                    }

                    if (cell.row === this.selectedRowsToBeSelected[key - 1].row) {
                        copiedText = `${copiedText}   ${this.copiedRows[cell.row - 1][this.copiedHeaders.indexOf(cell.header)] || null}`
                        return;
                    }

                    copiedText = `${copiedText}\n${this.copiedRows[cell.row - 1][this.copiedHeaders.indexOf(cell.header)] || null}`

                })
                this.copyToClipBoard(copiedText)
            },
            copyToClipBoard(text) {
                let dummy = document.createElement("textarea");
                document.body.appendChild(dummy);
                dummy.value = text;
                dummy.select();
                document.execCommand("copy");
                document.body.removeChild(dummy);
            },
            handleScroll() {
                this.$refs.headers.scroll({left: this.$refs.body.scrollLeft, top: 0})
                this.$refs.rows_identifier.scroll({left: 0, top: this.$refs.body.scrollTop})
            },
            selectCell(column, row, value) {
                this.activeCell = {column, row, value}
                this.cellWhereCopyButtonIs = {column, row, value}
                this.selectedRowsToBeChanged = []
                this.selectedRowsToBeSelected = []
            },
            isMainCellSelected(column, row) {
                if (!this.activeCell) {
                    return false;
                }
                return this.activeCell.column === column && this.activeCell.row === row
            },
            showButtonForCopy(column, row) {
                if (!this.cellWhereCopyButtonIs) {
                    return false;
                }
                return this.cellWhereCopyButtonIs.column === column && this.cellWhereCopyButtonIs.row === row
            },
            isCellInMultiselect(column, row) {
                return this.selectedRowsToBeChanged.find(x => x.header === column && x.row === row) || this.selectedRowsToBeSelected.find(x => x.header === column && x.row === row)
            },
            mouseDown(v) {
                this.mouseIsDownInSelectedCell = v;
                this.mouseIsDownOnCell = false
                let copiedData = []
                if (!v) {
                    this.selectedRowsToBeChanged.forEach(r => {
                        let indexBasedOnColumn = this.copiedHeaders.indexOf(r.header)
                        copiedData.push({
                            column: indexBasedOnColumn,
                            row: r.row - 1,
                            value: this.copiedRows[r.row - 1][indexBasedOnColumn]
                        })
                        if (!this.isCellDisabled(indexBasedOnColumn, r.row - 1)) {
                            this.copiedRows[r.row - 1][indexBasedOnColumn] = this.activeCell.value
                        }
                    })
                    if (this.selectedRowsToBeChanged.length > 0 && this.undo.indexOf(this.selectedRowsToBeChanged) === -1) {
                        this.undo.push(copiedData)
                    }
                    this.$forceUpdate()
                }
            },
            mouseDownOnCell(column, row, value) {
                this.selectCell(column, row, value)
                if (this.activeCell && this.activeCell.column === column && this.activeCell.row === row && !this.mouseIsDownInSelectedCell) {
                    this.mouseIsDownOnCell = true
                }
            },
            mouseIsMovingForMultiRows(header, row, event) {
                if (!this.mouseIsDownOnCell) {
                    return;
                }

                this.scrollBasedOnSelection(event)

                this.selectedRowsToBeSelected = []

                let indexOfStartHeader = this.copiedHeaders.indexOf(this.activeCell.column)
                let indexOfEndHeader = this.copiedHeaders.indexOf(header)
                let indexOfStartRow = this.activeCell.row
                let indexOfEndRow = row

                let startOfHeader = indexOfStartHeader < indexOfEndHeader ? indexOfStartHeader : indexOfEndHeader
                let endOfHeader = indexOfStartHeader > indexOfEndHeader ? indexOfStartHeader : indexOfEndHeader

                let startOfRow = indexOfStartRow < indexOfEndRow ? indexOfStartRow : indexOfEndRow
                let endOfRow = indexOfStartRow > indexOfEndRow ? indexOfStartRow : indexOfEndRow

                for (let j = startOfRow; j <= endOfRow; j++) {
                    for (let i = startOfHeader; i <= endOfHeader; i++) {
                        this.selectedRowsToBeSelected.push({header: this.copiedHeaders[i], row: j})
                    }
                }
            },
            scrollBasedOnSelection(event) {
                if (event.clientX > this.$refs.headers.clientWidth - this.cellWidth) {
                    this.$refs.body.scroll({left: this.$refs.body.scrollLeft + 20, top: this.$refs.body.scrollTop})
                }

                if (event.clientX < this.cellWidth * 3) {
                    this.$refs.body.scroll({left: this.$refs.body.scrollLeft - 20, top: this.$refs.body.scrollTop})
                }

                if (event.clientY > this.$refs.body.clientHeight - (this.cellHeight * 2)) {
                    this.$refs.body.scroll({left: this.$refs.body.scrollLeft, top: this.$refs.body.scrollTop + 20})
                }

                if (event.clientY < this.cellHeight * 3) {
                    this.$refs.body.scroll({left: this.$refs.body.scrollLeft, top: this.$refs.body.scrollTop - 20})
                }
            },
            mouseIsMoving(header, row, event) {
                if (!this.mouseIsDownInSelectedCell) {
                    return;
                }

                this.scrollBasedOnSelection(event)

                if (header === this.activeCell.column) {
                    this.selectedRowsToBeChanged = []

                    let start = this.activeCell.row < row ? this.activeCell.row : row
                    let end = this.activeCell.row > row ? this.activeCell.row : row

                    for (let i = start; i <= end; i++) {
                        this.selectedRowsToBeChanged.push({header, row: i})
                    }
                    this.cellWhereCopyButtonIs = {
                        column: header,
                        row,
                        placeButtonOnLeft: this.activeCell.row > row
                    }
                }

                if (header !== this.activeCell.column && row === this.activeCell.row) {
                    this.selectedRowsToBeChanged = []

                    let indexOf1 = this.copiedHeaders.indexOf(this.activeCell.column)
                    let indexOf2 = this.copiedHeaders.indexOf(header)

                    let start = indexOf1 < indexOf2 ? indexOf1 : indexOf2
                    let end = indexOf1 > indexOf2 ? indexOf1 : indexOf2

                    for (let i = start; i <= end; i++) {
                        this.selectedRowsToBeChanged.push({header: this.copiedHeaders[i], row: row})
                    }
                    this.cellWhereCopyButtonIs = {
                        column: header,
                        row,
                        placeButtonOnLeft: indexOf1 > indexOf2
                    }
                }
            },
            hasComment(header, row) {
                return this.cellsWithComments.find(c => c.row === row && this.copiedHeaders.indexOf(header) === c.column)
            },
            showDropdown(column, row, event) {
                if (this.showDropDown.column) {
                    this.showDropDown = {column: null, key: null}
                    return
                }
                let hasComment = this.hasComment(this.copiedHeaders[column], row + 1)
                if (column && hasComment) {
                    this.showDropDown = {...hasComment, event}
                }
            },
            valueChanged(e) {
                this.showDropDown.comment = e
            },
            manipulateRows(event) {
                if (event === 'insert-row-up') {
                    this.copiedRows.splice(this.cellPopup.row - 1, 0, Array(this.longestArray))
                    this.cellPopup = null
                }

                if (event === 'insert-row-down') {
                    this.copiedRows.splice(this.cellPopup.row, 0, Array(this.longestArray))
                    this.cellPopup = null
                }

                if (event === 'insert-column-right') {
                    let column = this.cellPopup ? this.cellPopup.column : this.selectedHeader.header_key
                    this.copiedRows.forEach(r => r.splice(column + 1, 0, null))
                    this.cellPopup = null
                    this.selectedHeader = null
                }

                if (event === 'insert-column-left') {
                    let column = this.cellPopup ? this.cellPopup.column : this.selectedHeader.header_key
                    this.copiedRows.forEach(r => r.splice(column, 0, null))
                    this.selectedHeader = null
                    this.cellPopup = null
                }

                if (event === 'delete-column') {
                    let column = this.cellPopup ? this.cellPopup.column : this.selectedHeader.header_key
                    this.copiedRows.forEach(r => r.splice(column, 1))
                    this.cellPopup = null
                }

                if (event === 'delete-row') {
                    this.copiedRows.splice(this.cellPopup.row - 1, 1)
                    this.cellPopup = null
                }

                if (event === 'copy') {
                    let copiedData = this.copiedRows.map(r => r[this.selectedHeader.header_key]).join('\n')
                    this.copyToClipBoard(copiedData)
                    this.cellPopup = null
                }

                this.calculateHeaders()
            },
            selectedHeaderCell(e) {
                this.selectedHeader = {...e, header_key: this.copiedHeaders.indexOf(e.header)}
            },
            stopEditingCell() {
                this.editingCell = null
            },
            undoFunction() {
                this.selectedRowsToBeChanged = []
                this.selectedRowsToBeSelected = []
                this.activeCell = null
                this.cellWhereCopyButtonIs = null

                if(this.undo.length === 0) {
                    return;
                }

                let poped = this.undo.pop()
                poped.forEach(p => {
                    this.copiedRows[p.row][p.column] = p.value
                })
            }
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.keyDownEventListener)
        },
    }
</script>


<style scoped lang="scss">

    $headers: #dadada;
    $darker-border: #212121;
    $border: #e0e0e0;
    $selected-border: #4B89FF;

    .excel {
        display: flex;
        flex-direction: column;
        max-height: 400px;
        max-width: 1000px;
        border-right: 1px solid $border;
        border-bottom: 1px solid $border;
        user-select: none;
        box-sizing: border-box;

        * {
            box-sizing: border-box;
        }

        .excel__headers {
            display: -webkit-box;
            overflow: hidden;
            min-height: var(--var-cell-height);
            border-bottom: 1px solid $darker-border;

            .excel__header--cell {
                width: var(--var-cell-width);
                min-height: var(--var-cell-height);
                border-top: 1px solid $darker-border;
                border-right: 1px solid $darker-border;
                display: flex;
                align-items: center;
                justify-content: center;
                background: $headers;
                box-sizing: border-box;

                &.active-column-row {
                    background: darken($headers, 10%);
                }
            }

        }

        .excel__rows-identifier {
            min-width: var(--var-cell-width);
            border-right: 1px solid $darker-border;
            display: grid;
            overflow: hidden;

            .excel__body--row-identifier {
                width: var(--var-cell-width);
                height: var(--var-cell-height);
                border-left: 1px solid $darker-border;
                display: flex;
                align-items: center;
                justify-content: center;
                background: $headers;
                box-sizing: border-box;

                &:not(:first-child) {
                    border-top: 1px solid $darker-border;
                }

                &.active-column-row {
                    background: darken($headers, 10%);
                }
            }
        }

        .excel__body {
            display: flex;
            overflow: hidden;

            .excel__body--row {
                display: flex;
            }

            .excel__body-rows-container {
                overflow: scroll;
                display: grid;
                position: relative;

                & > :first-child {
                    .excel__body--cell {
                        border-top: 0;
                    }
                }
            }

            .excel__body--cell {
                width: var(--var-cell-width);
                height: var(--var-cell-height);
                border-top: 1px solid $border;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                position: relative;
                box-sizing: border-box;
                font-weight: 200;

                .edit-input {
                    width: 95%;
                    height: 95%;
                    font-size: 16px;
                    text-align: center;
                    color: #2c2c2c;
                    font-weight: 300;
                }

                &:not(:last-child) {
                    border-right: 1px solid $border;
                }

                &.selected-main-cell {
                    background: whitesmoke;
                    box-shadow: inset 0 0 0 2px $selected-border;
                }

                &.first-selected-cell {
                    background: lighten($selected-border, 30%);
                }

                &.selected-cell {
                    background: lighten($selected-border, 30%);
                }

                &.first-cell {
                    background: $headers;
                }

                &.disabled-main-cell {
                    color: lighten(black, 30%);
                }

                .small-button {
                    position: absolute;
                    height: 6px;
                    width: 6px;
                    background: $selected-border;
                    right: -3px;
                    bottom: -3px;
                    z-index: 1;
                    cursor: crosshair;
                }
            }
        }
    }

    .static-cell {
        min-width: var(--var-cell-width-plus-one);
        background: $headers;
        border: 1px solid $darker-border;
    }

    .flexed {
        display: flex;
    }

    .arrow-up {
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid black;
        position: absolute;
        top: -1px;
        right: -3px;
        transform: rotate(45deg);
    }

</style>

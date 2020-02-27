export default class CommonUtils {
    static leftVerticalLine(selectedRowsToBeChanged, copiedHeaders, activeCell, cellWidth, cellHeight) {
        let lowerColumn = copiedHeaders.indexOf(activeCell.column) <= selectedRowsToBeChanged[selectedRowsToBeChanged.length - 1].header

        if (selectedRowsToBeChanged.every(x => x.row === activeCell.row)) {

            let left = copiedHeaders.indexOf(selectedRowsToBeChanged[0].header) * cellWidth - 1

            return {
                'position': 'absolute',
                'left': `${left + (lowerColumn ? copiedHeaders.indexOf(selectedRowsToBeChanged[0].header) : 0)}px`,
                'top': `${(selectedRowsToBeChanged[0].row - 1) * cellHeight}px`,
                'border': '1px solid red',
                'height': `${cellHeight}px`
            }
        }

        return {
            'position': 'absolute',
            'left': `${copiedHeaders.indexOf(selectedRowsToBeChanged[0].header) * cellWidth - 1}px`,
            'top': `${(selectedRowsToBeChanged[0].row - 1) * cellHeight}px`,
            'border': '1px solid red',
            'height': `${selectedRowsToBeChanged.length * cellHeight}px`
        }
    }

    static rightVerticalLine(selectedRowsToBeChanged, copiedHeaders, activeCell, cellWidth, cellHeight) {
        if (selectedRowsToBeChanged.every(x => x.row === activeCell.row)) {

            let lowerColumn = copiedHeaders.indexOf(activeCell.column) > copiedHeaders.indexOf(selectedRowsToBeChanged[0].header)
            let left = lowerColumn ? copiedHeaders.indexOf(activeCell.column) * cellWidth : copiedHeaders.indexOf(selectedRowsToBeChanged[selectedRowsToBeChanged.length - 1].header) * cellWidth


            return {
                'position': 'absolute',
                'left': `${left + cellWidth - 1}px`,
                'top': `${(selectedRowsToBeChanged[0].row - 1) * cellHeight}px`,
                'border': '1px solid red',
                'height': `${cellHeight}px`
            }
        }

        return {
            'position': 'absolute',
            'left': `${(copiedHeaders.indexOf(selectedRowsToBeChanged[0].header) + 1) * cellWidth - 1}px`,
            'top': `${(selectedRowsToBeChanged[0].row - 1) * cellHeight}px`,
            'border': '1px solid red',
            'height': `${selectedRowsToBeChanged.length * cellHeight + 1}px`
        }
    }

    static topHorizontalLine(selectedRowsToBeChanged, copiedHeaders, activeCell, cellWidth, cellHeight) {
        if (selectedRowsToBeChanged.every(x => x.row === activeCell.row)) {
            return {
                'position': 'absolute',
                'left': `${copiedHeaders.indexOf(selectedRowsToBeChanged[0].header) * cellWidth - 1}px`,
                'top': `${(selectedRowsToBeChanged[0].row - 1) * cellHeight}px`,
                'border': '1px solid red',
                'width': `${cellWidth * selectedRowsToBeChanged.length}px`
            }
        }

        return {
            'position': 'absolute',
            'left': `${copiedHeaders.indexOf(selectedRowsToBeChanged[0].header) * cellWidth - 1}px`,
            'top': `${(selectedRowsToBeChanged[0].row - 1) * cellHeight}px`,
            'border': '1px solid red',
            'width': `${cellWidth}px`
        }
    }

    static bottomHorizontalLine(selectedRowsToBeChanged, copiedHeaders, activeCell, cellWidth, cellHeight) {

        if (selectedRowsToBeChanged.length > 1 && selectedRowsToBeChanged.every(x => x.row === activeCell.row)) {
            return {
                'position': 'absolute',
                'left': `${copiedHeaders.indexOf(selectedRowsToBeChanged[0].header) * cellWidth}px`,
                'top': `${(selectedRowsToBeChanged[0].row) * cellHeight}px`,
                'border': '1px solid red',
                'width': `${cellWidth * selectedRowsToBeChanged.length}px`
            }
        }
        return {
            'position': 'absolute',
            'left': `${copiedHeaders.indexOf(selectedRowsToBeChanged[0].header) * cellWidth}px`,
            'top': `${(selectedRowsToBeChanged[selectedRowsToBeChanged.length - 1].row) * cellHeight}px`,
            'border': '1px solid red',
            'width': `${cellWidth}px`
        }
    }
}

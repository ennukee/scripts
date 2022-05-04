/*	
	LeetCode
	Problem #34 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
*/

/**
 * @param {character[][]} board
 * @return {boolean}
 */
 var isValidSudoku = function(board) {
    const horizontals = Array.from(Array(9), () => new Array())
    const verticals = Array.from(Array(9), () => new Array())
    const sections = Array.from(Array(9), () => new Array())

    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell !== '.') {
                horizontals[rowIndex].push(cell)
                verticals[colIndex].push(cell)
                const rowMulti = Math.floor(rowIndex / 3) 
                const colAdd = Math.floor(colIndex / 3) 
                sections[rowMulti * 3 + colAdd].push(cell)
            }
        })
    })

    const everyCallback = (section => (section.length === [...new Set(section)].length))
    return horizontals.every(everyCallback)
        && verticals.every(everyCallback)
        && sections.every(everyCallback)
};

console.log(isValidSudoku(
[["5","3",".",".","7",".",".",".","."]
,["6",".",".","1","9","5",".",".","."]
,[".","9","8",".",".",".",".","6","."]
,["8",".",".",".","6",".",".",".","3"]
,["4",".",".","8",".","3",".",".","1"]
,["7",".",".",".","2",".",".",".","6"]
,[".","6",".",".",".",".","2","8","."]
,[".",".",".","4","1","9",".",".","5"]
,[".",".",".",".","8",".",".","7","9"]]
))
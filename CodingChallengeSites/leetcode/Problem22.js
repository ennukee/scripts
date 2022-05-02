/*	
	LeetCode
	Problem #22 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/generate-parentheses/
*/

/**
 * @param {number} n
 * @return {string[]}
 */
// non-recursive
var generateParenthesis = function(n) {
    let solutions = [['', n, 0]]
    while (true) {
        if (solutions.every(([,remainingOpen,availableClosed]) => remainingOpen === 0 && availableClosed === 0)) {
            return solutions.map(([solutionString]) => solutionString)
        }
        solutions = solutions.flatMap(([string, remainingOpen, availableClosed]) => {
            if (remainingOpen === 0 && availableClosed === 0) {
                return [string, remainingOpen, availableClosed]
            }
            let iterations = []
            if (remainingOpen > 0) {
                iterations.push([`${string}(`, remainingOpen - 1, availableClosed + 1])
            }
            if (availableClosed > 0) {
                iterations.push([`${string})`, remainingOpen, availableClosed - 1])
            }
            return iterations
        })
    }
};

console.log(generateParenthesis(
    3,
))

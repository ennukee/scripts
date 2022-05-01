/*	
	LeetCode
	Problem #7 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/reverse-integer/
*/

/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    const negativeMultiplier = x < 0 ? -1 : 1
    const flippedNumber = Number([...String(Math.abs(x))].reverse().join(''))

    if (flippedNumber > Math.pow(2, 31) - 1 || flippedNumber < -Math.pow(2, 31)) return 0
    return flippedNumber * negativeMultiplier
};

console.log(reverse(
    123,
))

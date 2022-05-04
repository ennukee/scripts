/*	
LeetCode
Problem #179 -- Difficulty: Medium

Dylan Bowers

https://leetcode.com/problems/largest-number/
*/

/**
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function(nums) {
    const output = nums
        .map(n => n.toString())
        .sort((a, b) => {
            if (a.length !== b.length) {
                return b.repeat(a.length).localeCompare(a.repeat(b.length))
            }
            return b.localeCompare(a)
        })
        .join('')
        .replace(/^0*/g, '')
    return output || '0'
};

console.log(largestNumber(
    [9,34,30,5,3]
))

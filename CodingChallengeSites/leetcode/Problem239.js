/*	
LeetCode
Problem #239 -- Difficulty: Hard

Dylan Bowers

https://leetcode.com/problems/sliding-window-maximum/
*/

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    const currentWindow = []
    for (let i = 0; i < k; i++) {
        currentWindow.push(nums.shift())
    }

    const out = [Math.max(...currentWindow)]
    while (nums.length) {
        // console.log(currentWindow)
        currentWindow.shift()
        currentWindow.push(nums.shift())
        out.push(Math.max(...currentWindow))
    }
    return out
};

console.log(maxSlidingWindow(
    [1,3,-1,-3,5,3,6,7],
    3
))

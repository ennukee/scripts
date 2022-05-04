/*	
LeetCode
Problem #189 -- Difficulty: Medium

Dylan Bowers

https://leetcode.com/problems/rotate-array/
*/

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */

// O(n) runtime, O(n) space
var rotate = function(nums, k) {
    const newNums = nums.map((_, index) => nums[((nums.length - (k % nums.length)) + index) % nums.length])
    nums.forEach((_, index) => {
        nums[index] = newNums[index]
    })
    return nums
};
console.log(rotate(
    // [1,2,3,4,5,6,7], 3
    [1, 2], 3
))

// index=0 -> index=4

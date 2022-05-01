/*	
	LeetCode
	Problem #11 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/container-with-most-water/
*/

/**
 * @param {number[]} height
 * @return {number}
 */
 var maxArea = function(height) {
    let maxArea = 0
    let left = 0
    let right = height.length - 1
    while (left < right) {
        const area = Math.min(height[left], height[right]) * (right - left)
        if (area > maxArea) {
            maxArea = area
        }
        if (height[right] >= height[left]) {
            left++
        } else {
            right--
        }
    }
    return maxArea
};

console.log(maxArea(
    [1,8,6,2,5,4,8,3,7],
))

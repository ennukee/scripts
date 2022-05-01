/*	
	LeetCode
	Problem #11 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/container-with-most-water/
*/

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    const result = []
    const sorted = nums.sort((a, b) => a - b) // ascending
    sorted.forEach((num, numIndex) => {
        if (numIndex > 0 && sorted[numIndex] === sorted[numIndex - 1]) return
        if (num > 0) return

        let left = numIndex + 1
        let right = sorted.length - 1

        while (left < right) {
            const sum = sorted[numIndex] + sorted[left] + sorted[right]
            console.log(left, right, sum)
            if (sum === 0) {
                result.push([sorted[numIndex], sorted[left], sorted[right]])
                left++
                right--
                while(left < right && sorted[left] === sorted[left - 1]) {
                    left++
                }
                while(left < right && sorted[right] === sorted[right + 1]) {
                    right--
                }
            }
            if (sum < 0) {
                left++
            }
            if (sum > 0) {
                right--
            }
        }
    })
    return result
};

console.log(threeSum(
    [0, 0, 0],
))




// 2 [ -1 0 0 0 0 0 0 0 0 0 1 ]
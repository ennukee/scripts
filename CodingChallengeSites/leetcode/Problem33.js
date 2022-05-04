/*	
	LeetCode
	Problem #33 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/search-in-rotated-sorted-array/
*/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
// Not O(logn), but want to focus more on complexity/data structures over tricky algorithms
 var search = function(nums, target) {
    return nums.indexOf(target)
};

console.log(search(
    [4,5,6,7,0,1,2], 0
))

// [2,4,5,6,7,0,1], 7
/*
[2,4,5] 6 [7,0,1]

1 2 3 4 5
2 3 4 5 1
3 4 5 1 2
4 5 1 2 3
5 1 2 3 4



*/
/*	
	LeetCode
	Problem #34 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
*/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
 var searchRange = function(nums, target) {
    let left = 0
    let right = nums.length - 1

    if (nums.length === 0 || nums[left] > target || nums[right] < target) {
        return [-1, -1]
    }

    const findBound = (tar, left = 0, right = nums.length) => {
        while (left <= right) {
            const mid = Math.floor((right + left) / 2)
            // console.log(mid, tar, nums[mid])
            if (tar > nums[mid]) { left = mid + 1 }
            else { right = mid - 1 }
        }
        return left
    }
    // console.log(left, right)
    const leftBound = findBound(target)
    if (nums[leftBound] !== target) return [-1, -1]
    return [leftBound, findBound(target + 1, leftBound) - 1]
};

console.log(searchRange(
    [5,7,7,8,8,10], 8
))

/*
 IF TARGET === MID -> ?
 IF TARGET < MID -> SET RIGHT = (MID - 1)
 IF TARGET > MID -> SET LEFT = (MID + 1)


 5 7 7 7 8 8 9
 5 6 6 7 7 | 7 | 8 8 8 9 9
 8 8 8 9 9
 8 8 | 8 | 9 9


 5 7 8 8 8 8 9
 5 7 8 | 8 | 8 8 9
 5 (7) 8 | 8 | 8 (8) 9
 8 | 8 | 8 


*/

    // while (left < right) {
    //     const mid = left + Math.floor((right - left) / 2)
    //     console.log(left, right, target, nums[mid])
    //     if (target < nums[mid]) {
    //         right = mid - 1
    //     }
    //     if (target > nums[mid]) {
    //         console.log('left set to', mid + 1)
    //         left = mid + 1
    //     }
    //     if (target === nums[mid]) {
    //         let midleft = left + Math.floor((mid - left) / 2)
    //         let midright = mid + Math.ceil((right - mid) / 2)
    //         console.log(midleft, midright)
    //         while (nums[midleft] < target) {
    //             if (target < nums[midleft]) {

    //             }
    //         }
    //         break
    //     }
    //     // [7 7 8 |8| 8 8 9]
    // }
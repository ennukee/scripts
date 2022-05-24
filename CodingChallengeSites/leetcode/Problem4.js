/*	
LeetCode
Problem #4 -- Difficulty: Hard

Dylan Bowers

https://leetcode.com/problems/median-of-two-sorted-arrays/
*/

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
 var findMedianSortedArrays = function(nums1, nums2) {
    const totalLength = (nums1.length + nums2.length)
    const medianIndex = Math.floor(totalLength / 2)
    let selected = -1000000000000000000000
    let count = 0
    console.log(totalLength, medianIndex)
    while (count < medianIndex) {
        count++

        if (nums1.length === 0) {
            selected = nums2.shift()
        } else if (nums2.length === 0) {
            selected = nums1.shift()
        } else {
            const value = (nums1[0] < nums2[0])
                ? nums1.shift()
                : nums2.shift()
            selected = value
        }
        
    }
    
    let nextValue
    if (nums1.length === 0) {
        nextValue = nums2[0]
    } else if (nums2.length === 0) {
        nextValue = nums1[0]
    } else {
        nextValue = nums1[0] < nums2[0]
            ? nums1[0]
            : nums2[0]
    }

    if (totalLength % 2 === 0) {
        return (selected + nextValue) / 2
    } else return nextValue
};

/*
    4

    count 4
    [0, 0, 0]
    [1]
*/


console.log(findMedianSortedArrays(
    // [0, 0, 0, 0],
    // [-1, 0, 0, 1],
    // [0, 0],
    // [0, 0],
    [1, 3],
    [],
))

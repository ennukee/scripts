/*	
LeetCode
Problem #46 -- Difficulty: Medium

Dylan Bowers

https://leetcode.com/problems/permutations/
*/

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    const res = []
    depth(nums, [], res, nums.length)
    return res
};

const depth = function(remaining, current, result, length) {
    if (length === current.length) {
        result.push(current)
        return
    }
    remaining.forEach((num, index) => {
        depth(
            [...remaining.slice(0, index), ...remaining.slice(index + 1)],
            [...current, num],
            result,
            length
        )
    })
} 

console.log(permute(
    [1,2,3]
))


/*

[1,2,3]

[[1, [2, [3]], [3, [2]]], [2], [3]]

[[[1,2],[1,3]], [[2,1],[2,3]], [[3,1],[3,2]]]
*/
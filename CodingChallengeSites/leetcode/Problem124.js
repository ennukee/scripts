/*	
LeetCode
Problem #124 -- Difficulty: Hard

Dylan Bowers

https://leetcode.com/problems/binary-tree-maximum-path-sum/
*/


function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxPathSum = function(root) {
    if (root === null) return
    if (!root.left && !root.right) return root.val
    return Math.max(
        root.val,
        root.val + maxPathSum(root.left) + maxPathSum(root.right),
        maxPathSum(root.left),
        maxPathSum(root.right),
    )
};

const example1 = new TreeNode(
    -10,
    new TreeNode(9, null, null),
    new TreeNode(
        20,
        new TreeNode(15, null, null),
        new TreeNode(7, null, null),
    ),
)

console.log(maxPathSum(
    example1
))

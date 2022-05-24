/*	
LeetCode
Problem #297 -- Difficulty: Hard

Dylan Bowers

PROBLEM_URL_HERE
*/

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

function TreeNode(val, left, right) {
    this.val = val
    this.left = left || null
    this.right = right || null
}

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
 var serialize = function(root) {
    let currentNodes = []
    let nextLevelNodes = [root]
    while (nextLevelNodes.some(v => v)) {
        nextLevelNodes = nextLevelNodes.flatMap(node => {
            if (node) {
                currentNodes.push(node.val)
                return [node.left || null, node.right || null]
            } else {
                currentNodes.push(null)
                return []
            }
        })
    }
    return currentNodes
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    if (data.length === 0 || data[0] === null) return null

    const head = new TreeNode(data.shift())
    let latestNodes = [head]
    while (data.length > 0) {
        latestNodes = latestNodes.flatMap(node => {
            if (node) {
                const leftValue = data.shift()
                const rightValue = data.shift()
                node.left = leftValue === null ? null : new TreeNode(leftValue)
                node.right = rightValue === null ? null : new TreeNode(rightValue)
                return [node.left, node.right]
            }
            return []
        })
    }

    return head
};

const t1 = (rem) => {
    if (rem === 0) return null
    return new TreeNode(rem, t1(rem - 1))
}

console.log(
    deserialize(
        serialize(
            t1(50)
        )
    )
)

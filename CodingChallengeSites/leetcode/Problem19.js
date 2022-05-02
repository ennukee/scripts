/*	
	LeetCode
	Problem #19 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/remove-nth-node-from-end-of-list/
*/

function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
    const nodes = []
    let currentNode = head
    while(currentNode) {
        nodes.push(currentNode)
        currentNode = currentNode.next
    }

    if (n === nodes.length) return nodes[1] || null
    nodes[nodes.length - (n + 1)].next = (nodes[nodes.length - (n - 1)] || null)
    return nodes[0]
};

console.log(removeNthFromEnd(
    new ListNode(1, new ListNode(2, null)), 1,
))

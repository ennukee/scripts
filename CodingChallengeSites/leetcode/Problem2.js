/*	
	LeetCode
	Problem #2 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/add-two-numbers/
*/

var addTwoNumbers = function(l1, l2) {
    const computeLNNumber = (ln) => {
        let curNode = ln
        let output = ''
        while (curNode) {
            output = output + curNode.val
            curNode = curNode.next
        }
        console.log('compute number', output)
        return BigInt([...output].reverse().join(''))
    }
    const addedValues = BigInt(computeLNNumber(l1) + computeLNNumber(l2))
    const arrayVersion = [...String(addedValues)].reverse().map(i => Number(i))
    console.log(addedValues)
    console.log(arrayVersion)
    const [returnNode] = arrayVersion.reduce(([firstNode, lastNode], currentNumber) => {
        console.log('currentNumber', currentNumber)
        const node = new ListNode(currentNumber, null)
        if (lastNode) {
            lastNode.next = node
        }
        return [firstNode || node, node]
    }, [null, null])
    return returnNode
};

/*
    ! Used for testing cases locally

const final = (ln) => {
    let curNode = ln
    let output = ''
    while (curNode) {
        output = output + curNode.val
        curNode = curNode.next
    }
    console.log('final number', output)
    return Number([...output].reverse().join(''))
}

function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

const one = new ListNode(1, new ListNode(0, new ListNode(0, new ListNode(0, new ListNode(0, new ListNode(0, new ListNode(0, new ListNode(0, new ListNode(0,  new ListNode(1, null))))))))))
const two = new ListNode(5, new ListNode(6, new ListNode(4, null)))

console.log(final(addTwoNumbers(
    one, two
)))

*/
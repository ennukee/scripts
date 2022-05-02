/*	
	LeetCode
	Problem #17 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/letter-combinations-of-a-phone-number/
*/

/**
 * @param {string} digits
 * @return {string[]}
 */
 var letterCombinations = function(digits) {
    const numMap = {
        '2': [...'abc'],
        '3': [...'def'],
        '4': [...'ghi'],
        '5': [...'jkl'],
        '6': [...'mno'],
        '7': [...'pqrs'],
        '8': [...'tuv'],
        '9': [...'wxyz'],
    }

    const digitArray = [...digits]
    const result = digitArray.reduce((end, currentNumber) => {
        const telephoneChars = numMap[currentNumber]
        return end.flatMap(s1 => {
            return telephoneChars.map(s2 => `${s1}${s2}`)
        })
    }, [''])

    if (result.length === 1 && result[0] === '') return []
    return result
};

console.log(letterCombinations(
    '23',
))




// 2 [ -1 0 0 0 0 0 0 0 0 0 1 ]
/*	
	LeetCode
	Problem #5 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/longest-palindromic-substring/
*/

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if ([...s].every(char => char === s[0])) return s
    const palindromesByCharacter = [...s].map((_, index) => palindromeHelper(index, s))
    return palindromesByCharacter.sort((a, b) => b.length - a.length)[0]
};

const palindromeHelper = function(index, s) {
    let leftBound = index
    let rightBound = index
    let currentIncrementTarget = 'right'
    let bestPalindrome = ''
    let sequentialNoPalindromes = 0
    while (leftBound >= 0 && rightBound < s.length) {
        if (sequentialNoPalindromes > 1) return bestPalindrome
        const substring = s.slice(leftBound, rightBound + 1)
        // console.log(s, leftBound, rightBound)
        // console.log(s, index, substring)
        if (isPalindrome(substring) && substring.length > bestPalindrome.length) {
            bestPalindrome = substring
            sequentialNoPalindromes = 0
        } else {
            sequentialNoPalindromes++
        }
        if (currentIncrementTarget === 'right') {
            // console.log('+right')
            rightBound = rightBound + 1
            currentIncrementTarget = 'left'
        } else {
            // console.log('+left')
            leftBound = leftBound - 1
            currentIncrementTarget = 'right'
        }
    }
    return bestPalindrome
}

const isPalindrome = function(s) {
    return [...s].slice(0, Math.floor(s.length / 2)).every((char, index) => 
        s[s.length - (index + 1)] === char
    )
}

console.log(longestPalindrome(
    "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
))

/*	
LeetCode
Problem #140 -- Difficulty: Hard

Dylan Bowers

https://leetcode.com/problems/word-break-ii/
*/

/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {string[]}
 */
var wordBreak = function(s, wordDict, current = [], output = []) {
    if (s.length === 0) return output.push(current.join(' '))
    for (let word of wordDict) {
        if (s.startsWith(word)) {
            current.push(word)
            wordBreak(s.slice(word.length), wordDict, current, output)
            current.pop()
        }
    }
    return output
};

console.log(wordBreak(
    "catsanddog",
    ["cat","cats","and","sand","dog"]
))

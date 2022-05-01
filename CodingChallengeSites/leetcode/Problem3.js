/*	
	LeetCode
	Problem #3 -- Difficulty: Medium

	Dylan Bowers

	https://leetcode.com/problems/longest-substring-without-repeating-characters/
*/

/**
 * @param {string} s
 * @return {number}
 */
// O(nlogn) approach
// var lengthOfLongestSubstring = function(s) {
//     const computeLongestSubstring = (str) => {
//         let substring = ''
//         for (const char of [...str]) {
//             if (substring.includes(char)) {
//                 return substring
//             }
//             substring = substring + char
//         }
//         return substring
//     }
//     const outputs = [...s].map((_,index) => {
//         return computeLongestSubstring(s.slice(index))
//     }).map(str => str.length)

//     return outputs.length > 0 ? Math.max(...outputs) : 0
// };

// O(n)
// var lengthOfLongestSubstring = function(s) {
//     let result = 0
//     let substring = ''
//     const stringArray = [...s]
//     for (const char of stringArray) {
//         const index = substring.indexOf(char)
//         if (index >= 0) {
//             substring = substring.slice(index + 1) + char
//         } else {
//             substring = substring + char
//             result = Math.max(substring.length, result)
//         }
//     }
//     return result
// };

// O(n) -- ES6
var lengthOfLongestSubstring = function(s) {
    const stringArray = [...s]
    const [result] = stringArray.reduce(([result, substring], char) => {
        // console.log(char, result, substring)
        const index = substring.indexOf(char)
        if (index > -1) {
            const newSubstring = substring.slice(index + 1) + char
            return [result, newSubstring]
        }
        return [Math.max(substring.length + 1, result), substring + char]
    }, [0, ''])
    return result
};

console.log(lengthOfLongestSubstring(
    'abcabcbb',
))

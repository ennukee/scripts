const fs = require('fs')
const [,,id] = process.argv

const baseFileContent = `/*	
LeetCode
Problem #${id} -- Difficulty: Medium

Dylan Bowers

PROBLEM_URL_HERE
*/



console.log(problemFunction(

))
`

fs.writeFile(`Problem${id}.js`, baseFileContent, null, () => {})
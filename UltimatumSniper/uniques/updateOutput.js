/**
 * Used to update the output JSON file with new price data without rescanning all uniques
 */
const fs = require('fs')
const path = require('path');
const uniquePriceData = require('./util/data/results/uniquePriceData.json')
const uniqueOutput = require('./unique_output.json')

const newUniqueOutput = uniqueOutput.map(unique => {
    const { name: createdUnique, cost: createdOldCost } = unique["Unique you create"]
    const { name: usedUnique, cost: usedOldCost } = unique["Unique sacrificed"]

    console.log(uniquePriceData.find(u => u.name === 'Pledge of Hands'))
    console.log(usedUnique)

    const updatedCreatedUniqueCost = uniquePriceData.find(u => u.name === createdUnique).chaosValue
    const updatedUsedUniqueCost = uniquePriceData.find(u => u.name === usedUnique)?.chaosValue || -1 // fuck song of the sirens

    const createdCostDiff = updatedCreatedUniqueCost - createdOldCost
    const usedCostDiff = updatedUsedUniqueCost - usedOldCost

    const newProfit = unique["Profit made"] + createdCostDiff - usedCostDiff

    const copiedUnique = { ...unique }
    copiedUnique["Unique you create"].cost = updatedCreatedUniqueCost
    copiedUnique["Unique sacrificed"].cost = updatedUsedUniqueCost
    copiedUnique["Profit made"] = newProfit

    return copiedUnique
})

newUniqueOutput.sort((a, b) => b["Profit made"] - a["Profit made"])

// eslint-disable-next-line no-undef
const filepath = path.join(__dirname, 'unique_output_corrected.json')
fs.writeFile(filepath, JSON.stringify(newUniqueOutput, null, 2), (error) => console.log(error))
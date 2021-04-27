const axios = require('axios')
const fs = require('fs')
const endpoint = 'https://poe.ninja/api/data/itemoverview?league=Ritual&type=SkillGem'

const IGNORE_LOW_CONFIDENCE_GEMS = true
const MAXIMUM_BASE_GEM_VALUE = 1000
const IGNORE_ALTERNATE_QUALITIES = false

const main = ({ data: { lines: data } }) => {
    /*
    [
        gemName: {
            lowConfidence: boolean, // doesn't count if 21/23 is the only low confidence
            prices: {
                '21/23c': number,
                '21/20c': number,
                '20/23c': number,
                '20/20c': number, -- 19/20 is assumed to be this price
                '20/20': number,
                all other are assumed full loss
            }
            averageProfit: number -- calculated and appended based on above values
        },
        ...
    ]
    */
    const validVariants = (gem) =>
        gem.name.includes('Awakened')
        ? ['6/23c', '6/20c', '5/23c', '5/20c', '5/20', '6/0c']
        : ['21/23c', '21/20c', '20/23c', '20/20c', '20/20', '21/0c']

    const parsedData = data.reduce((total, current) => {
        if(
            !validVariants(current).includes(current.variant)
            || current.name.includes('Vaal')
        ) return total

        if(!total[current.name]) {
            const pricesForm = validVariants(current).reduce((acc, cur) => {
                acc[cur] = 0
                return acc
            }, {})
            total[current.name] = {
                lowConfidence: false,
                prices: pricesForm,
            }
        }

        const sparklineData = current.sparkline.data
        if(!sparklineData[sparklineData.length - 1]) {
            total[current.name].lowConfidence = true
        }

        total[current.name].prices[current.variant] = current.chaosValue
        return total
    }, {})

    Object.keys(parsedData).forEach(gem => {
        /*
            Double corrupt rolls twice on the following pool with equal chance, you cannot hit the same roll twice
             1. Nothing
             2. Gem level change
             3. Quality change
             4. Turn into vaal gem (nothing if it has no vaal variant, which we will assume is always the case)

             See data from this sheet for percentages used below: https://docs.google.com/spreadsheets/d/1lbxUqZn2mxCoHZuMlIkcKpGnYN6DebhVT4UBm7HwyKo/edit?usp=sharing
        */

        const item = parsedData[gem]
        const baseCost = item.prices[gem.includes('Awakened') ? '5/20' : '20/20']
        if (
            (IGNORE_LOW_CONFIDENCE_GEMS && item.lowConfidence)
            || !baseCost
            || baseCost > MAXIMUM_BASE_GEM_VALUE
            || (IGNORE_ALTERNATE_QUALITIES && ['Anomalous', 'Divergent', 'Phantasmal'].includes(gem.split(' ')[0]))
        ) {
            delete parsedData[gem]
            return
        }

        if (!item.prices[gem.includes('Awakened') ? '6/23c' : '21/23c']) {
            item.prices[gem.includes('Awakened') ? '6/23c' : '21/23c'] = item.prices[gem.includes('Awakened') ? '6/20c' : '21/20c']
        }

        if (!item.prices[gem.includes('Awakened') ? '5/23c' : '20/23c']) {
            item.prices[gem.includes('Awakened') ? '5/23c' : '20/23c'] = item.prices[gem.includes('Awakened') ? '5/20c' : '20/20c']
        }

        const averageProfit = (
            (0.5 / 11.75) * item.prices[gem.includes('Awakened') ? '6/23c' : '21/23c']
            + (2 / 11.75) * item.prices[gem.includes('Awakened') ? '6/20c' : '21/20c']
            + (2.25 / 11.75) * item.prices[gem.includes('Awakened') ? '5/23c' : '20/23c']
            + (4 / 11.75) * item.prices[gem.includes('Awakened') ? '5/20c' : '20/20c']
            + (0.5 / 11.75) * item.prices[gem.includes('Awakened') ? '6/0c' : '21/0c'] || 0
        ) - baseCost
        item.averageProfit = averageProfit
    })

    const sortedData = Object.entries(parsedData).map(([gemName, gemData]) => ({
        gemName,
        ...gemData
    })).sort((i1, i2) => i2.averageProfit - i1.averageProfit)
    fs.writeFile('./out.txt', JSON.stringify(sortedData, null, 2), (err) => {
        if (err) console.log(err)
    })
}

const data = () => {
    axios.get(endpoint).then(resp => main(resp))
}

data()
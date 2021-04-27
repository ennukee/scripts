const { default: axios } = require("axios")
const fs = require('fs')
const path = require('path');

const POENINJA_UNIQUE_BASE = 'https://poe.ninja/api/data/itemoverview?league=Ultimatum&type=Unique'
const VALID_SUBSECTIONS = [
    'Jewel',
    'Flask',
    'Weapon',
    'Armour',
    'Accessory',
    'Map',
]

const wait = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))

const main = async () => {
  const allUniques = []
  for (let i = 0; i < VALID_SUBSECTIONS.length; i += 1) {
    const endpoint = POENINJA_UNIQUE_BASE + VALID_SUBSECTIONS[i]
    const resp = await axios.get(endpoint)

    const remapped = resp.data.lines.filter(piece => piece.links === 0).map(({ id, name, chaosValue, exaltValue}) => ({
      id, name, chaosValue, exaltValue
    }))
    allUniques.push(...remapped)
    await wait(1000)
  }
  // eslint-disable-next-line no-undef
  const filepath = path.join(__dirname, 'results', 'uniquePriceData.json')
  fs.writeFile(filepath, JSON.stringify(allUniques, null, 2), (error) => console.log(error))
}

main()
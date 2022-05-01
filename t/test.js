const fetch = require('node-fetch')
const jsdom = require('jsdom')
const fs = require('fs')

const data = `Team Purple	Alliance	2000	Biggiejuggs-Stormrage	Lilïna-Stormrage	Lunasyl-Stormrage	Nauuri-Stormrage	
Off Meta Goons	Alliance	1900	Yagotov-Stormrage	Ankhin-Stormrage	Kmg-Sargeras	Fancymoose-Stormrage
The Boys	Alliance	1800	Punchdrunklv-Stormrage	Obamasfone-Sargeras	Fitlakare-Stormrage	Saztec-Stormrage	Farmerpumps-Stormrage
Team Sparkle	Alliance	1600	Cornpops-Thrall	Foxxman-Stormrage	Greenbstrd-Thrall	Sparklestick	Calucius-Thrall
The Melee Brain Cell	Alliance	2300	Dianemeta-Stonemaul	Ganypally-Stonemaul	Qpd-Sargeras	Tolun-Stonemaul	Salud-Stonemaul
Kiarita and Friends	Alliance	1900	Zameluk-Quel'Thalas	Letmerun-Sargeras	Isäbell-Stormrage	Kiarita-Stormrage	
Respect the Route	Alliance	1900	Deathsak-Sargeras	Sverali-Sargeras	Drpanic-sargeras	Bread-Sargeras	
Boomers	Horde	2000	Shiryon-thrall	Justacow-Arthas	Buswalker-tichondrius	Tegzi-tichobdrius	
Team Vindactum	Alliance	2000	Dapru-Icecrown	Whadeer-Icecrown	Sipsm-Icecrown	Chickenism-Icecrown	Sinmonk-Icecrown
TheBetters	Alliance	2100	Whodemon-Anvilmar	bubblbuddy-stormrage	Hiddenwhell-Anvilmar	Malleability-Stormrage	Krakfu-Anvilmar
Knivez Out	Alliance	2100	Sporkyy-Stormrage	Cethín-Sargeras	Leobane-Stormrage	Fumagic-Emerald Dream	
Peepoping	Alliance	2000	Soulshape-Stormrage	Sasooka-Sargeras	Julliete-Sargeras	Darkpanther-Stormrage	
Bean Gang	Alliance	2300	Teles-Stormrage	Sanerai-Stormrage	Xiloscient-Stormrage	Smoltron-Stormrage`

const main = async () => {
    const mappedData = data.split('\n').reduce((acc, line) => {
        // console.log(line.split('\t'))
        const vals = line.split('\t')
        acc[vals[0]] = vals.slice(2)
        return acc
    }, {})
    const dataEntries = Object.entries(mappedData)
    const classFetchData = []
    for (let i = 0; i < dataEntries.length; i++) {
        const [teamName, lineValues] = dataEntries[i]
        const classes = []
        for (let i = 1; i < lineValues.length; i++) {
            const character = lineValues[i]
            const [name, realm] = character.split('-')

            await new Promise(resolve => setTimeout(() => resolve(), 250))

            if (!realm || !name) {
                console.log('Realm or name was blank:', realm, name)
                continue
            }
            const url = `https://raider.io/characters/us/${realm}/${name}`
            console.log('Fetching', url)

            const className = await fetch(url)
                .then(r => r.text())
                .then(r => {
                    let classData = ''
                    try {
                        const doc = new jsdom.JSDOM(r)
                        classData = doc.window.document.querySelectorAll('.rio-characterbanner-padding h3')[2].textContent
                    }  catch {
                        console.log('Failed to get class data from URL', url)
                    }
                    return classData
                })
            classes.push(className)
        }
        classFetchData.push([teamName, lineValues[0], ...classes])
    }
    console.log(classFetchData)
    fs.writeFile('./out.csv', classFetchData.map(line => line.join(',')).join('\n'), null, () => {})
}

main()
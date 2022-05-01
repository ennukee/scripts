const { default: axios } = require("axios")
require('dotenv').config()

const USE_PRELOADED_DATA = false
const PRELOADED_DATA = {
  '2383': {
    code: 'JVh7rP9kXA6bvTZ3',
    encounterID: 2383,
    killedOn: '12/20/2020',
    ilvl: 206.8000030517578,
    players: [
      'Pududu',     'Ryeshot',
      'Ayowolo',    'Sinmonk',
      'Radalyn',    'Megafangwolf',
      'Lupp',       'Windz',
      'Mackzsh',    'Cerbi',
      'Chickenism', 'Ryn',
      'Clownbox',   'Finesthour',
      'Twelvebtw',  'Tats',
      'Rhelia',     'Jinarvo',
      'Saruu',      'Npdx'
    ]
  },
  '2398': {
    code: 'RFahcTW8vHrn3dpD',
    encounterID: 2398,
    killedOn: '12/16/2020',
    ilvl: 203.89999389648438,
    players: [
      'Ayowolo',    'Pududu',
      'Ryeshot',    'Sinmonk',
      'Radalyn',    'Mygiraffe',
      'Gutsman',    'Megafangwolf',
      'Windz',      'Mackzsh',
      'Cerbi',      'Chickenism',
      'Ryn',        'Agatio',
      'Finesthour', 'Clownbox',
      'Twelvebtw',  'Tats',
      'Rhelia',     'Npdx'
    ]
  },
  '2399': {
    code: 'mVv3B4KCxTD2ParQ',
    encounterID: 2399,
    killedOn: '1/17/2021',
    ilvl: 221.4499969482422,
    players: [
      'Ayowolo',      'Pududu',
      'Ryeshot',      'Sinmonk',
      'Radalyn',      'Mygiraffe',
      'Protpalli',    'Gutsman',
      'Megafangwolf', 'Windz',
      'Sarusham',     'Mackzsh',
      'Cerbi',        'Chickenism',
      'Finesthour',   'Twelvebtw',
      'Tats',         'Rhelia',
      'Jinarvo',      'Npdx'
    ]
  },
  '2402': {
    code: 'J3m8pxrqYKXBHbn4',
    encounterID: 2402,
    killedOn: '12/21/2020',
    ilvl: 206.60000610351562,
    players: [
      'Pududu',     'Ryeshot',
      'Ayowolo',    'Sinmonk',
      'Radalyn',    'Megafangwolf',
      'Lupp',       'Windz',
      'Mackzsh',    'Cerbi',
      'Chickenism', 'Ryn',
      'Clownbox',   'Finesthour',
      'Twelvebtw',  'Tats',
      'Rhelia',     'Jinarvo',
      'Saruu',      'Npdx'
    ]
  },
  '2405': {
    code: 'mDk2BfrNzTt73gjQ',
    encounterID: 2405,
    killedOn: '12/27/2020',
    ilvl: 213.0500030517578,
    players: [
      'Pududu',     'Ayowolo',
      'Sinmonk',    'Radalyn',
      'Lupp',       'Megafangwolf',
      'Windz',      'Mackzsh',
      'Cerbi',      'Chickenism',
      'Ryn',        'Clownbox',
      'Finesthour', 'Twelvebtw',
      'Tats',       'Rhelia',
      'Saruu',      'Jinarvo',
      'Npdx',       'Nurux'
    ]
  },
  '2406': {
    code: 'Hd8vyY4mBzT3QtDf',
    encounterID: 2406,
    killedOn: '12/28/2020',
    ilvl: 213.9499969482422,
    players: [
      'Pududu',     'Ayowolo',
      'Ryeshot',    'Sinmonk',
      'Radalyn',    'Mygiraffe',
      'Lupp',       'Megafangwolf',
      'Windz',      'Mackzsh',
      'Cerbi',      'Chickenism',
      'Ryn',        'Clownbox',
      'Finesthour', 'Twelvebtw',
      'Tats',       'Rhelia',
      'Jinarvo',    'Nurux'
    ]
  },
  '2407': {
    code: '3TqQCp9tBMAx7LY1',
    encounterID: 2407,
    killedOn: '2/21/2021',
    ilvl: 224.6999969482422,
    players: [
      'Pududu',    'Ayowolo',
      'Ryeshot',   'Sinmonk',
      'Radalyn',   'Mygiraffe',
      'Protpalli', 'Megafangwolf',
      'Lupp',      'Windz',
      'Sarusham',  'Mackzsh',
      'Cerbi',     'Chickenism',
      'Ryn',       'Finesthour',
      'Twelvebtw', 'Tats',
      'Rhelia',    'Jinarvo'
    ]
  },
  '2412': {
    code: 'G7pb1CcgfjhyqNBA',
    encounterID: 2412,
    killedOn: '1/10/2021',
    ilvl: 219.9499969482422,
    players: [
      'Pududu',       'Ryeshot',
      'Ayowolo',      'Sinmonk',
      'Radalyn',      'Mygiraffe',
      'Megafangwolf', 'Lupp',
      'Windz',        'Sarusham',
      'Mackzsh',      'Cerbi',
      'Chickenism',   'Ryn',
      'Finesthour',   'Twelvebtw',
      'Rhelia',       'Tats',
      'Jinarvo',      'Npdx'
    ]
  },
  '2417': {
    code: 'LRptjMKCQnXcm9H3',
    encounterID: 2417,
    killedOn: '2/8/2021',
    ilvl: 223.6999969482422,
    players: [
      'Pududu',    'Ryeshot',
      'Ayowolo',   'Sinmonk',
      'Radalyn',   'Mygiraffe',
      'Protpalli', 'Megafangwolf',
      'Windz',     'Sarusham',
      'Leeita',    'Mackzsh',
      'Cerbi',     'Chickenism',
      'Ryn',       'Finesthour',
      'Twelvebtw', 'Rhelia',
      'Tats',      'Jinarvo'
    ]
  },
  '2418': {
    code: 'JVh7rP9kXA6bvTZ3',
    encounterID: 2418,
    killedOn: '12/20/2020',
    ilvl: 206.4499969482422,
    players: [
      'Pududu',     'Ryeshot',
      'Ayowolo',    'Sinmonk',
      'Gutsman',    'Megafangwolf',
      'Lupp',       'Windz',
      'Mackzsh',    'Cerbi',
      'Chickenism', 'Agatio',
      'Ryn',        'Clownbox',
      'Finesthour', 'Twelvebtw',
      'Tats',       'Rhelia',
      'Jinarvo',    'Npdx'
    ]
  }
}

const BASE_URL = 'https://www.warcraftlogs.com/api/v2/client';
const headers = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  }
})
const generateGQL = (current_page, version, server, realm, guildName) => `{
  reportData {
    reports(
      guildName: "${guildName}",
      guildServerSlug: "${realm}",
      guildServerRegion: "${server}",
      page: ${current_page},
      limit: 100,
      startTime: 1607385600000 # Static, used for CN release date
      endTime: 1614038400000   # Dynamic, specify per guild
      zoneID: 26
      ) {
      current_page
      last_page
      total
      
      ${version === 'basic' 
        ? '' 
        : `data {
        ${version === 'players' 
        ? `masterData {
            actors(type: "Player") {
              id
              name
            }
          }` 
        : ''}
        code
        startTime
        ${version === 'fights' 
          ? `fights(killType: Kills) {
            averageItemLevel
            difficulty
            encounterID
            friendlyPlayers
          }` 
          : ''}
      }`}
    }
  }
}`

const calculateResponse = (firstKillData) => {
  /*
  Special terms to use?
    "Switch Hitter" - someone only played on the lowest number of prog bosses
    "Pillar" - people played on EVERY single boss (or the most, if none applicable)
  */
  const playerFrequency = Object.values(firstKillData).reduce((total, current) => {
    current.players.forEach(player => {
      if(!total[player]) {
        total[player] = []
      }
      total[player].push(current.encounterID)
    })
    return total
  }, {})
  // console.log(playerFrequency)


  const output = {
    firstKillData,
    pillars: Object.entries(playerFrequency).filter(([player, count]) => count.length === 10),
    switchHitters: Object.entries(playerFrequency).filter(([player, count]) => (count.length <= 3)),
  }
  console.log(output)
  return output
  // console.log(output)
}

const processFirstKills = (data) => {
  const firstKills = {
    /*
      These objects should have form
      {
        code: string,
        ilvl: number,
        players: string[], <- converted from number ids using master data
        killedOn: number, <- equivalent to startTime
      }
    */
    2398: {}, // Shriek
    2418: {}, // Altimor
    2383: {}, // Hungering
    2402: {}, // Sun King
    2405: {}, // Xy'mox
    2406: {}, // Inerva
    2412: {}, // Council
    2399: {}, // Sludgefist
    2417: {}, // SLG
    2407: {}, // Donny
  }
  const validEncounterIds = Object.keys(firstKills).map(i => +i) // Why does Object.keys convert to string?

  const convertPlayerIdsToNames = (masterData, playerIds) => {
    const betterMasterData = masterData.reduce((total, current) => {
      total[current.id] = current.name
      return total
    }, {})
    return playerIds.map(id => betterMasterData[id])
  }

  console.log(data)

  data.forEach(log => {
    log.fights.forEach(fight => {
      if (fight.difficulty !== 5) { return }
      // console.log(fight.encounterID)
      if (validEncounterIds.includes(fight.encounterID) && !firstKills[fight.encounterID].code) {
        firstKills[fight.encounterID] = {
          code: log.code,
          encounterID: fight.encounterID,
          killedOn: (new Date(log.startTime)).toLocaleDateString(),
          ilvl: fight.averageItemLevel,
          players: convertPlayerIdsToNames(log.masterData.actors, fight.friendlyPlayers),
        }
      }
    })
  })

  // console.log(firstKills)
  return calculateResponse(firstKills)
}

const processRequests = async (token, server, realm, guildName) => {
  console.log('Token acquired', token)

  const pageCheckRequest = await axios.post(BASE_URL, { data: { query: generateGQL(1, 'basic', server, realm, guildName) } }, headers(token))
  const pageCount = pageCheckRequest.data[0].data.reportData.reports.last_page

  // Queue all the requests needed to get all relevant information
  let currentPage = 1
  const allRequests = []
  while(currentPage <= pageCount) {
    const fightRequest = axios.post(BASE_URL, { data: { query: generateGQL(currentPage, 'fights', server, realm, guildName) } }, headers(token))
    const playerRequest = axios.post(BASE_URL, { data: { query: generateGQL(currentPage, 'players', server, realm, guildName) } }, headers(token))
    allRequests.push(fightRequest, playerRequest)
    currentPage += 1
  }

  // Wait for all requests to finish
  const completedRequests = await Promise.all(allRequests)

  // Take 2D array above and flatten it while condensing the fight/players requests into one single array using the log code as the primary key
  const combinedData = Object.values(completedRequests.reduce((total, current) => {
    const currentReports = current.data[0].data.reportData.reports.data
    currentReports.forEach(report => {
      if (!total[report.code]) {
        total[report.code] = {}
      }
      total[report.code] = {
        ...total[report.code],
        ...report,
      }
    })
    return total
  }, {})).sort((a, b) => a.startTime - b.startTime)

  // Pass it to the data processing logic
  return processFirstKills(combinedData)
}

const getToken = async (server, realm, guildName) => {
  return axios.post(`https://www.warcraftlogs.com/oauth/token`, {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'client_credentials',
  }).then(
    (resp) => {
      return processRequests(resp.data.access_token, server, realm, guildName)
    },
    (err) => console.log(err),
  );
};

module.exports = {
  getToken
}
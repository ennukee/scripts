const { default: axios } = require("axios")
require('dotenv').config()

const BASE_URL = 'https://www.warcraftlogs.com/api/v2/client';
const headers = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  }
})

const query = `
{
  reportData {
  reports(
    guildName: "vindicatum",
    guildServerSlug: "icecrown",
    guildServerRegion: "us",
    page: 1,
    limit: 100,
    startTime: 1607385600000 # Static, used for CN release date
    endTime: 1614038400000   # Dynamic, specify per guild
    zoneID: 26
    ) {
      current_page
      last_page
      total

      data {
#         rankedCharacters {
          
#         }
        rankings(difficulty: 4, encounterID: 2399, timeframe: Historical)
        masterData {
          actors(type: "Player") {
            id
            name
          }
        }
        code
        startTime
#         fights(killType: Kills) {
#           averageItemLevel
#           difficulty
#           encounterID
#           friendlyPlayers
#         }
      }
    }
  }
}
`

const main = async (token) => {
  /*
    Used in tandem with Insomnia to get insight on data from specific queries
  */

  const resp = await axios.post(BASE_URL, { data: { query } }, headers(token))
  console.log(resp.data[0].data.reportData.reports.data.map(log => log.rankings.data))
}

main(``) // Removed, check env file

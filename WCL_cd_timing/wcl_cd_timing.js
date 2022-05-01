const { default: axios } = require("axios")
const fs = require('fs')
require('dotenv').config()

// 2423 / 2433 / 2429 / 2432 / 2434 / 2430 / 2436 / 2431 / 2422 / 2435
const ENCOUNTER_ID = 2435

const CODES = [
  // 'NAzZrXhQGtCDWyMm', // Tyrannical
  'pqKLQJmdxrYXH1gy', 
  'xm4TRKcM6LayHv1X', 
  'zpHyG3kxLgAFQhKB', 
];
const BASE_URL = 'https://www.warcraftlogs.com/api/v2/client';

const SPELL_IDS = [
  // '228260', // Void Eruption
  '10060', // PI
  // '12472', // IV
  // '12042', // AP
  '190319', // Combust
  '113858', // DSI
  '265187', // Tyrant
  '102560', // Incarn
  '79140', // Vendetta
  '123904', // Xuen
  '288613', // Trueshot
  '42650', // Army

  // Healing CDs
  // '62618', // PW:Barrier
  // '325013', // Boon

  // '31821', // AM
  // '316958', // Ashen

  // '207399', // APT
  // '98008', // SLT
  // '108280', // HTT

  // Utility CDs
  // '97462', // Rally
  // '51052', // AMZ
]

const SPELL_ID_NAME_MAP = {
  // '228260': 'VF',
  '10060': 'PI',
  // '12472': 'IV',
  // '12042': 'AP',
  '190319': 'Combust',
  '265187': 'DemonicTyrant',
  '113858': 'DSI', 
  '102560': 'Incarn', 
  '79140': 'Vendetta',
  '123904': 'Xuen',
  '288613': 'Trueshot',
  '42650': 'Army',

  // '62618': 'Barrier',
  // '325013': 'Boon',
  // '31821': 'AM',
  // '316958': 'Ashen',
  // '207399': 'APT',
  // '98008': 'SLT',
  // '108280': 'HTT',

  // '97462': 'Rally',
  // '51052': 'AMZ',
}

const SPELL_CAST_LIMIT = 15 // to check only P1 casts

const debug = true

const outputGQLErrors = (out) => {
  if (out[0] && out[0].errors) {
    console.log(out[0].errors)
    console.log(out[0].errors[0].locations)
    return true
  }
}

const getFightData = async (token, code) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };
  const fightsGQL = `{
    reportData {
      report(code: "${code}") {
        code
        fights(
          killType: Kills,
          encounterID: ${ENCOUNTER_ID}
        ) {
          startTime
          endTime
        }
      }
    }
  }`
  axios.post(BASE_URL, {
    data: {
      query: fightsGQL
    }
  }, headers).then(
    (resp) => {
      SPELL_IDS.forEach(id => getSpellData(resp.data, headers, id, code))
    },
  );
}

const getSpellData = (data, headers, spellId, code) => {
  if (debug && outputGQLErrors(data)) return
  const { startTime, endTime } = data[0].data.reportData.report.fights[0];
  const spellsGQL = `{
    reportData {
      report(code: "${code}") {
        code
        guild {
          name
        }
        masterData {
          actors {
            id,
            name
          }
        }
        events(
          dataType: Casts,
          abilityID: ${spellId},
          startTime: ${startTime},
          endTime: ${endTime}
        ) {
          data
        }
      }
    }
  }`
  // console.log(spellsGQL)
  axios.post(BASE_URL, {
    data: {
      query: spellsGQL
    }
  }, headers).then(
    (resp) => handleDataOutput(resp.data, startTime, spellId, code),
    (err) => console.log(err),
  );
}

const handleDataOutput = (spellData, start, spellId, code) => {
  if (debug && outputGQLErrors(spellData)) return;
  const data = spellData[0].data.reportData.report;
  const castList = data.events.data;
  const actorList = data.masterData.actors;
  const guildName = data.guild ? data.guild.name : 'N/A (check log)';
  const output = {}
  castList.forEach(cast => {
    const unitName = `http://www.warcraftlogs.com/reports/${code}\t${guildName}\t${actorList.filter(unit => unit.id === cast.sourceID)[0].name}`
    if (!output[unitName]) {
      output[unitName] = []
    } else if (output[unitName].length >= SPELL_CAST_LIMIT) {
      return
    }
    const relativeCast = Math.floor((cast.timestamp - start) / 1000)
    const castMinutes = Math.floor(relativeCast / 60)
    const castSeconds = relativeCast % 60
    output[unitName].push(`${castMinutes}:${castSeconds < 10 ? '0' : ''}${castSeconds}`)
  });
  Object.entries(output).forEach(([key, value]) => {
    fs.appendFile(`./timing_output/${SPELL_ID_NAME_MAP[spellId] || spellId}_timings.txt`, [key, ...value].join('\t') + '\n', (err) => {
      if (err) throw err;
    })
  })
}

const handleCodeIterator = async (access_token) => {
  console.log('Token acquired', access_token)
  for (let i = 0; i < CODES.length; i++) {
    getFightData(access_token, CODES[i])
    await new Promise(resolve => setTimeout(() => resolve(), 20000))
  }
}

const getToken = () => {
  return axios.post(`https://www.warcraftlogs.com/oauth/token`, {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'client_credentials',
  }).then(
    (resp) => {
      handleCodeIterator(resp.data.access_token)
      // CODES.forEach(code => getFightData(resp.data.access_token, code))
    },
    (err) => console.log(err),
  );
};
  
getToken();





  // '190319', // combust
  // '194223', // celestial alignment
  // '205180', // darkglare
  // '323764', // convoke
  // '328231', // wild spirits
  // '327661', // FG
  // '200174', // Bender
  // '10060', // PI
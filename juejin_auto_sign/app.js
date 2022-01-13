const got = require('got')

const { cookie, aid, uuid, _signature, PUSH_PLUS_TOKEN } = require('./config')

const urlApi = [
  'https://api.juejin.cn/growth_api/v1/check_in',   // 掘金签到api
  'https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky',  //沾幸运次数
  'https://api.juejin.cn/growth_api/v1/lottery/draw'  //免费抽一次
]
const PUSH_URL = 'http://www.pushplus.plus/send' // pushplus 推送api


const HEADERS = {
  cookie,
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 Edg/92.0.902.67'
}

async function dbFuc() {
  let reqApi = urlApi.map(v=> `${v}?aid=${aid}&uuid=${uuid}&_signature=${_signature}`)
  let promises = reqApi.map((url) => got.post(url, {
    hooks: {
      beforeRequest: [
        options => {
          Object.assign(options.headers, HEADERS)
        }
      ]
    },
    json: {
      lottery_history_id: "7005733067977719816"
    }
  }));
  let results = [];
  for (let promise of promises) {
    let res = await promise
    results.push(res.body);
  }
  handlePush(results)
}

// push
async function handlePush (desp) {
  const body = {
    token: `${PUSH_PLUS_TOKEN}`,
    title: `签到结果`,
    content: `${desp}`
  };
  const res = await got.post(PUSH_URL, {
    json: body
  })
}

dbFuc()


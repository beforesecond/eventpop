var cron = require('node-cron')
var moment = require('moment')

var time1 = moment().unix()
var time2 = moment('2019-01-17 17:55:00').unix()
var time3 = moment('2019-01-17 18:05:00').unix()

cron.schedule('* * * * * *', function() {
  if (time1 >= time2 && time1 <= time3) {
    console.log('running a task every second')

    const { exec } = require('child_process')
    exec('npm run start', (err, stdout, stderr) => {
      if (err) {
        console.log(err)
        // node couldn't execute the command
        return
      }
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
    })
  }
})

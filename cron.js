var cron = require('node-cron')
var moment = require('moment')

var time2 = moment('2019-08-16 11:59:00').unix()
var time3 = moment('2019-08-16 12:01:00').unix()

cron.schedule('*/10 * * * * *', function() {
  var time1 = moment().unix()
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

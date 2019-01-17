var cron = require('node-cron')

cron.schedule('* * * * * *', function() {
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
})

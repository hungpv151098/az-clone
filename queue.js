#!/usr/bin/env node

const sendMailQueue = require('./src/queue/sendMail/sendMail.queue');
const config = require('./src/app.config');
const sendMailProcess = require('./src/queue/sendMail/sendMail.process');
const sendTokenQueue = require('./src/queue/sendToken/sendToken.queue');
const sendTokenProcess = require('./src/queue/sendToken/sendToken.process');

sendMailQueue.process(config.queue.sendEmail, sendMailProcess);
sendTokenQueue.process(config.queue.sendToken, 1, async (job, done) => {
  try {
    await sendTokenProcess(job, done);
  } catch (e) {
    console.log(`Error in sendToken: ${e}`);
    job.failed();
    done(e);
  }
});

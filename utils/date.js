const moment = require('moment-timezone');
const date_and_time = require('date-and-time')

  let date_time = new Date(moment.tz(Date.now(), "Asia/Colombo"));
  let date = date_and_time.format(date_time,'YYYY/MM/DD').toString();

  module.exports = {
    date : date
  };
  
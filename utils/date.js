const moment = require('moment-timezone');
const date_and_time = require('date-and-time')
  exports.getDate = async function (user, random_password) {
    let date = new Date(moment.tz(Date.now(), "Asia/Colombo"));
    console.log(date_and_time.format(date,'YYYY/MM/DD').toString());
  };

  let date_time = new Date(moment.tz(Date.now(), "Asia/Colombo"));
  let date = date_and_time.format(date_time,'YYYY/MM/DD').toString();

  module.exports = {
    date : date
  };
  
const moment = require('moment-timezone');
const date_and_time = require('date-and-time')

  let date_time = new Date(moment.tz(Date.now(), "Asia/Colombo"));
  let date = date_and_time.format(date_time,'YYYY/MM/DD').toString();
  let month = date_and_time.format(date_time,'MM').toString();
  let month_integer = parseInt(date_and_time.format(date_time,'MM').toString());
  let year = date_and_time.format(date_time,'YYYY').toString();
  let year_integer = parseInt(date_and_time.format(date_time,'YYYY').toString());
  let year_month = date_and_time.format(date_time,'YYYY/MM').toString();

  function lastSixMonths(date){
    var date_time = new Date(date);
    let month_arr = [];
    month_arr[0] = year_month;
    for(let i = 1; i<6; i++){
      date_time.setMonth(date_time.getMonth() - 1);
      month_arr[i] = date_and_time.format(date_time,'YYYY/MM').toString();
    }
    return month_arr;
  }

  module.exports = {
    date : date,
    month : month,
    month_integer : month_integer,
    year : year,
    year_integer : year_integer,
    year_month : year_month,
    month_arr : lastSixMonths(date)
  };


  
  

import Locale from '../constants/Locale';

import i18n from '../i18n';


const helper = {
    ObjToArr(data) {
        if(typeof(data) == 'object') {
            return Object.keys(data).map(key => ({ key, value: data[key] }));
        }
        return false;
    },
    inArray(value, array) {
      if(array.indexOf(value) != -1)
      {  
            return true
      }
      return false
    },
    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    parserDate(date){
      var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = '' +d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return {
          day,
          month,
          year
        }
    },
    secondFormat(second) {
      return (second < 10) ? "0"+second : second
    },
    timerFormat(second) {
      let min = second / 60;
      let hour = min / 60;
      let day = Math.floor(hour / 24);
      let time = [
          this.secondFormat( Math.floor(hour % 24) ), 
          this.secondFormat( Math.floor(min % 60) ), 
          this.secondFormat( Math.floor(second % 60) ), 
        ].join(":");

        return {
          day,
          time
        }
    },
    phoneNumber(phone) {
      return phone.replace(/[^0-9]/g, '')
    },
    formatNumber(number) {
        return  String(number).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    },
    formatDate(date, type = "yyyy-mm-dd") {
        let {day, month, year} = this.parserDate(date);
        switch (type) {
          case "yyyy-mm-dd":
            return [year, month, day].join('-');
        
          case "dd.mm.yyyy":
            return [day, month, year].join('.');
        }
       
    },
    getWeek(d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        
        //Set the start date of the week, Monday
        let startWeekDay =  new Date(d.getTime() - 86400 * 1000 * 3);
        //Set the end date of the week, Sunday
        let endWeekDay = new Date(d.getTime() + 86400 * 1000 * 3);
        // Get first day of year
        let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        // Calculate full weeks to nearest Thursday
        let weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);

        
        // Return array of year and week number
        return {
            'year' : d.getUTCFullYear(), 
            'weekNo' : weekNo,
            'startWeekDay' : startWeekDay,
            'endWeekDay' : endWeekDay,
        };
    },
    getDate(d, locale = "ru") {
      let date = new Date(d)
      return date.getDate() + " " + Locale[ locale ]["monthRodNames"][date.getMonth()] 
    },
    getDayWeek(d, locale = "ru") {
      let date = new Date(d)
      return Locale[ locale ]["dayNames"][date.getDay()]
    },
    getFullDate(d, locale) {
      return this.getDate(d, locale) + " " + this.getYear(d, locale)
    },
    getWeekStr(d, locale = "ru") {
      let week = this.getWeek(new Date(d));
      return  this.getFullDate(week.startWeekDay, locale)+ " — " + this.getFullDate(week.endWeekDay, locale)
    },
    getWeekNoStr(d, locale ="ru") {
      let week = this.getWeek(new Date(d));
      return Locale[ locale ].week + " " + week.weekNo
    },
    getMonth(d, locale = "ru") {
      let date = new Date(d)
      return Locale[ locale ]["monthNames"][date.getMonth()]
    },
    getYear(d) {
      let date = new Date(d);
      return date.getFullYear()
    },
    isIncludedRangeDate (date, minDate, maxDate) {
      date = this.formatDate(date, "yyyy-mm-dd")
      return new Date(minDate) <= new Date(date) && new Date(date) <= new Date(maxDate)
    },
    decimalAdjust(type, value, exp) {
      // Если степень не определена, либо равна нулю...
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      // Если значение не является числом, либо степень не является целым числом...
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
      }
      // Сдвиг разрядов
      value = value.toString().split('e');
      value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
      // Обратный сдвиг
      value = value.toString().split('e');
      return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    },
    round10(value, exp) {
        return this.decimalAdjust('round', value, exp);
      
    },
    num2str(n, text_forms=['минута', 'минуты', 'минут']) {
        n = Math.abs(n) % 100; var n1 = n % 10;
        if (n > 10 && n < 20) { return text_forms[2]; }
        if (n1 > 1 && n1 < 5) { return text_forms[1]; }
        if (n1 == 1) { return text_forms[0]; }
        return text_forms[2];
    },
    distanceFormat(km) {
      let meter = km * 1000;
      if(meter > 2000) {
        let km = this.round10(meter / 1000 , -1);
        return km + " " + this.num2str(km, i18n.t('arr_km'));
      }
      return meter + " " + this.num2str(meter, i18n.t('arr_meter'));
    },
    formarCreditCard(number) {
      return number.toString().slice(-4)
    },
    createCryptogram(cardNumber, cardExp, cardCvv, publicId) {
      cardNumber = cardNumber.replace(/\D+/g,"");
      cardExp = cardExp.split("/").join("");
      var exp = cardExp.substr(2, 4) + cardExp.substr(0, 2);
      console.log( cardNumber + "@" + exp + "@" + cardCvv + "@" + publicId)
      return cardNumber + "@" + exp + "@" + cardCvv + "@" + publicId;
    },
    upTime(time_start:timestamp, time_now:timestamp) {
      return this.timerFormat(time_now - time_start)
    },
    validateCardNumber(digits) {
      if(digits) {
        digits = digits.replace(/\D+/g,"");
        let sum = 0;
      
        for (let i = 0; i < digits.length; i++) {
          let cardNum = parseInt(digits[i]);
      
          if ((digits.length - i) % 2 === 0) {
            cardNum = cardNum * 2;
      
            if (cardNum > 9) {
              cardNum = cardNum - 9;
            }
          }
      
          sum += cardNum;
        }

        return sum % 10 === 0;
      }
      return false
    },
    isLatinStr(str) {
      var regexp = /[а-яё0-9]/i;
      if(regexp.test(str)) {
          return false;
      }
      return true
    }
  };
  
  module.exports = helper;
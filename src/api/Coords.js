/**
 * @file Geodesic, cartographic, and geographic
 * @author Jason Wohlgemuth
 * @module geodetic
 * @site https://applied.js.org/geodetic.js
**/
const GEOSPATIAL_VALUE_LENGTH = 3;
const MINUTES_PER_DEGREE = 60;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_DEGREE = MINUTES_PER_DEGREE * SECONDS_PER_MINUTE;
const TEN_THOUSANDTHS = 4;
const ONE_THOUSANDTHS = 3;
const TEN = 1;
const {abs, asin, atan, atan2, cos, sin, sqrt, tan, trunc, PI} = Math;
const RADIANS_PER_DEGREE = PI / 180.0;
const DEGREES_PER_RADIAN = 180.0 / PI;
const DATUM = Object.create(null, {
    EARTH_EQUATOR_RADIUS:       {enumerable: true, value: 6378137},
    EARTH_MEAN_RADIUS:          {enumerable: true, value: 6371001},
    EARTH_AUTHALIC_RADIUS:      {enumerable: true, value: 6371007},
    SEMI_MAJOR_AXIS:            {enumerable: true, value: 6378137.0},
    SEMI_MINOR_AXIS:            {enumerable: true, value: 6356752.3142},
    FLATTENING:                 {enumerable: true, value: 0.0033528106718309896},
    FLATTENING_INVERSE:         {enumerable: true, value: 298.257223563},
    FIRST_ECCENTRICITY_SQUARED: {enumerable: true, value: 0.006694380004260827},
    LINEAR_ECCENTRICITY:        {enumerable: true, value: 521854.00842339},
    AXIS_RATIO:                 {enumerable: true, value: 0.996647189335}
});
type point2 = [number, number];
function delta(fn: (number) => number): (number, number) => number {
    return (a, b) => (fn(a) - fn(b));
}
function deg(val: number): number {
    return val * DEGREES_PER_RADIAN;
}
function rad(val: number): number {
    return val * RADIANS_PER_DEGREE;
}
function hav(theta: number): number {
    return 0.5 * (1 - cos(theta));
}
function ahav(x: number): number {
    return acos(1 - (2 * x));
}
function pad (str) {
    return String( (Number(str) < 10) ? "0"+str : str );
}
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function frac(float: number): any {
    float = abs(float);
    let digits = (float !== trunc(float)) ? String(float).split('.')[1].length : 0;
    return (float - trunc(float)).toFixed(digits);
}
const Coords = {
    /**
    * @function toDegreesMinutesSeconds
    * @memberof module:geodetic
    * @param {number[]} value Latitude or longitude expressed as [DDD, MMM, SSS]
    * @returns {number[]} [degrees, minutes, seconds]
    * @example <caption>Convert a decimal degree value</caption>
    * const {toDegreesMinutesSeconds} = require('applied').geodetic;
    * const val = [32.8303, 0, 0];
    * var dms = toDegreesMinutesSeconds(val);
    * console.log(dms);// [32, 49, 49.0800]
    */

    toDegreesMinutesSeconds(value) {
        if (value.length !== GEOSPATIAL_VALUE_LENGTH) {
            return null;
        }
        const data = value;
        const dimension = data.length - data.slice(0).reverse().findIndex(function(val) {return abs(val) > 0;});
        const degrees = trunc(value[0]);
        let minutes = 0;
        let seconds = 0;

        /* istanbul ignore else */
        if (dimension === 1) {
            minutes = frac(data[0]) * MINUTES_PER_DEGREE;
            seconds = frac(minutes) * SECONDS_PER_MINUTE;
        } else if (dimension === 2) {
            minutes = trunc(data[1]);
            seconds = frac(data[1]) * SECONDS_PER_MINUTE;
        } else if (dimension === GEOSPATIAL_VALUE_LENGTH) {
            minutes = value[1];
            seconds = value[2];
        }
        return [
            abs(degrees),
            trunc(minutes),
            seconds.toFixed(TEN)
        ].map(Number);
    },
    /**
    * @function toDegreesDecimalMinutes
    * @memberof module:geodetic
    * @param {number[]} value Latitude or longitude expressed  as [DDD, MMM, SSS]
    * @returns {number[]} [degrees, minutes, seconds]
    * @example <caption>Convert a decimal degree value</caption>
    * const {toDegreesDecimalMinutes} = require('applied').geodetic;
    * const val = [32.8303, 0, 0];
    * let ddm = toDegreesDecimalMinutes(val);
    * console.log(ddm);// [32, 49.818]
    **/
    toDegreesDecimalMinutes(value) {
        if (value.length !== GEOSPATIAL_VALUE_LENGTH) {
            return null;
        }
        let data = value;
        let dimension = data.length - clone(data).reverse().findIndex((val) => {return abs(val) > 0;});
        let degrees = trunc(data[0]);
        let minutes = 0;
        let seconds = 0;
        /* istanbul ignore else */
        if (dimension === 1) {
            minutes = frac(data[0]) * MINUTES_PER_DEGREE;
        } else if (dimension > 1) {
            minutes = data[1] + (data[2] / SECONDS_PER_MINUTE);
        }
        return [
            abs(degrees),
            minutes.toFixed(ONE_THOUSANDTHS),
            seconds
        ].map(Number);
    },
    /**
    * @function toDecimalDegrees
    * @memberof module:geodetic
    * @param {number[]} value Latitude or longitude expressed  as [DDD, MMM, SSS]
    * @returns {number}
    * @example <caption>Convert a degree minutes seconds value</caption>
    * const {toDecimalDegrees} = require('applied').geodetic;
    * const val = ['32', '49', '49.0800'];
    * let dd = toDecimalDegrees(val);
    * console.log(dd);// 32.8303
    **/

    toDecimalDegrees(value: number[]): ?number {

        let data = value;
        const sign = Math.sign(data[0])
        data = data.map(Number).map(abs)
        data = sign * (data[0] + (data[1] / MINUTES_PER_DEGREE) + (data[2] / SECONDS_PER_DEGREE));
        return !isNaN(data) ? data : null;

    },
    /**
    * @function getHaversineDistance
    * @param {number[]} pointA [latitude, longitude] (in degrees)
    * @param {number[]} pointB [latitude, longitude] (in degrees)
    * @returns {number} Distance between points (in meters)
    * @example <caption>Calulate distance from Omaha, NE to San Diego, CA</caption>
    * const {getHaversineDistance} = require('applied').geodetic;
    * const a = [41.2500, 96.0000];// Omaha, NE
    * const b = [32.7157, 117.1611];// San Diego, CA
    * let distance = getHaversineDistance(a, b);
    * console.log(distance);// about 2098 km
    **/
    getHaversineDistance(pointA: point2, pointB: point2): number {
        const a = pointA.map(rad);
        const b = pointB.map(rad);
        const Δ = [
            b[0] - a[0], // latitude
            b[1] - a[1] // longitude
        ];
        const R = DATUM.EARTH_AUTHALIC_RADIUS;
        const inner = hav(Δ[0]) + (cos(a[0]) * cos(b[0]) * hav(Δ[1]));
        return 2 * R * asin(sqrt(inner));
    },
    toDD_OF_DDM (value) {
        if(typeof value == "undefined" && null == value) return 0

        let data = value;
        let degress = parseFloat(data[0]);
        let minutes = parseFloat(data[1]);
        let negative_or_positive = 1;
        if(degress < 0) {
            degress = abs(degress)
            negative_or_positive = -1
        } 
        return (degress + (minutes / MINUTES_PER_DEGREE)) * negative_or_positive

    },
    toDD_OF_DMS (value) {
        if(typeof value == "undefined" && null == value) return 0

        let data = value;
        let degress = parseFloat(data[0]);
        let minutes = parseFloat(data[1]);
        let seconds = parseFloat(data[2]);
        let negative_or_positive = 1;
        if(degress < 0) {
            degress = abs(degress)
            negative_or_positive = -1
        } 
        return ((degress + (minutes/60) + (seconds/3600) ) * negative_or_positive)

    },
    changeLetter(letter) {
        switch (letter) {
          case 'N':
            return "S"
          case 'S':
            return "N"
          case 'E':
            return "W" 
          case 'W':
            return "E" 
          default:
            return letter
        }
    },
    latX(lat) {
        return (lat >= 0)? 'N' : 'S'
    },
    lngX(lng) {
        return (lng >= 0)? 'E' : 'W'
    },
    isDegres(lat, lng) {
        lat = parseFloat(lat)
        lng = parseFloat(lng)

        if(typeof lat === "number" 
            && typeof lng === "number"
            && !isNaN(lat) && !isNaN(lng)) 
        {
            if(lat <=90 && lat >=-90 && lng <=180 && lng >=-180)
                return {lat, lng}
        }
        return false
    },
    /**
    * @function getDMS
    * @param {number{}} value Latitude and longitude
    * @returns {string[]} N53°21′6.12″E58°58′51.6″
    * @example <caption>Get string decimal degree value</caption>
    * let lat = 53.35170;
    * let lng = 58.98100;
    * var dms = getDMS(lat, lng);
    * console.log(dms);// N53°21′6.12″E58°58′51.6″
    */
    getDMS(lat, lng) {
        let str, arLat, arLng

        if(data = this.isDegres(lat, lng)) {
            arLat= this.toDegreesMinutesSeconds([data.lat, 0, 0])
            arLng = this.toDegreesMinutesSeconds([data.lng, 0, 0])
            
            str = this.latX(lat) + `${pad(arLat[0])}°${pad(arLat[1])}′${arLat[2]}″`
            str += this.lngX(lng) + `${pad(arLng[0])}°${pad(arLng[1])}′${arLng[2]}″`
         
            return str;
        }
        return false
       
    },
    getDDM(lat, lng) {
        let str, arLat, arLng

        if(data = this.isDegres(lat, lng)) {
            arLat= this.toDegreesDecimalMinutes([data.lat, 0, 0])
            arLng = this.toDegreesDecimalMinutes([data.lng, 0, 0])

            str = this.latX(lat) + `${pad(arLat[0])}°${pad(arLat[1])}′ `
            str += this.lngX(lng) + `${pad(arLng[0])}°${pad(arLng[1])}′`
            //N05°03.220′	E145°02.033′
            return str;
        }
    },
    getDD(lat, lng) {
        let str, arLat, arLng
        
        if(data = this.isDegres(lat, lng)) {
            arLat= this.toDecimalDegrees(this.toDegreesMinutesSeconds([data.lat, 0, 0]))
            arLng = this.toDecimalDegrees(this.toDegreesMinutesSeconds([data.lng, 0, 0]))
            //pad(arLat)
            str = this.latX(lat) + `${pad(arLat.toFixed(5))}° `
            str += this.lngX(lng) + `${pad(arLng.toFixed(5))}°`
            //N05.05367° E145.03389°
            return str;
        }
    },
    getFPLN(lat, lng) {
        let str, arLat, arLng
        
        if(data = this.isDegres(lat, lng)) {
            arLat= this.toDegreesMinutesSeconds([data.lat, 0, 0])
            arLng = this.toDegreesMinutesSeconds([data.lng, 0, 0])
            //0503N14502E
            str = pad(arLat[0]) + pad(arLat[1]) + this.latX(lat) 
            str += pad(arLng[0]) + pad(arLng[1]) +this.lngX(lng)
            
            return str
        }
    },
    getGPS(lat, lng) {
        if(data = this.isDegres(lat, lng)) {
            return data.lat.toFixed(5)+','+ data.lng.toFixed(5)
        }
    },
    getGoogleMaps(lat, lng) {
        //https://www.google.com/maps/place/53.3517,58.981/53.3517,58.981,10z
        let res = false
        if(data = this.isDegres(lat, lng)) {
            res =  `https://www.google.com/maps/place/${data.lat},${data.lng}/${data.lat},${data.lng},10z`
        }
        console.log('linkGoogleMaps', res)
        return res
        
    },
    getYandexMaps(lat, lng) {
        //https://yandex.ru/maps/?ll=58.981%2C53.3517&pt=58.981%2C53.3517&z=10
        let res = false
        if(data = this.isDegres(lat, lng)) {
            res = `https://yandex.ru/maps/?ll=${data.lng}%2C${data.lat}&pt=${data.lng}%2C${data.lat}&z=10`
        }
        console.log('linkYandexMaps', res)
        return res
    },
    getCoordList(lat, lng) {
        return [
            {key: 'D.M.S', name: 'Градусы минуты и секунды', value: Coords.getDMS(lat, lng)},
            {key: 'D.D.M', name: 'Градусы минуты и доли минут', value: Coords.getDDM(lat, lng)},
            {key: 'D.D', name: 'Градусы и доли градусов', value: Coords.getDD(lat, lng)},
            {key: 'GPS', name: 'GPS', value: Coords.getGPS(lat, lng)},
            {key: 'FPLN', name: 'FPLN', value: Coords.getFPLN(lat, lng)},
        ]
    },
    strCoordList(lat, lng) {
        let str
        let coordList = this.getCoordList(lat, lng)
        str = 'Координаты: \n'
        coordList.map((item, key) => {
            str += item.name + ': ' + item.value + '\n'
        })
        str += 'GoogleMaps: \n' + this.getGoogleMaps(lat, lng)
        str += 'YandexMaps: \n' + this.getYandexMaps(lat, lng)

        //console.log(str)
        return str
    },
    
    isLatOrLng(latlng) {
        if(latlng == null) return false

        let data = {};
        switch (latlng[1]) {
            case "N": 
                data.lat = latlng.slice(2)
            break;
            case "S": 
                data.lat = latlng.slice(2)
                data.lat[0] = (data.lat[0]) * -1
            break;
            case "E": 
                data.lng = latlng.slice(2)
            break;
            case "W": 
                data.lng = latlng.slice(2)
                data.lng[0] = (data.lng[0]) * -1
            break;
        }

        console.log('isLatOrLng', data)
        return data
    },
    parseGPS(str) {
        //Допустимый формат -123.35170,-128.981; 58.211,122.23
        //необходимо дописать проверку по макс и мин -90 до 90 для широты и -180 до 180 для долготы!!!
        let arr, lat, lng, error = null
        let coordList = []
        //this.strParser2latlon(str)
        console.log('func parseGPS', str)
        if(/^(([0-1]|-?\d{1,3})\.(\d{1,})\,([0-1]|-?\d{1,3})\.(\d{1,}))$/.test(str)) {
            
            arr = str.split(",")
            if(data = this.isDegres(arr[0], arr[1])) {
                coordList = this.getCoordList(data.lat, data.lng)
                lat = data.lat
                lng = data.lng
            } else {
                error = "Неудачный формат"
            }
        } else {
            error = "Неудачный формат"
        }
        return {error, lat, lng, coordList}
    },
    
    strParser2latlon(str) {
        let lat, lng, latlng, dms, newstr, coords_format;
        let data = {};
        let latOrLng = null;
        let lngOrLat = null;
        //str = str.replace(/[\u2032]/g, "\"")
        //str = str.replace(/[\u2033]/g, "\'")
        //str = str.replace(/[\u00b0]/g, "°")
        re_dms = /([N|S]|[W|E])([0-1]?\d{1,2})_(\d{1,2})_(\d{1,}\.?\d{1,}?)/g
        re_ddm = /([N|S]|[W|E])([0-1]?\d{1,2})_(\d{1,2}\.\d{1,})/g
        re_dd = /([N|S]|[W|E])([0-1]?\d{1,2}\.?\d{1,})/g

        newstr = str.replace(/°|\′|\″/g, "_")
        dms = newstr.match(re_dms)
        if(dms = newstr.match(re_dms)) {
            coords_format = "dms";
            latOrLng = dms[0]
            lngOrLat = dms[1]
            regEx = re_dms

        } else if(ddm = newstr.match(re_ddm)) {
            coords_format = "ddm";
            latOrLng = ddm[0]
            lngOrLat = ddm[1]
            regEx = re_ddm
        } else if(dd = newstr.match(re_dd)) {
            coords_format = "dd";
            latOrLng = dd[0]
            lngOrLat = dd[1]
            regEx = re_dd
        }

        if(lngOrLat != null && latOrLng != null) {
            latlng = this.isLatOrLng(regEx.exec(lngOrLat))
            regEx.lastIndex = 0
            latlng2 = this.isLatOrLng(regEx.exec(latOrLng))
            
            console.log('strParser2latlon', data);
            //console.log('toDD_OF_DDM', this.toDD_OF_DDM(data.lat))
            return  {   type: coords_format, 
                        value: {
                            ...latlng,
                            ...latlng2
                        }
                    }
        }
        
        return false
    },
    parser(str) {
        let data = null
        var newstr = str
        if(data = this.strParser2latlon(str)) {
            if(data.type == "ddm") {
                    newstr = this.toDD_OF_DDM(data.value.lat) + "," + this.toDD_OF_DDM(data.value.lng) 
            } else if(data.type == "dms") {
                    newstr =  this.toDD_OF_DMS(data.value.lat) + "," + this.toDD_OF_DMS(data.value.lng) 
            } else if(data.type == "dd") {
                    newstr = Number(data.value.lat) + "," + Number(data.value.lng)      
            }
        }
        return this.parseGPS(newstr)
    }
    //https://www.npmjs.com/package/parse-dms    
}
// Обязательно тесты напиши
//console.log('strParser2latlonDMS', Coords.strParser2latlon("N14°22′55.52″ E22°11′22.11″"))
//console.log('strParser2latlonDDM', Coords.strParser2latlon("N28°171.019′	E095°05.967′"))
//console.log('strParser2latlonDD', Coords.strParser2latlon("N25.35° E41.33"))
//console.log('strParser2latlonDD', Coords.parser("N25.35° W41.33"))
//console.log('parserDDM', Coords.parser("N28°171.019′	E095°05.967′"))
//console.log('parserDDM', Coords.parser("N28°17.019′	E095°05.967′"))
//console.log('dms', Coords.getDMS(53.35170, 58.981))
//console.log('ddm', Coords.getDDM(53.35170, 58.981))
// console.log('dd', Coords.getDD(53.35170, 58.981))
// console.log('flpn', Coords.getFPLN(53.35170, 58.981))
// console.log('google', Coords.getGoogleMaps(53.35170, 58.981))
// console.log('yandex', Coords.getYandexMaps(53.35170, 58.981))
//console.log('parseGPS', Coords.parseGPS('53.35170, 58.981'))
 //console.log('strCoordList', Coords.strCoordList(53.35170, 58.981))
//  const a = [41.2500, -96.0000];// Omaha, NE
// const b = [53.407184, 58.979204];// Magnitogorsk, CH
// let distance = Coords.getHaversineDistance(a, b);
// console.log(distance/1000);// about 2098 km

module.exports = Coords;
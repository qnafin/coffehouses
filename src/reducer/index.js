import {combineReducers} from 'redux'

import other from './other'
import auth from './auth'
import user from './user'
import onboard from './onboard'
import main from './main'
import payment from './payment'
import rent from './rent'
import search from './search'
import setting from './setting'
import station from './station'
import socket from './socket'



export default combineReducers({
    auth,
    user,
    main,
    other,
    onboard,
    payment,
    rent,
    setting,
    search,
    socket,
    station
})
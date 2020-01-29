import {combineReducers} from 'redux'

import other from './other'
import auth from './auth'
import user from './user'
import main from './main'
import payment from './payment'
import search from './search'
import setting from './setting'
import coffehouses from './coffehouses'



export default combineReducers({
    auth,
    user,
    main,
    other,
    payment,
    setting,
    search,
    coffehouses
})
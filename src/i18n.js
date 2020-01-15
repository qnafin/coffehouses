import i18n from 'i18n-js';
import Locale from './constants/Locale'
import  * as api from "./api"


i18n.fallbacks = true;
i18n.translations = { ru: Locale.ru, en: Locale.en };

i18n.locale = "ru"
// api.getLocale().then((res) => {
//     i18n.locale = res      
// })

export const getLocale = async () =>  {
    return api.getLocale()
}

export default i18n
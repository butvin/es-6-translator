"use strict"
import Translate from './translator.js';

function format() {
    const date = new Date();
    const locale = 'zh-Hans-CN-bauddha-u-nu-hanidec';
// const locale =  navigator.languages ? navigator.languages[0] : navigator.language;
    const formatter = new Intl.DateTimeFormat(locale);
    const formattedDate = formatter.format(date);
    console.log(formattedDate); // 二〇二〇/四/二一

    return formattedDate
}

function sprintf(s) {
    let bits = s.split('%');
    let out = bits[0];
    const re = /^([ds])(.*)$/;
    for (let i=1; i<bits.length; i++) {
        // p = re.exec(bits[i]);
        // if (!p || arguments[i]==null) continue;
        // if (p[1] == 'd') {
        //   out += parseInt(arguments[i], 10);
        // } else if (p[1] == 's') {
        //   out += arguments[i];
        // }
        // out += p[2];
    }
    return out;
}

const options = {
    defaultLang: 'ru',
    languages: ['ru', 'ukr'],
    localStorage: true,
    autoDetectLang: false,
    filesLocation: '/i18n/',
}


const translator = new Translate(options)
console.log(translator)


translator.setLang('ukr')
console.log(translator.getLang())

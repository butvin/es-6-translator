'use strict'

console.time('timer')
console.timeStamp('timer')

/**
 * JSON specifications:
 * @link https://www.ecma-international.org/ecma-262/6.0/#sec-json-object
 *
 * js map: Map([iterable])
 * @link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Map
 *
 * CONSOLE API
 * @link https://developer.mozilla.org/ru/docs/Web/API/Console
 */

import Translate from './Translate.js'

const options = {
    defaultLang: 'ru', // lang="en"
    languages: ['ru', 'uk', 'en'],
    localStorage: true,
    autoDetectLang: false,
    filesLocation: './i18n',
}

const t = new Translate(options)
// console.log('translator >>', t)

const langStart = t.currentLangAttr
console.log('Lang attribute on loading >>', langStart)

const langFinish = t.getLang()
console.log('Lang attribute on ready >>', langFinish)























// testing
// for (let i = 0; i < 5; i++) {
//     console.error('[%s]This is %s call',
//       new Date().toLocaleTimeString(),
//       i+1
//     )
// }



// function i18n(template) {
//     for (
//         let info = i18n.db[i18n.locale][template.join('\x01')],
//             out = [info.t[0]], i = 1,
//             length = info.t.length;
//         i < length;
//         i++
//     ) out[i] = arguments[1 + info.v[i - 1]] + info.t[i];
//
//     return out.join('');
// }


// i18n.locale = 'ru';
// i18n.db = {};


// i18n.set = locale => (tCurrent, ...rCurrent) => {
//     const key = tCurrent.join('\x01');
//     let db = i18n.db[locale] || (i18n.db[locale] = {});
//     db[key] = {
//         t: tCurrent.slice(),
//         v: rCurrent.map((value, i) => i)
//     };
//     const config = {
//         for: other => (tOther, ...rOther) => {
//             db = i18n.db[other] || (i18n.db[other] = {});
//             db[key] = {
//                 t: tOther.slice(),
//                 v: rOther.map((value, i) => rCurrent.indexOf(value))
//             };
//             return config;
//         }
//     };
//     return config;
// };


// const rusData = fetch('/i18n/rus.json')
// .then(response => response.json())
// .then(data => {
//   console.log(data)
//   return data
// })
// console.log(rusData)


//   {
//     if (!response.ok || response.status !== 200) {
//       throw new Error(`HTTP ERROR! STATUS: ${response.status}`)
//   } else {
//     console.log(response.json())
//     localStorage.setItem('loaded', JSON.stringify(response))
//     console.log(JSON.parse(localStorage.getItem('loaded')))
//   }
// }


// if (lang === this._lang) {
//   return console.log(`${this._lang} is already set.`)
// }
// fetch(`./i18n/${lang}.json`)
// .then(response => response.json())
// .then((translation) => {
//   console.log(translation)
// })
// .catch((e) => {
//   console.log(`Could not load ${this._lang}.json: ` + e.message)
// })
// .finally(() => {
//   // console.log(`[FINALLY] Fetch from '${uri}' for ${this.getLang()} finished.`);
// })


// function format() {
//     const date = new Date();
//     const locale = 'zh-Hans-CN-bauddha-u-nu-hanidec';
// // const locale =  navigator.languages ? navigator.languages[0] : navigator.language;
//     const formatter = new Intl.DateTimeFormat(locale);
//     const formattedDate = formatter.format(date);
//     console.log(formattedDate); // 二〇二〇/四/二一
//
//     return formattedDate
// }


// function sprintf(s) {
//     let bits = s.split('%');
//     let out = bits[0];
//     const re = /^([ds])(.*)$/;
//     for (let i=1; i<bits.length; i++) {
//         // p = re.exec(bits[i]);
//         // if (!p || arguments[i]==null) continue;
//         // if (p[1] == 'd') {
//         //   out += parseInt(arguments[i], 10);
//         // } else if (p[1] == 's') {
//         //   out += arguments[i];
//         // }
//         // out += p[2];
//     }
//     return out;
// }

console.timeEnd('timer')
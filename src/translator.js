"use strict";

export default class Translate {
    /**
     * Translators constructor
     *
     * @param options
     */
    constructor (options = {}) {
        this._cache = new Map();

        if (options instanceof Object) {
            this._options = Object.assign({}, this.defaultConfig, options)

            if (this._options.autoDetectLang) {
                this._lang = this._options.detectLang()
                this._options.defaultLanguage = this.detectLang()
            }

            if (this._options.defaultLang &&
                typeof this._options.defaultLang == 'string'
            ) {
                this.setLang(this._options.defaultLang)
            }
        }
    }

    /**
     * Get loaded locale at start app
     *
     * @returns {string}
     */
    detectLang() {
        const storedLanguage = localStorage.getItem('language')

        if (this._options.localStorage && storedLanguage) {
            return storedLanguage
        }

        const language = navigator.languages ?
            navigator.languages[0] : navigator.language;

        return language.slice(0, 2)
    }

    /**
     *
     * @param {Object} data
     * @param {String} lang
     * @returns {Translate}
     */
    addTranslation(data, lang) {
        // todo
    }

    /**
     * Examples
     *
     * translate(['%s день', '%s дня', '%s дней', 10]) // множественная форма
     * translate('Привет')
     * translate('Привет %s', 'гость')
     *
     * @param {String|Number|Array} msgId
     * @returns {String|Translate}
     */
    translate(msgId) {
        // todo
    }

    /**
     * Current locale
     *
     * @param {string} lang
     * @returns {Translate}
     */
    setLang(lang) {
        if (!this._options.languages.includes(lang)) {
            return
        }

        if (this._options.localStorage) {
            localStorage.setItem('language', lang);
        }

        return this._lang = this.$loadDictionary(lang)
    }

    /**
     * Get current loaded language
     *
     * @returns {string}
     */
    getLang() {
        return this._lang
    }

    _fetch(path) {
        return fetch(path)
            .then(response => response.json())
            .catch(error => {
                console.error(`
          Could not load "${path}".
          Please make sure that the file exists.
        `)
            })
    }

    async $loadDictionary(language) {

        if (this._cache.has(language)) {
            return JSON.parse(this._cache.get(language))
        }

        const translation = await this._fetch(
            `${this._options.filesLocation}/${language}.json`
        )

        if (!this._cache.has(language)) {
            this._cache.set(language, JSON.stringify(translation));
        }

        return translation
    }

    // async load(language) {
    //   if (!this._options.languages.includes(language)) {
    //     return;
    //   }
    //
    //   this._translate(await this.$loadDictionary(language));
    //
    //   document.documentElement.lang = language;
    //
    //   if (this._options.localStorage) {
    //     localStorage.setItem('language', language);
    //   }
    // }

    _getValueFromJSON(key, json, fallback) {
        let text = key.split('.').reduce((obj, i) => obj[i], json);

        if (!text && this._options.defaultLang && fallback) {
            let fallbackTranslation = JSON.parse(
                this._cache.get(this._options.defaultLang)
            );
            text = this._getValueFromJSON(key, fallbackTranslation, false);
        } else if (!text) {
            text = key;
            console.warn(`Could not find text for attribute "${key}".`);
        }

        return text;
    }

    /**
     * The defaultConfig property getter
     */
    get defaultConfig() {
        return {
            defaultLang: '',
            languages: ['rus', 'ukr'],
            filesLocation: '/i18n/',
            localStorage: false,
            autoDetectLang: false,
        }
    }

    _translate(translation) {
        const zip = (keys, values) => keys.map((key, i) => [key, values[i]])

        const nullSafeSplit = (str, separator) => (str ? str.split(separator) : null)

        let replace = element => {
            let keys = nullSafeSplit(element.getAttribute("data-i18n"), " ") || [];
            let properties = nullSafeSplit(
                element.getAttribute("data-i18n-attr"),
                " "
            ) || ["innerHTML"];

            if (keys.length > 0 && keys.length !== properties.length) {
                console.error('data-i18n and data-i18n-attr must contain the same number of items');
            } else {
                const pairs = zip(keys, properties)

                pairs.forEach(pair => {
                    const [key, property] = pair;
                    const text = this._getValueFromJSON(key, translation, true);

                    if (text) {
                        element[property] = text;
                        element.setAttribute(property, text);
                    } else {
                        console.error(`Could not find text for attribute "${key}".`);
                    }
                });
            }
        }

        this._elements.forEach(replace);
    }
}

Translate.default = Translate;
// module.exports = Translate;
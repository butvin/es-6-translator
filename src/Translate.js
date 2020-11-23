class Translate {
    /**
     * Translators constructor
     *
     * @param options
     */
    constructor (options = {}) {
        if (options instanceof Object) {
            this._options = Object.assign({}, this.defaultConfig, options)
            this._cache = new Map()

            if (this._options.autoDetectLang) {
                this._lang = this._options.detectLang()
                this._options.defaultLanguage = this.detectLang()
            }

            if (typeof this._options.defaultLang === 'string') {
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
        const isStoredLang = localStorage.getItem('lang')

        if (this._options.localStorage && isStoredLang) {
            return isStoredLang
        }

        const language = navigator.languages ?
            navigator.languages[0] : navigator.language;

        return language.slice(0, 2)
    }

    _setHtmlLangAttr(lang) {
        document.documentElement.setAttribute('lang', lang)
    }

    _getHtmlLangAttr() {
        const language = document.documentElement.lang
        console.log('language >>>', language)

        switch (language) {
            case 'ru':
                console.log('switch-case-russian >>>', language)
            break

            case 'ukr':
                console.log('switch-case-ukrainian >>>', language)
            break

            case 'en':
                console.log('switch-case-english >>>', language)
            break

            default:
                console.log('switch-case-default >>>', language)
                this._setHtmlLangAttr(this._options.defaultLang)
            break
        }
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
        if (this._options.languages.includes(lang) && this._options.localStorage) {
            localStorage.setItem('lang', lang);
        }

        let path = this._options.filesLocation ?  (this._options.filesLocation + '/') : './'
        path += (lang + '.js').toString()

        console.log('[setLang()-method scope] path >>>', path)

        const dictionary = import(path)
          .then(module => {
              console.log('module >>>', module.default)
          })
          .catch(err => {
              console.log('error >>>', err)
          })

        console.log('dictionary >>>', dictionary)

        return this._lang = dictionary
    }

    /**
     * Get current loaded language
     *
     * @returns {string}
     */
    getLang() {
        return this._lang
    }

    _import(path) {
        return import(path)
            .then(module => module)
            .catch(error => {
                console.error(`
                   >>> Could not load "${path}"
                   >>> Check that the file exists
                `)
                console.log(error.message)
            })
    }

    _fetch(path) {
        return fetch(path)
            .then(response => response)
            .catch(error => {
                console.error(`Could not load "${path}". Check that the file exists.`)
                console.log(error.message)
            })
    }

    async $loadDictionary(language) {

        if (this._cache.has(language)) {
            return JSON.parse(this._cache.get(language))
        }

        const translation = await this._fetch(
            `${this._options.filesLocation}/${language}.js`
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
    //     localStorage.setItem('lang', language);
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
            languages: [],
            filesLocation: '',
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

export default Translate
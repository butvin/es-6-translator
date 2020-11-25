class Translate {
    /**
     * Translators constructor
     *
     * @param {Object} options
     */
    constructor (options = {}) {
        /** Obtain and handle the input options */
        this._options = Object.assign({}, this.defaultConfig, options)
        const opt = this._options

        /** Current language at the present */
        // this._lang

        /** Selector for HTML element @type {HTMLElement|HTMLHtmlElement} */
        this._htmlNode = document.documentElement || document.getElementsByTagName('html')[0]

        /** Init '_cache' property of class @type {Map<any, any>} */
        this._cache = new Map()

        /** Load default language from config */
        const defaultLang = this._options.defaultLang
        console.group('>>>\t[Obtain default language from config] >> '+defaultLang+'\n\n')
        console.groupEnd()

        if (typeof defaultLang === 'string' && defaultLang.length > 0 &&  this._options.languages.includes(defaultLang)) {

            if (!this._options.languages.includes(defaultLang)) {
                console.warn('Language '+defaultLang+' not found in ['+this._options.languages+']')
            }

            this.setLang(defaultLang)

            this._options.autoDetectLang = false
        }

        /** Auto detect language */
        if (this._options.autoDetectLang && this._options.autoDetectLang === true) {
            console.log('[Auto detect language] >> ON')
            this._lang = this.detectLang()
            this.setLang(this._lang)
            console.log('[Detected language] >>', this._lang )
        } else {
            console.log('[Auto detect language] >> OFF')
        }

        /** Current value of html lang attribute */
        this.currentLangAttr
    }

    // get _lang () {
    //     // todo
    // }

    /**
     * Getter for current value of lang attribute
     *
     * @returns {String}
     */
    get currentLangAttr () {
        return this._getHtmlLangAttr()
    }

    set currentLangAttr (lang) {
        return this._setHtmlLangAttr(lang)
    }

    /**
     * Auto detect language.
     *
     * @returns {string}
     */
    detectLang() {

        const langAttr = this._getHtmlLangAttr()
        const isStoredLang = localStorage.getItem('lang')

        if (langAttr && typeof langAttr === 'string') {
            return langAttr
        }
        else if (this._options.localStorage && isStoredLang) {
            return isStoredLang
        }
        else {
            let localeLang = navigator.languages ? navigator.languages[0] : navigator.language;
            return localeLang.slice(0, 2)
        }
    }

    /**
     * Set lang attribute value to HTML element
     *
     * @param {String} lang
     * @private
     */
    _setHtmlLangAttr(lang) {
        if (this._htmlNode.hasAttribute('lang') || this._htmlNode.hasAttribute('xml:lang')) {
            this._htmlNode.setAttribute('lang', lang)
        } else {
            console.error('>>>\t[HTML element has no property "xml:lang" || "lang"]')
        }
    }

    /**
     * Get html tag lang attribute value
     *
     * @private
     * @returns {String}
     */
    _getHtmlLangAttr() {
        let isEexistLangAttr =
            this._htmlNode.hasAttribute('lang') ||
            this._htmlNode.hasAttribute('xml:lang');

        if (isEexistLangAttr) {
            return (
                this._htmlNode.lang ||
                this._htmlNode.getAttribute('lang') ||
                this._htmlNode.getAttribute('xml:lang')
            )
        } else {
            console.error('[HTML element without attribute "xml:lang" or "lang"]')
        }
    }

    /**
     * On switch language behavior
     *
     * @param {String} language
     * @private
     */
    _switch (language) {
        switch (language) {
            case 'ru':
                console.warn('switch-case-russian >>', language)
                this._setHtmlLangAttr(language)
                break

            case 'ukr':
                console.warn('switch-case-ukrainian >>', language)
                this._setHtmlLangAttr(language)
                break

            case 'en':
                console.warn('switch-case-english >>', language)
                this._setHtmlLangAttr(language)
                break

            default:
                console.warn('switch-case-default >>', language)
                this._setHtmlLangAttr(language)
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
     * Obtain path to dictionary depended by language argument
     *
     * @param {String} lang
     * @private
     */
    _getPath(lang) {
        let path = (this._options.filesLocation ? (this._options.filesLocation + '/') : './') + lang + '.js';

        return path.toString()
    }

    /**
     * Set specific language
     *
     * @param {string} lang
     * @returns {Translate}
     */
    async setLang(lang) {

        // localStorage.clear();

        const path = this._getPath(lang)

        const loaded = await this._import(path)

        if (loaded) {
            this._setHtmlLangAttr(lang)

            if (this._options.localStorage === true) {
                localStorage.setItem('lang', lang)
                localStorage.setItem('loaded', JSON.stringify(loaded))
            }

            console.group('\n>>>\t\t[Loaded language] >> '+lang+'\n>>>\t\t[Dynamically imported and stored] >>', JSON.parse(JSON.stringify(loaded)))
            console.groupEnd()

            // todo: this._lang = loaded
            this._lang = lang

            return loaded
        }
    }

    /**
     * Get current loaded language
     *
     * @returns {string}
     */
    getLang() {
        return this._lang
    }

    /**
     * Dynamically language importing
     *
     * @param {string} path
     * @returns {Promise<* | void>}
     * @private
     */
    _import(path) {
        return import(path)
            .then(dictionary => dictionary.default)
            .catch(error => {
                console.error(`
                   >>> Could not load "${path}". Check the file exists.
                   >>> Error: [${error.message}]
                `)
            })
    }

    /**
     * Fetch data from file by path
     *
     * @param {String} path
     * @returns {Promise<* | void>}
     * @private
     */
    _fetch(path) {
        return fetch(path)
            .then(response => response)
            .catch(error => {
                console.error(`
                   >>> Could not load "${path}". Check the file exists.
                   >>> Error: [${error.message}]
                `)
            })
    }

    /**
     *
     * @param language
     * @returns {Promise<any|Response|void>}
     */
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
     * The default configuration getter
     */
    get defaultConfig() {
        return {
            defaultLang: '',
            languages: [],
            filesLocation: '',
            localStorage: false,
            autoDetectLang: true,
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

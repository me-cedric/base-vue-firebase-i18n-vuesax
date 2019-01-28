
import firebase from '@/firebase/firebase'
import Vue from 'vue'
import Subject from './Subject'

import VueI18n from 'vue-i18n'

import fr from '@/lang/fr.json'
import languageConstants from '@/lang/language-const.json'

// Multilanguage
Vue.use(VueI18n)

const DEFAULT_LANGUAGE = languageConstants && languageConstants.hasOwnProperty('defaultLang') ? languageConstants.defaultLang : null
const FALLBACK_LANGUAGE = languageConstants && languageConstants.hasOwnProperty('fallbackLang') ? languageConstants.fallbackLang : null
const SUPPORTED_LANGUAGES = languageConstants && languageConstants.hasOwnProperty('supportedLang') ? languageConstants.supportedLang : null

export const i18n = new VueI18n({
  locale: DEFAULT_LANGUAGE, // set locale
  fallbackLocale: FALLBACK_LANGUAGE,
  messages: { fr }, // set locale messages
  silentTranslationWarn: true
})

/**
 * Language service allowing you to setup a translation system
 * @param {*} defaultLangObj
 */
function LanguageService () {
  this.defaultLanguage = DEFAULT_LANGUAGE
  this.fallbackLanguage = FALLBACK_LANGUAGE
  this.supportedLanguages = SUPPORTED_LANGUAGES
}

/**
 * Checks if current lang is the one from the database
 */
LanguageService.prototype.checkLocationLang = function (locationId) {
  let checkedLang = this.getUserSupportedLang(locationId)
  if (i18n.lang !== checkedLang) {
    i18n.lang = checkedLang
  }
}

/**
 * Gets the first supported language that matches the user's
 * @return {String}
 */
LanguageService.prototype.getUserSupportedLang = function (locationId) {
  const userPreferredLang = this.getDefaultLanguage(locationId)

  // Check if user preferred browser lang is supported
  if (this.isLangSupported(userPreferredLang.lang)) {
    return userPreferredLang.lang
  }
  // Check if user preferred lang without the ISO is supported
  if (this.isLangSupported(userPreferredLang.langNoISO)) {
    return userPreferredLang.langNoISO
  }
  return this.defaultLanguage
}

/**
 * Gets the default language from firebase
 */
LanguageService.prototype.getDefaultLanguage = function (locationId) {
  return new Promise((resolve, reject) => {
    // Update the data object into the database
    return firebase.database().ref('locations').child(locationId).child('defaultLang')
      // Upload the file if there is one
      .then((snapshot) => {
        return {
          lang: snapshot.val(),
          langNoISO: snapshot.val().split('-')[0]
        }
      })
      .catch(err => reject(err))
  })
}

LanguageService.prototype.setI18nLocale = function (lang) {
  if (this.isLangSupported(lang)) {
    this.loadLanguage(lang)
  }
}

LanguageService.prototype.setDefaultLanguage = function (locationId, lang) {
  return new Promise((resolve, reject) => {
    // Update the data object into the database
    return firebase.database().ref('locations').child(locationId).child('defaultLang').set(lang)
      // Upload the file if there is one
      .then(() => {
        this.setI18nLocale(lang)
        document.querySelector('html').setAttribute('lang', lang)
        resolve('The Default Language Setting has been successfully updated')
      })
      .catch(err => reject(err))
  })
}

/**
 * Returns the users preferred language
 */
LanguageService.prototype.getBrowserLang = function () {
  var lang = window.navigator.language || window.navigator.userLanguage || this.defaultLanguage
  return {
    lang: lang,
    langNoISO: lang.split('-')[0]
  }
}

/**
 * Checks if a lang is supported
 * @param {String} lang
 * @return {boolean}
 */
LanguageService.prototype.isLangSupported = function (lang) {
  return this.supportedLanguages.includes(lang)
}

/**
 * Async loads a translation
 * @param lang
 * @return {Promise<*>|*}
 */
LanguageService.prototype.loadLanguage = function (lang) {
  return new Promise((resolve, reject) => {
    // Update the data object into the database
    return firebase.database().ref('webLanguages').child(lang).once('value')
      // Upload the file if there is one
      .then((snapshot) => {
        i18n.setLocaleMessage(lang, snapshot.val())
        i18n.locale = lang
      })
      .catch(err => reject(err))
  })
}

/**
 * String type
 * String key
 * Obj value
 */
LanguageService.prototype.updateTranslation = function (type, langCode, data) {
  let appOrDashboard = type === 'app' ? 'languages' : 'webLanguages'
  return new Promise(function (resolve, reject) {
    return firebase.database().ref(appOrDashboard).child(langCode).set(data)
      .then(result => { resolve(result) })
      .catch(error => reject(error))
  })
}

/**
 * String type
 * String key
 */
LanguageService.prototype.deleteTranslation = function (type, langCode) {
  let appOrDashboard = type === 'app' ? 'languages' : 'webLanguages'
  return new Promise(function (resolve, reject) {
    return firebase.database().ref(appOrDashboard).child(langCode).remove()
      .catch(error => reject(error))
  })
}

/**
 * Obj constants of supported languages
 */
LanguageService.prototype.updateConstants = function (constants) {
  return new Promise(function (resolve, reject) {
    return firebase.database().ref('languageSupport').set(constants)
      .then(result => { resolve(result) })
      .catch(error => reject(error))
  })
}

/**
 * Function to get all the languages.
 * @return Promise
 */
LanguageService.prototype.getAll = function (type, callback) {
  // Create the subject object
  let subject = new Subject()
  // Attach the passed callback to it
  subject.subscribe(callback)
  let webOrMobile = type === 'web' ? 'webLanguages' : 'languages'
  firebase.database().ref(webOrMobile).on('value',
    (snapshot) => {
      // The subject notifies all observers
      subject.notify(snapshot.val())
    },
    (error) => {
      console.log(error.code)
    })
}

/**
 * Function to get all the supported languages.
 * @return Promise
 */
LanguageService.prototype.getAllSupported = function (callback) {
  // Create the subject object
  let subject = new Subject()
  // Attach the passed callback to it
  subject.subscribe(callback)
  firebase.database().ref('languageSupport').on('value',
    (snapshot) => {
      // The subject notifies all observers
      subject.notify(snapshot.val())
    },
    (error) => {
      console.log(error.code)
    })
}

// Export the class
export default new LanguageService()

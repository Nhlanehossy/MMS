import { translationKeys as en } from "../Localization/International/english";
import { translationKeys as ja } from "../Localization/International/japanese";
import { translationKeys as ch } from "../Localization/International/chinese";
import { translationKeys as es } from "../Localization/International/spanish";
import { translationKeys as fr } from "../Localization/International/french";
import { translationKeys as pt } from "../Localization/International/portugese";
import { translationKeys as sw } from "../Localization/International/swahili";
import { translationKeys as ny } from "../Localization/local/chewa";
import { translationKeys as yao } from "../Localization/local/yao";
import { translationKeys as sena } from "../Localization/local/sena";
import { translationKeys as tumbuka } from "../Localization/local/tumbuka";

const languages = {
  en, ja, ch, es, fr, pt, sw, ny, yao, sena, tumbuka
};

function getLanguage() {
  return localStorage.getItem("language") || "en";
}

function setLanguage(lang) {
  if (languages[lang]) {
    localStorage.setItem("language", lang);
    updateTranslationKeys();
    return true;
  }
  return false;
}

let translationKeys = { ...languages[getLanguage()] };

function updateTranslationKeys() {
  const currentLang = getLanguage();
  translationKeys = { ...languages[currentLang] };
}

export { translationKeys, getLanguage, setLanguage };
export const availableLanguages = Object.keys(languages);
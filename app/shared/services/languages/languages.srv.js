/**
 * Created by Gregori.
 * @Description - service to import the json holding all the information about each country.
 */

import languages from '../../../../assets/languages/languages.json';

export class LanguagesService {
    constructor () {
        
    }

    getLanguages () {
        return languages;
    }
}


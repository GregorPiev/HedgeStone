/**
 * Created by saar on 17/04/16.
 * @Description - service to import the json holding all the information about each country.
 */

import countries from '../../../../assets/countries/countries.json';

export class CountriesService {
    constructor () {
        
    }

    getCountries () {
        return countries;
    }
}


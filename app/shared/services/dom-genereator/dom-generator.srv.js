/**
 * Created by saar on 21/04/16.
 * @Description: service to generate html templates for each component that contains array of sub-components.
 */


export class DomGenerator {
    /**
     * @constructor
     * inject dependencies
     */
    constructor() {
        'ngInject';
    }

    /**
     * @generateArray
     * generate the html template for the component
     * @param data - array that contains the sub-components of the component
     * @param controllerAsName - the component's controllerAs name for the template to define its controller
     * @param dataName - the component's data attribute (=) for his scope
     * @returns {string}
     */
    generateArray(data, controllerAsName, dataName) {
        let componentTemplate = '';
        if (!_.isEmpty(data.array)) {
            if (typeof data.array[0].precedence !== 'undefined')
                data.array.sort(function (a, b) {
                    return a.precedence - b.precedence; // render elements by precedence defined in the json
                });
            angular.forEach(data.array, (value, key)=> {
                let component = Object.keys(value)[0];
                let searchable = (typeof data.array[key][component].searchable !== 'undefined' && data.array[key][component].searchable) ? ' searchable-item' : '';
                /**
                 * searchable - attribute added to the element in order to listen to a search event if fired in rootScope.
                 * Added only if the components "searchable" = true exists in the json.
                */
                componentTemplate += `<${component} data="${controllerAsName}.${dataName}.array[${key}]['${component}']" ${searchable}></${component}>`;

            });
        }
        return componentTemplate;
    }

    generateBackground(data) {
        if (typeof data.background !== 'undefined' && data) {
            return {"background-image": 'url(' + data.background + ')', "background-position": "center"};
        }
    }
}
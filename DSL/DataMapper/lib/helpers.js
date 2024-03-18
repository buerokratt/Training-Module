import Handlebars from 'handlebars';

Handlebars.registerHelper('toJSON', function(obj) {
    return JSON.stringify(obj);
});

Handlebars.registerHelper('eq', function(a, b) {
    return a == b;
});

Handlebars.registerHelper('jsonParse', function(obj) {
    return JSON.parse(obj);
});

Handlebars.registerHelper('arrayIsNotEmpty', function(array) {
    return !(!Array.isArray(array) || !array.length);
});

Handlebars.registerHelper('extractSlotKeys', function(obj) {
    const keys = [];

    function iterate(obj) {
        for (const key in obj) {
            keys.push(key)
        }
    }

    iterate(obj);

    return keys;
});

Handlebars.registerHelper('getObjectKeys', function(obj) {
    return Object.keys(obj);
});

Handlebars.registerHelper('ne', function(a, b) {
    return a !== b;
});

Handlebars.registerHelper('valueExists', function(array, value) {
    return array.includes(value);
})

Handlebars.registerHelper('removeEntityFromArray', function (entities, entityToRemove) {
    const index = entities.indexOf(entityToRemove);
    if(index > -1) {
        entities.splice(index, 1);
    }
    return entities
});

Handlebars.registerHelper('assign', function(varName, varValue, options) {
    if (!options.data.root) {
        options.data.root = {};
    }
    options.data.root[varName] = varValue;
});

Handlebars.registerHelper('sortEntities', function (entities) {
    return entities.sort((a,b) => a.name > b.name ? 1 : -1);
});

Handlebars.registerHelper('isInModel', function(intentTitle, intents) {
    const inModelIntents = intents?.inmodel;
    return Array.isArray(inModelIntents) ? inModelIntents.includes(intentTitle) : false;
});

Handlebars.registerHelper('findConnectedServiceId', function(intentTitle, intents) {
  const name = intentTitle.replace('_', ' ');
  const service = intents?.connections.find(x => x.intent === name);
  return service?.service ?? "";
});

Handlebars.registerHelper('getCount', function(intentTitle, intents) {
    const intentCounts = intents.count;
    const intentCount = intentCounts?.find(intent => intent.key === intentTitle)?.examples_counts?.value;
    return intentCount || 0;
});

Handlebars.registerHelper('addStringIfAbsent', function (input, addString) {
    if(input.startsWith(addString)) {
        return input;
    } else {
        return addString + input;
    }
})

Handlebars.registerHelper('concatStringIfAbsent', function (input, addString) {
    if(input.endsWith(addString)) {
        return input;
    } else {
        return input + addString;
    }
})

Handlebars.registerHelper('findMatchInObject', function (object, key , keyModifier) {
    if(object) {
        const result = object[keyModifier + key];
        return result ? result[0].text : '';
    }
    return '';
})

Handlebars.registerHelper('filterArrayByKey', function (array, key) {
    return array.filter(ar => ar[key].trim() !== '');
})

Handlebars.registerHelper('notEmpty', function(value, options) {
    if (typeof value === 'string' && value.trim() !== '') {
        return options.fn(this);
    }
    return options.inverse(this);
})

Handlebars.registerHelper('isType', function (type, value) {
    return typeof value === type;
});

export default Handlebars.helpers;

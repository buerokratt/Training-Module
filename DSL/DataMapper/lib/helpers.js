import Handlebars from 'handlebars';

Handlebars.registerHelper('toJSON', function(obj) {
    return JSON.stringify(obj);
});

Handlebars.registerHelper('eq', function(a, b) {
    return a == b;
});

Handlebars.registerHelper('assign', function(varName, varValue, options) {
    if (!options.data.root) {
        options.data.root = {};
    }
    options.data.root[varName] = varValue;
});

Handlebars.registerHelper('isInModel', function(intentTitle, intents) {
    const inModelIntents = intents?.inmodel;
    return Array.isArray(inModelIntents) ? inModelIntents.includes(intentTitle) : false;
});

Handlebars.registerHelper('getCount', function(intentTitle, intents) {
    const intentCounts = intents.count;
    const intentCount = intentCounts?.find(intent => intent.key === intentTitle)?.examples_counts?.value;
    return intentCount || 0;
});

export default Handlebars.helpers;

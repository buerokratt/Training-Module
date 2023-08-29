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

Handlebars.registerHelper('isInModel', function(intentTitle, data) {
    const inModelIntents = data?.response?.inmodel?.response?.intents;
    return Array.isArray(inModelIntents) ? inModelIntents.includes(intentTitle) : false;
});

Handlebars.registerHelper('getCount', function(intentTitle, data) {
    const intentCounts = data?.response?.count?.aggregations?.hot?.buckets;
    const intentCount = intentCounts?.find(bucket => bucket.key === intentTitle)?.examples_counts?.value;
    return intentCount || 0;
});

export default Handlebars.helpers;

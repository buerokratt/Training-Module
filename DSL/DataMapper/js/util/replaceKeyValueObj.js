import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    let { object, key, replace } = req.body;

    const data = {
        custom_fallback_form: [{ id: 1, name: 'Form 1' }],
        direct_to_customer_support_form: [{ id: 2, name: 'Form 2' }],
    };

    const oldKey = 'custom_fallback_form';
    const newKey = 'updated_key';
    const newValues = [{ id: 3}];

    const updatedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (key === oldKey) {
            acc[newKey] = newValues;
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});


    if (search === "|") {
        res.json(data.replace(/(examples:.*?)\|/g, '$1'));
    } else {
        res.json(data.replaceAll(search, replace));
    }
});

export default router;

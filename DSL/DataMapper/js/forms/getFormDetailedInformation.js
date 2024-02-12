import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { name, slots, responses } = req.body;
    const responseText = "utter_" + name;
    let result = responses.find(fd => fd.name === responseText);
    result = result ? result.response[0].text : "";

    let ignoredIntents = [];
    const slotInfo = [];

    if(slots.ignored_intents) {
        ignoredIntents = slots.ignored_intents;
    }

    if (slots.required_slots){
        for (const name of slots.required_slots) {
            const slotQuestion = responses.find(response => {
                return response.name === 'utter_ask_' + name
            });
            if (slotQuestion) {
                const newObj = {
                    slot_name: name,
                    question: slotQuestion.response[0].text
                };
                slotInfo.push(newObj);
            }
        }
    }
    const formDetails = {
        formResponse: result,
        requiredSlots: slotInfo,
        ignoredIntents: ignoredIntents
    };

    res.json(formDetails);
});

export default router;

# components/custom_components.py

from typing import List, Text, Any, Dict
from rasa.engine.graph import GraphComponent, ExecutionContext
from rasa.engine.storage.resource import Resource
from rasa.engine.storage.storage import ModelStorage
from rasa.shared.nlu.training_data.message import Message
from rasa.shared.nlu.constants import ENTITIES
from rasa.shared.nlu.training_data.training_data import TrainingData
from rasa.engine.recipes.default_recipe import DefaultV1Recipe
import re
from config.asukohad import asukohad

@DefaultV1Recipe.register(DefaultV1Recipe.ComponentType.MESSAGE_TOKENIZER, is_trainable=False)
class NormalizeCityNames(GraphComponent):
    def __init__(self, config: Dict[Text, Any]) -> None:
        self.suffixes = ["as", "s", "l", "a"]
        self.city_names = asukohad

    def process(self, messages: List[Message]) -> List[Message]:
        for message in messages:
            entities = message.get(ENTITIES, [])
            valid_entities = []
            for entity in entities:
                if entity.get("entity") == "asukoht":
                    original_value = entity["value"].lower()
                    # print(original_value + " original value")
                    base_name = self._remove_suffix(original_value)
                    # print(base_name + " basename")
                    standardized_name = self._standardize_name(base_name)
                    # print(standardized_name + " standardizedname")
                    # Check if the standardized name or its variations are in the list of locations
                    if standardized_name in self.city_names:
                        entity["value"] = self.city_names[standardized_name]
                        valid_entities.append(entity)
                    else:
                        # Check variations for the standardized name
                        variations = [name for name in self.city_names.keys() if standardized_name in name]
                        if variations:
                            entity["value"] = self.city_names[variations[0]]
                            valid_entities.append(entity)
                        #     print(f"Using variation: {variations[0]}")
                        # else:
                        #     print(f"Invalid city name: {standardized_name}")
                else:
                    # Keep other entities as is
                    valid_entities.append(entity)
            message.set(ENTITIES, valid_entities, add_to_output=True)
        return messages

    def process_training_data(self, training_data: TrainingData) -> TrainingData:
        # Add any necessary processing of training data here
        return training_data

    def _remove_suffix(self, name: Text) -> Text:
        for suffix in self.suffixes:
            if name.endswith(suffix):
                base_name = name[:-len(suffix)]
                if base_name in self.city_names:
                    return base_name
        return name

    def _standardize_name(self, name: Text) -> Text:
        standardized_name = re.sub(r"[-\s]", "-", name)
        return standardized_name

    def train(self, training_data: Any) -> Resource:
        return Resource("")

    @classmethod
    def create(
        cls, config: Dict[Text, Any], model_storage: ModelStorage, resource: Resource, execution_context: ExecutionContext
    ) -> "NormalizeCityNames":
        return cls(config)

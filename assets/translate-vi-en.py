from transformers import MarianMTModel, MarianTokenizer
import sys

# Load the model and tokenizer for English to Vietnamese
# model_name = "Helsinki-NLP/opus-mt-en-vi"
# tokenizer = MarianTokenizer.from_pretrained(model_name)
# model = MarianMTModel.from_pretrained(model_name)

# Load the model and tokenizer for Vietnamese to English
model_name = "Helsinki-NLP/opus-mt-vi-en"
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

# Input text to translate
text_to_translate = sys.argv[1]

# Tokenize the input text
inputs = tokenizer(text_to_translate, return_tensors="pt", padding=True, truncation=True)

# Generate translation
translated = model.generate(**inputs)

# Decode the translated text
translated_text = tokenizer.decode(translated[0], skip_special_tokens=True)

# Print the results
print(translated_text)

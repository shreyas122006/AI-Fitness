from langchain_core.prompts import PromptTemplate

FITNESS_SUMMARY_PROMPT_TEMPLATE = """You are a certified professional fitness trainer.

Analyze the following exercise and provide a concise, structured fitness summary.

Exercise Details:
- Exercise Name: {name}
- Target Muscle: {target}
- Body Part: {bodyPart}
- Equipment Required: {equipment}
- Secondary Muscles: {secondaryMuscles}
- Instructions: {instructions}

Instructions:
- Tone: Professional, encouraging fitness trainer.
- Length: Concise, maximum 200 words total.
- Accuracy: Do NOT invent impossible medical claims. Keep advice grounded and safe.

Return a strictly formatted JSON object with EXACTLY the following structure (no outer markdown code fences if possible, just raw valid JSON):

{{
  "exercise": "{name}",
  "frequency": "e.g., 2-3 times per week, 3-4 sets of 8-12 reps",
  "pros": [
    "Benefit 1",
    "Benefit 2"
  ],
  "cons": [
    "Limitation or risk 1",
    "Limitation or risk 2"
  ],
  "technique": [
    "Key form tip 1",
    "Key form tip 2",
    "Key form tip 3",
    "Key form tip 4"
  ],
  "mistakes": [
    "Common error 1",
    "Common error 2",
    "Common error 3"
  ],
  "medical": [
    "Precaution 1 e.g., avoid if shoulder impingement",
    "Precaution 2"
  ],
  "difficulty": "Beginner | Intermediate | Advanced",
  "calories": "Approx. 50-80 kcal per 15 min",
  "suitable": "e.g., Hypertrophy, beginners, home workouts"
}}

Respond ONLY with valid JSON.
"""

fitness_prompt = PromptTemplate(
    template=FITNESS_SUMMARY_PROMPT_TEMPLATE,
    input_variables=["name", "target", "bodyPart", "equipment", "secondaryMuscles", "instructions"]
)

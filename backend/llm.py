import os
import json
import re
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

# Attempt importing LangChain components
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.output_parsers import JsonOutputParser
    from prompts import fitness_prompt
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False


def generate_fallback_summary(exercise_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generates a high-quality rule-based structured summary if LLM key is absent or API fails."""
    name = exercise_data.get("name", "Exercise").title()
    target = exercise_data.get("target", "Target Muscles").title()
    body_part = exercise_data.get("bodyPart", "Full Body").title()
    equipment = exercise_data.get("equipment", "Bodyweight").title()
    secondary = exercise_data.get("secondaryMuscles", [])
    secondary_str = ", ".join([s.title() for s in secondary]) if secondary else "Core stabilizers"

    return {
        "exercise": name,
        "frequency": "2–3 times per week (3–4 sets of 8–12 reps)",
        "pros": [
            f"Directly targets and builds strength in the {target}.",
            f"Versatile movement utilizing {equipment} for progressive overload.",
            f"Engages secondary muscles including {secondary_str}."
        ],
        "cons": [
            "Requires strict form to avoid joint strain.",
            "Can cause fatigue if performed with ego lifting or poor warm-up."
        ],
        "technique": [
            f"Maintain neutral spine and engage core before initiating movement.",
            f"Control the eccentric (lowering) phase for 2-3 seconds.",
            f"Focus tension on the {target} throughout full range of motion.",
            "Exhale on exertion, inhale during recovery phase."
        ],
        "mistakes": [
            "Using momentum instead of controlled muscle contraction.",
            "Arching back or straining neck during heavy repetitions.",
            "Incomplete range of motion at top or bottom position."
        ],
        "medical": [
            f"Consult a specialist if experiencing acute joint pain in {body_part} area.",
            "Warm up thoroughly prior to heavy resistance sets."
        ],
        "difficulty": "Intermediate",
        "calories": "Approx. 40–70 kcal per 15-minute set",
        "suitable": f"Fitness enthusiasts aiming for strength and hypertrophy in {target}."
    }


def get_ai_summary(exercise_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generates AI summary using LangChain + Gemini 1.5 Flash, with clean fallback logic."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    if not api_key or api_key == "your_gemini_api_key_here" or not LANGCHAIN_AVAILABLE:
        return generate_fallback_summary(exercise_data)

    try:
        # Initialize Gemini LLM via LangChain
        llm = ChatGoogleGenerativeAI(
            model="gemini-3.5-flash",
            google_api_key=api_key,
            temperature=0.4,
            max_output_tokens=1500,
            request_timeout=12,
        )

        formatted_prompt = fitness_prompt.format(
            name=exercise_data.get("name", ""),
            target=exercise_data.get("target", ""),
            bodyPart=exercise_data.get("bodyPart", ""),
            equipment=exercise_data.get("equipment", ""),
            secondaryMuscles=", ".join(exercise_data.get("secondaryMuscles", [])),
            instructions=" ".join(exercise_data.get("instructions", []))
        )

        response = llm.invoke(formatted_prompt)
        content = response.content if hasattr(response, "content") else str(response)

        if isinstance(content, list):
            # Extract text from list of content blocks
            texts = [item["text"] for item in content if isinstance(item, dict) and "text" in item]
            content = " ".join(texts)

        # Parse JSON output from content
        cleaned_content = str(content).strip()
        # Remove markdown code fences if present e.g. ```json ... ```
        if "```" in cleaned_content:
            match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned_content)
            if match:
                cleaned_content = match.group(1)

        summary_json = json.loads(cleaned_content)
        
        # Verify required keys
        required_keys = ["exercise", "frequency", "pros", "cons", "technique", "mistakes", "medical", "difficulty", "calories", "suitable"]
        for key in required_keys:
            if key not in summary_json:
                summary_json[key] = [] if key in ["pros", "cons", "technique", "mistakes", "medical"] else ""

        return summary_json

    except Exception as e:
        print(f"[Gemini LangChain Warning] Falling back due to error: {e}")
        return generate_fallback_summary(exercise_data)

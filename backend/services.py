import os
import requests
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Any
from dotenv import load_dotenv
from llm import get_ai_summary

load_dotenv()

EXERCISE_API_BASE = os.getenv("EXERCISE_API_BASE", "https://exercisedb-api.vercel.app/api/v1").rstrip("/")

# Comprehensive fallback mock data for seamless demo/testing experience
MOCK_EXERCISES_DATABASE = {
    "dumbbell": [
        {
            "id": "db-01",
            "name": "Dumbbell Bicep Curl",
            "bodyPart": "upper arms",
            "target": "biceps",
            "equipment": "dumbbell",
            "secondaryMuscles": ["forearms", "brachialis"],
            "instructions": [
                "Stand upright holding a dumbbell in each hand with arms extended.",
                "Keep elbows close to your torso and rotate palms facing forward.",
                "Curl weights upward while contracting biceps until fully shortened.",
                "Slowly lower dumbbells back to starting position."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/p0c-WpMsYvjPZ3"
        },
        {
            "id": "db-02",
            "name": "Dumbbell Shoulder Press",
            "bodyPart": "shoulders",
            "target": "delts",
            "equipment": "dumbbell",
            "secondaryMuscles": ["triceps", "upper chest"],
            "instructions": [
                "Sit on a bench with back support holding dumbbells at shoulder level.",
                "Press dumbbells upward until arms are fully extended overhead.",
                "Pause briefly at peak contraction without locking elbows.",
                "Lower weights with control back to ear level."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/kF4gXQ6tH5aD9x"
        },
        {
            "id": "db-03",
            "name": "Dumbbell Goblet Squat",
            "bodyPart": "legs",
            "target": "quadriceps",
            "equipment": "dumbbell",
            "secondaryMuscles": ["glutes", "hamstrings", "core"],
            "instructions": [
                "Hold a single dumbbell vertically against chest with both palms.",
                "Stand with feet shoulder-width apart and toes slightly pointed outward.",
                "Hinge hips and bend knees to lower into a deep squat position.",
                "Push through full foot to return upright."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/z82mDq9K1xL3"
        },
        {
            "id": "db-04",
            "name": "Dumbbell Incline Bench Press",
            "bodyPart": "chest",
            "target": "upper chest",
            "equipment": "dumbbell",
            "secondaryMuscles": ["anterior deltoid", "triceps"],
            "instructions": [
                "Lie back on an incline bench set to 30-45 degrees with dumbbells above chest.",
                "Lower dumbbells smoothly toward upper chest keeping elbows at 45-degree angle.",
                "Press dumbbells back up until arms are fully extended."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/m31XqK90aPz7"
        },
        {
            "id": "db-05",
            "name": "Dumbbell Bent-Over Row",
            "bodyPart": "back",
            "target": "latissimus dorsi",
            "equipment": "dumbbell",
            "secondaryMuscles": ["rhomboids", "biceps", "rear deltoids"],
            "instructions": [
                "Hinge forward at waist with flat back holding dumbbells with neutral grip.",
                "Pull dumbbells upward toward ribs while squeezing shoulder blades together.",
                "Lower dumbbells under control to complete rep."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/y47VbL28xQ0"
        }
    ],
    "biceps": [
        {
            "id": "bic-01",
            "name": "Barbell Preacher Curl",
            "bodyPart": "upper arms",
            "target": "biceps",
            "equipment": "barbell",
            "secondaryMuscles": ["brachialis", "forearms"],
            "instructions": [
                "Rest upper arms on preacher bench pad holding EZ bar with underhand grip.",
                "Lower bar until arms are fully extended.",
                "Curl weight upward focusing on biceps contraction."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/p0c-WpMsYvjPZ3"
        },
        {
            "id": "bic-02",
            "name": "Hammer Dumbbell Curl",
            "bodyPart": "upper arms",
            "target": "biceps",
            "equipment": "dumbbell",
            "secondaryMuscles": ["brachioradialis", "forearms"],
            "instructions": [
                "Hold dumbbells at sides with neutral grip (palms facing each other).",
                "Curl dumbbells upward keeping palms facing each other throughout movement.",
                "Squeeze at top and slowly lower."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/p0c-WpMsYvjPZ3"
        },
        {
            "id": "bic-03",
            "name": "Cable High Pulley Bicep Curl",
            "bodyPart": "upper arms",
            "target": "biceps",
            "equipment": "cable",
            "secondaryMuscles": ["forearms"],
            "instructions": [
                "Stand between dual cable stacks holding D-handles at shoulder level.",
                "Curl handles inward toward ears while keeping upper arms parallel to floor.",
                "Return slowly under cable tension."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/p0c-WpMsYvjPZ3"
        },
        {
            "id": "bic-04",
            "name": "Concentration Curl",
            "bodyPart": "upper arms",
            "target": "biceps",
            "equipment": "dumbbell",
            "secondaryMuscles": ["brachialis"],
            "instructions": [
                "Sit on bench, brace triceps against inner thigh.",
                "Curl dumbbell toward chest keeping arm stationary.",
                "Lower with complete control."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/p0c-WpMsYvjPZ3"
        },
        {
            "id": "bic-05",
            "name": "Incline Dumbbell Bicep Curl",
            "bodyPart": "upper arms",
            "target": "biceps",
            "equipment": "dumbbell",
            "secondaryMuscles": ["forearms"],
            "instructions": [
                "Lie back on 45-degree incline bench with arms hanging downward.",
                "Curl weights upward without swinging shoulders.",
                "Lower to full stretch at bottom."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/p0c-WpMsYvjPZ3"
        }
    ]
}


def map_endpoint(search_type: str, keyword: str) -> str:
    """Maps search type to proper ExerciseDB API endpoint."""
    search_type_clean = search_type.lower().strip()
    keyword_clean = keyword.lower().strip()

    if search_type_clean in ["equipment", "equipments"]:
        return f"{EXERCISE_API_BASE}/equipments/{keyword_clean}/exercises"
    elif search_type_clean in ["muscle", "muscles"]:
        return f"{EXERCISE_API_BASE}/muscles/{keyword_clean}/exercises"
    elif search_type_clean in ["bodypart", "bodyparts", "body_part", "body part"]:
        return f"{EXERCISE_API_BASE}/bodyparts/{keyword_clean}/exercises"
    else:
        # Default fallback to muscle search
        return f"{EXERCISE_API_BASE}/muscles/{keyword_clean}/exercises"


def fetch_exercises_from_api(search_type: str, keyword: str) -> List[Dict[str, Any]]:
    """Calls ExerciseDB API and returns up to 10 exercises, with robust mock fallback."""
    url = map_endpoint(search_type, keyword)
    print(f"[ExerciseDB API] Requesting: {url}")

    try:
        response = requests.get(url, timeout=3.0)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                return data[:10]
            elif isinstance(data, dict) and "data" in data and isinstance(data["data"], list):
                return data["data"][:10]
    except Exception as err:
        print(f"[ExerciseDB API Warning] Error or timeout accessing {url}: {err}")

    # Fallback lookup in pre-configured database or generic generator
    kw = keyword.lower().strip()
    if "bicep" in kw or "arm" in kw:
        return MOCK_EXERCISES_DATABASE["biceps"]
    elif "dumbbell" in kw or "barbell" in kw or "cable" in kw:
        return MOCK_EXERCISES_DATABASE["dumbbell"]
    
    # Generic fallback dynamic mock items matching keyword
    generic_list = []
    for idx, ex_name in enumerate([f"{keyword.title()} Press", f"{keyword.title()} Extension", f"{keyword.title()} Pull", f"{keyword.title()} Squat", f"{keyword.title()} Lift"]):
        generic_list.append({
            "id": f"gen-{idx+1}",
            "name": ex_name,
            "bodyPart": search_type if search_type in ["bodyPart", "bodyparts"] else "full body",
            "target": keyword,
            "equipment": keyword if search_type == "equipment" else "dumbbell",
            "secondaryMuscles": ["core", "stabilizers"],
            "instructions": [
                f"Position body correctly for {ex_name}.",
                "Perform controlled movement maintaining proper posture.",
                "Return to initial stance and repeat for target repetitions."
            ],
            "gifUrl": "https://v2.exercisedb.io/image/p0c-WpMsYvjPZ3"
        })
    return generic_list


def process_exercises_with_ai(exercises: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Takes top 5 exercises, generates AI summary for each using ThreadPoolExecutor, and returns enriched list."""
    selected_5 = exercises[:5]

    # Execute AI summary generation concurrently for fast response times
    with ThreadPoolExecutor(max_workers=5) as executor:
        summaries = list(executor.map(get_ai_summary, selected_5))

    enriched_results = []
    for ex, summary in zip(selected_5, summaries):
        ex_copy = dict(ex)
        ex_copy["summary"] = summary
        enriched_results.append(ex_copy)

    return enriched_results

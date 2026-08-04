from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from models import SearchRequest
from services import fetch_exercises_from_api, process_exercises_with_ai

router = APIRouter()


@router.get("/")
def root_status():
    """Health check route."""
    return {"message": "API Running"}


@router.post("/search", response_model=List[Dict[str, Any]])
def search_exercises(payload: SearchRequest):
    """
    Search exercises by equipment, muscle, or bodyPart,
    fetches top 10 from ExerciseDB, picks top 5, and enriches with Gemini AI summary.
    """
    if not payload.keyword or not payload.keyword.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Keyword parameter cannot be empty."
        )

    search_type = payload.search_type.strip()
    keyword = payload.keyword.strip()

    try:
        # Step 1-3: Call ExerciseDB API / Fetch top exercises
        raw_exercises = fetch_exercises_from_api(search_type, keyword)
        if not raw_exercises:
            raise HTTPException(
                status_code=status.HTTP_444_RESPONSE_HEADER_TOO_BIG if hasattr(status, "HTTP_444") else 404,
                detail=f"No exercises found for {search_type} '{keyword}'."
            )

        # Step 4-6: Take first 5 exercises and generate AI summaries
        final_exercises = process_exercises_with_ai(raw_exercises)
        return final_exercises

    except HTTPException:
        raise
    except Exception as e:
        print(f"[Search Route Error] {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while processing exercise recommendations: {str(e)}"
        )

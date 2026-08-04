from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    search_type: str = Field(..., description="Type of search: 'equipment', 'muscle', or 'bodyPart'")
    keyword: str = Field(..., description="Keyword to search for e.g. dumbbell, biceps, upper arms")


class AISummary(BaseModel):
    exercise: str = Field("", description="Exercise Name")
    frequency: str = Field("", description="Recommended Frequency")
    pros: List[str] = Field(default_factory=list, description="Pros list")
    cons: List[str] = Field(default_factory=list, description="Cons list")
    technique: List[str] = Field(default_factory=list, description="Form & Technique steps")
    mistakes: List[str] = Field(default_factory=list, description="Common Mistakes")
    medical: List[str] = Field(default_factory=list, description="Medical Precautions")
    difficulty: str = Field("", description="Difficulty Level")
    calories: str = Field("", description="Approximate Calories Burned")
    suitable: str = Field("", description="Suitable For demographic/goals")


class ExerciseResponse(BaseModel):
    id: Optional[str] = None
    name: str
    bodyPart: str
    target: str
    equipment: str
    secondaryMuscles: List[str] = Field(default_factory=list)
    instructions: List[str] = Field(default_factory=list)
    gifUrl: str = ""
    summary: Dict[str, Any] = Field(default_factory=dict)


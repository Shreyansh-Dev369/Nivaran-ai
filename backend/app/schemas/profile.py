from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class ProfileResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    phone: Optional[str] = None
    investor_tier: str = "Tier 1 Verified (Demo)"
    pan_masked: str = "ABCDE****F"
    bio: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    bio: Optional[str] = Field(None, max_length=500)

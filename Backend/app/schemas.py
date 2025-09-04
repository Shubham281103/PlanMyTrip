from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional

# Itinerary Schemas
class ItineraryBase(BaseModel):
    destination: str
    start_date: date
    end_date: date
    # Trip Preferences
    trip_theme: Optional[List[str]] = []
    budget: Optional[str] = None
    pace: Optional[str] = None
    travel_mode: Optional[str] = None
    group_type: Optional[str] = None

class ItineraryCreate(ItineraryBase):
    pass

class Itinerary(ItineraryBase):
    id: int
    owner_id: int
    content: Optional[str] = None
    pdf_path: Optional[str] = None

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    mobile_number: str | None = None
    address: str | None = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    itineraries: List[Itinerary] = []

    class Config:
        from_attributes = True


# Token Schemas for Authentication
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
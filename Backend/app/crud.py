from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import HTTPException
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        mobile_number=user.mobile_number,
        address=user.address,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_itineraries_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Itinerary).filter(models.Itinerary.owner_id == user_id).offset(skip).limit(limit).all()

def create_user_itinerary(db: Session, itinerary: schemas.ItineraryCreate, user_id: int, pdf_path: str = None, content: str = None):
    db_itinerary = models.Itinerary(
        **itinerary.dict(), 
        owner_id=user_id, 
        pdf_path=pdf_path,
        content=content
    )
    db.add(db_itinerary)
    db.commit()
    db.refresh(db_itinerary)
    return db_itinerary 
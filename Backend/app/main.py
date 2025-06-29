from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import os
from fastapi import APIRouter
from typing import Any
from pydantic import BaseModel
from passlib.context import CryptContext

from . import crud, models, schemas
from .database import engine, get_db
from .deps import create_access_token, get_current_user
from .crud import pwd_context
from .agent import agent_instance
from .pdf_generator import pdf_generator_instance, PDF_STORAGE_PATH
from fastapi.responses import FileResponse


app = FastAPI(title="Trip Planner API")


origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.get("/profile", response_model=schemas.User)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.post("/change-password")
def change_password(
    req: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not pwd_context.verify(req.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400, detail="Current password is incorrect")
    hashed_new = pwd_context.hash(req.new_password)
    current_user.hashed_password = hashed_new
    db.add(current_user)
    db.commit()
    return {"msg": "Password updated successfully"}


app.include_router(router)


@app.post("/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)


@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me/", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.post("/itineraries/", response_model=schemas.Itinerary)
def create_itinerary(
    itinerary: schemas.ItineraryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    content = agent_instance.generate_itinerary(
        place=itinerary.destination,
        start_date=itinerary.start_date,
        end_date=itinerary.end_date
    )

    pdf_filename = pdf_generator_instance.generate(
        content=content,
        user_id=current_user.id,
        destination=itinerary.destination
    )

    return crud.create_user_itinerary(
        db=db,
        itinerary=itinerary,
        user_id=current_user.id,
        pdf_path=pdf_filename,
        content=content
    )


@app.get("/itineraries/", response_model=list[schemas.Itinerary])
def read_itineraries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    itineraries = crud.get_itineraries_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit)
    return itineraries


@app.get("/itineraries/{itinerary_id}/download")
def download_itinerary_pdf(
    itinerary_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    itinerary = db.query(models.Itinerary).filter(
        models.Itinerary.id == itinerary_id).first()

    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    if itinerary.owner_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this itinerary")

    pdf_path = f"{PDF_STORAGE_PATH}/{itinerary.pdf_path}"

    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF file not found")

    return FileResponse(pdf_path, media_type='application/pdf', filename=itinerary.pdf_path)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Trip Planner API"}

from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)

    itineraries = relationship("Itinerary", back_populates="owner")


class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, index=True, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    content = Column(Text, nullable=True)
    pdf_path = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    trip_theme = Column(ARRAY(String), nullable=True, default=[])
    budget = Column(String, nullable=True)
    pace = Column(String, nullable=True)
    travel_mode = Column(String, nullable=True)
    group_type = Column(String, nullable=True)

    owner = relationship("User", back_populates="itineraries")
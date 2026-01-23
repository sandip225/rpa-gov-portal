from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, Token
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user
from app.config import get_settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
settings = get_settings()

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Validate required fields
    if not user_data.email or not user_data.email.strip():
        raise HTTPException(status_code=400, detail="Email is required")
    if not user_data.mobile or not user_data.mobile.strip():
        raise HTTPException(status_code=400, detail="Mobile number is required")
    if not user_data.password or not user_data.password.strip():
        raise HTTPException(status_code=400, detail="Password is required")
    if not user_data.full_name or not user_data.full_name.strip():
        raise HTTPException(status_code=400, detail="Full name is required")
    
    # Validate email format
    if '@' not in user_data.email:
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Validate mobile number (should be 10 digits)
    if not user_data.mobile.isdigit() or len(user_data.mobile) != 10:
        raise HTTPException(status_code=400, detail="Mobile number must be 10 digits")
    
    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if mobile exists
    if db.query(User).filter(User.mobile == user_data.mobile).first():
        raise HTTPException(status_code=400, detail="Mobile number already registered")
    
    # Create user
    user = User(
        email=user_data.email.strip(),
        mobile=user_data.mobile.strip(),
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name.strip(),
        city=user_data.city if user_data.city else None
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

from fastapi import APIRouter, Depends, HTTPException, status, Request
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
async def register(request: Request, db: Session = Depends(get_db)):
    try:
        # Handle both JSON and form data
        content_type = request.headers.get("content-type", "")
        
        if "application/json" in content_type:
            data = await request.json()
        else:
            form_data = await request.form()
            data = dict(form_data)
        
        # Extract and validate fields
        email = data.get("email", "").strip()
        mobile = data.get("mobile", "").strip()
        password = data.get("password", "").strip()
        full_name = data.get("full_name") or data.get("fullName", "").strip()
        city = data.get("city", "")
        
        # Validate required fields
        if not email:
            raise HTTPException(status_code=400, detail="Email is required")
        if not mobile:
            raise HTTPException(status_code=400, detail="Mobile number is required")
        if not password:
            raise HTTPException(status_code=400, detail="Password is required")
        if not full_name:
            raise HTTPException(status_code=400, detail="Full name is required")
        
        # Validate email format
        if '@' not in email:
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        # Validate mobile number (should be 10 digits)
        if not mobile.isdigit() or len(mobile) != 10:
            raise HTTPException(status_code=400, detail="Mobile number must be 10 digits")
        
        # Check if email exists
        if db.query(User).filter(User.email == email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if mobile exists
        if db.query(User).filter(User.mobile == mobile).first():
            raise HTTPException(status_code=400, detail="Mobile number already registered")
        
        # Create user
        user = User(
            email=email,
            mobile=mobile,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            city=city if city else None
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
async def login(request: Request, db: Session = Depends(get_db)):
    try:
        # Handle both JSON and form data
        content_type = request.headers.get("content-type", "")
        
        if "application/json" in content_type:
            data = await request.json()
            email = data.get("email") or data.get("username")
            password = data.get("password")
        else:
            form_data = await request.form()
            email = form_data.get("username") or form_data.get("email")
            password = form_data.get("password")
        
        if not email or not password:
            raise HTTPException(status_code=422, detail="Email and password required")
        
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.hashed_password):
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
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
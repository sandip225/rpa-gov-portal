#!/usr/bin/env python3
"""
Create a test user for the Unified Services Portal
This script connects directly to the database and creates a test user
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.database import SessionLocal, engine, Base
from app.models import User
from app.auth import get_password_hash

def create_test_user():
    """Create a test user in the database"""
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == "test@example.com").first()
        if existing_user:
            print("✅ Test user already exists!")
            print(f"Email: {existing_user.email}")
            print(f"Mobile: {existing_user.mobile}")
            return
        
        # Create new test user
        test_user = User(
            email="test@example.com",
            mobile="9999999999",
            hashed_password=get_password_hash("Test@123"),
            full_name="Test User",
            city="Ahmedabad"
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print("✅ Test user created successfully!")
        print("\nLogin credentials:")
        print("==================")
        print("Email: test@example.com")
        print("Password: Test@123")
        print("Mobile: 9999999999")
        print("==================")
        
    except Exception as e:
        print(f"❌ Error creating test user: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating test user for Unified Services Portal...")
    print()
    create_test_user()

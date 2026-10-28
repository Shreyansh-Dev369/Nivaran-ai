import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import jwt
from backend.app.core.config import settings

# Salt delimiter for stored hash: "pbkdf2_sha256${rounds}${salt}${hash}"
PBKDF2_ROUNDS = 100_000


def get_password_hash(password: str) -> str:
    """Generate a salted PBKDF2-HMAC-SHA256 password hash."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ROUNDS
    )
    return f"pbkdf2_sha256${PBKDF2_ROUNDS}${salt}${key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password hash with constant-time equality check."""
    if not hashed_password:
        return False
    try:
        parts = hashed_password.split("$")
        if len(parts) == 4 and parts[0] == "pbkdf2_sha256":
            rounds = int(parts[1])
            salt = parts[2]
            expected_key = parts[3]
            key = hashlib.pbkdf2_hmac(
                "sha256",
                plain_password.encode("utf-8"),
                salt.encode("utf-8"),
                rounds
            )
            return hmac.compare_digest(key.hex(), expected_key)
        # Fallback for plain demo passwords if matched
        return hmac.compare_digest(plain_password, hashed_password)
    except Exception:
        return False


def create_access_token(subject: str, extra_data: Optional[Dict[str, Any]] = None, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode: Dict[str, Any] = {
        "sub": str(subject),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    if extra_data:
        to_encode.update(extra_data)

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except (jwt.PyJWTError, Exception):
        return None

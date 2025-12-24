from fastapi import FastAPI, HTTPException, Query, Request, Depends, Header, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Set
from datetime import datetime
import os
import uuid
import httpx
import secrets
import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(title="CNESS Circles API")

# Security
security = HTTPBasic()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.cness_circles

# Collections
circles_collection = db.circles
circle_members_collection = db.circle_members
circle_posts_collection = db.circle_posts
circle_resources_collection = db.circle_resources
circle_comments_collection = db.circle_comments
circle_comment_likes_collection = db.circle_comment_likes
circle_post_likes_collection = db.circle_post_likes
circle_chatrooms_collection = db.circle_chatrooms
circle_chat_messages_collection = db.circle_chat_messages
notifications_collection = db.notifications
admin_settings_collection = db.admin_settings
admin_sessions_collection = db.admin_sessions

# External API base URL
EXTERNAL_API_BASE = os.environ.get("EXTERNAL_API_BASE", "https://uatapi.cness.io")

# ============== WEBSOCKET CONNECTION MANAGER ==============

class ConnectionManager:
    """Manages WebSocket connections for real-time chat"""
    
    def __init__(self):
        # Map chatroom_id -> set of (user_id, websocket) tuples
        self.active_connections: Dict[str, Set[tuple]] = {}
        # Map websocket -> (chatroom_id, user_id)
        self.connection_info: Dict[WebSocket, tuple] = {}
    
    async def connect(self, websocket: WebSocket, chatroom_id: str, user_id: str):
        await websocket.accept()
        if chatroom_id not in self.active_connections:
            self.active_connections[chatroom_id] = set()
        self.active_connections[chatroom_id].add((user_id, websocket))
        self.connection_info[websocket] = (chatroom_id, user_id)
        
        # Notify others that user joined
        await self.broadcast_system_message(
            chatroom_id, 
            f"User {user_id[:8]} joined the chat", 
            exclude_websocket=websocket
        )
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.connection_info:
            chatroom_id, user_id = self.connection_info[websocket]
            if chatroom_id in self.active_connections:
                self.active_connections[chatroom_id].discard((user_id, websocket))
                if not self.active_connections[chatroom_id]:
                    del self.active_connections[chatroom_id]
            del self.connection_info[websocket]
            return chatroom_id, user_id
        return None, None
    
    async def broadcast_message(self, chatroom_id: str, message: dict):
        """Broadcast message to all connections in a chatroom"""
        if chatroom_id in self.active_connections:
            disconnected = []
            for user_id, websocket in self.active_connections[chatroom_id]:
                try:
                    await websocket.send_json(message)
                except Exception:
                    disconnected.append((user_id, websocket))
            
            # Clean up disconnected websockets
            for conn in disconnected:
                self.active_connections[chatroom_id].discard(conn)
    
    async def broadcast_system_message(self, chatroom_id: str, message: str, exclude_websocket: WebSocket = None):
        """Broadcast system message to chatroom"""
        system_msg = {
            "type": "system",
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }
        if chatroom_id in self.active_connections:
            for user_id, websocket in self.active_connections[chatroom_id]:
                if websocket != exclude_websocket:
                    try:
                        await websocket.send_json(system_msg)
                    except Exception:
                        pass
    
    def get_online_users(self, chatroom_id: str) -> List[str]:
        """Get list of online user IDs in a chatroom"""
        if chatroom_id in self.active_connections:
            return list(set(user_id for user_id, _ in self.active_connections[chatroom_id]))
        return []

# Global connection manager instance
chat_manager = ConnectionManager()

# Admin credentials
ADMIN_CREDENTIALS = {
    "superadmin@cness.co": "Sadmin108@"
}

# Default role permissions
DEFAULT_ROLE_PERMISSIONS = {
    "Aspiring": {
        "can_post_local": True,
        "can_post_national": False,
        "can_post_global": False,
        "can_upload_resources_local": True,
        "can_upload_resources_national": False,
        "can_upload_resources_global": False,
        "can_create_circle_profession": False,
        "can_create_circle_interest": False,
        "can_create_circle_living": True,
        "can_create_circle_news": True,
        "can_create_chatroom": True,
        "can_chat": True,
        "description": "Can post in Local circles, create Living/News circles, and chat"
    },
    "Inspired": {
        "can_post_local": True,
        "can_post_national": True,
        "can_post_global": False,
        "can_upload_resources_local": True,
        "can_upload_resources_national": True,
        "can_upload_resources_global": False,
        "can_create_circle_profession": True,
        "can_create_circle_interest": True,
        "can_create_circle_living": True,
        "can_create_circle_news": True,
        "can_create_chatroom": True,
        "can_chat": True,
        "description": "Can post in Local and National circles, create all circle types"
    },
    "Leader": {
        "can_post_local": True,
        "can_post_national": True,
        "can_post_global": True,
        "can_upload_resources_local": True,
        "can_upload_resources_national": True,
        "can_upload_resources_global": True,
        "can_create_circle_profession": True,
        "can_create_circle_interest": True,
        "can_create_circle_living": True,
        "can_create_circle_news": True,
        "can_create_chatroom": True,
        "can_chat": True,
        "description": "Can post and upload resources in all circles, create all types"
    },
    "Guest": {
        "can_post_local": False,
        "can_post_national": False,
        "can_post_global": False,
        "can_upload_resources_local": False,
        "can_upload_resources_national": False,
        "can_upload_resources_global": False,
        "can_create_circle_profession": False,
        "can_create_circle_interest": False,
        "can_create_circle_living": False,
        "can_create_circle_news": False,
        "can_create_chatroom": False,
        "can_chat": False,
        "description": "Can only view circles and join"
    }
}

# ============== LOCATION DATA ==============

COUNTRIES_DATA = {
    "India": {
        "code": "IN",
        "provinces": [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
            "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
            "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
            "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
            "Delhi", "Chandigarh", "Puducherry"
        ]
    },
    "Canada": {
        "code": "CA",
        "provinces": [
            "Alberta", "British Columbia", "Manitoba", "New Brunswick",
            "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
            "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"
        ]
    },
    "USA": {
        "code": "US",
        "provinces": [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
            "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
            "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
            "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
            "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
            "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
            "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
            "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
            "Washington", "West Virginia", "Wisconsin", "Wyoming"
        ]
    },
    "United Kingdom": {
        "code": "UK",
        "provinces": [
            "England", "Scotland", "Wales", "Northern Ireland",
            "London", "Birmingham", "Manchester", "Leeds", "Glasgow", "Liverpool"
        ]
    },
    "Australia": {
        "code": "AU",
        "provinces": [
            "New South Wales", "Victoria", "Queensland", "Western Australia",
            "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"
        ]
    }
}

DEFAULT_INTERESTS = [
    {"id": "mindfulness", "name": "Mindfulness & Meditation"},
    {"id": "sustainability", "name": "Sustainable Living"},
    {"id": "leadership", "name": "Conscious Leadership"},
    {"id": "creativity", "name": "Creative Arts"},
    {"id": "wellness", "name": "Health & Wellness"},
    {"id": "spirituality", "name": "Spirituality"},
    {"id": "entrepreneurship", "name": "Entrepreneurship"},
    {"id": "technology", "name": "Technology"},
    {"id": "education", "name": "Education"},
    {"id": "environment", "name": "Environment"},
    {"id": "community", "name": "Community Building"},
    {"id": "personal-growth", "name": "Personal Growth"}
]

# ============== MODELS ==============

class CircleCreate(BaseModel):
    name: str
    description: str
    intention: str
    scope: str
    category: str
    image_url: Optional[str] = None
    country: Optional[str] = None
    province: Optional[str] = None
    profession_id: Optional[str] = None
    interest_id: Optional[str] = None

class CircleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    intention: Optional[str] = None
    image_url: Optional[str] = None

class CirclePostCreate(BaseModel):
    content: str
    media_urls: Optional[List[str]] = []
    post_type: str = "regular"
    status: str = "published"  # draft, published, suspended

class PostStatusUpdate(BaseModel):
    status: str  # draft, published, suspended

class ResourceCreate(BaseModel):
    title: str
    description: Optional[str] = None
    resource_type: str  # document, video, link, image
    url: str
    file_size: Optional[int] = None

class BulkCircleCreate(BaseModel):
    country: str
    create_global: bool = True
    create_national: bool = True
    create_local: bool = True
    create_for_professions: bool = True
    create_for_interests: bool = True

class AdminLogin(BaseModel):
    username: str
    password: str

class RolePermissionUpdate(BaseModel):
    role: str
    can_post_local: bool
    can_post_national: bool
    can_post_global: bool
    can_upload_resources_local: bool
    can_upload_resources_national: bool
    can_upload_resources_global: bool
    can_create_circle_profession: Optional[bool] = None
    can_create_circle_interest: Optional[bool] = None
    can_create_circle_living: Optional[bool] = None
    can_create_circle_news: Optional[bool] = None
    can_create_chatroom: Optional[bool] = None
    can_chat: Optional[bool] = None

class CommentCreate(BaseModel):
    content: str
    parent_comment_id: Optional[str] = None  # For reply comments
    mentions: Optional[List[str]] = []  # User IDs mentioned with @

class CommentUpdate(BaseModel):
    content: str

class ChatRoomCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ChatMessageCreate(BaseModel):
    content: str
    mentions: Optional[List[str]] = []

# ============== HELPER FUNCTIONS ==============

def verify_admin(username: str, password: str) -> bool:
    """Verify admin credentials"""
    if username in ADMIN_CREDENTIALS:
        return ADMIN_CREDENTIALS[username] == password
    return False

async def get_user_level(user_id: str, auth_token: Optional[str] = None) -> dict:
    """Get user's certification level from external API"""
    try:
        headers = {}
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{EXTERNAL_API_BASE}/api/dashboard",
                headers=headers
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("success", {}).get("status"):
                    user_data = data.get("data", {}).get("data", {})
                    return {
                        "level": user_data.get("level", "Aspiring"),
                        "name": user_data.get("name", ""),
                        "badges": user_data.get("user_badges", [])
                    }
    except Exception as e:
        print(f"Error fetching user level: {e}")
    
    # Default to Aspiring if API fails
    return {"level": "Aspiring", "name": "", "badges": []}

async def get_role_permissions() -> dict:
    """Get role permissions from database or return defaults"""
    settings = await admin_settings_collection.find_one({"type": "role_permissions"})
    if settings:
        return settings.get("permissions", DEFAULT_ROLE_PERMISSIONS)
    return DEFAULT_ROLE_PERMISSIONS

async def check_posting_permission(user_id: str, circle_scope: str, auth_token: Optional[str] = None) -> dict:
    """Check if user can post in a circle based on their level and circle scope"""
    user_info = await get_user_level(user_id, auth_token)
    user_level = user_info.get("level", "Aspiring")
    
    permissions = await get_role_permissions()
    level_perms = permissions.get(user_level, permissions.get("Aspiring"))
    
    scope_mapping = {
        "local": "can_post_local",
        "national": "can_post_national",
        "global": "can_post_global"
    }
    
    perm_key = scope_mapping.get(circle_scope, "can_post_local")
    can_post = level_perms.get(perm_key, False)
    
    return {
        "can_post": can_post,
        "user_level": user_level,
        "circle_scope": circle_scope,
        "reason": f"{user_level} level {'can' if can_post else 'cannot'} post in {circle_scope} circles"
    }

async def check_resource_permission(user_id: str, circle_scope: str, auth_token: Optional[str] = None) -> dict:
    """Check if user can upload resources in a circle"""
    user_info = await get_user_level(user_id, auth_token)
    user_level = user_info.get("level", "Aspiring")
    
    permissions = await get_role_permissions()
    level_perms = permissions.get(user_level, permissions.get("Aspiring"))
    
    scope_mapping = {
        "local": "can_upload_resources_local",
        "national": "can_upload_resources_national",
        "global": "can_upload_resources_global"
    }
    
    perm_key = scope_mapping.get(circle_scope, "can_upload_resources_local")
    can_upload = level_perms.get(perm_key, False)
    
    return {
        "can_upload": can_upload,
        "user_level": user_level,
        "circle_scope": circle_scope
    }

async def check_circle_creation_permission(user_id: str, category: str, auth_token: Optional[str] = None) -> dict:
    """Check if user can create a circle of a specific category"""
    user_info = await get_user_level(user_id, auth_token)
    user_level = user_info.get("level", "Guest")
    
    permissions = await get_role_permissions()
    level_perms = permissions.get(user_level, permissions.get("Guest", {}))
    
    category_mapping = {
        "profession": "can_create_circle_profession",
        "interest": "can_create_circle_interest",
        "living": "can_create_circle_living",
        "news": "can_create_circle_news"
    }
    
    perm_key = category_mapping.get(category, "can_create_circle_profession")
    can_create = level_perms.get(perm_key, False)
    
    return {
        "can_create": can_create,
        "user_level": user_level,
        "category": category,
        "reason": f"{user_level} level {'can' if can_create else 'cannot'} create {category} circles"
    }

async def check_chat_permission(user_id: str, auth_token: Optional[str] = None) -> dict:
    """Check if user can chat/create chatrooms"""
    user_info = await get_user_level(user_id, auth_token)
    user_level = user_info.get("level", "Guest")
    
    permissions = await get_role_permissions()
    level_perms = permissions.get(user_level, permissions.get("Guest", {}))
    
    return {
        "can_chat": level_perms.get("can_chat", False),
        "can_create_chatroom": level_perms.get("can_create_chatroom", False),
        "user_level": user_level
    }

async def create_notification(user_id: str, notification_type: str, title: str, message: str, data: dict = None):
    """Create a notification for a user"""
    notification = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "type": notification_type,
        "title": title,
        "message": message,
        "data": data or {},
        "read": False,
        "created_at": datetime.utcnow()
    }
    await notifications_collection.insert_one(notification)
    return notification

async def extract_mentions(content: str) -> List[str]:
    """Extract @mentions from content"""
    import re
    mentions = re.findall(r'@(\S+)', content)
    return mentions

async def get_professions_from_external_api(auth_token: Optional[str] = None):
    """Fetch professions from external CNESS API"""
    try:
        headers = {}
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{EXTERNAL_API_BASE}/api/profession/get-valid-profession",
                headers=headers
            )
            if response.status_code == 200:
                data = response.json()
                professions_list = []
                if isinstance(data, list):
                    professions_list = data
                elif isinstance(data, dict) and "data" in data:
                    professions_list = data["data"]
                elif isinstance(data, dict) and "professions" in data:
                    professions_list = data["professions"]
                
                normalized = []
                for prof in professions_list:
                    if isinstance(prof, str):
                        normalized.append({"_id": prof.lower().replace(" ", "-"), "name": prof})
                    elif isinstance(prof, dict):
                        prof_id = prof.get("_id") or prof.get("id") or prof.get("name", "unknown").lower().replace(" ", "-")
                        prof_name = prof.get("name") or prof.get("title") or prof.get("_id") or "Unknown"
                        normalized.append({"_id": prof_id, "name": prof_name})
                
                if normalized:
                    return normalized
                    
    except Exception as e:
        print(f"Error fetching professions: {e}")
    
    return [
        {"_id": "art-director", "name": "Art Director"},
        {"_id": "ux-designer", "name": "UX Designer"},
        {"_id": "software-engineer", "name": "Software Engineer"},
        {"_id": "product-manager", "name": "Product Manager"},
        {"_id": "data-scientist", "name": "Data Scientist"},
        {"_id": "marketing-manager", "name": "Marketing Manager"},
        {"_id": "content-creator", "name": "Content Creator"},
        {"_id": "entrepreneur", "name": "Entrepreneur"},
        {"_id": "consultant", "name": "Consultant"},
        {"_id": "teacher", "name": "Teacher"},
        {"_id": "healthcare-professional", "name": "Healthcare Professional"},
        {"_id": "financial-analyst", "name": "Financial Analyst"}
    ]

def get_unsplash_url(query: str, seed: str = None) -> str:
    """Get Unsplash image URL"""
    if seed:
        return f"https://source.unsplash.com/400x400/?{query}&sig={seed}"
    return f"https://source.unsplash.com/400x400/?{query}"

# ============== ADMIN AUTHENTICATION ==============

@app.post("/api/admin/login")
async def admin_login(credentials: AdminLogin):
    """Admin login endpoint"""
    if verify_admin(credentials.username, credentials.password):
        # Create session token
        session_token = secrets.token_urlsafe(32)
        
        await admin_sessions_collection.insert_one({
            "token": session_token,
            "username": credentials.username,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow().replace(hour=23, minute=59, second=59)
        })
        
        return {
            "success": True,
            "token": session_token,
            "username": credentials.username,
            "message": "Login successful"
        }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/admin/logout")
async def admin_logout(admin_token: str = Query(...)):
    """Admin logout endpoint"""
    await admin_sessions_collection.delete_one({"token": admin_token})
    return {"success": True, "message": "Logged out successfully"}

@app.get("/api/admin/verify")
async def verify_admin_session(admin_token: str = Query(...)):
    """Verify admin session"""
    session = await admin_sessions_collection.find_one({"token": admin_token})
    if session:
        if session["expires_at"] > datetime.utcnow():
            return {"success": True, "username": session["username"]}
    raise HTTPException(status_code=401, detail="Invalid or expired session")

# ============== ADMIN STATISTICS ==============

@app.get("/api/admin/statistics")
async def get_admin_statistics(admin_token: str = Query(...)):
    """Get comprehensive statistics for admin dashboard"""
    # Verify admin
    session = await admin_sessions_collection.find_one({"token": admin_token})
    if not session or session["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Circle statistics
    total_circles = await circles_collection.count_documents({})
    circles_by_scope = {
        "global": await circles_collection.count_documents({"scope": "global"}),
        "national": await circles_collection.count_documents({"scope": "national"}),
        "local": await circles_collection.count_documents({"scope": "local"})
    }
    circles_by_category = {
        "profession": await circles_collection.count_documents({"category": "profession"}),
        "interest": await circles_collection.count_documents({"category": "interest"}),
        "living": await circles_collection.count_documents({"category": "living"}),
        "news": await circles_collection.count_documents({"category": "news"})
    }
    
    # Post statistics
    total_posts = await circle_posts_collection.count_documents({})
    posts_by_status = {
        "published": await circle_posts_collection.count_documents({"status": "published"}),
        "draft": await circle_posts_collection.count_documents({"status": "draft"}),
        "suspended": await circle_posts_collection.count_documents({"status": "suspended"})
    }
    
    # Also count posts without status field (legacy)
    legacy_posts = await circle_posts_collection.count_documents({"status": {"$exists": False}})
    posts_by_status["published"] += legacy_posts
    
    # Resource statistics
    total_resources = await circle_resources_collection.count_documents({})
    resources_by_type = {}
    for rtype in ["document", "video", "link", "image"]:
        resources_by_type[rtype] = await circle_resources_collection.count_documents({"resource_type": rtype})
    
    # Member statistics
    total_memberships = await circle_members_collection.count_documents({})
    unique_users = len(await circle_members_collection.distinct("user_id"))
    
    # Get top circles by engagement
    pipeline = [
        {"$project": {
            "id": 1,
            "name": 1,
            "scope": 1,
            "category": 1,
            "member_count": 1,
            "post_count": 1,
            "active_today": 1
        }},
        {"$sort": {"member_count": -1}},
        {"$limit": 10}
    ]
    top_circles = await circles_collection.aggregate(pipeline).to_list(length=10)
    for c in top_circles:
        c.pop("_id", None)
    
    # Circles by country
    country_pipeline = [
        {"$match": {"country": {"$ne": None}}},
        {"$group": {"_id": "$country", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10}
    ]
    circles_by_country = await circles_collection.aggregate(country_pipeline).to_list(length=10)
    
    return {
        "success": True,
        "statistics": {
            "circles": {
                "total": total_circles,
                "by_scope": circles_by_scope,
                "by_category": circles_by_category,
                "by_country": {item["_id"]: item["count"] for item in circles_by_country}
            },
            "posts": {
                "total": total_posts,
                "by_status": posts_by_status
            },
            "resources": {
                "total": total_resources,
                "by_type": resources_by_type
            },
            "members": {
                "total_memberships": total_memberships,
                "unique_users": unique_users
            },
            "top_circles": top_circles
        }
    }

@app.get("/api/admin/circle-engagement/{circle_id}")
async def get_circle_engagement(circle_id: str, admin_token: str = Query(...)):
    """Get engagement statistics for a specific circle"""
    session = await admin_sessions_collection.find_one({"token": admin_token})
    if not session or session["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    circle = await circles_collection.find_one({"id": circle_id})
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    # Get post counts by status
    posts_published = await circle_posts_collection.count_documents({"circle_id": circle_id, "status": "published"})
    posts_draft = await circle_posts_collection.count_documents({"circle_id": circle_id, "status": "draft"})
    posts_suspended = await circle_posts_collection.count_documents({"circle_id": circle_id, "status": "suspended"})
    posts_legacy = await circle_posts_collection.count_documents({"circle_id": circle_id, "status": {"$exists": False}})
    
    # Get resource counts
    resources = await circle_resources_collection.count_documents({"circle_id": circle_id})
    
    # Get member count
    members = await circle_members_collection.count_documents({"circle_id": circle_id})
    
    # Get recent activity (last 7 days)
    week_ago = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = week_ago.replace(day=week_ago.day - 7) if week_ago.day > 7 else week_ago
    
    recent_posts = await circle_posts_collection.count_documents({
        "circle_id": circle_id,
        "created_at": {"$gte": week_ago}
    })
    
    circle.pop("_id", None)
    if isinstance(circle.get("created_at"), datetime):
        circle["created_at"] = circle["created_at"].isoformat()
    if isinstance(circle.get("updated_at"), datetime):
        circle["updated_at"] = circle["updated_at"].isoformat()
    
    return {
        "success": True,
        "circle": circle,
        "engagement": {
            "members": members,
            "posts": {
                "published": posts_published + posts_legacy,
                "draft": posts_draft,
                "suspended": posts_suspended,
                "total": posts_published + posts_draft + posts_suspended + posts_legacy
            },
            "resources": resources,
            "recent_posts_7days": recent_posts
        }
    }

# ============== ADMIN POST MANAGEMENT ==============

@app.get("/api/admin/posts")
async def get_all_posts_admin(
    admin_token: str = Query(...),
    circle_id: Optional[str] = None,
    status: Optional[str] = None,
    page: int = 1,
    limit: int = 20
):
    """Get all posts for admin management"""
    session = await admin_sessions_collection.find_one({"token": admin_token})
    if not session or session["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    query = {}
    if circle_id:
        query["circle_id"] = circle_id
    if status:
        query["status"] = status
    
    skip = (page - 1) * limit
    
    cursor = circle_posts_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    posts = await cursor.to_list(length=limit)
    
    # Enrich with circle info
    for post in posts:
        post.pop("_id", None)
        circle = await circles_collection.find_one({"id": post.get("circle_id")})
        if circle:
            post["circle_name"] = circle.get("name")
            post["circle_scope"] = circle.get("scope")
        if isinstance(post.get("created_at"), datetime):
            post["created_at"] = post["created_at"].isoformat()
        if isinstance(post.get("updated_at"), datetime):
            post["updated_at"] = post["updated_at"].isoformat()
        # Add default status for legacy posts
        if "status" not in post:
            post["status"] = "published"
    
    total = await circle_posts_collection.count_documents(query)
    
    return {
        "success": True,
        "posts": posts,
        "total": total,
        "page": page,
        "limit": limit
    }

@app.patch("/api/admin/posts/{post_id}/status")
async def update_post_status_admin(
    post_id: str,
    status_update: PostStatusUpdate,
    admin_token: str = Query(...)
):
    """Update post status (publish, suspend, draft)"""
    session = await admin_sessions_collection.find_one({"token": admin_token})
    if not session or session["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if status_update.status not in ["draft", "published", "suspended"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be: draft, published, or suspended")
    
    post = await circle_posts_collection.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    await circle_posts_collection.update_one(
        {"id": post_id},
        {"$set": {"status": status_update.status, "updated_at": datetime.utcnow()}}
    )
    
    return {
        "success": True,
        "message": f"Post status updated to {status_update.status}",
        "post_id": post_id,
        "new_status": status_update.status
    }

@app.delete("/api/admin/posts/{post_id}")
async def delete_post_admin(post_id: str, admin_token: str = Query(...)):
    """Suspend (soft delete) a post"""
    session = await admin_sessions_collection.find_one({"token": admin_token})
    if not session or session["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    post = await circle_posts_collection.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Soft delete by setting status to suspended
    await circle_posts_collection.update_one(
        {"id": post_id},
        {"$set": {"status": "suspended", "updated_at": datetime.utcnow()}}
    )
    
    # Update circle post count
    await circles_collection.update_one(
        {"id": post["circle_id"]},
        {"$inc": {"post_count": -1}}
    )
    
    return {"success": True, "message": "Post suspended successfully"}

# ============== ADMIN SETTINGS ==============

@app.get("/api/admin/settings/roles")
async def get_role_permissions_admin(admin_token: str = Query(...)):
    """Get current role permissions"""
    session = await admin_sessions_collection.find_one({"token": admin_token})
    if not session or session["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    permissions = await get_role_permissions()
    
    return {
        "success": True,
        "permissions": permissions,
        "roles": ["Aspiring", "Inspired", "Leader"]
    }

@app.put("/api/admin/settings/roles")
async def update_role_permissions_admin(
    permission_update: RolePermissionUpdate,
    admin_token: str = Query(...)
):
    """Update role permissions"""
    session = await admin_sessions_collection.find_one({"token": admin_token})
    if not session or session["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if permission_update.role not in ["Aspiring", "Inspired", "Leader"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    # Get current permissions
    current = await get_role_permissions()
    
    # Update the specific role
    current[permission_update.role] = {
        "can_post_local": permission_update.can_post_local,
        "can_post_national": permission_update.can_post_national,
        "can_post_global": permission_update.can_post_global,
        "can_upload_resources_local": permission_update.can_upload_resources_local,
        "can_upload_resources_national": permission_update.can_upload_resources_national,
        "can_upload_resources_global": permission_update.can_upload_resources_global
    }
    
    # Save to database
    await admin_settings_collection.update_one(
        {"type": "role_permissions"},
        {"$set": {"permissions": current, "updated_at": datetime.utcnow()}},
        upsert=True
    )
    
    return {
        "success": True,
        "message": f"Permissions updated for {permission_update.role}",
        "permissions": current
    }

@app.get("/api/admin/settings/countries")
async def get_available_countries(admin_token: str = Query(...)):
    """Get available countries for circle generation"""
    session = await admin_sessions_collection.find_one({"token": admin_token})
    if not session or session["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    countries = []
    for country, data in COUNTRIES_DATA.items():
        # Count existing circles
        national_count = await circles_collection.count_documents({"scope": "national", "country": country})
        local_count = await circles_collection.count_documents({"scope": "local", "country": country})
        
        countries.append({
            "name": country,
            "code": data["code"],
            "provinces_count": len(data["provinces"]),
            "existing_national_circles": national_count,
            "existing_local_circles": local_count
        })
    
    return {
        "success": True,
        "countries": countries
    }

# ============== CIRCLE APIS (Updated with permissions) ==============

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "CNESS Circles API is running"}

@app.get("/api/circles/countries")
async def get_countries():
    """Get available countries and their provinces"""
    return {
        "success": True,
        "countries": [
            {
                "name": country,
                "code": data["code"],
                "provinces": data["provinces"]
            }
            for country, data in COUNTRIES_DATA.items()
        ]
    }

@app.post("/api/circles")
async def create_circle(
    circle: CircleCreate, 
    user_id: str = Query(...),
    authorization: Optional[str] = Header(None)
):
    """Create a new circle (Living and News categories require Aspiring certification)"""
    # Check permission for creating circles of specific category
    auth_token = authorization[7:] if authorization and authorization.startswith("Bearer ") else None
    
    # Only check permission for living and news categories - anyone can view/join any circle
    if circle.category in ["living", "news"]:
        permission = await check_circle_creation_permission(user_id, circle.category, auth_token)
        if not permission["can_create"]:
            raise HTTPException(
                status_code=403,
                detail=f"Your level ({permission['user_level']}) cannot create {circle.category} circles. {permission['reason']}"
            )
    
    circle_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    image_url = circle.image_url
    if not image_url:
        query = circle.name.replace(" ", "+")
        image_url = get_unsplash_url(query, circle_id[:8])
    
    circle_doc = {
        "id": circle_id,
        "name": circle.name,
        "description": circle.description,
        "intention": circle.intention,
        "scope": circle.scope,
        "category": circle.category,
        "image_url": image_url,
        "country": circle.country,
        "province": circle.province,
        "profession_id": circle.profession_id,
        "interest_id": circle.interest_id,
        "creator_id": user_id,
        "member_count": 1,
        "active_today": 1,
        "online_now": 1,
        "post_count": 0,
        "resource_count": 0,
        "is_featured": False,
        "created_at": now,
        "updated_at": now
    }
    
    await circles_collection.insert_one(circle_doc)
    
    membership = {
        "id": str(uuid.uuid4()),
        "circle_id": circle_id,
        "user_id": user_id,
        "role": "admin",
        "joined_at": now
    }
    await circle_members_collection.insert_one(membership)
    
    circle_doc.pop("_id", None)
    circle_doc["created_at"] = circle_doc["created_at"].isoformat()
    circle_doc["updated_at"] = circle_doc["updated_at"].isoformat()
    
    return {"success": True, "circle": circle_doc}

@app.get("/api/circles")
async def get_circles(
    scope: Optional[str] = None,
    category: Optional[str] = None,
    country: Optional[str] = None,
    province: Optional[str] = None,
    profession_id: Optional[str] = None,
    interest_id: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "popular",
    page: int = 1,
    limit: int = 20
):
    """Get circles with filters"""
    query = {}
    
    if scope:
        query["scope"] = scope
    if category:
        query["category"] = category
    if country:
        query["country"] = country
    if province:
        query["province"] = province
    if profession_id:
        query["profession_id"] = profession_id
    if interest_id:
        query["interest_id"] = interest_id
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    sort_options = {
        "popular": ("member_count", -1),
        "active": ("active_today", -1),
        "newest": ("created_at", -1)
    }
    sort_field, sort_order = sort_options.get(sort, ("member_count", -1))
    
    skip = (page - 1) * limit
    
    cursor = circles_collection.find(query).sort(sort_field, sort_order).skip(skip).limit(limit)
    circles = await cursor.to_list(length=limit)
    
    for circle in circles:
        circle.pop("_id", None)
        if isinstance(circle.get("created_at"), datetime):
            circle["created_at"] = circle["created_at"].isoformat()
        if isinstance(circle.get("updated_at"), datetime):
            circle["updated_at"] = circle["updated_at"].isoformat()
    
    total = await circles_collection.count_documents(query)
    
    return {
        "success": True,
        "circles": circles,
        "total": total,
        "page": page,
        "limit": limit
    }

@app.get("/api/circles/by-location")
async def get_circles_by_location(
    country: str,
    province: Optional[str] = None,
    include_national: bool = True,
    include_global: bool = True,
    category: Optional[str] = None,
    page: int = 1,
    limit: int = 50
):
    """Get circles based on user's location"""
    queries = []
    
    if province:
        local_query = {"scope": "local", "province": province}
        if category:
            local_query["category"] = category
        queries.append(local_query)
    
    if include_national:
        national_query = {"scope": "national", "country": country}
        if category:
            national_query["category"] = category
        queries.append(national_query)
    
    if include_global:
        global_query = {"scope": "global"}
        if category:
            global_query["category"] = category
        queries.append(global_query)
    
    final_query = {"$or": queries} if queries else {}
    
    skip = (page - 1) * limit
    
    cursor = circles_collection.find(final_query).sort("member_count", -1).skip(skip).limit(limit)
    circles = await cursor.to_list(length=limit)
    
    for circle in circles:
        circle.pop("_id", None)
        if isinstance(circle.get("created_at"), datetime):
            circle["created_at"] = circle["created_at"].isoformat()
        if isinstance(circle.get("updated_at"), datetime):
            circle["updated_at"] = circle["updated_at"].isoformat()
    
    local_circles = [c for c in circles if c.get("scope") == "local"]
    national_circles = [c for c in circles if c.get("scope") == "national"]
    global_circles = [c for c in circles if c.get("scope") == "global"]
    
    return {
        "success": True,
        "location": {"country": country, "province": province},
        "circles": circles,
        "grouped": {
            "local": local_circles,
            "national": national_circles,
            "global": global_circles
        },
        "counts": {
            "local": len(local_circles),
            "national": len(national_circles),
            "global": len(global_circles),
            "total": len(circles)
        }
    }

@app.get("/api/circles/featured")
async def get_featured_circles(limit: int = 5):
    """Get featured circles"""
    cursor = circles_collection.find({"is_featured": True}).sort("member_count", -1).limit(limit)
    circles = await cursor.to_list(length=limit)
    
    if len(circles) < limit:
        remaining = limit - len(circles)
        existing_ids = [c["id"] for c in circles]
        cursor = circles_collection.find({"id": {"$nin": existing_ids}}).sort("member_count", -1).limit(remaining)
        more_circles = await cursor.to_list(length=remaining)
        circles.extend(more_circles)
    
    for circle in circles:
        circle.pop("_id", None)
        if isinstance(circle.get("created_at"), datetime):
            circle["created_at"] = circle["created_at"].isoformat()
        if isinstance(circle.get("updated_at"), datetime):
            circle["updated_at"] = circle["updated_at"].isoformat()
    
    return {"success": True, "circles": circles}

@app.get("/api/circles/{circle_id}")
async def get_circle(circle_id: str):
    """Get single circle details"""
    circle = await circles_collection.find_one({"id": circle_id})
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    circle.pop("_id", None)
    if isinstance(circle.get("created_at"), datetime):
        circle["created_at"] = circle["created_at"].isoformat()
    if isinstance(circle.get("updated_at"), datetime):
        circle["updated_at"] = circle["updated_at"].isoformat()
    
    return {"success": True, "circle": circle}

@app.patch("/api/circles/{circle_id}")
async def update_circle(circle_id: str, updates: CircleUpdate, user_id: str = Query(...)):
    """Update circle details"""
    circle = await circles_collection.find_one({"id": circle_id})
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    if circle["creator_id"] != user_id:
        membership = await circle_members_collection.find_one({
            "circle_id": circle_id, 
            "user_id": user_id, 
            "role": "admin"
        })
        if not membership:
            raise HTTPException(status_code=403, detail="Only creator or admin can update circle")
    
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await circles_collection.update_one({"id": circle_id}, {"$set": update_data})
    
    return {"success": True, "message": "Circle updated"}

@app.delete("/api/circles/{circle_id}")
async def delete_circle(circle_id: str, user_id: str = Query(...)):
    """Delete a circle"""
    circle = await circles_collection.find_one({"id": circle_id})
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    if circle["creator_id"] != user_id:
        raise HTTPException(status_code=403, detail="Only creator can delete circle")
    
    await circles_collection.delete_one({"id": circle_id})
    await circle_members_collection.delete_many({"circle_id": circle_id})
    await circle_posts_collection.delete_many({"circle_id": circle_id})
    await circle_resources_collection.delete_many({"circle_id": circle_id})
    
    return {"success": True, "message": "Circle deleted"}

# ============== MEMBERSHIP APIS ==============

@app.get("/api/circles/{circle_id}/check-join-eligibility")
async def check_join_eligibility(
    circle_id: str,
    user_id: str = Query(...),
    user_profession_id: Optional[str] = Query(None),
    user_interests: Optional[str] = Query(None),  # Comma-separated interest IDs
    authorization: Optional[str] = Header(None)
):
    """
    Check if a user can join a circle based on their profession/interest
    
    Rules:
    - For profession circles: User must have the same profession
    - For interest circles: User must have the matching interest
    - User must be Aspiring level or higher to join profession/interest circles
    - Living and News circles: Anyone can join
    """
    circle = await circles_collection.find_one({"id": circle_id})
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    # Check if already a member
    existing = await circle_members_collection.find_one({"circle_id": circle_id, "user_id": user_id})
    if existing:
        return {"success": True, "can_join": True, "reason": "Already a member", "is_member": True}
    
    # Get user level from external API
    auth_token = authorization[7:] if authorization and authorization.startswith("Bearer ") else None
    user_level = await get_user_level(user_id, auth_token)
    
    # Living and News circles: Anyone can join
    if circle.get("category") in ["living", "news"]:
        return {
            "success": True,
            "can_join": True,
            "reason": "Open circle - anyone can join",
            "is_member": False,
            "user_level": user_level
        }
    
    # For profession/interest circles, user must be Aspiring or higher
    if user_level == "Member":
        return {
            "success": True,
            "can_join": False,
            "reason": "You must complete Aspiring certification to join profession/interest circles",
            "is_member": False,
            "user_level": user_level,
            "required_level": "Aspiring"
        }
    
    # Check profession match
    if circle.get("category") == "profession":
        circle_profession_id = circle.get("profession_id")
        if circle_profession_id and user_profession_id:
            if circle_profession_id != user_profession_id:
                return {
                    "success": True,
                    "can_join": False,
                    "reason": f"This circle is for {circle.get('profession_name', 'a specific profession')}. You can only join circles matching your profession.",
                    "is_member": False,
                    "user_level": user_level,
                    "circle_profession": circle.get("profession_name"),
                    "user_profession_id": user_profession_id
                }
        # If no profession info provided, allow join (for backward compatibility)
    
    # Check interest match
    if circle.get("category") == "interest":
        circle_interest_id = circle.get("interest_id")
        user_interest_list = user_interests.split(",") if user_interests else []
        
        if circle_interest_id and user_interest_list:
            if circle_interest_id not in user_interest_list:
                return {
                    "success": True,
                    "can_join": False,
                    "reason": f"This circle is for {circle.get('interest_name', 'a specific interest')}. You can only join circles matching your interests.",
                    "is_member": False,
                    "user_level": user_level,
                    "circle_interest": circle.get("interest_name")
                }
    
    return {
        "success": True,
        "can_join": True,
        "reason": "Eligible to join",
        "is_member": False,
        "user_level": user_level
    }

@app.post("/api/circles/{circle_id}/join")
async def join_circle(circle_id: str, user_id: str = Query(...)):
    """Join a circle"""
    circle = await circles_collection.find_one({"id": circle_id})
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    existing = await circle_members_collection.find_one({"circle_id": circle_id, "user_id": user_id})
    if existing:
        return {"success": True, "message": "Already a member", "is_member": True}
    
    membership = {
        "id": str(uuid.uuid4()),
        "circle_id": circle_id,
        "user_id": user_id,
        "role": "member",
        "joined_at": datetime.utcnow()
    }
    await circle_members_collection.insert_one(membership)
    
    await circles_collection.update_one(
        {"id": circle_id},
        {"$inc": {"member_count": 1}}
    )
    
    return {"success": True, "message": "Joined circle", "is_member": True}

@app.post("/api/circles/{circle_id}/leave")
async def leave_circle(circle_id: str, user_id: str = Query(...)):
    """Leave a circle"""
    membership = await circle_members_collection.find_one({"circle_id": circle_id, "user_id": user_id})
    
    if not membership:
        return {"success": True, "message": "Not a member", "is_member": False}
    
    if membership["role"] == "admin":
        admin_count = await circle_members_collection.count_documents({
            "circle_id": circle_id, 
            "role": "admin"
        })
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot leave. Transfer admin role first.")
    
    await circle_members_collection.delete_one({"circle_id": circle_id, "user_id": user_id})
    
    await circles_collection.update_one(
        {"id": circle_id},
        {"$inc": {"member_count": -1}}
    )
    
    return {"success": True, "message": "Left circle", "is_member": False}

@app.get("/api/circles/{circle_id}/members")
async def get_circle_members(circle_id: str, page: int = 1, limit: int = 20):
    """Get circle members"""
    skip = (page - 1) * limit
    
    cursor = circle_members_collection.find({"circle_id": circle_id}).skip(skip).limit(limit)
    members = await cursor.to_list(length=limit)
    
    for member in members:
        member.pop("_id", None)
        if isinstance(member.get("joined_at"), datetime):
            member["joined_at"] = member["joined_at"].isoformat()
    
    total = await circle_members_collection.count_documents({"circle_id": circle_id})
    
    return {"success": True, "members": members, "total": total}

@app.get("/api/circles/user/{user_id}/joined")
async def get_user_circles(user_id: str):
    """Get circles a user has joined"""
    memberships = await circle_members_collection.find({"user_id": user_id}).to_list(length=100)
    circle_ids = [m["circle_id"] for m in memberships]
    
    if not circle_ids:
        return {"success": True, "circles": []}
    
    circles = await circles_collection.find({"id": {"$in": circle_ids}}).to_list(length=100)
    
    for circle in circles:
        circle.pop("_id", None)
        if isinstance(circle.get("created_at"), datetime):
            circle["created_at"] = circle["created_at"].isoformat()
        if isinstance(circle.get("updated_at"), datetime):
            circle["updated_at"] = circle["updated_at"].isoformat()
    
    return {"success": True, "circles": circles}

@app.get("/api/circles/{circle_id}/membership")
async def check_membership(circle_id: str, user_id: str = Query(...)):
    """Check if user is member of circle"""
    membership = await circle_members_collection.find_one({"circle_id": circle_id, "user_id": user_id})
    
    return {
        "success": True,
        "is_member": membership is not None,
        "role": membership["role"] if membership else None
    }

# ============== CIRCLE POSTS APIS (with permissions) ==============

@app.get("/api/circles/{circle_id}/check-post-permission")
async def check_post_permission(
    circle_id: str,
    user_id: str = Query(...),
    authorization: Optional[str] = Header(None)
):
    """Check if user can post in this circle based on their level"""
    circle = await circles_collection.find_one({"id": circle_id})
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    auth_token = None
    if authorization and authorization.startswith("Bearer "):
        auth_token = authorization[7:]
    
    permission = await check_posting_permission(user_id, circle["scope"], auth_token)
    
    return {
        "success": True,
        **permission
    }

@app.post("/api/circles/{circle_id}/posts")
async def create_circle_post(
    circle_id: str,
    post: CirclePostCreate,
    user_id: str = Query(...),
    authorization: Optional[str] = Header(None)
):
    """Create a post in a circle (with permission check)"""
    circle = await circles_collection.find_one({"id": circle_id})
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    # Check membership
    membership = await circle_members_collection.find_one({"circle_id": circle_id, "user_id": user_id})
    if not membership:
        raise HTTPException(status_code=403, detail="Must be a member to post. Please join the circle first.")
    
    # Check permission based on user level
    auth_token = None
    if authorization and authorization.startswith("Bearer "):
        auth_token = authorization[7:]
    
    permission = await check_posting_permission(user_id, circle["scope"], auth_token)
    if not permission["can_post"]:
        raise HTTPException(
            status_code=403, 
            detail=f"Your level ({permission['user_level']}) cannot post in {circle['scope']} circles. {permission['reason']}"
        )
    
    post_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    post_doc = {
        "id": post_id,
        "circle_id": circle_id,
        "user_id": user_id,
        "content": post.content,
        "media_urls": post.media_urls or [],
        "post_type": post.post_type,
        "status": post.status or "published",
        "likes_count": 0,
        "comments_count": 0,
        "created_at": now,
        "updated_at": now
    }
    
    await circle_posts_collection.insert_one(post_doc)
    
    # Update circle stats only for published posts
    if post_doc["status"] == "published":
        await circles_collection.update_one(
            {"id": circle_id},
            {
                "$inc": {"post_count": 1, "active_today": 1},
                "$set": {"updated_at": now}
            }
        )
    
    post_doc.pop("_id", None)
    post_doc["created_at"] = post_doc["created_at"].isoformat()
    post_doc["updated_at"] = post_doc["updated_at"].isoformat()
    
    return {"success": True, "post": post_doc}

@app.get("/api/circles/{circle_id}/posts")
async def get_circle_posts(
    circle_id: str,
    post_type: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    include_suspended: bool = False
):
    """Get posts in a circle (excludes suspended by default)"""
    query = {"circle_id": circle_id}
    
    if post_type:
        query["post_type"] = post_type
    
    # Exclude suspended posts unless explicitly requested
    if not include_suspended:
        query["$or"] = [
            {"status": "published"},
            {"status": {"$exists": False}}  # Legacy posts without status
        ]
    
    skip = (page - 1) * limit
    
    cursor = circle_posts_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    posts = await cursor.to_list(length=limit)
    
    for post in posts:
        post.pop("_id", None)
        if isinstance(post.get("created_at"), datetime):
            post["created_at"] = post["created_at"].isoformat()
        if isinstance(post.get("updated_at"), datetime):
            post["updated_at"] = post["updated_at"].isoformat()
        if "status" not in post:
            post["status"] = "published"
    
    total = await circle_posts_collection.count_documents(query)
    
    return {"success": True, "posts": posts, "total": total}

@app.get("/api/circles/posts/feed")
async def get_circles_feed(user_id: str = Query(...), page: int = 1, limit: int = 20):
    """Get feed of posts from all circles user has joined (excludes suspended)"""
    memberships = await circle_members_collection.find({"user_id": user_id}).to_list(length=100)
    circle_ids = [m["circle_id"] for m in memberships]
    
    if not circle_ids:
        return {"success": True, "posts": [], "total": 0}
    
    skip = (page - 1) * limit
    
    query = {
        "circle_id": {"$in": circle_ids},
        "$or": [
            {"status": "published"},
            {"status": {"$exists": False}}
        ]
    }
    
    cursor = circle_posts_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    posts = await cursor.to_list(length=limit)
    
    for post in posts:
        post.pop("_id", None)
        circle = await circles_collection.find_one({"id": post["circle_id"]})
        if circle:
            post["circle_name"] = circle["name"]
            post["circle_image"] = circle["image_url"]
            post["circle_scope"] = circle["scope"]
            post["circle_category"] = circle["category"]
            post["circle_member_count"] = circle["member_count"]
            post["circle_active_today"] = circle["active_today"]
        if isinstance(post.get("created_at"), datetime):
            post["created_at"] = post["created_at"].isoformat()
        if isinstance(post.get("updated_at"), datetime):
            post["updated_at"] = post["updated_at"].isoformat()
        if "status" not in post:
            post["status"] = "published"
    
    total = await circle_posts_collection.count_documents(query)
    
    return {"success": True, "posts": posts, "total": total}

# Note: Post like toggle endpoint is defined later in POST LIKE/SHARE APIS section

@app.delete("/api/circles/posts/{post_id}")
async def delete_circle_post(post_id: str, user_id: str = Query(...)):
    """Delete a circle post"""
    post = await circle_posts_collection.find_one({"id": post_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Only author can delete post")
    
    await circle_posts_collection.delete_one({"id": post_id})
    
    if post.get("status") != "suspended":
        await circles_collection.update_one(
            {"id": post["circle_id"]},
            {"$inc": {"post_count": -1}}
        )
    
    return {"success": True, "message": "Post deleted"}

# ============== RESOURCES APIS ==============

@app.post("/api/circles/{circle_id}/resources")
async def upload_resource(
    circle_id: str,
    resource: ResourceCreate,
    user_id: str = Query(...),
    authorization: Optional[str] = Header(None)
):
    """Upload a resource to a circle"""
    circle = await circles_collection.find_one({"id": circle_id})
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    # Check membership
    membership = await circle_members_collection.find_one({"circle_id": circle_id, "user_id": user_id})
    if not membership:
        raise HTTPException(status_code=403, detail="Must be a member to upload resources")
    
    # Check permission
    auth_token = None
    if authorization and authorization.startswith("Bearer "):
        auth_token = authorization[7:]
    
    permission = await check_resource_permission(user_id, circle["scope"], auth_token)
    if not permission["can_upload"]:
        raise HTTPException(
            status_code=403,
            detail=f"Your level ({permission['user_level']}) cannot upload resources in {circle['scope']} circles"
        )
    
    resource_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    resource_doc = {
        "id": resource_id,
        "circle_id": circle_id,
        "user_id": user_id,
        "title": resource.title,
        "description": resource.description,
        "resource_type": resource.resource_type,
        "url": resource.url,
        "file_size": resource.file_size,
        "downloads_count": 0,
        "created_at": now,
        "updated_at": now
    }
    
    await circle_resources_collection.insert_one(resource_doc)
    
    await circles_collection.update_one(
        {"id": circle_id},
        {"$inc": {"resource_count": 1}}
    )
    
    resource_doc.pop("_id", None)
    resource_doc["created_at"] = resource_doc["created_at"].isoformat()
    resource_doc["updated_at"] = resource_doc["updated_at"].isoformat()
    
    return {"success": True, "resource": resource_doc}

@app.get("/api/circles/{circle_id}/resources")
async def get_circle_resources(circle_id: str, page: int = 1, limit: int = 20):
    """Get resources in a circle"""
    query = {"circle_id": circle_id}
    
    skip = (page - 1) * limit
    
    cursor = circle_resources_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    resources = await cursor.to_list(length=limit)
    
    for resource in resources:
        resource.pop("_id", None)
        if isinstance(resource.get("created_at"), datetime):
            resource["created_at"] = resource["created_at"].isoformat()
        if isinstance(resource.get("updated_at"), datetime):
            resource["updated_at"] = resource["updated_at"].isoformat()
    
    total = await circle_resources_collection.count_documents(query)
    
    return {"success": True, "resources": resources, "total": total}

# ============== BULK CIRCLE CREATION ==============

@app.post("/api/circles/generate/for-country")
async def generate_circles_for_country(
    request: BulkCircleCreate,
    user_id: str = Query(default="system"),
    auth_token: Optional[str] = Query(default=None)
):
    """Generate circles for a country"""
    country = request.country
    
    if country not in COUNTRIES_DATA:
        raise HTTPException(status_code=400, detail=f"Country '{country}' not supported")
    
    country_data = COUNTRIES_DATA[country]
    provinces = country_data["provinces"]
    
    professions = await get_professions_from_external_api(auth_token) if request.create_for_professions else []
    interests = DEFAULT_INTERESTS if request.create_for_interests else []
    
    created_circles = []
    now = datetime.utcnow()
    
    # Create Global circles (only if create_global is True)
    if request.create_global and request.create_for_professions:
        for prof in professions:
            prof_id = prof.get("_id")
            prof_name = prof.get("name")
            
            existing = await circles_collection.find_one({
                "scope": "global",
                "category": "profession",
                "profession_id": prof_id
            })
            
            if not existing:
                circle_doc = {
                    "id": str(uuid.uuid4()),
                    "name": f"Global {prof_name}s",
                    "description": f"A worldwide community for {prof_name}s to connect and grow together.",
                    "intention": f"Unite {prof_name}s globally",
                    "scope": "global",
                    "category": "profession",
                    "image_url": get_unsplash_url(prof_name.lower().replace(" ", "+")),
                    "country": None,
                    "province": None,
                    "profession_id": prof_id,
                    "profession_name": prof_name,
                    "interest_id": None,
                    "interest_name": None,
                    "creator_id": user_id,
                    "member_count": 0,
                    "active_today": 0,
                    "online_now": 0,
                    "post_count": 0,
                    "resource_count": 0,
                    "is_featured": False,
                    "created_at": now,
                    "updated_at": now
                }
                await circles_collection.insert_one(circle_doc)
                created_circles.append({"scope": "global", "name": circle_doc["name"]})
    
    if request.create_global and request.create_for_interests:
        for interest in interests:
            interest_id = interest.get("id")
            interest_name = interest.get("name")
            
            existing = await circles_collection.find_one({
                "scope": "global",
                "category": "interest",
                "interest_id": interest_id
            })
            
            if not existing:
                circle_doc = {
                    "id": str(uuid.uuid4()),
                    "name": f"Global {interest_name}",
                    "description": f"A worldwide community for people interested in {interest_name}.",
                    "intention": f"Connect through {interest_name}",
                    "scope": "global",
                    "category": "interest",
                    "image_url": get_unsplash_url(interest_name.lower().replace(" ", "+").replace("&", "")),
                    "country": None,
                    "province": None,
                    "profession_id": None,
                    "profession_name": None,
                    "interest_id": interest_id,
                    "interest_name": interest_name,
                    "creator_id": user_id,
                    "member_count": 0,
                    "active_today": 0,
                    "online_now": 0,
                    "post_count": 0,
                    "resource_count": 0,
                    "is_featured": False,
                    "created_at": now,
                    "updated_at": now
                }
                await circles_collection.insert_one(circle_doc)
                created_circles.append({"scope": "global", "name": circle_doc["name"]})
    
    # Create National circles
    if request.create_national:
        if request.create_for_professions:
            for prof in professions:
                prof_id = prof.get("_id")
                prof_name = prof.get("name")
                
                existing = await circles_collection.find_one({
                    "scope": "national",
                    "category": "profession",
                    "profession_id": prof_id,
                    "country": country
                })
                
                if not existing:
                    circle_doc = {
                        "id": str(uuid.uuid4()),
                        "name": f"{prof_name}s {country}",
                        "description": f"A community for {prof_name}s in {country}.",
                        "intention": f"Connect {prof_name}s in {country}",
                        "scope": "national",
                        "category": "profession",
                        "image_url": get_unsplash_url(f"{prof_name}+{country}".lower().replace(" ", "+")),
                        "country": country,
                        "province": None,
                        "profession_id": prof_id,
                        "profession_name": prof_name,
                        "interest_id": None,
                        "interest_name": None,
                        "creator_id": user_id,
                        "member_count": 0,
                        "active_today": 0,
                        "online_now": 0,
                        "post_count": 0,
                        "resource_count": 0,
                        "is_featured": False,
                        "created_at": now,
                        "updated_at": now
                    }
                    await circles_collection.insert_one(circle_doc)
                    created_circles.append({"scope": "national", "country": country, "name": circle_doc["name"]})
        
        if request.create_for_interests:
            for interest in interests:
                interest_id = interest.get("id")
                interest_name = interest.get("name")
                
                existing = await circles_collection.find_one({
                    "scope": "national",
                    "category": "interest",
                    "interest_id": interest_id,
                    "country": country
                })
                
                if not existing:
                    circle_doc = {
                        "id": str(uuid.uuid4()),
                        "name": f"{interest_name} {country}",
                        "description": f"A community for people in {country} interested in {interest_name}.",
                        "intention": f"{interest_name} enthusiasts in {country}",
                        "scope": "national",
                        "category": "interest",
                        "image_url": get_unsplash_url(interest_name.lower().replace(" ", "+").replace("&", "")),
                        "country": country,
                        "province": None,
                        "profession_id": None,
                        "profession_name": None,
                        "interest_id": interest_id,
                        "interest_name": interest_name,
                        "creator_id": user_id,
                        "member_count": 0,
                        "active_today": 0,
                        "online_now": 0,
                        "post_count": 0,
                        "resource_count": 0,
                        "is_featured": False,
                        "created_at": now,
                        "updated_at": now
                    }
                    await circles_collection.insert_one(circle_doc)
                    created_circles.append({"scope": "national", "country": country, "name": circle_doc["name"]})
    
    # Create Local circles
    if request.create_local:
        for province in provinces:
            if request.create_for_professions:
                for prof in professions:
                    prof_id = prof.get("_id")
                    prof_name = prof.get("name")
                    
                    existing = await circles_collection.find_one({
                        "scope": "local",
                        "category": "profession",
                        "profession_id": prof_id,
                        "province": province
                    })
                    
                    if not existing:
                        circle_doc = {
                            "id": str(uuid.uuid4()),
                            "name": f"{prof_name}s {province}",
                            "description": f"Local community for {prof_name}s in {province}, {country}.",
                            "intention": f"Connect local {prof_name}s in {province}",
                            "scope": "local",
                            "category": "profession",
                            "image_url": get_unsplash_url(f"{prof_name}+community".lower().replace(" ", "+")),
                            "country": country,
                            "province": province,
                            "profession_id": prof_id,
                            "profession_name": prof_name,
                            "interest_id": None,
                            "interest_name": None,
                            "creator_id": user_id,
                            "member_count": 0,
                            "active_today": 0,
                            "online_now": 0,
                            "post_count": 0,
                            "resource_count": 0,
                            "is_featured": False,
                            "created_at": now,
                            "updated_at": now
                        }
                        await circles_collection.insert_one(circle_doc)
                        created_circles.append({"scope": "local", "province": province, "name": circle_doc["name"]})
            
            if request.create_for_interests:
                for interest in interests:
                    interest_id = interest.get("id")
                    interest_name = interest.get("name")
                    
                    existing = await circles_collection.find_one({
                        "scope": "local",
                        "category": "interest",
                        "interest_id": interest_id,
                        "province": province
                    })
                    
                    if not existing:
                        circle_doc = {
                            "id": str(uuid.uuid4()),
                            "name": f"{interest_name} {province}",
                            "description": f"Local community for {interest_name} enthusiasts in {province}, {country}.",
                            "intention": f"Local {interest_name} community",
                            "scope": "local",
                            "category": "interest",
                            "image_url": get_unsplash_url(interest_name.lower().replace(" ", "+").replace("&", "")),
                            "country": country,
                            "province": province,
                            "profession_id": None,
                            "profession_name": None,
                            "interest_id": interest_id,
                            "interest_name": interest_name,
                            "creator_id": user_id,
                            "member_count": 0,
                            "active_today": 0,
                            "online_now": 0,
                            "post_count": 0,
                            "resource_count": 0,
                            "is_featured": False,
                            "created_at": now,
                            "updated_at": now
                        }
                        await circles_collection.insert_one(circle_doc)
                        created_circles.append({"scope": "local", "province": province, "name": circle_doc["name"]})
    
    return {
        "success": True,
        "message": f"Created {len(created_circles)} circles for {country}",
        "country": country,
        "created_count": len(created_circles),
        "circles_created": created_circles[:100]
    }

@app.get("/api/circles/stats")
async def get_circles_stats():
    """Get statistics about circles"""
    total_circles = await circles_collection.count_documents({})
    global_circles = await circles_collection.count_documents({"scope": "global"})
    national_circles = await circles_collection.count_documents({"scope": "national"})
    local_circles = await circles_collection.count_documents({"scope": "local"})
    
    profession_circles = await circles_collection.count_documents({"category": "profession"})
    interest_circles = await circles_collection.count_documents({"category": "interest"})
    
    total_members = await circle_members_collection.count_documents({})
    total_posts = await circle_posts_collection.count_documents({})
    total_resources = await circle_resources_collection.count_documents({})
    
    pipeline = [
        {"$match": {"country": {"$ne": None}}},
        {"$group": {"_id": "$country", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    by_country = await circles_collection.aggregate(pipeline).to_list(length=20)
    
    return {
        "success": True,
        "stats": {
            "total_circles": total_circles,
            "by_scope": {
                "global": global_circles,
                "national": national_circles,
                "local": local_circles
            },
            "by_category": {
                "profession": profession_circles,
                "interest": interest_circles
            },
            "total_members": total_members,
            "total_posts": total_posts,
            "total_resources": total_resources,
            "by_country": {item["_id"]: item["count"] for item in by_country}
        }
    }

@app.post("/api/circles/seed")
async def seed_circles():
    """Seed sample circles"""
    await circles_collection.delete_many({})
    await circle_members_collection.delete_many({})
    await circle_posts_collection.delete_many({})
    await circle_resources_collection.delete_many({})
    
    now = datetime.utcnow()
    
    sample_circles = [
        {
            "id": str(uuid.uuid4()),
            "name": "Art Directors India",
            "description": "A community for Art Directors across India.",
            "intention": "Connect and inspire Indian Art Directors",
            "scope": "national",
            "category": "profession",
            "image_url": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
            "country": "India",
            "province": None,
            "profession_id": "art-director",
            "profession_name": "Art Director",
            "interest_id": None,
            "interest_name": None,
            "creator_id": "system",
            "member_count": 1250,
            "active_today": 89,
            "online_now": 23,
            "post_count": 456,
            "resource_count": 34,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Global Art Directors",
            "description": "Worldwide community for Art Directors.",
            "intention": "Unite Art Directors globally",
            "scope": "global",
            "category": "profession",
            "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
            "country": None,
            "province": None,
            "profession_id": "art-director",
            "profession_name": "Art Director",
            "interest_id": None,
            "interest_name": None,
            "creator_id": "system",
            "member_count": 5420,
            "active_today": 312,
            "online_now": 87,
            "post_count": 2341,
            "resource_count": 156,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Tech Entrepreneurs Maharashtra",
            "description": "Local community for tech entrepreneurs in Maharashtra.",
            "intention": "Build Maharashtra's tech ecosystem",
            "scope": "local",
            "category": "profession",
            "image_url": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400",
            "country": "India",
            "province": "Maharashtra",
            "profession_id": "entrepreneur",
            "profession_name": "Entrepreneur",
            "interest_id": None,
            "interest_name": None,
            "creator_id": "system",
            "member_count": 890,
            "active_today": 45,
            "online_now": 12,
            "post_count": 234,
            "resource_count": 23,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Mindfulness & Meditation",
            "description": "A space for mindfulness practitioners.",
            "intention": "Cultivate inner peace together",
            "scope": "global",
            "category": "interest",
            "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400",
            "country": None,
            "province": None,
            "profession_id": None,
            "interest_id": "mindfulness",
            "creator_id": "system",
            "member_count": 8930,
            "active_today": 567,
            "online_now": 145,
            "post_count": 4521,
            "resource_count": 287,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        }
    ]
    
    await circles_collection.insert_many(sample_circles)
    
    return {
        "success": True,
        "message": f"Seeded {len(sample_circles)} circles",
        "circles_count": len(sample_circles)
    }

# ============== COMMENTS APIS ==============

@app.post("/api/circles/posts/{post_id}/comments")
async def create_comment(
    post_id: str,
    comment: CommentCreate,
    user_id: str = Query(...),
    authorization: Optional[str] = Header(None)
):
    """Create a comment on a post"""
    post = await circle_posts_collection.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if user is member of the circle
    membership = await circle_members_collection.find_one({
        "circle_id": post["circle_id"],
        "user_id": user_id
    })
    if not membership:
        raise HTTPException(status_code=403, detail="Must be a member to comment")
    
    comment_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    # Extract mentions from content
    mentions = await extract_mentions(comment.content)
    
    comment_doc = {
        "id": comment_id,
        "post_id": post_id,
        "circle_id": post["circle_id"],
        "user_id": user_id,
        "content": comment.content,
        "parent_comment_id": comment.parent_comment_id,
        "mentions": mentions,
        "likes_count": 0,
        "replies_count": 0,
        "created_at": now,
        "updated_at": now
    }
    
    await circle_comments_collection.insert_one(comment_doc)
    
    # Update post comment count
    await circle_posts_collection.update_one(
        {"id": post_id},
        {"$inc": {"comments_count": 1}}
    )
    
    # If this is a reply, update parent comment replies count
    if comment.parent_comment_id:
        await circle_comments_collection.update_one(
            {"id": comment.parent_comment_id},
            {"$inc": {"replies_count": 1}}
        )
    
    # Create notifications for mentions
    for mentioned_user in mentions:
        await create_notification(
            user_id=mentioned_user,
            notification_type="mention",
            title="You were mentioned",
            message="Someone mentioned you in a comment",
            data={
                "post_id": post_id,
                "comment_id": comment_id,
                "circle_id": post["circle_id"],
                "mentioned_by": user_id
            }
        )
    
    comment_doc.pop("_id", None)
    comment_doc["created_at"] = comment_doc["created_at"].isoformat()
    comment_doc["updated_at"] = comment_doc["updated_at"].isoformat()
    
    return {"success": True, "comment": comment_doc}

@app.get("/api/circles/posts/{post_id}/comments")
async def get_post_comments(
    post_id: str,
    page: int = 1,
    limit: int = 20
):
    """Get comments for a post (top-level only, with replies nested)"""
    query = {"post_id": post_id, "parent_comment_id": None}
    
    skip = (page - 1) * limit
    
    cursor = circle_comments_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    comments = await cursor.to_list(length=limit)
    
    # Get replies for each comment
    for comment in comments:
        comment.pop("_id", None)
        if isinstance(comment.get("created_at"), datetime):
            comment["created_at"] = comment["created_at"].isoformat()
        if isinstance(comment.get("updated_at"), datetime):
            comment["updated_at"] = comment["updated_at"].isoformat()
        
        # Get replies (single level thread)
        replies_cursor = circle_comments_collection.find({
            "parent_comment_id": comment["id"]
        }).sort("created_at", 1).limit(50)
        replies = await replies_cursor.to_list(length=50)
        
        for reply in replies:
            reply.pop("_id", None)
            if isinstance(reply.get("created_at"), datetime):
                reply["created_at"] = reply["created_at"].isoformat()
            if isinstance(reply.get("updated_at"), datetime):
                reply["updated_at"] = reply["updated_at"].isoformat()
        
        comment["replies"] = replies
    
    total = await circle_comments_collection.count_documents(query)
    
    return {"success": True, "comments": comments, "total": total}

@app.post("/api/circles/comments/{comment_id}/like")
async def like_comment(comment_id: str, user_id: str = Query(...)):
    """Like a comment"""
    comment = await circle_comments_collection.find_one({"id": comment_id})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check if already liked
    existing_like = await circle_comment_likes_collection.find_one({
        "comment_id": comment_id,
        "user_id": user_id
    })
    
    if existing_like:
        # Unlike
        await circle_comment_likes_collection.delete_one({
            "comment_id": comment_id,
            "user_id": user_id
        })
        await circle_comments_collection.update_one(
            {"id": comment_id},
            {"$inc": {"likes_count": -1}}
        )
        return {"success": True, "liked": False}
    else:
        # Like
        await circle_comment_likes_collection.insert_one({
            "id": str(uuid.uuid4()),
            "comment_id": comment_id,
            "user_id": user_id,
            "created_at": datetime.utcnow()
        })
        await circle_comments_collection.update_one(
            {"id": comment_id},
            {"$inc": {"likes_count": 1}}
        )
        return {"success": True, "liked": True}

@app.delete("/api/circles/comments/{comment_id}")
async def delete_comment(comment_id: str, user_id: str = Query(...)):
    """Delete a comment"""
    comment = await circle_comments_collection.find_one({"id": comment_id})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Only author can delete comment")
    
    # Delete replies first
    await circle_comments_collection.delete_many({"parent_comment_id": comment_id})
    
    # Delete the comment
    await circle_comments_collection.delete_one({"id": comment_id})
    
    # Update post comment count
    await circle_posts_collection.update_one(
        {"id": comment["post_id"]},
        {"$inc": {"comments_count": -1 - comment.get("replies_count", 0)}}
    )
    
    # Update parent comment if this was a reply
    if comment.get("parent_comment_id"):
        await circle_comments_collection.update_one(
            {"id": comment["parent_comment_id"]},
            {"$inc": {"replies_count": -1}}
        )
    
    return {"success": True, "message": "Comment deleted"}

# ============== POST LIKE/SHARE APIS ==============

@app.post("/api/circles/posts/{post_id}/like")
async def toggle_like_post(post_id: str, user_id: str = Query(...)):
    """Toggle like on a post"""
    post = await circle_posts_collection.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if already liked
    existing_like = await circle_post_likes_collection.find_one({
        "post_id": post_id,
        "user_id": user_id
    })
    
    if existing_like:
        # Unlike
        await circle_post_likes_collection.delete_one({
            "post_id": post_id,
            "user_id": user_id
        })
        await circle_posts_collection.update_one(
            {"id": post_id},
            {"$inc": {"likes_count": -1}}
        )
        return {"success": True, "liked": False, "likes_count": post["likes_count"] - 1}
    else:
        # Like
        await circle_post_likes_collection.insert_one({
            "id": str(uuid.uuid4()),
            "post_id": post_id,
            "user_id": user_id,
            "created_at": datetime.utcnow()
        })
        await circle_posts_collection.update_one(
            {"id": post_id},
            {"$inc": {"likes_count": 1}}
        )
        return {"success": True, "liked": True, "likes_count": post["likes_count"] + 1}

@app.get("/api/circles/posts/{post_id}/like-status")
async def get_like_status(post_id: str, user_id: str = Query(...)):
    """Check if user has liked a post"""
    existing_like = await circle_post_likes_collection.find_one({
        "post_id": post_id,
        "user_id": user_id
    })
    
    return {"success": True, "liked": existing_like is not None}

@app.post("/api/circles/posts/{post_id}/share")
async def share_post(post_id: str, user_id: str = Query(...), platform: str = Query(default="copy")):
    """Track post share"""
    post = await circle_posts_collection.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Increment share count
    await circle_posts_collection.update_one(
        {"id": post_id},
        {"$inc": {"shares_count": 1}}
    )
    
    return {"success": True, "message": "Post shared", "platform": platform}

# ============== CHATROOM APIS ==============

@app.post("/api/circles/{circle_id}/chatrooms")
async def create_chatroom(
    circle_id: str,
    chatroom: ChatRoomCreate,
    user_id: str = Query(...),
    authorization: Optional[str] = Header(None)
):
    """Create a chatroom in a circle (only certified users)"""
    circle = await circles_collection.find_one({"id": circle_id})
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    # Check membership
    membership = await circle_members_collection.find_one({
        "circle_id": circle_id,
        "user_id": user_id
    })
    if not membership:
        raise HTTPException(status_code=403, detail="Must be a member to create chatroom")
    
    # Check chat permission (only certified users can create)
    auth_token = authorization[7:] if authorization and authorization.startswith("Bearer ") else None
    chat_perm = await check_chat_permission(user_id, auth_token)
    
    if not chat_perm["can_create_chatroom"]:
        raise HTTPException(
            status_code=403,
            detail=f"Your level ({chat_perm['user_level']}) cannot create chatrooms. Get certified first."
        )
    
    chatroom_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    chatroom_doc = {
        "id": chatroom_id,
        "circle_id": circle_id,
        "name": chatroom.name,
        "description": chatroom.description,
        "creator_id": user_id,
        "members": [user_id],
        "member_count": 1,
        "message_count": 0,
        "last_message_at": now,
        "created_at": now,
        "updated_at": now
    }
    
    await circle_chatrooms_collection.insert_one(chatroom_doc)
    
    chatroom_doc.pop("_id", None)
    chatroom_doc["created_at"] = chatroom_doc["created_at"].isoformat()
    chatroom_doc["updated_at"] = chatroom_doc["updated_at"].isoformat()
    chatroom_doc["last_message_at"] = chatroom_doc["last_message_at"].isoformat()
    
    return {"success": True, "chatroom": chatroom_doc}

@app.get("/api/circles/{circle_id}/chatrooms")
async def get_circle_chatrooms(circle_id: str, page: int = 1, limit: int = 20):
    """Get chatrooms in a circle (anyone can view)"""
    query = {"circle_id": circle_id}
    
    skip = (page - 1) * limit
    
    cursor = circle_chatrooms_collection.find(query).sort("last_message_at", -1).skip(skip).limit(limit)
    chatrooms = await cursor.to_list(length=limit)
    
    for chatroom in chatrooms:
        chatroom.pop("_id", None)
        if isinstance(chatroom.get("created_at"), datetime):
            chatroom["created_at"] = chatroom["created_at"].isoformat()
        if isinstance(chatroom.get("updated_at"), datetime):
            chatroom["updated_at"] = chatroom["updated_at"].isoformat()
        if isinstance(chatroom.get("last_message_at"), datetime):
            chatroom["last_message_at"] = chatroom["last_message_at"].isoformat()
    
    total = await circle_chatrooms_collection.count_documents(query)
    
    return {"success": True, "chatrooms": chatrooms, "total": total}

@app.post("/api/circles/chatrooms/{chatroom_id}/join")
async def join_chatroom(chatroom_id: str, user_id: str = Query(...)):
    """Join a chatroom"""
    chatroom = await circle_chatrooms_collection.find_one({"id": chatroom_id})
    if not chatroom:
        raise HTTPException(status_code=404, detail="Chatroom not found")
    
    # Check if user is member of the circle
    membership = await circle_members_collection.find_one({
        "circle_id": chatroom["circle_id"],
        "user_id": user_id
    })
    if not membership:
        raise HTTPException(status_code=403, detail="Must be a circle member to join chatroom")
    
    # Check if already a member
    if user_id in chatroom.get("members", []):
        return {"success": True, "message": "Already a member"}
    
    # Add to chatroom
    await circle_chatrooms_collection.update_one(
        {"id": chatroom_id},
        {
            "$push": {"members": user_id},
            "$inc": {"member_count": 1}
        }
    )
    
    return {"success": True, "message": "Joined chatroom"}

@app.post("/api/circles/chatrooms/{chatroom_id}/messages")
async def send_chat_message(
    chatroom_id: str,
    message: ChatMessageCreate,
    user_id: str = Query(...),
    authorization: Optional[str] = Header(None)
):
    """Send a message to chatroom (only certified users can post)"""
    chatroom = await circle_chatrooms_collection.find_one({"id": chatroom_id})
    if not chatroom:
        raise HTTPException(status_code=404, detail="Chatroom not found")
    
    # Check if user is member of chatroom
    if user_id not in chatroom.get("members", []):
        raise HTTPException(status_code=403, detail="Must join the chatroom first")
    
    # Check chat permission (only certified users can send messages)
    auth_token = authorization[7:] if authorization and authorization.startswith("Bearer ") else None
    chat_perm = await check_chat_permission(user_id, auth_token)
    
    if not chat_perm["can_chat"]:
        raise HTTPException(
            status_code=403,
            detail=f"Your level ({chat_perm['user_level']}) cannot send messages. Get Aspiring certification first."
        )
    
    message_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    # Extract mentions
    mentions = await extract_mentions(message.content)
    
    message_doc = {
        "id": message_id,
        "chatroom_id": chatroom_id,
        "circle_id": chatroom["circle_id"],
        "user_id": user_id,
        "content": message.content,
        "mentions": mentions,
        "created_at": now
    }
    
    await circle_chat_messages_collection.insert_one(message_doc)
    
    # Update chatroom stats
    await circle_chatrooms_collection.update_one(
        {"id": chatroom_id},
        {
            "$inc": {"message_count": 1},
            "$set": {"last_message_at": now}
        }
    )
    
    # Create notifications for mentions
    for mentioned_user in mentions:
        if mentioned_user in chatroom.get("members", []):
            await create_notification(
                user_id=mentioned_user,
                notification_type="chat_mention",
                title="You were mentioned in chat",
                message="Someone mentioned you in a chatroom",
                data={
                    "chatroom_id": chatroom_id,
                    "message_id": message_id,
                    "circle_id": chatroom["circle_id"],
                    "mentioned_by": user_id
                }
            )
    
    message_doc.pop("_id", None)
    message_doc["created_at"] = message_doc["created_at"].isoformat()
    
    return {"success": True, "message": message_doc}

@app.get("/api/circles/chatrooms/{chatroom_id}/messages")
async def get_chat_messages(
    chatroom_id: str,
    page: int = 1,
    limit: int = 50,
    before: Optional[str] = None  # For pagination (message ID)
):
    """Get messages from chatroom (anyone can view)"""
    query = {"chatroom_id": chatroom_id}
    
    skip = (page - 1) * limit
    
    cursor = circle_chat_messages_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    messages = await cursor.to_list(length=limit)
    
    for msg in messages:
        msg.pop("_id", None)
        if isinstance(msg.get("created_at"), datetime):
            msg["created_at"] = msg["created_at"].isoformat()
    
    # Reverse to show oldest first
    messages.reverse()
    
    total = await circle_chat_messages_collection.count_documents(query)
    
    return {"success": True, "messages": messages, "total": total}

@app.get("/api/circles/chatrooms/{chatroom_id}/check-permission")
async def check_chat_permission_api(
    chatroom_id: str,
    user_id: str = Query(...),
    authorization: Optional[str] = Header(None)
):
    """Check if user can send messages in chatroom"""
    chatroom = await circle_chatrooms_collection.find_one({"id": chatroom_id})
    if not chatroom:
        raise HTTPException(status_code=404, detail="Chatroom not found")
    
    is_member = user_id in chatroom.get("members", [])
    
    auth_token = authorization[7:] if authorization and authorization.startswith("Bearer ") else None
    chat_perm = await check_chat_permission(user_id, auth_token)
    
    return {
        "success": True,
        "is_chatroom_member": is_member,
        "can_send_messages": chat_perm["can_chat"] and is_member,
        "can_create_chatroom": chat_perm["can_create_chatroom"],
        "user_level": chat_perm["user_level"]
    }

# ============== NOTIFICATIONS APIS ==============

@app.get("/api/notifications")
async def get_notifications(user_id: str = Query(...), page: int = 1, limit: int = 20):
    """Get user notifications"""
    query = {"user_id": user_id}
    
    skip = (page - 1) * limit
    
    cursor = notifications_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    notifications = await cursor.to_list(length=limit)
    
    for notif in notifications:
        notif.pop("_id", None)
        if isinstance(notif.get("created_at"), datetime):
            notif["created_at"] = notif["created_at"].isoformat()
    
    total = await notifications_collection.count_documents(query)
    unread = await notifications_collection.count_documents({**query, "read": False})
    
    return {"success": True, "notifications": notifications, "total": total, "unread": unread}

@app.post("/api/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, user_id: str = Query(...)):
    """Mark notification as read"""
    await notifications_collection.update_one(
        {"id": notification_id, "user_id": user_id},
        {"$set": {"read": True}}
    )
    return {"success": True}

@app.post("/api/notifications/mark-all-read")
async def mark_all_notifications_read(user_id: str = Query(...)):
    """Mark all notifications as read"""
    await notifications_collection.update_many(
        {"user_id": user_id, "read": False},
        {"$set": {"read": True}}
    )
    return {"success": True}

# ============== CIRCLE CREATION PERMISSION CHECK ==============

@app.get("/api/circles/check-create-permission")
async def check_create_circle_permission(
    category: str = Query(...),
    user_id: str = Query(...),
    authorization: Optional[str] = Header(None)
):
    """Check if user can create a circle of specific category"""
    auth_token = authorization[7:] if authorization and authorization.startswith("Bearer ") else None
    permission = await check_circle_creation_permission(user_id, category, auth_token)
    
    return {
        "success": True,
        **permission
    }

# ============== WEBSOCKET CHAT ENDPOINT ==============

@app.websocket("/ws/chat/{chatroom_id}")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    chatroom_id: str,
    user_id: str = Query(...)
):
    """
    WebSocket endpoint for real-time chat in chatrooms.
    
    Connect with: ws://host/ws/chat/{chatroom_id}?user_id={user_id}
    
    Message format to send:
    {
        "type": "message",
        "content": "Hello world!"
    }
    
    Message format received:
    {
        "type": "message" | "system",
        "id": "uuid",
        "user_id": "user-id",
        "content": "message content",
        "mentions": [],
        "created_at": "iso-timestamp"
    }
    """
    # Verify chatroom exists
    chatroom = await circle_chatrooms_collection.find_one({"id": chatroom_id})
    if not chatroom:
        await websocket.close(code=4004, reason="Chatroom not found")
        return
    
    # Check if user is member of the circle
    membership = await circle_members_collection.find_one({
        "circle_id": chatroom["circle_id"],
        "user_id": user_id
    })
    if not membership:
        await websocket.close(code=4003, reason="Must be a circle member")
        return
    
    # Check if user is chatroom member, auto-join if not
    if user_id not in chatroom.get("members", []):
        await circle_chatrooms_collection.update_one(
            {"id": chatroom_id},
            {
                "$push": {"members": user_id},
                "$inc": {"member_count": 1}
            }
        )
    
    # Connect to chatroom
    await chat_manager.connect(websocket, chatroom_id, user_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            if data.get("type") == "message":
                content = data.get("content", "").strip()
                if not content:
                    continue
                
                # Check chat permission
                chat_perm = await check_chat_permission(user_id, None)
                if not chat_perm["can_chat"]:
                    await websocket.send_json({
                        "type": "error",
                        "message": f"Your level ({chat_perm['user_level']}) cannot send messages. Get Aspiring certification first."
                    })
                    continue
                
                # Extract mentions
                mentions = await extract_mentions(content)
                
                # Create message in database
                message_id = str(uuid.uuid4())
                now = datetime.utcnow()
                
                message_doc = {
                    "id": message_id,
                    "chatroom_id": chatroom_id,
                    "circle_id": chatroom["circle_id"],
                    "user_id": user_id,
                    "content": content,
                    "mentions": mentions,
                    "created_at": now
                }
                
                await circle_chat_messages_collection.insert_one(message_doc)
                
                # Update chatroom stats
                await circle_chatrooms_collection.update_one(
                    {"id": chatroom_id},
                    {
                        "$inc": {"message_count": 1},
                        "$set": {"last_message_at": now}
                    }
                )
                
                # Broadcast message to all connected clients
                broadcast_msg = {
                    "type": "message",
                    "id": message_id,
                    "user_id": user_id,
                    "content": content,
                    "mentions": mentions,
                    "created_at": now.isoformat()
                }
                
                await chat_manager.broadcast_message(chatroom_id, broadcast_msg)
                
                # Create notifications for mentioned users
                for mentioned_user in mentions:
                    if mentioned_user != user_id:
                        await create_notification(
                            user_id=mentioned_user,
                            notification_type="chat_mention",
                            title="You were mentioned in chat",
                            message="Someone mentioned you in a chatroom",
                            data={
                                "chatroom_id": chatroom_id,
                                "message_id": message_id,
                                "circle_id": chatroom["circle_id"],
                                "mentioned_by": user_id
                            }
                        )
            
            elif data.get("type") == "typing":
                # Broadcast typing indicator
                await chat_manager.broadcast_message(chatroom_id, {
                    "type": "typing",
                    "user_id": user_id,
                    "is_typing": data.get("is_typing", False)
                })
            
            elif data.get("type") == "ping":
                # Respond to ping to keep connection alive
                await websocket.send_json({"type": "pong"})
                
    except WebSocketDisconnect:
        chatroom_id, user_id = chat_manager.disconnect(websocket)
        if chatroom_id:
            await chat_manager.broadcast_system_message(
                chatroom_id,
                f"User {user_id[:8]} left the chat"
            )
    except Exception as e:
        print(f"WebSocket error: {e}")
        chat_manager.disconnect(websocket)

@app.get("/api/circles/chatrooms/{chatroom_id}/online-users")
async def get_chatroom_online_users(chatroom_id: str):
    """Get list of online users in a chatroom"""
    online_users = chat_manager.get_online_users(chatroom_id)
    return {
        "success": True,
        "online_users": online_users,
        "count": len(online_users)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

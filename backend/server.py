from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import os
import uuid
import httpx
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(title="CNESS Circles API")

# CORS configuration - Allow all origins for the circles API
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
provinces_collection = db.provinces

# External API base URL (UAT)
EXTERNAL_API_BASE = os.environ.get("EXTERNAL_API_BASE", "https://uatapi.cness.io")

# ============== LOCATION DATA ==============

# Country and province data
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

# Default interests list
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
    scope: str  # local, national, global
    category: str  # profession, interest, living, news
    image_url: Optional[str] = None
    country: Optional[str] = None
    province: Optional[str] = None  # For local circles
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

class BulkCircleCreate(BaseModel):
    country: str
    create_national: bool = True
    create_local: bool = True
    create_for_professions: bool = True
    create_for_interests: bool = True

class UserLocation(BaseModel):
    country: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None

# ============== HELPER FUNCTIONS ==============

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
                # Handle different response formats
                if isinstance(data, list):
                    return data
                elif isinstance(data, dict) and "data" in data:
                    return data["data"]
                elif isinstance(data, dict) and "professions" in data:
                    return data["professions"]
                return []
    except Exception as e:
        print(f"Error fetching professions: {e}")
    
    # Return default professions if API fails
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

def generate_circle_image(category: str, name: str) -> str:
    """Generate a relevant Unsplash image URL based on category"""
    search_terms = {
        "profession": ["office", "workplace", "professional", "business"],
        "interest": ["nature", "meditation", "creative", "community"],
        "living": ["lifestyle", "mindful", "peaceful", "growth"],
        "news": ["conference", "event", "meeting", "gathering"]
    }
    
    import hashlib
    seed = hashlib.md5(name.encode()).hexdigest()[:8]
    terms = search_terms.get(category, ["community"])
    term = terms[hash(name) % len(terms)]
    
    return f"https://images.unsplash.com/photo-{seed}?w=400&q=80&fit=crop&auto=format"

def get_unsplash_url(query: str, seed: str = None) -> str:
    """Get Unsplash image URL"""
    if seed:
        return f"https://source.unsplash.com/400x400/?{query}&sig={seed}"
    return f"https://source.unsplash.com/400x400/?{query}"

# ============== CIRCLE APIS ==============

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
async def create_circle(circle: CircleCreate, user_id: str = Query(...)):
    """Create a new circle"""
    circle_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    # Generate image if not provided
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
        "is_featured": False,
        "created_at": now,
        "updated_at": now
    }
    
    await circles_collection.insert_one(circle_doc)
    
    # Auto-join creator as admin
    membership = {
        "id": str(uuid.uuid4()),
        "circle_id": circle_id,
        "user_id": user_id,
        "role": "admin",
        "joined_at": now
    }
    await circle_members_collection.insert_one(membership)
    
    # Remove MongoDB _id for response
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
    """Get circles with filters including location-based filtering"""
    query = {}
    
    if scope:
        query["scope"] = scope
    if category:
        query["category"] = category
    if country:
        query["country"] = country
    if province:
        # For local scope, filter by province
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
    
    # Sorting
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
    """Get circles based on user's location - local, national, and global"""
    queries = []
    
    # Local circles (province/state level)
    if province:
        local_query = {"scope": "local", "province": province}
        if category:
            local_query["category"] = category
        queries.append(local_query)
    
    # National circles
    if include_national:
        national_query = {"scope": "national", "country": country}
        if category:
            national_query["category"] = category
        queries.append(national_query)
    
    # Global circles
    if include_global:
        global_query = {"scope": "global"}
        if category:
            global_query["category"] = category
        queries.append(global_query)
    
    # Combine queries with OR
    if queries:
        final_query = {"$or": queries}
    else:
        final_query = {}
    
    skip = (page - 1) * limit
    
    cursor = circles_collection.find(final_query).sort("member_count", -1).skip(skip).limit(limit)
    circles = await cursor.to_list(length=limit)
    
    for circle in circles:
        circle.pop("_id", None)
        if isinstance(circle.get("created_at"), datetime):
            circle["created_at"] = circle["created_at"].isoformat()
        if isinstance(circle.get("updated_at"), datetime):
            circle["updated_at"] = circle["updated_at"].isoformat()
    
    # Group by scope for easier frontend handling
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
    """Get featured circles for carousel"""
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
        # Check if user is admin
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
    
    return {"success": True, "message": "Circle deleted"}

# ============== MEMBERSHIP APIS ==============

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
        # Check if there are other admins
        admin_count = await circle_members_collection.count_documents({
            "circle_id": circle_id, 
            "role": "admin"
        })
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot leave. Transfer admin role first or delete the circle.")
    
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

# ============== CIRCLE POSTS APIS ==============

@app.post("/api/circles/{circle_id}/posts")
async def create_circle_post(circle_id: str, post: CirclePostCreate, user_id: str = Query(...)):
    """Create a post in a circle"""
    circle = await circles_collection.find_one({"id": circle_id})
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    # Check membership
    membership = await circle_members_collection.find_one({"circle_id": circle_id, "user_id": user_id})
    if not membership:
        raise HTTPException(status_code=403, detail="Must be a member to post. Please join the circle first.")
    
    post_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    post_doc = {
        "id": post_id,
        "circle_id": circle_id,
        "user_id": user_id,
        "content": post.content,
        "media_urls": post.media_urls or [],
        "post_type": post.post_type,
        "likes_count": 0,
        "comments_count": 0,
        "created_at": now,
        "updated_at": now
    }
    
    await circle_posts_collection.insert_one(post_doc)
    
    # Update circle stats
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
    limit: int = 20
):
    """Get posts in a circle"""
    query = {"circle_id": circle_id}
    
    if post_type:
        query["post_type"] = post_type
    
    skip = (page - 1) * limit
    
    cursor = circle_posts_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    posts = await cursor.to_list(length=limit)
    
    for post in posts:
        post.pop("_id", None)
        if isinstance(post.get("created_at"), datetime):
            post["created_at"] = post["created_at"].isoformat()
        if isinstance(post.get("updated_at"), datetime):
            post["updated_at"] = post["updated_at"].isoformat()
    
    total = await circle_posts_collection.count_documents(query)
    
    return {"success": True, "posts": posts, "total": total}

@app.get("/api/circles/posts/feed")
async def get_circles_feed(user_id: str = Query(...), page: int = 1, limit: int = 20):
    """Get feed of posts from all circles user has joined"""
    memberships = await circle_members_collection.find({"user_id": user_id}).to_list(length=100)
    circle_ids = [m["circle_id"] for m in memberships]
    
    if not circle_ids:
        return {"success": True, "posts": [], "total": 0}
    
    skip = (page - 1) * limit
    
    cursor = circle_posts_collection.find({"circle_id": {"$in": circle_ids}}).sort("created_at", -1).skip(skip).limit(limit)
    posts = await cursor.to_list(length=limit)
    
    # Enrich posts with circle info
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
    
    total = await circle_posts_collection.count_documents({"circle_id": {"$in": circle_ids}})
    
    return {"success": True, "posts": posts, "total": total}

@app.post("/api/circles/posts/{post_id}/like")
async def like_circle_post(post_id: str, user_id: str = Query(...)):
    """Like a circle post"""
    post = await circle_posts_collection.find_one({"id": post_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    await circle_posts_collection.update_one(
        {"id": post_id},
        {"$inc": {"likes_count": 1}}
    )
    
    return {"success": True, "message": "Post liked"}

@app.delete("/api/circles/posts/{post_id}")
async def delete_circle_post(post_id: str, user_id: str = Query(...)):
    """Delete a circle post"""
    post = await circle_posts_collection.find_one({"id": post_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Only author can delete post")
    
    await circle_posts_collection.delete_one({"id": post_id})
    
    await circles_collection.update_one(
        {"id": post["circle_id"]},
        {"$inc": {"post_count": -1}}
    )
    
    return {"success": True, "message": "Post deleted"}

# ============== BULK CIRCLE CREATION APIs ==============

@app.post("/api/circles/generate/for-country")
async def generate_circles_for_country(
    request: BulkCircleCreate,
    user_id: str = Query(default="system"),
    auth_token: Optional[str] = Query(default=None)
):
    """
    Generate circles for a country - creates national and local circles 
    for all professions and interests
    """
    country = request.country
    
    if country not in COUNTRIES_DATA:
        raise HTTPException(status_code=400, detail=f"Country '{country}' not supported. Available: {list(COUNTRIES_DATA.keys())}")
    
    country_data = COUNTRIES_DATA[country]
    provinces = country_data["provinces"]
    
    # Get professions from external API or use defaults
    professions = await get_professions_from_external_api(auth_token) if request.create_for_professions else []
    interests = DEFAULT_INTERESTS if request.create_for_interests else []
    
    created_circles = []
    now = datetime.utcnow()
    
    # Create Global circles (if not already existing)
    if request.create_for_professions:
        for prof in professions:
            prof_id = prof.get("_id") or prof.get("id")
            prof_name = prof.get("name") or prof.get("title", "Unknown")
            
            # Check if global circle exists
            existing = await circles_collection.find_one({
                "scope": "global",
                "category": "profession",
                "profession_id": prof_id
            })
            
            if not existing:
                circle_doc = {
                    "id": str(uuid.uuid4()),
                    "name": f"Global {prof_name}s",
                    "description": f"A worldwide community for {prof_name}s to connect, share insights, and grow together.",
                    "intention": f"Unite {prof_name}s globally",
                    "scope": "global",
                    "category": "profession",
                    "image_url": get_unsplash_url(prof_name.lower().replace(" ", "+")),
                    "country": None,
                    "province": None,
                    "profession_id": prof_id,
                    "interest_id": None,
                    "creator_id": user_id,
                    "member_count": 0,
                    "active_today": 0,
                    "online_now": 0,
                    "post_count": 0,
                    "is_featured": False,
                    "created_at": now,
                    "updated_at": now
                }
                await circles_collection.insert_one(circle_doc)
                created_circles.append({"scope": "global", "name": circle_doc["name"]})
    
    if request.create_for_interests:
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
                    "interest_id": interest_id,
                    "creator_id": user_id,
                    "member_count": 0,
                    "active_today": 0,
                    "online_now": 0,
                    "post_count": 0,
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
                prof_id = prof.get("_id") or prof.get("id")
                prof_name = prof.get("name") or prof.get("title", "Unknown")
                
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
                        "description": f"A community for {prof_name}s in {country} to connect and collaborate.",
                        "intention": f"Connect {prof_name}s in {country}",
                        "scope": "national",
                        "category": "profession",
                        "image_url": get_unsplash_url(f"{prof_name}+{country}".lower().replace(" ", "+")),
                        "country": country,
                        "province": None,
                        "profession_id": prof_id,
                        "interest_id": None,
                        "creator_id": user_id,
                        "member_count": 0,
                        "active_today": 0,
                        "online_now": 0,
                        "post_count": 0,
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
                        "interest_id": interest_id,
                        "creator_id": user_id,
                        "member_count": 0,
                        "active_today": 0,
                        "online_now": 0,
                        "post_count": 0,
                        "is_featured": False,
                        "created_at": now,
                        "updated_at": now
                    }
                    await circles_collection.insert_one(circle_doc)
                    created_circles.append({"scope": "national", "country": country, "name": circle_doc["name"]})
    
    # Create Local circles (province level)
    if request.create_local:
        for province in provinces:
            if request.create_for_professions:
                for prof in professions:
                    prof_id = prof.get("_id") or prof.get("id")
                    prof_name = prof.get("name") or prof.get("title", "Unknown")
                    
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
                            "interest_id": None,
                            "creator_id": user_id,
                            "member_count": 0,
                            "active_today": 0,
                            "online_now": 0,
                            "post_count": 0,
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
                            "interest_id": interest_id,
                            "creator_id": user_id,
                            "member_count": 0,
                            "active_today": 0,
                            "online_now": 0,
                            "post_count": 0,
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
        "circles_created": created_circles[:50]  # Return first 50 for preview
    }

@app.post("/api/circles/generate/all-countries")
async def generate_circles_for_all_countries(
    user_id: str = Query(default="system"),
    auth_token: Optional[str] = Query(default=None),
    create_local: bool = Query(default=False)  # Local creation is expensive
):
    """Generate circles for all supported countries"""
    results = {}
    
    for country in COUNTRIES_DATA.keys():
        request = BulkCircleCreate(
            country=country,
            create_national=True,
            create_local=create_local,
            create_for_professions=True,
            create_for_interests=True
        )
        
        result = await generate_circles_for_country(request, user_id, auth_token)
        results[country] = {
            "created_count": result["created_count"],
            "message": result["message"]
        }
    
    total_created = sum(r["created_count"] for r in results.values())
    
    return {
        "success": True,
        "message": f"Generated circles for {len(results)} countries. Total circles created: {total_created}",
        "results": results,
        "total_created": total_created
    }

@app.get("/api/circles/stats")
async def get_circles_stats():
    """Get statistics about circles in the system"""
    total_circles = await circles_collection.count_documents({})
    global_circles = await circles_collection.count_documents({"scope": "global"})
    national_circles = await circles_collection.count_documents({"scope": "national"})
    local_circles = await circles_collection.count_documents({"scope": "local"})
    
    profession_circles = await circles_collection.count_documents({"category": "profession"})
    interest_circles = await circles_collection.count_documents({"category": "interest"})
    
    total_members = await circle_members_collection.count_documents({})
    total_posts = await circle_posts_collection.count_documents({})
    
    # Get circles by country
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
            "by_country": {item["_id"]: item["count"] for item in by_country}
        }
    }

# ============== SEED DATA ==============

@app.post("/api/circles/seed")
async def seed_circles():
    """Seed sample circles for demo"""
    # Clear existing
    await circles_collection.delete_many({})
    await circle_members_collection.delete_many({})
    await circle_posts_collection.delete_many({})
    
    now = datetime.utcnow()
    
    sample_circles = [
        {
            "id": str(uuid.uuid4()),
            "name": "Art Directors India",
            "description": "A community for Art Directors across India to share work, discuss trends, and collaborate on projects.",
            "intention": "Connect and inspire Indian Art Directors",
            "scope": "national",
            "category": "profession",
            "image_url": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
            "country": "India",
            "province": None,
            "profession_id": "art-director",
            "interest_id": None,
            "creator_id": "system",
            "member_count": 1250,
            "active_today": 89,
            "online_now": 23,
            "post_count": 456,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Global Art Directors",
            "description": "The worldwide community for Art Directors to network, share insights, and grow together.",
            "intention": "Unite Art Directors globally",
            "scope": "global",
            "category": "profession",
            "image_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
            "country": None,
            "province": None,
            "profession_id": "art-director",
            "interest_id": None,
            "creator_id": "system",
            "member_count": 5420,
            "active_today": 312,
            "online_now": 87,
            "post_count": 2341,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Tech Entrepreneurs Maharashtra",
            "description": "Local community for tech entrepreneurs in Maharashtra to network and share resources.",
            "intention": "Build Maharashtra's tech ecosystem",
            "scope": "local",
            "category": "profession",
            "image_url": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400",
            "country": "India",
            "province": "Maharashtra",
            "profession_id": "entrepreneur",
            "interest_id": None,
            "creator_id": "system",
            "member_count": 890,
            "active_today": 45,
            "online_now": 12,
            "post_count": 234,
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Mindfulness & Meditation",
            "description": "A space for mindfulness practitioners to share experiences, techniques, and support each other.",
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
            "is_featured": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "name": "UX Designers Canada",
            "description": "Canadian UX designers community for sharing work and industry insights.",
            "intention": "Connect Canadian UX talent",
            "scope": "national",
            "category": "profession",
            "image_url": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400",
            "country": "Canada",
            "province": None,
            "profession_id": "ux-designer",
            "interest_id": None,
            "creator_id": "system",
            "member_count": 2340,
            "active_today": 156,
            "online_now": 34,
            "post_count": 876,
            "is_featured": False,
            "created_at": now,
            "updated_at": now
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Software Engineers Ontario",
            "description": "Local community for software engineers in Ontario.",
            "intention": "Build Ontario's tech community",
            "scope": "local",
            "category": "profession",
            "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
            "country": "Canada",
            "province": "Ontario",
            "profession_id": "software-engineer",
            "interest_id": None,
            "creator_id": "system",
            "member_count": 1560,
            "active_today": 89,
            "online_now": 23,
            "post_count": 432,
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

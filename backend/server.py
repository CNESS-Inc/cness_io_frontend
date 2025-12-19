from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import os
import uuid
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(title="CNESS Circles API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.cness_circles

# Collections
circles_collection = db.circles
circle_members_collection = db.circle_members
circle_posts_collection = db.circle_posts

# ============== MODELS ==============

class CircleCreate(BaseModel):
    name: str
    description: str
    intention: str  # One-line purpose
    scope: str  # local, national, global
    category: str  # profession, interest, living, news
    image_url: Optional[str] = None
    country: Optional[str] = None  # For national circles
    city: Optional[str] = None  # For local circles
    profession_id: Optional[str] = None
    interest_id: Optional[str] = None

class CircleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    intention: Optional[str] = None
    image_url: Optional[str] = None

class CirclePostCreate(BaseModel):
    circle_id: str
    content: str
    media_urls: Optional[List[str]] = []
    post_type: str = "regular"  # regular, prompt, resource

class CirclePostUpdate(BaseModel):
    content: Optional[str] = None
    media_urls: Optional[List[str]] = None

# ============== CIRCLE APIS ==============

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "CNESS Circles API is running"}

@app.post("/api/circles")
async def create_circle(circle: CircleCreate, user_id: str = Query(...)):
    """Create a new circle"""
    circle_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    circle_doc = {
        "id": circle_id,
        "name": circle.name,
        "description": circle.description,
        "intention": circle.intention,
        "scope": circle.scope,
        "category": circle.category,
        "image_url": circle.image_url or f"https://picsum.photos/seed/{circle_id}/400/400",
        "country": circle.country,
        "city": circle.city,
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
    
    # Auto-join creator as member
    membership = {
        "id": str(uuid.uuid4()),
        "circle_id": circle_id,
        "user_id": user_id,
        "role": "admin",
        "joined_at": now
    }
    await circle_members_collection.insert_one(membership)
    
    return {"success": True, "circle": circle_doc}

@app.get("/api/circles")
async def get_circles(
    scope: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "popular",
    page: int = 1,
    limit: int = 20
):
    """Get all circles with filters"""
    query = {}
    
    if scope:
        query["scope"] = scope
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    # Sorting
    sort_field = {"popular": "member_count", "active": "active_today", "newest": "created_at"}
    sort_order = -1
    
    skip = (page - 1) * limit
    
    cursor = circles_collection.find(query).sort(sort_field.get(sort, "member_count"), sort_order).skip(skip).limit(limit)
    circles = await cursor.to_list(length=limit)
    
    # Convert ObjectId and datetime
    for circle in circles:
        circle.pop("_id", None)
        if "created_at" in circle:
            circle["created_at"] = circle["created_at"].isoformat()
        if "updated_at" in circle:
            circle["updated_at"] = circle["updated_at"].isoformat()
    
    total = await circles_collection.count_documents(query)
    
    return {
        "success": True,
        "circles": circles,
        "total": total,
        "page": page,
        "limit": limit
    }

@app.get("/api/circles/featured")
async def get_featured_circles(limit: int = 5):
    """Get featured circles for carousel"""
    cursor = circles_collection.find({"is_featured": True}).sort("member_count", -1).limit(limit)
    circles = await cursor.to_list(length=limit)
    
    # If not enough featured, get popular ones
    if len(circles) < limit:
        remaining = limit - len(circles)
        existing_ids = [c["id"] for c in circles]
        cursor = circles_collection.find({"id": {"$nin": existing_ids}}).sort("member_count", -1).limit(remaining)
        more_circles = await cursor.to_list(length=remaining)
        circles.extend(more_circles)
    
    for circle in circles:
        circle.pop("_id", None)
        if "created_at" in circle:
            circle["created_at"] = circle["created_at"].isoformat()
        if "updated_at" in circle:
            circle["updated_at"] = circle["updated_at"].isoformat()
    
    return {"success": True, "circles": circles}

@app.get("/api/circles/{circle_id}")
async def get_circle(circle_id: str):
    """Get single circle details"""
    circle = await circles_collection.find_one({"id": circle_id})
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    circle.pop("_id", None)
    if "created_at" in circle:
        circle["created_at"] = circle["created_at"].isoformat()
    if "updated_at" in circle:
        circle["updated_at"] = circle["updated_at"].isoformat()
    
    return {"success": True, "circle": circle}

@app.patch("/api/circles/{circle_id}")
async def update_circle(circle_id: str, updates: CircleUpdate, user_id: str = Query(...)):
    """Update circle details"""
    circle = await circles_collection.find_one({"id": circle_id})
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    if circle["creator_id"] != user_id:
        raise HTTPException(status_code=403, detail="Only creator can update circle")
    
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
        raise HTTPException(status_code=400, detail="Already a member")
    
    membership = {
        "id": str(uuid.uuid4()),
        "circle_id": circle_id,
        "user_id": user_id,
        "role": "member",
        "joined_at": datetime.utcnow()
    }
    await circle_members_collection.insert_one(membership)
    
    # Update member count
    await circles_collection.update_one(
        {"id": circle_id},
        {"$inc": {"member_count": 1}}
    )
    
    return {"success": True, "message": "Joined circle"}

@app.post("/api/circles/{circle_id}/leave")
async def leave_circle(circle_id: str, user_id: str = Query(...)):
    """Leave a circle"""
    membership = await circle_members_collection.find_one({"circle_id": circle_id, "user_id": user_id})
    
    if not membership:
        raise HTTPException(status_code=400, detail="Not a member")
    
    if membership["role"] == "admin":
        raise HTTPException(status_code=400, detail="Admin cannot leave. Transfer ownership first.")
    
    await circle_members_collection.delete_one({"circle_id": circle_id, "user_id": user_id})
    
    await circles_collection.update_one(
        {"id": circle_id},
        {"$inc": {"member_count": -1}}
    )
    
    return {"success": True, "message": "Left circle"}

@app.get("/api/circles/{circle_id}/members")
async def get_circle_members(circle_id: str, page: int = 1, limit: int = 20):
    """Get circle members"""
    skip = (page - 1) * limit
    
    cursor = circle_members_collection.find({"circle_id": circle_id}).skip(skip).limit(limit)
    members = await cursor.to_list(length=limit)
    
    for member in members:
        member.pop("_id", None)
        if "joined_at" in member:
            member["joined_at"] = member["joined_at"].isoformat()
    
    total = await circle_members_collection.count_documents({"circle_id": circle_id})
    
    return {"success": True, "members": members, "total": total}

@app.get("/api/circles/user/{user_id}")
async def get_user_circles(user_id: str):
    """Get circles a user has joined"""
    memberships = await circle_members_collection.find({"user_id": user_id}).to_list(length=100)
    circle_ids = [m["circle_id"] for m in memberships]
    
    circles = await circles_collection.find({"id": {"$in": circle_ids}}).to_list(length=100)
    
    for circle in circles:
        circle.pop("_id", None)
        if "created_at" in circle:
            circle["created_at"] = circle["created_at"].isoformat()
        if "updated_at" in circle:
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
        raise HTTPException(status_code=403, detail="Must be a member to post")
    
    post_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    post_doc = {
        "id": post_id,
        "circle_id": circle_id,
        "user_id": user_id,
        "content": post.content,
        "media_urls": post.media_urls,
        "post_type": post.post_type,
        "likes_count": 0,
        "comments_count": 0,
        "created_at": now,
        "updated_at": now
    }
    
    await circle_posts_collection.insert_one(post_doc)
    
    # Update circle post count and activity
    await circles_collection.update_one(
        {"id": circle_id},
        {"$inc": {"post_count": 1, "active_today": 1}}
    )
    
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
        if "created_at" in post:
            post["created_at"] = post["created_at"].isoformat()
        if "updated_at" in post:
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
        if "created_at" in post:
            post["created_at"] = post["created_at"].isoformat()
        if "updated_at" in post:
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

# ============== SEED DATA ==============

@app.post("/api/circles/seed")
async def seed_circles():
    """Seed sample circles for demo"""
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
            "city": None,
            "profession_id": "art-director",
            "interest_id": None,
            "creator_id": "system",
            "member_count": 1250,
            "active_today": 89,
            "online_now": 23,
            "post_count": 456,
            "is_featured": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
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
            "city": None,
            "profession_id": "art-director",
            "interest_id": None,
            "creator_id": "system",
            "member_count": 5420,
            "active_today": 312,
            "online_now": 87,
            "post_count": 2341,
            "is_featured": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
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
            "city": None,
            "profession_id": None,
            "interest_id": "mindfulness",
            "creator_id": "system",
            "member_count": 8930,
            "active_today": 567,
            "online_now": 145,
            "post_count": 4521,
            "is_featured": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Tech Entrepreneurs Mumbai",
            "description": "Local community for tech entrepreneurs in Mumbai to network and share resources.",
            "intention": "Build Mumbai's tech ecosystem",
            "scope": "local",
            "category": "profession",
            "image_url": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400",
            "country": "India",
            "city": "Mumbai",
            "profession_id": "entrepreneur",
            "interest_id": None,
            "creator_id": "system",
            "member_count": 890,
            "active_today": 45,
            "online_now": 12,
            "post_count": 234,
            "is_featured": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Living: Conscious Leadership",
            "description": "Explore what it means to lead with consciousness and purpose in today's world.",
            "intention": "Transform leadership paradigms",
            "scope": "global",
            "category": "living",
            "image_url": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
            "country": None,
            "city": None,
            "profession_id": None,
            "interest_id": "leadership",
            "creator_id": "system",
            "member_count": 3450,
            "active_today": 198,
            "online_now": 56,
            "post_count": 1234,
            "is_featured": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sustainable Living India",
            "description": "Share tips, products, and lifestyle changes for sustainable living in India.",
            "intention": "Make sustainability accessible",
            "scope": "national",
            "category": "interest",
            "image_url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
            "country": "India",
            "city": None,
            "profession_id": None,
            "interest_id": "sustainability",
            "creator_id": "system",
            "member_count": 2340,
            "active_today": 123,
            "online_now": 34,
            "post_count": 876,
            "is_featured": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "UX Designers Global",
            "description": "A worldwide community for UX designers to share work, get feedback, and discuss industry trends.",
            "intention": "Design better experiences together",
            "scope": "global",
            "category": "profession",
            "image_url": "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400",
            "country": None,
            "city": None,
            "profession_id": "ux-designer",
            "interest_id": None,
            "creator_id": "system",
            "member_count": 7650,
            "active_today": 432,
            "online_now": 98,
            "post_count": 3456,
            "is_featured": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "News & Events: Consciousness Summit",
            "description": "Updates and discussions about consciousness-related events, conferences, and news.",
            "intention": "Stay informed on consciousness events",
            "scope": "global",
            "category": "news",
            "image_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
            "country": None,
            "city": None,
            "profession_id": None,
            "interest_id": None,
            "creator_id": "system",
            "member_count": 4320,
            "active_today": 234,
            "online_now": 67,
            "post_count": 1890,
            "is_featured": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Clear existing and insert new
    await circles_collection.delete_many({})
    await circles_collection.insert_many(sample_circles)
    
    return {"success": True, "message": f"Seeded {len(sample_circles)} circles"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

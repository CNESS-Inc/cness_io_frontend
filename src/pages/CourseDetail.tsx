import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { AddProductToCollection, CreateCollectionList, GetCollectionList, GetContinueWatchingProductById, GetLibraryrDetailsById } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import ContentTabs from "../components/MarketPlace/library/ContentTabs";
import OverviewTab from "../components/MarketPlace/library/OverviewTab";
import StoryTellingTab from "../components/MarketPlace/library/StoryTellingTab";
import ReviewsTab from "../components/MarketPlace/library/ReviewsTab";
import ContentList from "../components/MarketPlace/library/ContentList";
import VideoDisplay from "../components/MarketPlace/library/VideoDisplay";
import MusicDisplay from "../components/MarketPlace/library/MusicDisplay";
import { X } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";

type SaveToCollectionsModalProps = {
  open: boolean;
  closeModal: () => void;
  collections: any[];
  onAddToCollection: (collectionId: string) => void;
  onCreateCollection: (name: string) => void;
  productThumbnail: string;
};
// ----------------- SaveToCollectionsModal Component -----------------
function SaveToCollectionsModal({
  open,
  closeModal,
  collections,
  onAddToCollection,
  onCreateCollection,
  productThumbnail
}: SaveToCollectionsModalProps) {
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!newCollectionName.trim()) return;

    setIsCreating(true);
    await onCreateCollection(newCollectionName);
    setNewCollectionName("");
    setShowCreateInput(false);
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button className="absolute top-3 right-3 text-2xl text-black-400 hover:text-black-600" onClick={closeModal}>
          &times;
        </button>
        <h2 className="text-xl font-semibold text-center font-poppins mb-6">Save to My Collection</h2>
        <div className="flex flex-col gap-6 mb-5">
          {collections.map((col) => (
            <div key={col.name} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={col.thumbnail_url || productThumbnail || "https://via.placeholder.com/64"}
                  alt={col.name}
                  className="w-16 h-12 rounded-md object-cover"
                />
                <span className="text-lg font-medium">{col.name}</span>
              </div>
              <button
                onClick={() => onAddToCollection(col.id)}
                className="rounded-full border border-slate-400 p-1 hover:bg-slate-100 transition-all flex items-center justify-center"
              >
                <AiOutlinePlus className="text-xl font-bold text-[#000000]" />
              </button>
            </div>
          ))}
        </div>
        {showCreateInput ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Enter collection name"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 font-[Open_Sans]"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              />
              <button
                onClick={() => {
                  setShowCreateInput(false);
                  setNewCollectionName("");
                }}
                className="p-2 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>
            <button
              onClick={handleCreate}
              disabled={!newCollectionName.trim() || isCreating}
              className="w-full py-2 px-4 rounded-lg bg-[#7077FE] text-white font-semibold hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition font-[Poppins]"
            >
              {isCreating ? "Creating..." : "Create Collection"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCreateInput(true)}
            className="py-2 px-4 rounded-md bg-[#7077FE] text-white font-semibold hover:bg-[#6D28D9] mt-2 flex items-center justify-center gap-2 text-sm mx-auto font-[Poppins]"
          >
            <span className="inline-flex items-center justify-center rounded-full bg-white text-[#7077FE] w-6 h-6">
              <AiOutlinePlus size={18} />
            </span>
            Add new collection
          </button>
        )}
      </div>
    </div>
  );
}

// ----------------- Main CourseDetail Component -----------------
export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<any>('overview');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);
  const [activeFile, setActiveFile] = useState<any>(null);
  const [activeContent, setActiveContent] = useState<any>(null);
  const [productProgress, setProductProgress] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
      fetchProductProgress();
      fetchCollections();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    try {
      const response = await GetLibraryrDetailsById(id);
      const data = response?.data?.data?.product;
      console.log("📦 Product Data:", data);
      console.log("📂 Contents:", data?.contents);
      console.log("🎬 Category:", data?.category?.slug);
      console.log("🎥 Available fields:", {
        hasContent: !!data?.content,
        content: data?.content,
        hasFileUrl: !!data?.file_url,
        file_url: data?.file_url,
        hasVideoUrl: !!data?.video_url,
        video_url: data?.video_url,
        id: data?.id,
        title: data?.title
      });
      setProductData(data);

      // Auto-select first file from first content
      if (data?.contents?.[0]?.files?.[0]) {
        console.log("✅ Setting activeFile and activeContent from contents");
        setActiveFile(data.contents[0].files[0]);
        setActiveContent(data.contents[0]);
      } else if (data?.category?.slug === "video") {
        // Video products don't have contents/files structure - create mock objects
        console.log("✅ Creating mock file/content for video product");
        console.log("🔍 product_type_details:", data?.product_type_details);

        // Use video_files from product_type_details for single video products
        const videoUrl = data?.product_type_details?.video_files || data?.content || data?.file_url || data?.video_url || "";
        console.log("🔍 videoUrl extracted:", videoUrl);

        const mockFile = {
          file_id: data?.id || `video-${Date.now()}`,
          title: data?.title || "Video",
          file_url: videoUrl,
          file_type: "video",
          duration: data?.duration
        };
        const mockContent = {
          content_id: `${data?.id}-content` || `content-${Date.now()}`,
          title: data?.title || "Video Content",
          content_type: "video"
        };
        console.log("📝 Created mock file:", mockFile);
        console.log("📝 Created mock content:", mockContent);
        setActiveFile(mockFile);
        setActiveContent(mockContent);
      } else {
        console.warn("⚠️ No contents/files found in product data");
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to load product details",
        type: "error",
        duration: 3000,
      });
      navigate("/dashboard/library");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductProgress = async () => {
    try {
      const response = await GetContinueWatchingProductById(id);
      setProductProgress(response?.data?.data);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await GetCollectionList();
      setCollections(response?.data?.data?.collections || []);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };

  const handleTrackSelect = (file: any, content: any) => {
    setActiveFile(file);
    setActiveContent(content);
  };

  const handleAddToCollection = async (collectionId: string) => {
    try {
      await AddProductToCollection(collectionId, {
        product_id: id
      });

      showToast({
        message: "Added to collection successfully!",
        type: "success",
        duration: 3000,
      });

      setShowModal(false);
      fetchCollections();
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to add to collection",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleCreateCollection = async (name: string) => {
    try {
      const response = await CreateCollectionList({
        name: name,
        description: `Collection for ${productData?.category?.name || 'products'}`,
        is_public: false,
        thumbnail_url: productData?.thumbnail_url || null
      });

      showToast({
        message: "Collection created successfully!",
        type: "success",
        duration: 3000,
      });

      await fetchCollections();

      const newCollectionId = response?.data?.data?.collection?.id;
      if (newCollectionId) {
        await handleAddToCollection(newCollectionId);
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to create collection",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleTrackEnd = () => {
    // Auto-play next track
    const currentContentIndex = productData.contents.findIndex(
      (c: any) => c.content_id === activeContent.content_id
    );
    const currentFileIndex = activeContent.files.findIndex(
      (f: any) => f.file_id === activeFile.file_id
    );

    // Try next file in same content
    if (currentFileIndex < activeContent.files.length - 1) {
      setActiveFile(activeContent.files[currentFileIndex + 1]);
    }
    // Try first file of next content
    else if (currentContentIndex < productData.contents.length - 1) {
      const nextContent = productData.contents[currentContentIndex + 1];
      if (nextContent.files.length > 0) {
        setActiveContent(nextContent);
        setActiveFile(nextContent.files[0]);
      }
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto px-5">
        {/* Collections Modal */}
        <SaveToCollectionsModal
          open={showModal}
          closeModal={() => setShowModal(false)}
          collections={collections}
          onAddToCollection={handleAddToCollection}
          onCreateCollection={handleCreateCollection}
          productThumbnail={productData?.thumbnail_url || ""}
        />

        {/* Two-column layout starts from breadcrumbs */}
        <div className="mt-9 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Left column: all soft guitar content */}

          <div>
            {productData?.category?.slug === "music" && (
              <MusicDisplay
                thumbnail={productData?.thumbnail_url}
                title={productData?.title}
                seller={productData?.seller}
                rating={productData?.rating}
                purchase={productData?.purchase?.purchased_at}
                duration={productData?.duration}
                moods={productData?.moods}
                category={productData?.category}
                content={productData?.contents}
                currentFile={activeFile}
                currentContent={activeContent}
                productId={id!}
                productProgress={productProgress}
                onTrackEnd={handleTrackEnd}
                onProgressUpdate={fetchProductProgress}
                onSaveToCollection={() => setShowModal(true)}
              />
            )}

            {productData?.category?.slug === "video" && (
              <VideoDisplay
                thumbnail={productData?.thumbnail_url}
                title={productData?.title}
                seller={productData?.seller}
                rating={productData?.rating}
                purchase={productData?.purchase?.purchased_at}
                duration={productData?.duration}
                mood={productData?.mood}
                category={productData?.category}
                content={productData?.contents}
                currentFile={activeFile}
                product_type_details={productData?.product_type_details}
                currentContent={activeContent}
                productId={id!}
                productProgress={productProgress}
                onVideoEnd={handleTrackEnd}
                onProgressUpdate={fetchProductProgress}
                onSaveToCollection={() => setShowModal(true)}
              />
            )}

            {/* Tabs */}
            <ContentTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="mt-3">
              {activeTab === 'overview' && (
                <OverviewTab
                  overview={productData?.overview}
                  highlights={productData?.highlights}
                  duration={productData?.duration}
                  skillLevel={productData?.skill_level}
                  language={productData?.language}
                  format={productData?.format}
                  requirements={productData?.requirements}
                  theme={productData?.theme}
                />
              )}

              {activeTab === 'storytelling' && (
                <StoryTellingTab
                  storytelling_video_url={productData?.storytelling_video_url}
                  storytelling_description={productData?.storytelling_description}
                />
              )}

              {activeTab === 'reviews' && (
                <ReviewsTab productId={id!} show_overall_review={true} show_public_review={true} />
              )}
            </div>
          </div>
          {/* Right column: Course Content sidebar */}
          <ContentList
            contents={productData?.contents || []}
            onTrackSelect={handleTrackSelect}
            activeFileId={activeFile?.file_id}
            productProgress={productProgress}
          />
        </div>
      </div>
    </div>
  );
}

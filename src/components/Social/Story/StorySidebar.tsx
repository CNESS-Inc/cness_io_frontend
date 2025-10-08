import { cn } from "../../../lib/utils";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Image from "../../ui/Image";

interface Story {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  hasNewStory: boolean;
  isViewed: boolean;
}

interface StorySidebarProps {
  stories: Story[];
  activeStoryId?: string;
  onStorySelect: (storyId: string) => void;
}

export function StorySidebar({
  stories,
  activeStoryId,
  onStorySelect,
}: StorySidebarProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/social');
  };

  return (
    <div className="w-[465px] bg-card border-r border-border h-screen overflow-y-auto">
      <div className="">
        <div className="text-xl font-semibold text-foreground mb-6 p-6">
          <div className="w-full flex justify-between items-center">
            <div className="logo">
              <div className="flex items-center">
                <Link to="/" className="flex items-center" aria-label="Home">
                  <Image
                    src={`https://res.cloudinary.com/diudvzdkb/image/upload/w_240,h_136,f_webp,q_auto/v1759918812/cnesslogo_neqkfd`}
                    alt="Company Logo"
                    width={100}
                    className="h-auto w-[144.16px]"
                  />
                </Link>
              </div>
            </div>

            <div className="button">
              <button 
                onClick={handleClose}
                className="w-[35px] h-[35px] rounded-[7px] border-[1px] border-strock border-[#ECEEF2] flex justify-center items-center hover:bg-gray-50 transition-colors"
              >
                <IoCloseOutline className="text-[#E1056D]" />
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => onStorySelect(story.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
                "hover:bg-secondary/50",
                activeStoryId === story.id && "bg-[#7077FE0D]"
              )}
            >
              <div className="relative">
                <div
                  className={cn(
                    "p-0.5 rounded-full",
                    story.hasNewStory && !story.isViewed
                      ? "bg-gradient-to-r from-primary to-primary-glow"
                      : "bg-story-viewed"
                  )}
                >
                  {/* <Avatar className="w-12 h-12 border-2 border-story-color">
                                        <AvatarImage className="b-gradient-to-r from-[#6340FF] to-[#D748EA]" src={story.user.avatar} />
                                        <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                                            {story.user.initials}
                                        </AvatarFallback>
                                    </Avatar> */}

                  <div className="relative w-[73px] h-[73px]  rounded-full p-[1.83px] bg-gradient-to-r from-[#6340FF] to-[#D748EA]">
                    <div className="w-full h-full rounded-full overflow-hidden object-cover bg-white p-[3px]">
                      <img
                        src={story.user.avatar}
                        alt="User Avatar"
                        className="w-full h-full rounded-full object-cover bg-white"
                      />
                    </div>

                    <span className="absolute bottom-[10px] right-[12px] w-[10px] h-[10px] rounded-full bg-green-500 border-[1.5px] border-white"></span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="poppins font-medium text-foreground truncate text-[14px] leading-[100%] align-middle mb-1">
                  {story.user.name}
                </p>
                <p className="jakarta font-medium text-foreground truncate text-[14px] leading-[100%] text-[#7077FE] tracking-[0%] align-middle relative pl-2 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#7077FE]">
                  3 new
                </p>
                <p className="sans font-normal not-italic text-xs leading-[150%] align-middle tracking-normal text-muted-foreground">
                  1 hour ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

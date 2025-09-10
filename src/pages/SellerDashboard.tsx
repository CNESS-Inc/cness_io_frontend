//import React from "react";
import {
  GreetingBar,
  TrueProfileCard,
  CertificationCard,
  SocialStackCard,
  BestPracticesSection,
  DirectorySection, // <-- already imported
} from "../components/Seller/SellerSegmentcard";

export default function SellerDashboard() {
  const bpItems = [
    { id: 1, image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1200&auto=format&fit=crop", title: "Best Practice 1", description: "Description" },
    { id: 2, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", title: "Best Practice 2", description: "Description" },
    { id: 3, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop", title: "Best Practice 3", description: "Description" },
    { id: 4, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", title: "Best Practice 4", description: "Description" },
  ];

  const directoryItems = [
    { id: 1, image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=600&auto=format&fit=crop", title: "Directory Name", subtitle: "Overview of the Directory" },
    { id: 2, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop", title: "Directory Name", subtitle: "Overview of the Directory" },
    { id: 3, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop", title: "Directory Name", subtitle: "Overview of the Directory" },
  ];

  const suggested = [
    { id: 1, name: "Liam", handle: "@liamthegreat", avatar: "https://i.pravatar.cc/60?img=11" },
    { id: 2, name: "Ethan", handle: "@ethanideas", avatar: "https://i.pravatar.cc/60?img=12" },
    { id: 3, name: "Ava", handle: "@avawrites", avatar: "https://i.pravatar.cc/60?img=13" },
    { id: 4, name: "Ava", handle: "@avawrites", avatar: "https://i.pravatar.cc/60?img=14" },
  ];
  const requested = [
    { id: 5, name: "Noah", handle: "@noahdev", avatar: "https://i.pravatar.cc/60?img=15" },
    { id: 6, name: "Mia", handle: "@miacreates", avatar: "https://i.pravatar.cc/60?img=16" },
  ];

  return (
    <div className="px-4 lg:px-6 py-6">
      <GreetingBar name="Leo" onCloseSuggestion={() => console.log("close suggestion")} />

      <div className="grid grid-cols-12 gap-5">
        {/* LEFT column stacks: TrueProfile -> Certification -> BestPractices -> Directory */}
        <div className="col-span-12 lg:col-span-8 space-y-5">
          <TrueProfileCard
            avatarUrl="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=facearea&facepad=3&crop=faces"
            completion={100}
            onUpdateProfile={() => console.log("Update profile")}
            onOpen={() => console.log("Open True Profile")}
          />

          <CertificationCard
            progress={82}
            activeLevel="Inspired"
            onContinue={() => console.log("Continue assessment")}
            onOpen={() => console.log("Open Certification")}
          />

          <BestPracticesSection
            items={bpItems}
            onAdd={() => console.log("Add Best Practices")}
            onFollow={(bp) => console.log("Follow:", bp)}
          />

          {/* ⬇️ Directory directly below Best Practices */}
          <DirectorySection
            items={directoryItems}
            onView={(it) => console.log("View Details:", it)}
          />
        </div>

        {/* RIGHT column: single long Social stack */}
        <div className="col-span-12 lg:col-span-4">
          <SocialStackCard
            coverUrl="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
            avatarUrl="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200&auto=format&fit=facearea&facepad=2&crop=faces"
            name="Leo Nolan"
            handle="@leonolan"
            resonating={100}
            resonators={1000}
            onViewProfile={() => console.log("View profile")}
            onSearch={(q) => console.log("Search:", q)}
            onOpen={() => console.log("Open Social")}
            adventureTitle="Your Next Social Life Adventure"
            adventureText="What would your younger self admire about your life now? Any standout achievements or experiences?"
            onStartPosting={() => console.log("Start Posting")}
            onViewFeed={() => console.log("View Feed")}
            suggested={suggested}
            requested={requested}
            onConnect={(f) => console.log("Connect:", f)}
          />
        </div>
      </div>
    </div>
  );
}

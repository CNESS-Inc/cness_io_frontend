import MyDreamBuiderComponent from "./DreamBuilders/MyDreamBuiderComponent.tsx";
import MyconnectionsComponent from "./MyConnections/MyconnectionsComponent.tsx";

const RightSocial = () => {
  return (
    <>
      <div className="flex flex-col">
        {/* My Dreambuilders Section */}
        <MyDreamBuiderComponent/>

        {/* My Connections Section */}
        <MyconnectionsComponent/>
      </div>
    </>
  );
};

export default RightSocial;

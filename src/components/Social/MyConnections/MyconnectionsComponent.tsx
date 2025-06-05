import { Link } from "react-router-dom";
import MyConnections from "./MyConnections.tsx";

const MyconnectionsComponent = () => {
  return (
    <>
      <div className="flex flex-col bg-[#F6F6F6] p-4 rounded-lg shadow-md mt-5">
        <MyConnections />
        <Link
          to="/view-all-connections"
          className="text-nowrap text-[#7077FE] size-4 underline"
        >
          See all
        </Link>
      </div>
    </>
  );
};

export default MyconnectionsComponent;

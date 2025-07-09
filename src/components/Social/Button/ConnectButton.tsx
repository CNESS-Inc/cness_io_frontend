import { useState } from "react";
import { SendConnectionRequest } from "../../../Common/ServerAPI";

interface ConnectButtonProps {
  isFriend?: boolean;
  is_requested: boolean;
  userId?: string;
  isUserProfile?: boolean;
  onRequestSent?: () => void; // Add callback prop
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
  isFriend,
  is_requested,
  userId,
  isUserProfile = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState(is_requested);

  const handleSendConnectionRequest = async () => {
    setLoading(true);
    try {
      const formattedData = { friend_id: userId };
      const res = await SendConnectionRequest(formattedData)

      if (res.success) {
          setRequest(true); 
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isFriend ? (
        isUserProfile ? (
          <button
            className="bg-yellow-400 hover:bg-yellow-500 rounded-full text-gray-900 py-3 px-2 connect_btn"
            style={{ height: "55px", width: "190px" }}
          >
            Connected
          </button>
        ) : (
          <span className="text-gray-600">Connected</span>
        )
      ) : request ? (
        isUserProfile ? (
          <button
            className="bg-yellow-400 hover:bg-yellow-500 rounded-full text-gray-900 py-3 px-2 connect_btn"
            style={{ height: "55px", width: "190px" }}
          >
            Request Raised
          </button>
        ) : (
          <button disabled className="text-gray-500">
            Request raised
          </button>
        )
      ) : isUserProfile ? (
        <button
          className="bg-yellow-400 hover:bg-yellow-500 rounded-full text-gray-900 py-3 px-2 connect_btn"
          onClick={handleSendConnectionRequest}
          disabled={loading}
          style={{ height: "55px", width: "190px" }}
        >
          {loading ? "Sending..." : "Connect"}
        </button>
      ) : (
        <button onClick={handleSendConnectionRequest} disabled={loading}>
          {loading ? "Sending..." : "Connect"}
        </button>
      )}
    </>
  );
};

export default ConnectButton;

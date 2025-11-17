import React from "react";
// import {X,MessageCircle} from "lucide-react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
type Connection = {
  id: number | string;
  name: string;
  username: string;
  profileImage: string;
};

type ConnectionsListProps = {
  title?: string;
  connections: Connection[];
  onMessage?: (id: number | string) => void;
  onUnfriend?: (id: number | string) => void;
};

const Connections: React.FC<ConnectionsListProps> = ({
  title = "Connections",
  connections,
  // onMessage,
  onUnfriend,
}) => {
  // Split into two equal columns
  const navigate = useNavigate();
  const half = Math.ceil(connections.length / 2);
  const leftCol = connections.slice(0, half);
  const rightCol = connections.slice(half);

  const renderConnection = (conn: Connection) => (
    <div
      key={conn.id}
      className="flex items-center justify-between  h-[76px] border border-gray-200 rounded-xl p-3 bg-white"
    >
      <div className="flex items-center gap-3">
        <img
          src={conn.profileImage}
          alt={conn.name}
          className="w-[52px] h-[52px] rounded-full object-cover border-[0.95px] border-gray-200"
        />
        <div>
          <h4 className="font-poppins font-medium text-[16px] leading-[100%] tracking-[0]">
            {conn.name}
          </h4>
          <p className="text-xs text-gray-500">@{conn.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/*
        <button
          onClick={() => onMessage?.(conn.id)}
          className="w-[93px] h-[30px] rounded-[75px] px-[12px] py-[6px] gap-[6px] flex items-center justify-center bg-[#7B61FF] text-white hover:bg-[#684de0] transition font-openSans font-semibold text-[12px] leading-[150%] tracking-[0]"
        >
          <MessageCircle className="inline-block w-4 h-4" />
          Message
        </button>
        */}

        <button
          onClick={() => onUnfriend?.(conn.id)}
          className="w-[93px] h-[30px] rounded-[75px] px-3 py-1.5 gap-1.5 flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-openSans font-semibold text-[12px] leading-[150%] tracking-[0]"
        >
          <X className="inline-block w-4 h-4" />
          Unfriend
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button 
        onClick={() => navigate('/dashboard/MyConnection')}
        className="inline-flex items-center gap-2 rounded-full border bg-white border-gray-200 px-3 py-1.5 text-sm text-black hover:bg-gray-50 bg-color-white">
          View all
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {leftCol.map(renderConnection)}
        </div>
        <div className="flex flex-col gap-4">
          {rightCol.map(renderConnection)}
        </div>
      </div>
    </div>
  );
};

export default Connections;

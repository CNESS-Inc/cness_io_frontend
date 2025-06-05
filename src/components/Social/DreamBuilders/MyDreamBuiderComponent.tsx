import React from 'react';
import { Link } from 'react-router-dom';
import MyDreamBuilders from './MyDreamBuilders.tsx';

const MyDreamBuiderComponent: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#F6F6F6] p-4 rounded-lg shadow-md mt-5">
      <MyDreamBuilders />
      <Link
        to="/view-all-favorites"
        className="text-nowrap text-[#7077FE] size-4 underline"
      >
        See all
      </Link>
    </div>
  );
};

export default MyDreamBuiderComponent;
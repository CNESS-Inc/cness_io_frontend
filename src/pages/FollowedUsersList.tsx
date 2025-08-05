interface FollowedUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  is_following: boolean;
}


const FollowedUsersList = ({ users,
    //  onFollowToggle 
    }: { 
  users: FollowedUser[], 
  onFollowToggle: (userId: string) => void 
}) => {
  return (
    <div className="space-y-4">
      {users.map(user => (
        <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <img 
              src={user.profile_picture} 
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/profile.png";
              }}
            />
            <div>
              <p className="font-medium text-gray-800">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>
          {/* <button
            onClick={() => onFollowToggle(user.id)}
            className={`text-xs px-3 py-1 rounded-full ${
              user.is_following
                ? "bg-gray-200 text-gray-800"
                : "bg-[#7C81FF] text-white"
            }`}
          >
            {user.is_following ? "Following" : "Follow"}
          </button> */}
        </div>
      ))}
    </div>
  );
};

export default FollowedUsersList
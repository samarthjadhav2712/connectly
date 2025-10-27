import { useQuery } from "@tanstack/react-query";
// Fix: Changed import paths from ../ to ./
import useAuthUser from "../hooks/useAuthUser";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import PageLoader from "../components/PageLoader";

const FriendsPage = () => {
  const { authUser } = useAuthUser();

  // Use TanStack Query to fetch friends
  const { data: friends, isLoading, error } = useQuery({
    queryKey: ['friends', authUser?._id], // Query depends on the user
    queryFn: getUserFriends,
    enabled: !!authUser, // Only run the query if the user is logged in
  });

  return (
    <div className="h-full w-full p-4 md:p-8">
      {/* Changed max-w-4xl to max-w-2xl to make the cards narrower */}
      <div className="max-w-xl mx-auto">
        <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
        
        {/* Added mt-8 to create a gap below the title */}
        {isLoading && (
          <div className="text-center text-lg text-gray-600 mt-8"><PageLoader/></div>
        )}

        {/* Added mt-8 to create a gap below the title */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-8" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error.message}</span>
          </div>
        )}

        {/* Added mt-8 to create a gap below the title */}
        {friends && (
          <div className="flex flex-col gap-4 mt-8">
            {friends.length === 0 ? (
              <NoFriendsFound/>
            ) : (
              friends.map(friend => (
                <FriendCard key={friend._id} friend={friend} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;


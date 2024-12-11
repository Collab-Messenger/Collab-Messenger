import { useState, useEffect, useContext } from "react";
import { blockUser, getAllUsers, makeAdmin, removeAdmin, unblockUser } from "../../services/user.service";
import { AppContext } from "../../store/app-context";

export const Admin = () => {
  const [users, setUsers] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

return (
    <div className="flex flex-col items-center -mt-[50px] ml-[700px] self-center">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <h2 className="text-xl mb-4">All Users</h2>
        {users.length > 0 ? (
            <ul className="w-full max-w-md">
                {users.filter((user) => user.handle !== userData?.handle).map((user) => (
                    <li key={user.uid} className="flex justify-between items-center mb-2 p-2 border-b">
                        <span>{user.handle}</span>
                        <div className="flex space-x-2">
                            {user.isAdmin ? (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => removeAdmin(user.handle)}
                                >
                                    Remove Admin
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => makeAdmin(user.handle)}
                                >
                                    Make Admin
                                </button>
                            )}
                            {user.isBlocked ? (
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => unblockUser(user.handle)}
                                >
                                    Unblock User
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => blockUser(user.handle)}
                                >
                                    Block User
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No users found</p>
        )}
    </div>
);
};
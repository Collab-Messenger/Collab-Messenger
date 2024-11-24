import { useState, useEffect } from "react";
import { blockUser, getAllUsers, makeAdmin, removeAdmin, unblockUser } from "../../services/user.service";

export const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = () => {
      getAllUsers((data) => {
        setUsers(data);
      });
    };

    fetchUsers();
  }, []);

return (
    <div>
        <h1>Admin Panel</h1>
        <h2>All Users</h2>
        {users.length > 0 ? (
            <ul>
                {users.map((user) => (
                    <li key={user.uid}>
                        {user.handle}
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
                    </li>
                ))}
            </ul>
        ) : (
            <p>No users found</p>
        )}
    </div>
);
};
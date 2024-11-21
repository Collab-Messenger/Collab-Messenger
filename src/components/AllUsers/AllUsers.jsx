import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUsersByName } from "../../services/user.service";

const AllUsers = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') ?? '';
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const results = await getUsersByName(search);
            setUsers(results);
          } catch (err) {
            console.error("Error fetching users:", err);
          }
        };

    fetchUsers();
  }, [search]);

  return (
    <div>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.uid}>{user.handle}</li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default AllUsers;
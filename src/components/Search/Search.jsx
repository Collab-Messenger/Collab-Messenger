import { useNavigate, useSearchParams } from "react-router-dom";
import { searchUsers } from "../../services/user.service";

export const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  const handleSearchClick = async () => {
    try {
      const results = await searchUsers(search);
      navigate('/', { state: { users: results } });
    } catch (err) {
      alert(err);
    }
  };

  const setSearch = (value) => {
    setSearchParams({ search: value });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearchClick}>Search</button>
      </label>
    </div>
  );
};
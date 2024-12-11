import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchUsers } from "../../services/user.service";

export const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');


  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
  }, [searchParams]);

  const handleSearchClick = async () => {
    try {
      console.log('Updating URL and performing search for:', search);
      
      setSearchParams({ search });

      const results = await searchUsers(search);
      console.log('Search results:', results);

      navigate('/', { state: { users: results } });
    } catch (err) {
      console.error('Error during search:', err);
      alert('An error occurred while searching. Please try again.');
    }
  };

  const handleInputChange = (value) => {
    setSearch(value);
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
          value={search}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearchClick}>Search</button>
      </label>
    </div>
  );
};

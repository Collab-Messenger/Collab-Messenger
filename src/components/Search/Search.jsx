import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchUsers } from "../../services/user.service";

/**
 * Search component for finding users within the application.
 *
 * @component
 */
export const Search = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') ?? '');

    /**
     * Update the search state whenever the URL search parameter changes.
     */
    useEffect(() => {
        setSearch(searchParams.get('search') ?? '');
    }, [searchParams]);

    /**
     * Handles the search button click event. It updates the URL with the search query and performs the search.
     */
    const handleSearchClick = async () => {
        try {
            console.log('Updating URL and performing search for:', search);
            
            setSearchParams({ search });

            // Perform search using the provided search query
            const results = await searchUsers(search);
            console.log('Search results:', results);

            // Navigate to the results page and pass the search results as state
            navigate('/', { state: { users: results } });
        } catch (err) {
            console.error('Error during search:', err);
            alert('An error occurred while searching. Please try again.');
        }
    };

    /**
     * Handles changes to the input field.
     *
     * @param {string} value - The new value of the input field.
     */
    const handleInputChange = (value) => {
        setSearch(value);
    };

    /**
     * Handles key press events, specifically the Enter key to trigger search.
     *
     * @param {Object} e - The keyboard event object.
     */
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

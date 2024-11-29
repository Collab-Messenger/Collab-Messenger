import { createContext } from "react";

/**
 * AppContext to provide global state management.
 * @typedef {Object} AppContextType
 * @property {Object|null} user - The current user object.
 * @property {Object|null} userData - Additional data for the current user.
 * @property {Function} setAppState - Function to update the app state.
 */
export const AppContext = createContext({
  user: null,
  userData: null,
  setAppState: () => {},
  setActiveChat: () => {},
  activeChat: () => {}
});


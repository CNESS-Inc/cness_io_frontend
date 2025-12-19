import React, { useState, useEffect, useRef } from "react";
import { SearchLocation } from "../../Common/ServerAPI";

interface Location {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface LocationSearchDropdownProps {
  value: Location | null;
  onChange: (location: Location | null) => void;
  placeholder?: string;
  error?: string;
}

const LocationSearchDropdown: React.FC<LocationSearchDropdownProps> = ({
  value,
  onChange,
  placeholder = "Search for a location...",
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Default popular locations
  const defaultLocations = [
    "New York",
    "London",
    "Tokyo",
    "Paris",
    "Sydney"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load default suggestions when dropdown opens
  useEffect(() => {
    if (isOpen && searchQuery.trim().length === 0) {
      loadDefaultSuggestions();
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      if (searchQuery.trim().length === 0 && isOpen) {
        // Show default suggestions if query is empty
        loadDefaultSuggestions();
      } else {
        setLocations([]);
      }
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(searchQuery);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const loadDefaultSuggestions = async () => {
    setIsLoading(true);
    try {
      // Load popular locations as default suggestions
      const allSuggestions: Location[] = [];

      for (const city of defaultLocations) {
        try {
          const response = await SearchLocation(city);
          if (response?.data?.data && response.data.data.length > 0) {
            // Take the first result for each city
            allSuggestions.push(response.data.data[0]);
          }
        } catch (error) {
          console.error(`Error fetching ${city}:`, error);
        }
      }

      setLocations(allSuggestions);
    } catch (error) {
      console.error("Error loading default suggestions:", error);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchLocations = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await SearchLocation(query);
      if (response?.data?.data) {
        setLocations(response.data.data);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(true);

    // Clear selected location if user types
    if (value === "") {
      onChange(null);
    }
  };

  const handleSelectLocation = (location: Location) => {
    onChange(location);
    setSearchQuery("");
    setIsOpen(false);
    setLocations([]);
  };

  const handleClearSelection = () => {
    onChange(null);
    setSearchQuery("");
    setLocations([]);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        {value ? (
          // Display selected location - ADD ERROR BORDER HERE
          <div
            className={`w-full px-4 py-2 border ${
              error ? "border-red-500" : "border-[#CBD5E1]"
            } rounded-xl bg-white flex items-center justify-between`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {value.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{value.address}</p>
            </div>
            <button
              type="button"
              onClick={handleClearSelection}
              className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          // Search input - ADD ERROR BORDER HERE
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className={`w-full px-4 py-2 border ${
                error ? "border-red-500" : "border-[#CBD5E1]"
              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                error ? "focus:ring-red-500" : "focus:ring-purple-500"
              } h-[43px]`}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !value && (searchQuery.length === 0 || searchQuery.length >= 3) && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              {searchQuery.length === 0 ? "Loading suggestions..." : "Searching..."}
            </div>
          ) : locations.length > 0 ? (
            <ul className="py-2">
              {locations.map((location) => (
                <li
                  key={location.placeId}
                  onClick={() => handleSelectLocation(location)}
                  className="px-4 py-3 hover:bg-purple-50 cursor-pointer border-b last:border-b-0 border-gray-100"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {location.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {location.address}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchQuery.length === 0 ? "No suggestions available" : "No locations found. Try a different search."}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>}

      {searchQuery.length > 0 && searchQuery.length < 3 && !value && (
        <p className="text-xs text-gray-500 mt-1">
          Type at least 3 characters to search
        </p>
      )}
    </div>
  );
};

export default LocationSearchDropdown;
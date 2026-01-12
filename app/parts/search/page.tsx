"use client";

import { useState } from "react";
import Link from "next/link";

export default function SearchParts() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("partNumber");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/parts/search?q=${encodeURIComponent(query)}&type=${searchType}`
      );
      const data = await response.json();
      setResults(data.parts || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Search Parts
          </h1>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Type
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="partNumber"
                    checked={searchType === "partNumber"}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Part Number
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="description"
                    checked={searchType === "description"}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Description
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="manufacturer"
                    checked={searchType === "manufacturer"}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    Manufacturer
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="ai"
                    checked={searchType === "ai"}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    AI Search
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Search Query
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    searchType === "ai"
                      ? "Describe the part you're looking for..."
                      : "Enter search term..."
                  }
                  className="flex-1 rounded-l-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !query}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
              {searchType === "ai" && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Use natural language to describe what you're looking for. E.g.,
                  "oil filter for 2015 Honda Civic" or "10 micron hydraulic filter"
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Search Results ({results.length})
            </h2>
            <div className="space-y-4">
              {results.map((part) => (
                <div
                  key={part.id}
                  className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {part.partNumber}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {part.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          <strong>Manufacturer:</strong> {part.manufacturer}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          <strong>Category:</strong> {part.category?.name}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/parts/${part.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && results.length === 0 && query && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No results found for "{query}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

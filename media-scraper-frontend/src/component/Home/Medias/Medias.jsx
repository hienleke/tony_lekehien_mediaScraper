import React, { useState , useEffect } from "react";
import "./Medias.css";
import axiosInstance from "../../../config/axiosInstance";

const MediaComponent = () => {
  const [media, setMedia] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMediaData = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/urlmedias", {
        params: {
          page,
          type: filterType,
          search: searchText,
        },
      });
      setMedia(data.data); 
      setTotalPages(data.totalPages); 
      setCurrentPage(page); 
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaData(1); 
  }, []);

  const handleSearchChange = (e) => setSearchText(e.target.value);

  const handleMediaTypeChange = (type) => setFilterType(type);

  const handleApplyFilters = () => {
    fetchMediaData(1); // Always reset to the first page
  };

  const handleRefresh = () => {
    setSearchText("");
    setFilterType("");
    fetchMediaData(1); // Reset everything and load the first page
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchMediaData(newPage);
    }
  };

  return (
    <div className="media-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search..."
        />

        {/* Filter Dropdown */}
        <select
          value={filterType}
          onChange={(e) => handleMediaTypeChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>

        <button onClick={handleApplyFilters}>Apply</button>
        <button onClick={handleRefresh}>Refresh</button>
      </div>

      {/* Media Gallery */}
      <div className="media-gallery">
        {media.map((item) => (
          <div key={item.id} className="media-item">
            {item.type === "image" ? (
              <img src={item.url} alt={`Media ${item.id}`} className="media-image" />
              
            ) : (
              <video controls className="media-video">
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
                )}
                <div className="media-item-description">
                    <a href={item.url} target="_blank" >{item.url}</a>
                    </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || loading}
        >
          Next
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default MediaComponent;

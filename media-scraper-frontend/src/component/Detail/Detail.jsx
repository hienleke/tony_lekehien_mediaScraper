import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Detail.css'

const Detail = ({detail_id}) => {
	let { id } = useParams(null);
	const [urls, setUrlData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUrlData = async () => {
			try {
				const response = await axios.get(`http://localhost:3001/api/urls/${id || detail_id}`);
				setUrlData(response.data); // assuming the API returns a single URL object
				setLoading(false);
			} catch (error) {
				console.error("Error fetching URL data", error);
				setLoading(false);
			}
		};

		fetchUrlData();
	}, [detail_id]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container">
			<h1 className="text-2xl font-bold mb-4">URL Details</h1> {/* Title should be outside of map */}
      <h2>Image</h2>
      <div className="image-container">
        {urls.filter((url) => url.type === 'image').map((url) => {
          return (
           <div className="image-item">
           <img src={url.url} alt="notFound" className="w-full h-auto" />
            </div>
          )
        })}
      </div>
      <h2>Video</h2>
      <div className="video-container">
      {urls.filter((url) => url.type === 'video').map((url) => {
        return (
           <div className="video-item">
           <video controls>
              <source src={url.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
         </div>)
        })}
      </div>
		</div>
	);
};

export default Detail;

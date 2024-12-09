import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './Detail.css'
import axiosInstance from '../../../config/axiosInstance'

const Detail = ({detail_id , urlName}) => {
	let { id } = useParams(null);
	const [urls, setUrlData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUrlData = async () => {
			try {
				const response = await axiosInstance.get(`/api/urls/${id || detail_id}`);
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
			<h1 className="text-2xl font-bold mb-4">URL Details  : {urlName || "not found"}</h1> {/* Title should be outside of map */}
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

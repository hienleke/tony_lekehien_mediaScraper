import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Detail from "./Detail/Detail";
import Medias from "./Medias/Medias"
import "./Home.css";
import axiosInstance from '../../config/axiosInstance'
const Home = () => {
	const [urlList, setUrlList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPage] = useState(1);
	const [loading_scrape, setLoading_scrape] = useState(false);
	const [loading_refesh, setLoading_refresh] = useState(false);
	const [currentDetailURL_id, setcurrentDetailURL_id] = useState(null);
	const [url, setUrl] = useState("");
	const itemsPerPage = 15;
	const navigate = useNavigate();

	const getUrls = async () => {
		setLoading_refresh(true);
		axiosInstance.get(`/api/urls`, {
			params: {
				page: currentPage,
				limit: itemsPerPage,
			},
		})
			.then((response) => {
				setUrlList(response.data);
				setCurrentPage(response.data.currentPage);
				setTotalPage(response.data.totalPages);
				setLoading_refresh(false);
			})
			.catch((error) => {
				console.error("There was an error fetching the data:", error);
				setLoading_refresh(false);
				navigate('/login');
			});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading_scrape(true);

		try {
			const response = await axiosInstance.post("/api/scrape", {
				urls: url.split(',').map(item => item.trim()),
			});

			const new_urls = Object.values(response.data.result)
				.filter((response) => !urlList.data.includes(response.url))
				.map((response) => ({
					id: response.id,
					url: response.url,
					createdAt: response.createdAt,
					updatedAt: response.updatedAt,
				}));

			if (response.status == 200) {
				urlList.data = [...new_urls, ...urlList.data];
				setUrlList(urlList);
				setUrl("");
			}
		} catch (err) {
		} finally {
			setLoading_scrape(false);
		}
	};

	useEffect(() => {}, [urlList]);

	useEffect(() => {
		getUrls();
	}, [currentPage]);

	const handleRefeshPage = () => {
		getUrls();
	};

	const handlePageChange = (page) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};
	const handleRowClick = (id) => {
		setcurrentDetailURL_id(id);
	};
	return (
		<div className="home-container">
			<form onSubmit={handleSubmit} className="scrape-bar">
				<input
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="Enter URL (e.g., https://example.com)"
					required
				/>
				<button type="submit" disabled={loading_scrape} className={`px-4 py-2 rounded-lg text-white ${loading_scrape ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}>
					{loading_scrape ? "Scraping..." : "Scrape"}
				</button>
			</form>

			<div className="main">
				<div className="content">
					<h2 className="text-2xl font-bold mb-4">Media Table</h2>
					<button onClick={handleRefeshPage} disabled={loading_refesh} className={`px-4 py-2 rounded-lg text-white ${loading_refesh ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"}`}>
						{loading_refesh ? "Loading" : "Refresh"}
					</button>
					<table className="custom-table">
						<thead>
							<tr className="custom-table-header">
								<th className="custom-table-cell-left">ID</th>
								<th className="custom-table-cell-left">URL</th>
								<th className="custom-table-cell-center">Created At (YYYY-MM-DD HH:mm:ss) </th>
								<th className="custom-table-cell-center">Updated At (YYYY-MM-DD HH:mm:ss) </th>
							</tr>
						</thead>
						<tbody className="custom-table-body">
							{urlList.data?.map((item) => (
								<tr key={item.id} className="custom-table-row" onClick={() => handleRowClick(item.id)}>
									<td className="custom-table-cell-left">{item.id}</td>
									<td className="custom-table-cell-link">
										<a href={item.url} target="_blank" rel="noopener noreferrer">
											{item.url}
										</a>
									</td>
									<td className="custom-table-cell-center">{moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}</td>
									<td className="custom-table-cell-center">{moment(item.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="flex justify-between items-center mt-4">
						<button onClick={() => handlePageChange(currentPage - 1)} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled={currentPage === 1}>
							Previous
						</button>
						<span className="text-sm">
							Page {currentPage} of {totalPages}
						</span>
						<button onClick={() => handlePageChange(currentPage + 1)} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled={currentPage === totalPages}>
							Next
						</button>
					</div>
				</div>
				<div className="detail">
					{currentDetailURL_id && <Detail detail_id={currentDetailURL_id}  urlName = {urlList?.data.find(item => item.id === currentDetailURL_id)?.url }  />}
				</div>
			</div>
			<div className="all_medias">
				<h2>ALL MEDIA SCRAPE</h2>
					<Medias></Medias>
				</div>
		</div>
	);
};

export default Home;

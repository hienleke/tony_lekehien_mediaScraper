const { URL } = require("url");
const log4js = require("../config/log4jsConfig");
const logger = log4js.getLogger();
const ScrapedURL = require("../models/ScrapedURL");
const Media = require("../models/Media");
const puppeteer = require("puppeteer");
const mediaService = require("../service/MediaService");
const { chromium } = require("playwright");
let browser, page;

const scrapeURLs = async (req, res) => {
	if (!browser) browser = await puppeteer.launch({ headless: false });
	if (!page) page = await browser.newPage();
	const { urls } = req.body;
	if (!urls || !Array.isArray(urls)) {
		return res.status(400).json({ error: "Invalid URLs array in request body" });
	}
	let result = {};
	let content;

	for await (const url_item of urls) {
		try {
			let domain = new URL(url_item).origin;
			let newScrapedURL = await ScrapedURL.findOne({ where: { url: url_item } });
			if (!newScrapedURL) newScrapedURL = await ScrapedURL.create({ url: url_item });
			let URL_scrape = {
				id: newScrapedURL.id,
				url: newScrapedURL.url,
				createdAt: newScrapedURL.createdAt,
				updatedAt: newScrapedURL.updatedAt,
				imageUrls: [],
				videoUrls: [],
			};
			await page.goto(url_item, { waitUntil: "load", timeout: 120000 });
			await page.waitForNavigation({
				waitUntil: 'networkidle0',
			  });
			
			
			const mediaSources = await page.evaluate((newScrapedURL) => {
				let URL_scrape = {
						id : newScrapedURL.id,
						imageUrls : [],
						videoUrls : []
					}
					let mediaItems = []
					const mediaElements = document.querySelectorAll("img, video");

					mediaElements.forEach((element, index) => {
						let mediaUrl = element.src;
						if (mediaUrl != "" && mediaUrl ) {
							if (element.tagName.toLowerCase() === "img") {
								URL_scrape.imageUrls.push(mediaUrl);
								mediaItems.push({
									type: "image",
									url: mediaUrl,
									urlId: URL_scrape.id,
								});
							} else if (element.tagName.toLowerCase() === "video") {
								URL_scrape.videoUrls.push(mediaUrl);
								mediaItems.push({
									type: "video",
									url: mediaUrl,
									urlId: URL_scrape.id,
								});
							}
						}
					});
					return { URL_scrape, mediaItems };
				},newScrapedURL
			);
			URL_scrape.imageUrls = mediaSources.URL_scrape.imageUrls;
			URL_scrape.videoUrls = mediaSources.URL_scrape.videoUrls;
			Media.bulkCreate(mediaSources.mediaItems)
				.then(() => {
					console.log("Media items have been added successfully.");
				})
				.catch((error) => {
					logger.error("Error occurred while creating media items: ", error);
				});
			result[url_item] = URL_scrape;
		} catch (error) {
			logger.error("Error during scraping: ", error);
			result[url_item] = error;
		}
	}
	res.status(200).json({ result });
};

module.exports = { scrapeURLs };

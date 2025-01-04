const { URL } = require("url");
const log4js = require("../config/log4jsConfig");
const logger = log4js.getLogger();
const ScrapedURL = require("../models/ScrapedURL");
const Media = require("../models/Media");
const puppeteer = require("puppeteer");
const mediaService = require("../service/MediaService");
const {getBrowserInstance , closeBrowser} = require("../service/ChormeService");

let browser, page;

const scrapeURLs = async (req, res) => {
    if (!browser) browser = await getBrowserInstance();
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid URLs array in request body' });
    }

    const MAX_CONCURRENT_WORKERS = 10; // Number of concurrent workers
    const result = {};
    const queue = [...new Set(urls)]; // Internal queue of URLs

    // Function to process a single URL
    const processURL = async (url) => {
        try {
            const page = await browser.newPage();
            let domain = new URL(url).origin;
            let newScrapedURL = await ScrapedURL.findOne({ where: { url } });

            if (!newScrapedURL) newScrapedURL = await ScrapedURL.create({ url });

            let URL_scrape = {
                id: newScrapedURL.id,
                url: newScrapedURL.url,
                createdAt: newScrapedURL.createdAt,
                updatedAt: newScrapedURL.updatedAt,
                imageUrls: [],
                videoUrls: [],
            };

            await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

            const mediaSources = await page.evaluate((scrapeData) => {
                const { id } = scrapeData;
                let URL_scrape = {
                    id,
                    imageUrls: [],
                    videoUrls: [],
                };

                const mediaItems = [];
                const mediaElements = document.querySelectorAll('img, video');
                mediaElements.forEach((element) => {
                    const mediaUrl = element.src;
                    if (mediaUrl) {
                        if (element.tagName.toLowerCase() === 'img') {
                            URL_scrape.imageUrls.push(mediaUrl);
                            mediaItems.push({ type: 'image', url: mediaUrl, urlId: id });
                        } else if (element.tagName.toLowerCase() === 'video') {
                            URL_scrape.videoUrls.push(mediaUrl);
                            mediaItems.push({ type: 'video', url: mediaUrl, urlId: id });
                        }
                    }
                });

                return { URL_scrape, mediaItems };
            }, { id: newScrapedURL.id });

            URL_scrape.imageUrls = mediaSources.URL_scrape.imageUrls;
            URL_scrape.videoUrls = mediaSources.URL_scrape.videoUrls;

            await Media.bulkCreate(mediaSources.mediaItems);

            await page.close();

            return { success: true, data: URL_scrape };
        } catch (error) {
            logger.error("Error in pupperteer controller:", error);
            await closeBrowser();
            return { success: false, error: error.message };
        }
    };

    // Process URLs in batches
    while (queue.length > 0) {
        const batch = queue.splice(0, MAX_CONCURRENT_WORKERS); // Take a batch of URLs
        const promises = batch.map((url) => processURL(url)); // Create promises for the batch

        // Wait for all promises to settle
        const results = await Promise.allSettled(promises);

        // Collect results
        results.forEach((result, index) => {
            const url = batch[index];
            if (result.status === 'fulfilled') {
                result[url] = result.value;
            } else {
                result[url] = { success: false, error: result.reason };
            }
        });
    }

    res.status(200).json({ result });
};

module.exports = { scrapeURLs };

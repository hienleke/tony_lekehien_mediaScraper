const { scrapeURLs } = require('../models/ScrapedURL');
const ScrapedURL = require('../models/ScrapedURL');
const sequelize = require('../config/database');

const getURLs = async (req, res) => {
  try{
  const page = parseInt(req.query.page) || 1; 
  const size = parseInt(req.query.size) || 20; 

  const limit = size; 
  const offset = (page - 1) * size; 

 
  const { count, rows } = await ScrapedURL.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]], 
  });

  res.status(200).json({
    totalItems: count,
    totalPages: Math.ceil(count / size),
    currentPage: page,
    data: rows,
  });
} catch (error) {
  console.error("Error fetching media:", error);
  res.status(500).json({ error: "An error occurred while fetching media." });
}
};
const getURLDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
   SELECT media."id", media."type", media."url", media."createdAt", media."updatedAt", 
           url.url AS mediaUrl
    FROM media AS media
    LEFT JOIN scraped_urls AS url ON media."urlId" = url."id"
    WHERE url."id" =  ${id}
    ORDER BY media."createdAt" DESC 
  `;
  const results = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching URL detail:", error);
    res.status(500).json({ error: "An error occurred while fetching URL detail." });
  }
};
const getAllURLDetails = async (req, res) => {
  try {
    const { type } = req.query;  // Getting the type from the query string (optional)

    // Building the dynamic query to fetch all records
    let query = `
      SELECT media."id", media."type", media."url", media."createdAt", media."updatedAt", 
             url.url AS mediaUrl
      FROM media AS media
      LEFT JOIN scraped_urls AS url ON media."urlId" = url."id"
    `;

    // If type is provided, add the filter condition for type
    if (type) {
      query += ` WHERE media."type" = '${type}'`;
    }

    query += ' ORDER BY media."createdAt" DESC';  // Ordering by the created date

    // Execute the query
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching URL details:", error);
    res.status(500).json({ error: "An error occurred while fetching URL details." });
  }
};


module.exports = { getURLs, getURLDetail , getAllURLDetails };



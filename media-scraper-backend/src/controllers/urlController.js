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
  res.status(500).json({ err: "An error occurred while fetching media." + error });
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
    const pageSize = 20;
    const { type, search, page = 1 } = req.query; // Default page is 1 if not provided
    const offset = (page - 1) * pageSize; // Calculate the offset based on page
    const limit = parseInt(pageSize);

    // Base query components
    const baseQuery = `
      FROM media AS media
      LEFT JOIN scraped_urls AS url ON media."urlId" = url."id"
      WHERE 1 = 1
    `;

    // Dynamic filtering conditions
    let whereClause = '';
    if (type && type !== "All") {
     whereClause += ` and  media."type" = '${type}'`;
    }
    if (search) {
      whereClause += ` and media."url" ILIKE '%${search}%'` ;
    }
  
    // Query for total count
    const countQuery = `
      SELECT COUNT(*) AS count
      ${baseQuery}
      ${whereClause}
    `;

    // Query for paginated data
    const dataQuery = `
      SELECT media."id", media."type", media."url", media."createdAt", media."updatedAt",
             url.url AS mediaUrl
      ${baseQuery}
      ${whereClause}
      ORDER BY media."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

   
    const [countResult, rows] = await Promise.all([
      sequelize.query(countQuery, { type: sequelize.QueryTypes.SELECT }),
      sequelize.query(dataQuery, { type: sequelize.QueryTypes.SELECT }),
    ]);

    const count = countResult[0].count;


    res.status(200).json({
      totalItems: parseInt(count),
      totalPages: Math.ceil(count / pageSize),
      currentPage: parseInt(page),
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching URL details:", error);
    res.status(500).json({ error: "An error occurred while fetching URL details." });
  }
};


module.exports = { getURLs, getURLDetail , getAllURLDetails };



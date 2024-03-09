const prisma = require("../config/prisma");

//getProductBySeries

module.exports.getProductBySeriesIdRaw = async (id) =>
  await prisma.$queryRaw`SELECT 
ps.series, p.*, pc.cover
FROM
GROUP4.product_series ps
    JOIN
GROUP4.products p ON p.serie_id = ps.id
    JOIN
GROUP4.product_cover pc ON pc.product_id = p.id
WHERE
ps.id = ${id}`;

module.exports.getProductByGroupNameRaw = async (groupName) =>
  await prisma.$queryRaw`SELECT 
pg.group ,pg.categories, p.*, pc.cover
FROM
GROUP4.product_group pg
    JOIN
GROUP4.products p ON p.group_id = pg.id
    JOIN
GROUP4.product_cover pc ON pc.product_id = p.id	
WHERE pg.group = ${groupName}`;

module.exports.getProductByCategoriesIdRaw = async (categoriesId) =>
  await prisma.$queryRaw`SELECT 
  pg.group ,pg.categories, p.*, pc.cover
FROM
  GROUP4.product_group pg
      JOIN
  GROUP4.products p ON p.group_id = pg.id
      JOIN
  GROUP4.product_cover pc ON pc.product_id = p.id	
WHERE pg.id = ${categoriesId}`;

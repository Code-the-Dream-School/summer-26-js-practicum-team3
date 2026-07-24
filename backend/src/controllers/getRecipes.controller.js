export async function getRecipes(req, res) {
  const whereClause = {};

  if (req.query.find) {
    whereClause.title = {
      contains: req.query.find,
      mode: 'insensitive',
    };
  }
  /**
   * LOGIC GOES HERE
   */
  const recipes = ['incoming requests', req.body, req.query, req.params];
  res.status(200).json(recipes);
}

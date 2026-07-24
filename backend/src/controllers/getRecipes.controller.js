export async function getRecipes(req, res) {
  console.log('we are connecting......');
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

  return res.status(200).json(recipes);
}

export default function DailyPlanner() {
  const currentNutrients = {
    protein: 10,
    carbs: 50,
    fat: 70,
    calories: 500,
  };

  const totalNutrientsGoal = {
    protein: 50,
    carbs: 200,
    fat: 100,
    calories: 2000,
  };

  return (
    <>
      <div
        style={{ margin: '2rem', padding: '2rem', fontFamily: 'sans-serif' }}
      >
        <section className="container">
          <h2>Nutrition Tracker</h2>
          <table>
            <tbody>
              <tr>
                <th>Protein</th>
                <td>
                  <span>{currentNutrients.protein}%</span>
                </td>
              </tr>
              <tr>
                <th>Carbs</th>
                <td>
                  <span>{currentNutrients.carbs}%</span>
                </td>
              </tr>
              <tr>
                <th>Fat</th>
                <td>
                  <span>{currentNutrients.fat}%</span>
                </td>
              </tr>
              <tr>
                <th>Calories</th>
                <td>
                  <span>{currentNutrients.calories}%</span>
                </td>
              </tr>
            </tbody>
          </table>

          <p>
            Goal: {totalNutrientsGoal.protein}% protein,{' '}
            {totalNutrientsGoal.carbs}% carbs, {totalNutrientsGoal.fat}% fat,{' '}
            {totalNutrientsGoal.calories}% calories
          </p>
        </section>
      </div>
    </>
  );
}

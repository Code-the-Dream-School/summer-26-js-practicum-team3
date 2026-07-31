import { useEffect, useRef } from 'react';
import './App.css';
import { Link } from 'react-router';

export default function DailyPlanner() {
  const proteinRef = useRef(null);
  const carbsRef = useRef(null);
  const fatRef = useRef(null);
  const caloriesRef = useRef(null);

  const progressTargets = {
    protein: 50, // grams
    carbs: 200, // grams
    fat: 70, // grams
    calories: 2000, // kcal
  };

  useEffect(() => {
    const refs = [
      { ref: proteinRef, value: progressTargets.protein },
      { ref: carbsRef, value: progressTargets.carbs },
      { ref: fatRef, value: progressTargets.fat },
      { ref: caloriesRef, value: progressTargets.calories },
    ];

    const timers = refs.map(({ ref, value }) => {
      const bar = ref.current;
      if (!bar) return null;

      let currentValue = 0;
      bar.style.width = '0%';

      const timerId = setInterval(() => {
        currentValue += 1;
        bar.style.width = `${currentValue}%`;

        if (currentValue >= value) {
          clearInterval(timerId);
        }
      }, 10);

      return timerId;
    });

    return () => timers.filter(Boolean).forEach(clearInterval);
  }, []);

  return (
    <>
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <header>
          <section className="container">
            <h2>Nutrition Tracker</h2>
            <div className="progress-bar">
              <table>
                <tr>
                  <th>Protein</th>
                  <td>
                    <div className="progress">
                      <div className="progress-track">
                        <div
                          ref={proteinRef}
                          className="progress-fill proteinBar"
                        />
                      </div>
                      <span>{progressTargets.protein}%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>Carbs</th>
                  <td>
                    <div className="progress">
                      <div className="progress-track">
                        <div
                          ref={carbsRef}
                          className="progress-fill carbsBar"
                        />
                      </div>
                      <span>{progressTargets.carbs}%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>Fat</th>
                  <td>
                    <div className="progress">
                      <div className="progress-track">
                        <div ref={fatRef} className="progress-fill fatBar" />
                      </div>
                      <span>{progressTargets.fat}%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>Calories</th>
                  <td>
                    <div className="progress">
                      <div className="progress-track">
                        <div
                          ref={caloriesRef}
                          className="progress-fill caloriesBar"
                        />
                      </div>
                      <span>{progressTargets.calories}%</span>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </section>
        </header>
        <main>
          <section className="added-recipes">
            <article className="recipe-card">
              <h3>Recipe Name</h3>
              <table>
                <tr>
                  <td>Cook Time:</td>
                  <td>Servings</td>
                  <td>Ingredient Info:</td>
                </tr>
              </table>
              <button>Expand</button>
            </article>
          </section>
        </main>
        <footer>
          <section className="navigation">
            <nav className="nav-bar">
              <ul>
                <li>
                  <Link to="/dailyplanner">Daily Planner</Link>
                </li>
                <li>
                  <Link to="/goals">Goals</Link>
                </li>
                <li>
                  <Link to="/addRecipe">Add Recipe</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
              </ul>
            </nav>
          </section>
        </footer>
      </div>
    </>
  );
}

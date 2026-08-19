import { Link } from 'react-router';
import '../MainPage/PublicPage.css';

function PublicPage() {
  return (
    <>
      <div>
        <header>
          <title>TodayEatz</title>
        </header>
        <main>
          <h1>Welcome to TodayEatz!</h1>
          <p id="paragraph">
            This is a nutritional app for anyone. From here you can be able to
            set your own healthy goals.
          </p>
        </main>
        <footer>
          <nav className="entry-links">
            <Link to="/login" className="link">
              Log In
            </Link>
            <Link to="/signup" className="link">
              Register
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default PublicPage;

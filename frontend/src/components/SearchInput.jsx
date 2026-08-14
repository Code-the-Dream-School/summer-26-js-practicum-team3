/* eslint-disable react/prop-types */
export function SearchInput({ searchTerm, onFilterChange }) {
  return (
    <form>
      <label htmlFor="filterInput">Search Recipes: </label>
      <input
        id="filterInput"
        type="text"
        value={searchTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="search todos here..."
      />
    </form>
  );
}

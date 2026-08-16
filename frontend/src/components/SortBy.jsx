/*eslint-disable */
export function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <form>
      <label htmlFor="sortBy">Sort By: </label>
      <select
        aria-label="sort by"
        name="sortBy"
        id="sortBy"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
      >
        <option value="calories">Calories</option>
        <option value="carbs">Carbs</option>
        <option value="fats">Fats</option>
        <option value="protein">Protein</option>
      </select>

      <label htmlFor="order">Sorting Order: </label>
      <select
        arai-label="sort direction"
        value={sortDirection}
        onChange={(e) => onSortDirectionChange(e.target.value)}
        name="order"
        id="order"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </form>
  );
}

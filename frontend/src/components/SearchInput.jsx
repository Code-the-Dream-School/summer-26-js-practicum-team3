/* eslint-disable react/prop-types */
import { FormControl, TextField } from '@mui/material';
// Shares the filter row with SortBy, and takes the full row on the
// narrowest screens.
const SEARCH_CONTAINER = {
  flex: { xs: '1 1 100%', sm: '1 1 0' },
  minWidth: 0,
};
const SEARCH_BAR = { width: '100%' };
export function SearchInput({ searchTerm, onFilterChange }) {
  return (
    <FormControl sx={SEARCH_CONTAINER}>
      <TextField
        sx={SEARCH_BAR}
        variant="standard"
        label="Search Recipes"
        id="filterInput"
        value={searchTerm}
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </FormControl>
  );
}

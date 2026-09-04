/* eslint-disable react/prop-types */
import { FormControl, TextField } from '@mui/material';
const SEARCH_CONTAINER = {
  width: { xs: '45%', md: '95%' },
  mb: { xs: '16px', md: 0 },
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
};
const SEARCH_BAR = {
  width: { xs: '100%', md: '50%' },
  alignText: 'center',
};
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

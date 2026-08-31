/*eslint-disable */
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
const CONTAINER = {
  mx: 0,
  maxWidth: { xs: '50%' },
  display: 'flex',
  flexDirection: 'row',
  justifyContent: { xs: 'flex-end', md: 'space-between' },
  alignItems: 'center',
  mb: 2,
};
const DISPLAY_SIZE = {
  width: { xs: '45%', md: '40%' },
  mx: { xs: '4px', md: 0 },
};

export function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <Stack sx={CONTAINER}>
      <FormControl variant="standard" sx={DISPLAY_SIZE}>
        <InputLabel id="sortBy-label">Sort By</InputLabel>
        <Select
          labelId="sortBy-label"
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          name="sortBy"
        >
          <MenuItem value="">
            <em>Select Your Options</em>
          </MenuItem>
          <MenuItem value="calories">Calories</MenuItem>
          <MenuItem value="carbs">Carbs</MenuItem>
          <MenuItem value="fats">Fats</MenuItem>
          <MenuItem value="protein">Protein</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="standard" sx={DISPLAY_SIZE}>
        <InputLabel id="order-label">Sorting Order</InputLabel>
        <Select
          labelId="order-label"
          id="order"
          value={sortDirection}
          onChange={(e) => onSortDirectionChange(e.target.value)}
          name="order"
        >
          <MenuItem value="">
            <em>Select Which Direction</em>
          </MenuItem>
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}

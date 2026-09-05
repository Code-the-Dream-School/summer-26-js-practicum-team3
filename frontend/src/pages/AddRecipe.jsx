import { Box, Card, CardContent, Typography } from '@mui/material';
import { AddRecipeForm } from '../features/recipes/components/AddRecipeForm';

export default function AddRecipe() {
  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', p: 3 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            align="center"
            sx={{ mb: 3 }}
          >
            Add Recipe
          </Typography>
          <AddRecipeForm />
        </CardContent>
      </Card>
    </Box>
  );
}

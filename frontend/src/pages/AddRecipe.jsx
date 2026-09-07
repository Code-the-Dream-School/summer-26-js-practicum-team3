import { Box, Card, CardContent, Typography } from '@mui/material';
import { AddRecipeForm } from '../features/recipes/components/AddRecipeForm';
import onboardingPortrait from '../assets/AppImages/onboarding-portrait.webp';

export default function AddRecipe() {
  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', p: 3 }}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          position: 'relative',
          backgroundImage: `url(${onboardingPortrait})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
           bgcolor: 'rgba(255, 255, 255, 0.6)',
          },
          '& .MuiOutlinedInput-root': {
            bgcolor: 'common.white',
          },
        }}
      >
        <CardContent sx={{ p: 4, position: 'relative' }}>
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

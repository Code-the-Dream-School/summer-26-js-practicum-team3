import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router';

const steps = [
  {
    number: '1',
    title: 'Sign Up',
    description: 'Create your free account',
  },
  {
    number: '2',
    title: 'Set your goals',
    description: 'Tell us your goals and preferences',
  },
  {
    number: '3',
    title: 'Build your menu',
    description: 'Plan meals and track your progress daily',
  },
];

const features = [
  {
    title: 'Curated Recipes',
    description: 'Start planning with a built-in recipe library',
  },
  {
    title: 'Daily menu builder',
    description: 'Build your day and see live nutrient progress',
  },
  {
    title: 'Goal tracking',
    description: 'Set targets and track calories, protein and carbs',
  },
];

export default function Home() {
  return (
    <>
      {/* Header section */}
      <Container
        component="header"
        maxWidth="md"
        sx={{ py: { xs: 10, md: 16 }, textAlign: 'center' }}
      >
        <Typography
          component="h2"
          sx={{
            mb: 3,
            fontSize: { xs: '2.2rem', md: '3.5rem' },
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          Plan meals. Hit your nutrition goals.
        </Typography>

        <Typography
          component="h3"
          sx={{
            maxWidth: 650,
            mx: 'auto',
            mb: 4,
            color: '#557064',
            fontSize: { xs: '1rem', md: '1.25rem' },
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Track your daily nutrients with a simple meal planner. Build around
          your goals.
        </Typography>
      </Container>

      {/* Main section */}
      <Box
        component="section"
        sx={{
          px: { xs: 2, md: 6 },
          py: { xs: 7, md: 10 },
          bgcolor: 'common.white',
        }}
      >
        {/* How it works area */}
        <Container maxWidth="lg">
          <Typography
            component="h3"
            sx={{
              mb: 6,
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '2.3rem' },
              fontWeight: 700,
            }}
          >
            How it works
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)',
              },
              gap: 5,
              textAlign: 'center',
            }}
          >
            {steps.map((step) => (
              <Box key={step.number}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: '50%',
                    color: 'primary.main',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                  }}
                >
                  {step.number}
                </Box>

                <Typography
                  component="h4"
                  sx={{ mb: 1, fontSize: '1.2rem', fontWeight: 700 }}
                >
                  {step.title}
                </Typography>

                <Typography sx={{ color: '#557064' }}>
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>

        {/* Feature area */}
        <Container maxWidth="lg" sx={{ mt: { xs: 9, md: 12 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {features.map((feature) => (
              <Box
                key={feature.title}
                sx={{
                  minHeight: 150,
                  p: 3,
                  textAlign: 'center',
                  border: '1px solid #c8ddd0',
                  borderRadius: 2,
                }}
              >
                <Typography
                  component="h4"
                  sx={{ mb: 1, fontSize: '1.15rem', fontWeight: 700 }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  sx={{
                    color: '#557064',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box
        component="footer"
        sx={{
          px: 2,
          py: { xs: 8, md: 10 },
          textAlign: 'center',
          bgcolor: '#f7fbf8',
        }}
      >
        <Typography
          component="h2"
          sx={{
            mb: 3,
            fontSize: { xs: '1.8rem', md: '2.3rem' },
            fontWeight: 700,
          }}
        >
          Ready to plan smarter?
        </Typography>

        <Button
          component={Link}
          to="/signup"
          variant="contained"
          size="large"
          sx={{
            minWidth: 140,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 700,
          }}
        >
          Sign Up
        </Button>
      </Box>
    </>
  );
}

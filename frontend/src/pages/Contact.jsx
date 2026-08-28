import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const developerCards = [
  {
    name: 'Olena Khvorostianenko',
    role: 'Full-Stack Software Engineer',
    email: 'olena.khvorostianenko@gmail.com',
    github: 'https://github.com/helen-khvorostianenko',
    linkedin: 'https://www.linkedin.com/in/olena-khvorostianenko/',
    initials: 'OK',
  },
  {
    name: 'Stephen Lewis',
    role: 'Software Engineer',
    email: 'st.rayis1085@yahoo.com',
    github: 'https://github.com/WizardOfWhimsical',
    linkedin: 'https://www.linkedin.com/in/stephenrlewis',
    initials: 'SL',
  },
  {
    name: 'Stephanie Mix',
    role: 'Full-Stack Developer & Product Marketing Manager',
    email: 'stephanie.robles26@gmail.com',
    github: 'https://github.com/stephcra123',
    linkedin: 'https://www.linkedin.com/in/stephaniemix',
  },
];

export default function Contact() {
  return (
    <Box component="main">
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}
      >
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 5, md: 8 },
          }}
        >
          <Typography variant="h1" gutterBottom>
            Contact Us / Meet the Developers
          </Typography>
          <Typography
            variant="h2"
            color="textSecondary"
            sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' } }}
          >
            Have questions, feedback, or want to connect? Reach out to our team!
          </Typography>
        </Box>

        {/* Main Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {developerCards.map((developer) => (
            <Card
              key={developer.email}
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4,
                }}
              >
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {developer.initials}
                </Avatar>
                <Typography variant="h5" component="h2" gutterBottom>
                  {developer.name}
                </Typography>

                <Typography color="text.secondary" gutterBottom>
                  {developer.role}
                </Typography>

                <Button
                  component="a"
                  href={`mailto:${developer.email}`}
                  startIcon={<EmailOutlinedIcon />}
                  sx={{ mt: 1 }}
                >
                  {developer.email}
                </Button>

                <Divider sx={{ width: '100%', my: 3 }} />

                <Stack direction="row" spacing={1}>
                  <Button
                    component="a"
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<GitHubIcon />}
                    aria-label={`${developer.name}'s GitHub profile`}
                  >
                    GitHub
                  </Button>

                  <Button
                    component="a"
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    startIcon={<LinkedInIcon />}
                    aria-label={`${developer.name}'s LinkedIn profile`}
                  >
                    LinkedIn
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

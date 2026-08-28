import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const teamMembers = [
  {
    name: 'Olena Khvorostianenko',
    role: 'Full-Stack Software Engineer',
    email: 'olena.khvorostianenko@gmail.com',
    github: 'https://github.com/helen-khvorostianenko',
    linkedin: 'https://www.linkedin.com/in/olena-khvorostianenko/',
    initials: 'OK',
    bio: 'I’m a software engineer with over 8 years of experience in backend development using PHP, JavaScript, and MySQL. After relocating from Ukraine, I joined Code the Dream to expand my skills into modern full-stack development with Node.js and React. I enjoy building efficient, well-structured applications and working across the stack to solve real problems.',
  },
  {
    name: 'Stephen Lewis',
    role: 'Software Engineer',
    email: 'st.rayis1085@yahoo.com',
    github: 'https://github.com/WizardOfWhimsical',
    linkedin: 'https://www.linkedin.com/in/stephenrlewis',
    initials: 'SL',
    bio: 'I’m your a-typical nerd or maybe just a typical 20 something who never quite grew out of being curious about everything. My love for computers and technology started where a lot of these stories do: Video Games. What I didn’t expect was for that interest to turn into a lifelong love of learning.',
  },
  {
    name: 'Stephanie Mix',
    role: 'Full-Stack Developer & Product Marketing Manager',
    email: 'stephanie.robles26@gmail.com',
    github: 'https://github.com/stephcra123',
    linkedin: 'https://www.linkedin.com/in/stephaniemix',
    bio: 'I came into Code the Dream with a decade of experience in product marketing and tech — launching AI and SaaS products, working alongside engineering teams, and creating technical documentation for developers. Learning to build the products I have spent years marketing felt like the natural next step. Through this program I am growing my full-stack development skills and deepening my understanding of how technology is actually made — which makes me a sharper strategist and a more credible voice in every technical conversation I am part of.',
  },
];

export default function Contact() {
  return (
    <Box component="main" sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        {/* Header / Intro */}
        <Box component="header" sx={{ mb: { xs: 5, md: 8 } }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}
          >
            About Us
          </Typography>

          <Typography
            variant="h6"
            color="textSecondary"
            sx={{
              maxWidth: 900,
              mx: 'auto',
              textAlign: 'center',
              lineHeight: 1.7,
            }}
          >
            Code the Dream is a non-profit organization learning community where
            mentors train and students learn to build real-world skills by
            creating apps and possibly other meaningful technology. Our team
            came together with one shared goal: to build a user-friendly app
            called TodayEatz. This app will allow the users to better manage
            their wellness and nutrition goals.
          </Typography>
        </Box>

        {/* Main Section / Team bios */}
        <Box component="section" sx={{ mb: { xs: 5, md: 8 } }}>
          {teamMembers.map((member) => (
            <Box
              key={member.name}
              component="article"
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                py: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:first-of-type': {
                  borderTop: '1px solid',
                  borderColor: 'divider',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'primary.main',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {member.initials}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {member.name}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="primary.main"
                  sx={{ fontWeight: 500, mb: 1 }}
                >
                  {member.role}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {member.bio}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer / Contact */}

        <Box
          component="footer"
          sx={{
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Contact the Team
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 3, flexWrap: 'wrap' }}
          >
            {teamMembers.map((member) => (
              <Button
                key={`${member.name}-email`}
                component="a"
                href={`mailto:${member.email}`}
                startIcon={<EmailOutlinedIcon />}
                variant="outlined"
                sx={{ minWidth: 220 }}
              >
                {member.name}
              </Button>
            ))}
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="wrap"
          >
            {teamMembers.map((member) => (
              <Box
                key={`${member.name}-links`}
                sx={{ display: 'flex', gap: 1 }}
              >
                <Button
                  component="a"
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="text"
                  startIcon={<GitHubIcon />}
                  aria-label={`${member.name}'s GitHub profile`}
                >
                  GitHub
                </Button>

                <Button
                  component="a"
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="text"
                  startIcon={<LinkedInIcon />}
                  aria-label={`${member.name}'s LinkedIn Profile`}
                >
                  LinkedIn
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

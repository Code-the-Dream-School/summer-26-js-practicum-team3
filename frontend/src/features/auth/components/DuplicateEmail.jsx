import { Box, Button, Stack, Typography } from '@mui/material';

function DuplicateEmail({ onSignIn, onTryAgain }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={600} align="center">
        Email already registered
      </Typography>
      <Typography variant="body1" align="left">
        An account with this email already exists. Sign in, or try registering
        with a different email.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" onClick={onSignIn}>
          Sign In
        </Button>
        <Button variant="outlined" onClick={onTryAgain}>
          Try Again
        </Button>
      </Box>
    </Stack>
  );
}
export default DuplicateEmail;

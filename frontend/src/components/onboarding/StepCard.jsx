import { Card, CardContent } from '@mui/material';

export default function StepCard({ children }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ textAlign: 'center', p: 4 }}>{children}</CardContent>
    </Card>
  );
}

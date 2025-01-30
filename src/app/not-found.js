
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import EngineeringIcon from '@mui/icons-material/Engineering';

  const Error = () => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <CssBaseline />
      <Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom>
            Error 404 <EngineeringIcon/> 
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
            {'La Pagina no Existe.'}
        </Typography>
        <Typography variant="body1">Error de referencia no detectado: desconocido no definido</Typography>
        <Link href="/start"><Button>Volver al inicio</Button></Link>
      </Container>
    </Box>
  );
}

export default Error;
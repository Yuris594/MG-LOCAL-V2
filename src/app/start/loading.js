import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
        <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
          <CircularProgress  color="inherit"/>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" height="10vh">
          <h1>Cargando....</h1>
        </Box>
      </Box>
    </>
  );
}

export default Loading;
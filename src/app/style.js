'use client';

import { createTheme } from "@mui/material"

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  palette: {
    primary: {
      main: "#00796b",
      button: "#174fe9",
    },
    background: {
      default: "#fff"
    }
  },
  typography: {
    fontFamily: "Roboto, Arial, san-serif"
  },
    fontSize: 25
});


export default theme;
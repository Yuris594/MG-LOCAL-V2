'use client';

import { useState } from "react";
import { Conexion } from "@/conexion";
import Grid from "@mui/material/Grid2";
import { Alert, Box, Button, CssBaseline, Snackbar, 
TextField, useMediaQuery, useTheme } from "@mui/material";

const registro = async (form) => {
  const response =  await fetch(Conexion.url + "/usuarios/nuevo", {
    method: "POST",
    body: JSON.stringify(form), 
    headers: { "Content-Type": "application/json" }
  });
  return response.json()
}

  const Registro = ({ onClose }) => {
  const [form, setForm] = useState({});
  const [open, setOpen] = useState(false);
  const [openE, setOpenE] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const register = async (e) => {
    e.preventDefault();
    console.log("Datos del formulario", form);
      if (!form.PER_Nom || !form.IdDiv){
        setOpenE(true);
        return;
      }
      try {
        const response = await registro(form)
          if (response.ok) {
            onClose();

            setOpen(true)
            console.log("Salida exitosa");
            window.location.reload();
          } else {
            setOpenE(true);
          }
      } catch (error) {
        console.error("Error al enviar la solicitud: ", error);
      }
    }

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setOpenE(false);
  };

  return (
    <>
      <CssBaseline />
        <Box component="form" onSubmit={register}>
          <h3 style={{ textAlign: "center" }}>REGISTRO DE USUARIO</h3>
          <Grid container spacing={2}>
            <Grid size={{ sx: 12, md: 6 }}>
                <TextField
                  autoComplete="given-name"
                  name="PER_Nom"
                  required
                  fullWidth
                  id="PER_Nom"
                  label="NOMBRE"
                  autoFocus
                  value={form.PER_Nom || ''}
                  onChange={handleChange}
                />
            </Grid>
            <Grid size={{ sx: 12, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  id="Usuario"
                  label="USUARIO"
                  name="PER_Usuario"
                  autoComplete="family-name"
                  value={form.PER_Usuario || ''}
                  onChange={handleChange}
                />
            </Grid>
            <Grid size={{ sx: 12, md: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="Clave"
                  label="CLAVE"
                  type="password"
                  name="PER_Clave"
                  autoComplete="email"
                  value={form.PER_Clave || ''}
                  onChange={handleChange}
                />
            </Grid>
            <Grid size={{ sx: 12, md: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="IdDiv"
                  label="IdDIV"
                  type="number"
                  id="IdDiv"
                  autoComplete="new-password"
                  value={form.IdDiv || ''}
                  onChange={handleChange}
                />
            </Grid>
            <Grid size={{ sx: 12, md: 6 }}>
                <TextField
                  fullWidth
                  id="PERAUTOPED"
                  label="PERAUTOPED"
                  type="number"
                  name="PERAUTOPED"
                  autoComplete="email"
                  value={form.PERAUTOPED || ''}
                  onChange={handleChange}
                />
            </Grid>
            <Grid size={{ sx: 12, md: 4 }}>
                <TextField
                  fullWidth
                  id="CODVEND"
                  label="CODVEND"
                  name="CODVEND"
                  autoComplete="email"
                  value={form.CODVEND || ''}
                  onChange={handleChange}
                />
            </Grid>
            <Grid size={{ sx: 12, md: 4 }}>
                <TextField
                  fullWidth
                  id="PREFIJO"
                  label="PREFIJO"
                  name="PREFIJO"
                  autoComplete="email"
                  value={form.PREFIJO || ''}
                  onChange={handleChange}
                />
            </Grid>
            <Grid size={{ sx: 12, md: 4 }}>
                <TextField
                  fullWidth
                  id="CONSECUTIVOPED"
                  label="CONSECUTIVOPED"
                  type="number"
                  name="CONSECUTIVOPED"
                  autoComplete="email"
                  value={form.CONSECUTIVOPED || ''}
                  onChange={handleChange}
                />
            </Grid>
            <Grid size={{ sx: 12, md: 12 }}>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  registrar
              </Button>
            </Grid>
          </Grid>
      </Box>
      {open ?  
          <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
              Registro Exitoso
            </Alert>
        </Snackbar>
      : "" }

      {openE ?  
          <Snackbar open={openE} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
            <Alert onClose={handleClose} severity="error"  sx={{ width: '100%' }}>
              Registro denegado
            </Alert>
        </Snackbar>
      : "" }
    </>
  )
}

export default Registro;


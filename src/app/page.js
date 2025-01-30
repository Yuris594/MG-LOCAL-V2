'use client';

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { Conexion } from "@/conexion";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "@/context/authContext";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import { AppBar, Box, Button, Paper, Snackbar, TextField, Toolbar, Typography } from "@mui/material";


const Alert = React.forwardRef(function Alert(props, ref) {
  return (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  );
});

export function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Departamento de Sistemas © Version 0.2 - "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Iniciar = async (usuario, clave) => {
  const response = await fetch(`/api/usuarios/listar/${usuario}/${clave}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { error: { detail: "Credenciales incorrectas" } };
    } else {
      return { error: { detail: "Error desconocido" } };
    }
  }
  return response.json();
};

function Login() {
  const theme = useTheme();
  const router = useRouter();
  const { login, auth } = useAuth();
  const [clave, setClave] = useState('');
  const [open, setOpen] = useState(false);
  const [openE, setOpenE] = useState(false);
  const [error, setError] = useState(false);
  const [usuario, setUsuario] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario || !clave) {
      setError(true);
      setOpenE(true);
      return;
    }

    try {
      const resultado = await Iniciar(usuario, clave);
        if (resultado.error) {
          setError(true);
          setOpenE(true);
        } else {
          const tokens = resultado;
          login(tokens);
          router.push("./start/");
          setOpen(true);
        }
    } catch (error) {
          setError(true);
          setOpenE(true);
          console.log("Error en la pagina Iniciar Sesión", error)
    }
  };


  const handleClose = (reason) => {
    if (reason === "clicaway") {
      return;

    }
    setOpen(false);
    setOpenE(false);
  };

  return (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ bgcolor: "#262626", height: "70px" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", }}>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}></Typography>
              <Button component={Link} href="./components/ingresos/" sx={{ color: "white" }}
                title="Control de Entreda y Salida de los Empleados">
                <TransferWithinAStationIcon sx={{ fontSize: 40 }} />
              </Button>
            </Toolbar>
          </AppBar>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%",  mt: 5 }}>
          <Paper component="main" elevation={3} sx={{ width: "380px", padding: "20px", borderRadius: "15px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "white", boxShadow: 3 }}>
            <Box sx={{ textAlign: "center", marginBottom: "20px", width: { xs: "250px", sm: "280px", md: "320px" }, height: "auto" }}>
              <img src="/logo_miguelgomez.png" alt="LOGO" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </Box>
            
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <TextField
                error={error}
                id="usuario"
                label="Usuario"
                margin="normal"
                fullWidth
                name="PER_Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />

              <TextField
                error={error}
                margin="normal"
                required
                fullWidth
                type="password"
                name="PER_Clave"
                id="contraseña"
                label="Contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />

              <Button type="submit" fullWidth  sx={{ mt: 2, backgroundColor: "#11eb6c", color: "white", "$:hover": { backgroundColor: "#35eb11" } }}>
                Iniciar sesión
              </Button>
            </Box>
          <Copyright sx={{ mt: 3, mb: 1 }} />
        </Paper>
      </Box>
      

        {open ? (
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} variant="outlined" severity="success" sx={{ width: "100%" }}>
              {`¡Hola, ${auth.PER_Nom}! Tu sesión ha comenzado.`}
            </Alert>
          </Snackbar>
        ) : ( "" )}

        {openE ? ( 
          <Snackbar open={openE} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} variant="outlined" severity="error" sx={{ width: "100%" }}>
              {'No se pudo iniciar sesión. Verifica tus credenciales.'}
            </Alert>
          </Snackbar>
        ) : ( "" )}
    </>
  );
}

export default Login;


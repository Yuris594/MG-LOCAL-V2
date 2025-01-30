"use client";

import Link from "next/link";
import Swal from "sweetalert2";
import dynamic from 'next/dynamic';
import { Conexion } from "@/conexion";
import { useEffect, useRef, useState } from "react";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
const WifiIcon = dynamic(() => import("@mui/icons-material/Wifi"), {ssr:false});
const WifiOffIcon = dynamic(() => import("@mui/icons-material/WifiOff"), {ssr:false});
import { AppBar, Box, Button, CssBaseline, Paper, TextField, Toolbar, Typography } from "@mui/material";


const showAlert = (title, icon, text = null) => {
  Swal.fire({
    title,
    text,
    icon,
    timer: 1000
  });
};

const registro = async (cedula) => {
  try {
    const response = await fetch(`/api/control_entradas/documento/${cedula}`, {
      method: "POST",
      body: JSON.stringify(cedula), 
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }
    return response.json();
  } catch(error) {
    console.error("Error al realizar la peticion", error);
    return null;
  }
}

const Ingresos = () => {
  const inputRef = useRef(null);
  const [cedula, setCedula] = useState('');
  const [online, setOnline] = useState(navigator.onLine);


  useEffect(() => {
    setOnline(navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);


  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current.focus();
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);


  const ingreso = async (e) => {
    if (!cedula) {
      showAlert("Cédula requerida", "info", "Por favor, ingresa la cédula");
      return;
    }

    if (!online) {
      showAlert("Sin conexión", "warning", "Verifique su conexión a internet");
      return;
    }

    try {
      showAlert("Estamos procesando su información.", "info", "Si esta muy lento, cancele el proceso y verifique su conexion.");
      const datos = await registro(cedula);
      console.log("Datos recibidos:", datos);

      if (datos?.respuesta !== undefined) {
        setCedula("");
        const mensajes = {
          "0": "¡Hora de ENTRADA registrada!",
          "1": "¡Hora de SALIDA registrada!",
          "2": "Ya Registró su hora de Entrada.",
          "3": "Cédula No Existe.",
        };
        const iconos = {
          "0": "success",
          "1": "success",
          "2": "info",
          "3": "error",
        };

        showAlert(mensajes[datos.respuesta], iconos[datos.respuesta]);
      } else {
        console.error("Datos no recibidos o respuesta indefinida");
        showAlert("Error de conexión", "error", "No se pudo procesar la solicitud.");
      }
    } catch (error) {
      console.log("Error al procesar la solicitud:", error);
    }
  };


  const handleClick = (value) => setCedula((prev) => prev + value);
  const handleDelete = () => setCedula((prev) => prev.slice(0, -1));


  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      ingreso(); 
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <AppBar position="static" sx={{ bgcolor: "#262626", height: "80px" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", }}>
            <Button component={Link} href="/" sx={{ color: "white" }}>
              <KeyboardReturnIcon sx={{ fontSize: 60, paddingTop: 1 }} />
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      
      <CssBaseline />
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "auto", margin: 2 }}>
        <Paper sx={{ width: "90%", maxWidth: 400, padding: 3, borderRadius: 2, boxShadow: 3, }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2, }}>
            <Box sx={{ width: 80, height: "auto" }}>
              <img src="/logo_miguelgomez-bglight.png" alt="LOGO" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
            </Box>
            {online ? (
              <WifiIcon sx={{ color: "green", fontSize: 25 }} />
            ) : (
              <WifiOffIcon sx={{ color: "red", fontSize: 25 }} />
            )}
          </Box>

          <Typography sx={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", marginBottom: 3, }}>
            REGISTRO DE INGRESOS
          </Typography>

          <TextField
            fullWidth
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ingrese su cédula"
            inputRef={inputRef}
            onKeyDown={handleKeyPress}
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                fontSize: 15,
                textAlign: "center",
              },
            }}
            
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((key, index) => (
              <Button
                key={index}
                variant="contained"
                onClick={() => key === "⌫" ? handleDelete() : handleClick(key)}
                disabled={key === ""}
                sx={{
                  height: 45,
                  borderRadius: 2,
                  fontSize: 16,
                  backgroundColor: key === "⌫" ? "#d32f2f" : "#59ee60",
                  color: "white",
                  "&:hover": { backgroundColor: key === "⌫" ? "#9a0007" : "#15b337", }, }}>
                {key}
              </Button>
            ))}
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={ingreso}
            sx={{
              mt: 4,
              bgcolor: "#11eb6c",
              fontSize: 15,
              fontWeight: "bold",
              ":hover": { bgcolor: "#0db45e" }, 
            }}>
              Registrar
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default Ingresos;



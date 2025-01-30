"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import Banner from "@/app/components/banner/banner";
import DeleteIcon from "@mui/icons-material/Delete";
import ClientesGlobal from "../clients/clientesGlobal/page";
import { Box, Modal, Button, ButtonGroup, IconButton, List, ListItem, 
ListItemButton, ListItemText, Paper, Typography, Divider } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "90vh",
  maxWidth: "80vw",
  overflowY: "auto",
  overflowX: "hidden",
  padding: "16px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: 24
};

const pago = () => {
  const [pagoF] = useState([]);
  const [banco, setBanco] = useState(0);
  const [cambio, setCambio] = useState(0);
  const [open, setOpen] = useState(false);
  const [efectivo, setEfectivo] = useState(0);
  const [restante, setRestante] = useState("");
  const { caja, setCaja, cliente } = useAuth();
  const [cuentaCliente, setCuentaCliente] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const keyCode = e.keyCode || e.which;
      if ((keyCode >= 48 && keyCode <= 57) || keyCode === 13) {
        let opt;

        if (selectedIndex === 0) {
          opt = setEfectivo;
        } else if (selectedIndex === 1) {
          opt = setBanco;
        } else if (selectedIndex === 2) {
          setCuentaCliente(caja.total);
        }

        if (opt) {
          opt((prevNumero) => {
            return prevNumero === 0
              ? String.fromCharCode(keyCode)
              : prevNumero + String.fromCharCode(keyCode);
          });
        }
      }
    };

    const handleKeyDown = (event) => {
      const keyCode = event.keyCode || event.which;
      if (keyCode === 8) {
        handleDelete();
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [efectivo, selectedIndex]);

  useEffect(() => {
    const nuevoEstado = [...pagoF, { dinero: efectivo }, { dinero: banco }];
    const sumaSaldoDESC = nuevoEstado.reduce((sum, dinero) => {
      return sum + parseInt(dinero.dinero);
    }, 0);

    const efectivoNumerico = sumaSaldoDESC;
    const efectivoNumericoC = cuentaCliente;

    const totalNumerico = caja.total;
    const numeroSinPuntos = totalNumerico.replace(/\./g, "");
    const numero = parseInt(numeroSinPuntos);

    if (totalNumerico === efectivoNumericoC) {
      if (!isNaN(cuentaCliente) && !isNaN(numero)) {
        const restante = numero - numero;
        const cambio = numero - numero;
        setRestante(restante >= 0 ? restante : 0);
        setCambio(cambio >= 0 ? cambio : 0);
      } else {
        setRestante(0);
        setCambio(0);
      }
    } else {
      if (!isNaN(efectivoNumerico) && !isNaN(numero)) {
        const restante = numero - efectivoNumerico;
        const cambio = efectivoNumerico - numero;
        console.log("Restante" + restante);
        console.log("Restante" + cambio);

        setRestante(restante >= 0 ? restante : 0);
        setCambio(cambio >= 0 ? cambio : 0);
      } else {
        setRestante(0);
        setCambio(0);
      }
    }
  }, [efectivo, banco, cuentaCliente, selectedIndex]);

  const handleListItemClick = (e, index) => {
    if (index === 2) {
      setCuentaCliente(caja.total);
    }
    setSelectedIndex(index);
  };

  const handleClick = (e) => {
    const nuevoValor = e.currentTarget.value;
    let opt;

    if (selectedIndex === 0) {
      opt = setEfectivo;
    } else if (selectedIndex === 1) {
      opt = setBanco;
    } else if (selectedIndex === 2) {
      setCuentaCliente(caja.total);
    }

    if (opt) {
      opt((prevEfectivo) => {
        return prevEfectivo === 0 ? nuevoValor : prevEfectivo + nuevoValor;
      });
    }
  };

  const handleDelete = () => {
    let opt;

    if (selectedIndex === 0) {
      opt = setEfectivo;
    } else if (selectedIndex === 1) {
      opt = setBanco;
    } else if (selectedIndex === 2) {
      setCuentaCliente(0);
    }

    if (opt) {
      opt((prevEfectivo) => {
        if (prevEfectivo.length > 1) {
          return prevEfectivo.slice(0, -1);
        } else {
          return 0;
        }
      });
    }
  };

  const handleDeleteComplete = (event) => {
    const valor = parseInt(event.currentTarget.value);
    let opt;

    if (valor === 0) {
      opt = setEfectivo;
    } else if (valor === 1) {
      opt = setBanco;
    } else if (valor === 2) {
      opt = setCuentaCliente;
    }

    if (opt) {
      opt((prevEfectivo) => {
        if (prevEfectivo.length > 10) {
          return prevEfectivo.slice(0, -1);
        } else {
          return 0;
        }
      });
    }
  };

  const actualizarInformacion = () => {
    const nuevoEstado = [
      ...pagoF,
      { efectivo: efectivo },
      { banco: banco },
      { cuentaCliente: cuentaCliente },
    ];
    const datos = JSON.parse(localStorage.getItem("pago")) || {};

    datos.cliente = cliente;
    datos.tipoPago = nuevoEstado;
    datos.cambio = cambio;
    localStorage.setItem("pago", JSON.stringify(datos));
    setCaja(datos);
  };

  const Cerrar = () => {
    localStorage.removeItem("pago");
    setCaja({});
  };

  return (
    <>
      <Box> {" "} <Banner /> {" "} </Box>
      <Box sx={{  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)', }}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", margin: 1 }}>
          <h2 style={{ fontSize: "2rem", alignItems: "center", justifyContent: "center" }}>
            {" "} PAGO {" "}
          </h2>
          <Button component={Link} variant="outlined" href="../pedidos/pedidosCaja/" sx={{ bgcolor: "#B0DDFF", color: "black" }} onClick={Cerrar}>
            Atras
          </Button>
        </Box>
        <Divider></Divider>

        <Paper sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
          <Paper sx={{ width: "50%", bgcolor: "background" }}>
            <Paper sx={{ backgroundColor: "#ffffff" }}>
              <Typography sx={{ fontSize: 17 }} color="primary" gutterBottom>Metodo de Pago</Typography>
            </Paper>

            <Paper>
              <List component="nav" aria-label="main mailbox folders">
                <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
                  <ListItemText primary="Efectivo" />
                </ListItemButton>

                <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                  <ListItemText primary="Banco" />
                </ListItemButton>

                <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
                  <ListItemText primary="Cuenta Cliente" />
                </ListItemButton>
              </List>
            </Paper>

            <Paper sx={{ backgroundColor: "#ffffff" }}>
              <Typography sx={{ fontSize: 17, marginBottom: 1 }} color="primary" gutterBottom>
                Resumen
              </Typography>
            </Paper>

            <Paper>
              <ListItem secondaryAction={
                  <IconButton value={0} onClick={handleDeleteComplete} edge="end: " aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }>
                <ListItemText primary={`Efectivo:  ${efectivo.toLocaleString("es")}`} />
              </ListItem>

              <ListItem secondaryAction={
                  <IconButton value={1} onClick={handleDeleteComplete} edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }>
                <ListItemText primary={"Banco:   " + banco.toLocaleString("es")} />
              </ListItem>

              <ListItem secondaryAction={
                  <IconButton value={2} onClick={handleDeleteComplete} edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }>
                <ListItemText primary={ "Cuenta Cliente: " + cuentaCliente.toLocaleString("es")} />
              </ListItem>
            </Paper>

            <ButtonGroup orientation="vertical" aria-label="vertical outlined button group" variant="text" sx={{ margin: 0, width: "100%", height: "100%" }}>
              <Button
                component={Link}
                href="../pedidos/ReciboCaja/"
                variant="outlined"
                onClick={actualizarInformacion}
                sx={{
                  width: "100%",
                  height: 250,
                  backgroundColor: restante === 0 ? "#00796b" : "transparent",
                  color: restante === 0 ? "white" : "black",
                }}>
                Validar
              </Button>
            </ButtonGroup>
          </Paper>

          <Paper sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", zoom: 2, width: "auto", }}>
              <ButtonGroup variant="text" aria-label="text button group" sx={{ height: 60 }}>
                <Button sx={{ flexDirection: "row" }}>
                  <Typography variant="outline" sx={{ display: "flex", paddingRight: 2, color: "black", fontSize: "8px" }} gutterBottom>
                    {" "}Cambio: {" "}
                  </Typography>
                  <Typography sx={{ fontSize: "8px" }} gutterBottom>
                    {" "}${cambio.toLocaleString("es")}{" "}
                  </Typography>
                </Button>

                <Button sx={{ flexDirection: "row" }}>
                  <Typography variant="outline" sx={{ display: "flex", paddingRight: 2, color: "black", fontSize: "8px",}} gutterBottom>
                    {" "}Restante: {" "}
                  </Typography>
                  <Typography sx={{ fontSize: "8px" }} gutterBottom>
                    {" "}${restante.toLocaleString("es")}{" "}
                  </Typography>
                </Button>

                <Button sx={{ flexDirection: "row" }}>
                  <Typography variant="outline" sx={{ display: "flex", paddingRight: 2,  color: "black", fontSize: "8px" }} gutterBottom>
                    {" "}Total: {" "}
                  </Typography>
                  <Typography sx={{ fontSize: "8px" }} gutterBottom>
                    {" "}${caja.total}{" "}
                  </Typography>
                </Button>
              </ButtonGroup>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", alignContent: "center", width: "100%", height: "100%", zoom: 1.5, }}>
              <ButtonGroup orientation="vertical" aria-label="vertical outlined button group" variant="text" sx={{ margin: "2px", width: "50%", height: "100%" }}>
                <Button variant="outlined" sx={{ height: "100px" }} value={1} onClick={handleClick}>
                  1
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={4} onClick={handleClick}>
                  4
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={7} onClick={handleClick}>
                  7
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={0} onClick={handleClick}>
                  +/-
                </Button>
              </ButtonGroup>

              <ButtonGroup orientation="vertical" aria-label="vertical contained button group" variant="text" sx={{ margin: "2px", width: "50%", height: "100%" }}>
                <Button
                  variant="outlined" sx={{ height: "100px" }} value={2} onClick={handleClick}>
                  2
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={5} onClick={handleClick}>
                  5
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={8} onClick={handleClick}>
                  8
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={0} onClick={handleClick}>
                  0
                </Button>
              </ButtonGroup>

              <ButtonGroup orientation="vertical" aria-label="vertical contained button group" variant="text" sx={{ margin: "2px", width: "50%", height: "100%" }}>
                <Button variant="outlined" sx={{ height: "100px" }} value={3} onClick={handleClick}>
                  3
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={6} onClick={handleClick}>
                  6
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={9} onClick={handleClick}>
                  9
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={","} onClick={handleClick}>
                  ,
                </Button>
              </ButtonGroup>

              <ButtonGroup orientation="vertical" aria-label="vertical contained button group" variant="text" sx={{ margin: "2px", width: "50%", height: "100%" }}>
                <Button variant="outlined" sx={{ height: "100px" }} value={10} onClick={handleClick}>
                  +10
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={20} onClick={handleClick}>
                  +20
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} value={50} onClick={handleClick}>
                  +50
                </Button>
                <Button variant="outlined" sx={{ height: "100px" }} onClick={handleDelete}>
                  X
                </Button>
              </ButtonGroup>
            </Box>
          </Paper>

          <Paper sx={{ width: "20%", bgcolor: "background.paper" }}>
            <List component="nav" aria-label="main mailbox folders" sx={{ marginTop: -47 }}>
              <ListItemButton selected={selectedIndex === 3} onClick={handleOpen}>
                <ListItemText primary={`CLIENTE: ${cliente.NOMBREALIAS}`} />
              </ListItemButton>
              <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}>
                <ListItemText primary="FACTURA" />
              </ListItemButton>
            </List>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={style}>
                <ClientesGlobal setOpen={setOpen} />
              </Box>
            </Modal>
          </Paper>
        </Paper>
      </Box>
    </>
  );
};

export default pago;

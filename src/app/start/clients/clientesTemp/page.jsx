"use client";

import Link from "next/link";
import PropTypes from "prop-types";
import { Conexion } from "@/conexion";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "@/context/authContext";
import Banner from "@/app/components/banner/banner";
import { Box, Tabs, Tab, Typography, TextField, Divider, Button, 
ButtonGroup, Paper, LinearProgress, useMediaQuery } from "@mui/material";


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const fDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

const columnsP = [
  { field: "FECHA_PEDIDO", headerName: "FECHA", width: 150,
    renderCell: (params) => fDate(params.value),
  },
  { field: "PEDIDO", headerName: "PEDIDO", width: 130, 
    cellClassName: "pedido-cell" 
  },
  { field: "ESTADO", headerName: "ESTADO", width: 130 },
  { field: "AUTORIZADONOM", headerName: "AUTORIZADO", width: 130, 
    cellClassName: "autor-cell" 
  },
  { field: "TOTAL_A_FACTURAR", headerName: "TOTAL A FACTURAR", width: 200,
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `$${parseFloat(precio).toLocaleString()}`;
    }, 
  },
  { field: "CreatedBy", headerName: "CREADO POR", width: 150 },
  { field: "U_EDITADOPOR", headerName: "EDITADO POR ", width: 150 },
  { field: "OBSERVACIONES", headerName: "NOTAS", width: 200 },
  { field: "COMENTARIO_CXC", headerName: "COMENTARIOS CL", width: 200 },
];


const columnsF = [
  { field: "FACTURA", headerName: "FACTURA", width: 130 },
  { field: "FECHA_DESPACHO", headerName: "FECHA", width: 190,
    renderCell: (params) => fDate(params.value),
  },
  { field: "ANULADA", headerName: "AN", width: 130 },
  { field: "PRECIO_TOTAL", headerName: "V. FACT", width: 130,
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `$${parseFloat(precio).toLocaleString()}`;
    },
  },
  { field: "PEDIDO", headerName: "PEDIDO", width: 130, 
    cellClassName: "pedido-cell" 
  },
  { field: "ARTICULO", headerName: "ARTICULO", width: 130 },
  { field: "DESCRIPCION", headerName: "DESCRIPCION", width: 700 },
  { field: "CANTIDAD", headerName: "CANT", width: 130, },
  { field: "PRECIO_UNITARIO", headerName: "PRECIO UNI.", width: 130,
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `$${parseFloat(precio).toLocaleString()}`;
    },
  },
  { field: "PORCIVA", headerName: "IVA", width: 100, },
  { field: "PORDESC", headerName: "DESC", width: 130, },
  { field: "VDESC", headerName: "V DESC", width: 130 },
  { field: "TOTAL_MERCADERIA", headerName: "V. TOTAL ", width: 130,
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `$${parseFloat(precio).toLocaleString()}`;
    },
  },
  { field: "IDRUTERO", headerName: "ID RUTERO", width: 100 },
  { field: "IDGUIA", headerName: "ID GUIA", width: 100 },
  { field: "OBSERVACIONES", headerName: "OBSERVACIONES", width: 400 },
  { field: "RUBRO1", headerName: "DOCS 2", width: 200 },
];


const columnsC = [
  { field: "DOC", headerName: "DOC", width: 130 },
  { field: "FECHADOC",  headerName: "FECHA DOC", width: 190,
    renderCell: (params) => fDate(params.value),
  },
  { field: "FECHAVENC", headerName: "FECHA VENC", width: 190,
    renderCell: (params) => fDate(params.value),
  },
  { field: "NUMDOC", headerName: "NUM DOC", width: 130, 
    cellClassName: "autor-cell" 
  },
  { field: "DIASVENC", headerName: "VENC", width: 130, },
  { field: "MONTO", headerName: "MONTO", width: 130,
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `$${parseFloat(precio).toLocaleString()}`;
    }, 
  },
  { field: "SALDO", headerName: "SALDO", width: 130,  
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `$${parseFloat(precio).toLocaleString()}`;
    }, cellClassName: "plazo-cell",
  },
  { field: "SMenorA30", headerName: "VENC < 30", width: 130,
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `$${parseFloat(precio).toLocaleString()}`;
    },
  },
  { field: "SMayorA60", headerName: "VENC < 60", width: 130,
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `$${parseFloat(precio).toLocaleString()}`;
    }, 
  },
  { field: "SMenorA60", headerName: "VENC > 60", width: 130,
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `$${parseFloat(precio).toLocaleString()}`;
    }, 
  },
  { field: "PLAZO", headerName: "PLAZO", width: 130, 
    cellClassName: "plazo-cell" 
  },
  { field: "VENDEDOR", headerName: "VENDEDOR", width: 130 },
];



const ConseguirPedidos = async (clienteT) => {
  const response = await fetch(`/api/clientes/pedidos/${clienteT.CLIENTE}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", },
  });
  if (!response.ok) {
    if (response.status === 404) {
      console.log("No hay pedidos para este cliente.");
      return [];
    }
  }
  return response.json();
};

const ConseguirFacturas = async (clienteT) => {
  const response = await fetch(`/api/clientes/facturas/${clienteT.CLIENTE}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", },
  });
  if (!response.ok) {
    if (response.status === 404) {
      console.log("No hay facturas para este cliente.");
      return [];
    }
  }
  return response.json();
};

const ConseguirCarteras = async (clienteT) => {
  const response = await fetch(`/api/clientes/cartera/${clienteT.CLIENTE}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", },
  });
  if (!response.ok) {
    if (response.status === 404) {
      console.log("No hay cartera para este cliente.");
      return [];
    }
  }
  return response.json();
};


const ClientesTemp = () => {
  const { cliente } = useAuth();
  const [selectedRows] = useState([]);
  const [value, setValue] = useState(3);
  const [cartera, setCartera] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [clienteT, setClienteT] = useState(cliente[0]);
  const [sumaSaldoTotal, setSumaSaldoTotal] = useState(0);
  const [sumaSaldo60Total, setSumaSaldo60Total] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setCargando(true);
    if (clienteT) {
      obtenerPedidos(clienteT.CLIENTE);
      obtenerFacturas(clienteT.CLIENTE);
      obtenerCarteras(clienteT.CLIENTE);
    }
  }, [value]);


  useEffect(() => {
    if (Array.isArray(cartera)) {
      const sumaSaldo60 = cartera.reduce((total, item) => total + item.SMayorA60, 0);
      const saldo60Redondeado = Number(sumaSaldo60).toFixed(0);
      setSumaSaldo60Total(`${parseFloat(saldo60Redondeado).toLocaleString()}`);

      const sumaSaldo = cartera.reduce((total, item) => total + item.SALDO, 0);
      const precioRedondeado = Number(sumaSaldo).toFixed(0);
      setSumaSaldoTotal(`${parseFloat(precioRedondeado).toLocaleString()}`);
    }
  }, [cartera]);


  const obtenerPedidos = async () => {
    const datos = await ConseguirPedidos(clienteT);
    if (datos) {
      setPedidos(datos);
      setCargando(false);
    } else {
      console.log("Error al obtener los datos");
      setPedidos([]);
      setCargando(false);
    }
  };

  const obtenerFacturas = async () => {
    const datos = await ConseguirFacturas(clienteT);
    if (datos) {
      setFacturas(datos);
      setCargando(false);
    } else {
      console.log("Error al obtener los datos");
      setFacturas([]);
      setCargando(false);
    }
  };

  const obtenerCarteras = async () => {
    const datos = await ConseguirCarteras(clienteT);
    if (datos) {
      setCartera(datos);
      setCargando(false);
    } else {
      console.log("Error al obtener los datos");
      setCartera([]);
      setCargando(false);
    }
  };

  return (
    <>
      <Box><Banner /></Box>
      
      <Paper elevation={3} sx={{ padding: 3, margin: "0 auto", marginTop: 3, maxWidth: 1000, width: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
            <Button variant="contained" sx={{ bgcolor: "#ffa28a", color: "white" }} LinkComponent={Link} href="../">
              Cerrar
            </Button>
            <Button variant="contained" sx={{ bgcolor: "#12e7dd", color: "white" }} LinkComponent={Link} href="../../pedidos/crearPedido/">
              Crear Pedido
            </Button>
          </Box>

        <Divider orientation="horizontal" />

        <h3><strong style={{ fontSize: 20, color: "#6d32f7" }}>{clienteT?.NOMBREALIAS || ""}</strong></h3>

        <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: isSmallScreen ? "column" : "row", alignItems: "center" }}>
          <Grid container rowSpacing={1.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ p: 1 }}>
            <Grid size={{ xs: 9, sm: 6, md: 3 }}>
              <strong>NIT</strong>
              <Typography sx={{ mb: 1.5, display: "flex" }}>
                {clienteT?.CLIENTE || ""}
              </Typography>
            </Grid>

            <Grid size={{ xs: 9, sm: 6, md: 3 }}>
              <strong>Cupo</strong>
              <Typography sx={{ mb: 1.5, display: "flex", color: "#16f50f" }}> 
                ${Number(clienteT?.CUPO || "0").toLocaleString("es-ES")} 
              </Typography>
            </Grid>

            <Grid size={{ xs: 9, sm: 6, md: 3 }}>
              <strong>Debe</strong>
              <Typography sx={{ mb: 1.5, display: "flex", color: "#f50f0f" }}>
                ${Number(clienteT?.SALDO || "0").toLocaleString("es-ES")}
              </Typography>
            </Grid>

            <Grid size={{ xs: 9, sm: 6, md: 3 }}>
              <strong>Teléfono</strong>
              <Typography sx={{ mb: 1.5, display: "flex" }}>
                {clienteT?.TELEFONO1 || ""}
              </Typography>
            </Grid>

            <Grid size={{ xs: 9, sm: 6, md: 3 }}>
              <strong>Celular</strong>
              <Typography sx={{ mb: 1.5, display: "flex" }}>
                {clienteT?.TELEFONO1 || ""}
              </Typography>
            </Grid>

            <Grid size={{ xs: 9, sm: 6, md: 3 }}>
              <strong>Dirección</strong>
              <Typography sx={{ mb: 1.5, display: "flex" }}>
                {clienteT?.DIRECCION || ""}
              </Typography>
            </Grid>

            <Grid size={{ xs: 9, sm: 6, md: 3 }}>
              <strong>Ciudad</strong>
              <Typography sx={{ mb: 1.5, display: "flex" }}>
                {clienteT?.CIUDAD || ""}
              </Typography>
            </Grid>

            <Grid size={{ xs: 9, sm: 6, md: 3 }}>
              <strong>Departamento</strong>
              <Typography sx={{ mb: 1.5, display: "flex" }}>
                {clienteT?.DEPARTAMENTO || ""}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 8, md: 8}}>
              <strong>Email</strong>
              <Typography sx={{ mb: 1.5, display: "flex" }}>
                {clienteT?.E_MAIL || ""}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 8, md: 8}}>
              <TextField
                id="outlined-basic"
                multiline
                rows={3}
                defaultValue={clienteT?.NOTAS || ""}
                variant="outlined"
                sx={{ width: "100%", border: "2px solid #13ace9" }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 8, md: 4}}>
              <Box sx={{ dispĺay: "flex", justifyContent: "space-around", alignItems: "center", gap: 2, flexWrap: isSmallScreen ? "wrap" : "nowrap" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", }}>
                  <ButtonGroup variant="text" aria-label="text button group" sx={{ height: 60 }}>
                    <Button sx={{ flexDirection: "column" }}>
                      <Typography sx={{ display: "flex", fontSize: 14, paddingRight: 5 }} gutterBottom >
                        ${sumaSaldoTotal}
                      </Typography>
                      <strong>Saldo</strong>
                    </Button>

                    <Button sx={{ flexDirection: "column" }}>
                      <Typography sx={{ display: "flex", fontSize: 14, paddingRight: 5 }} gutterBottom>
                        ${sumaSaldo60Total}
                      </Typography>
                      <strong>Saldo Mayor a 60</strong>
                    </Button>
                  </ButtonGroup>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>


        <Box sx={{ width: "100%", mt: 3 }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Pedidos" {...a11yProps(0)} onClick={obtenerPedidos} />
            <Tab label="Facturas" {...a11yProps(1)} onClick={obtenerFacturas} />
            <Tab label="Cartera" {...a11yProps(2)} onClick={obtenerCarteras} />
            <Tab label="" {...a11yProps(3)}  />
          </Tabs>
      
          <CustomTabPanel value={value} index={0}>
            <Box sx={{ width: "100%", height: 320 }}>
              {cargando === true ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              ) : pedidos.length <= 0 ? (
                <h2>NO HAY PEDIDOS</h2>
              ) : (
                <DataGrid
                density="compact"
                rows={pedidos}
                columns={columnsP}
                  getRowId={(row) => row.PEDIDO}
                  pageSizeOptions={[10, 15, 20]}
                  rowSelectionModel={selectedRows}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                />
              )}
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <Box sx={{ width: "100%", height: 320 }}>
              {cargando === true ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              ) : facturas.length <= 0 ? (
                <h2>NO HAY FACTURAS</h2>
              ) : (
                <DataGrid
                  density="compact"
                  rows={facturas}
                  columns={columnsF}
                  getRowId={(row) => row.ID}
                  pageSizeOptions={[10, 15, 20]}
                  rowSelectionModel={selectedRows}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                />
              )}
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={2}>
            <Box sx={{ width: "100%", height: 320 }}>
              {cargando === true ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              ) : cartera.length <= 0 ? (
                <h2>NO HAY CARTERA</h2>
              ) : (
                <DataGrid
                  density="compact"
                  rows={cartera}
                  columns={columnsC}
                  getRowId={(row) => row.NUMDOC}
                  pageSizeOptions={[10, 15, 20]}
                  rowSelectionModel={selectedRows}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                    },
                  }}
                />
              )}
            </Box>
          </CustomTabPanel>
        </Box>
      </Paper>
    </>
  );
};

export default ClientesTemp;

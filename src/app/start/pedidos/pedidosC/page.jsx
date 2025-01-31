"use client";

import React from "react";
import PropTypes from "prop-types";
import { Conexion } from "@/conexion";
import Grid from "@mui/material/Grid2";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/authContext';
import PrintIcon from '@mui/icons-material/Print';
import { useEffect, useRef, useState } from "react";
import Banner from "@/app/components/banner/banner";
import useGenerarPDF from "@/app/hooks/useGenerarPDF";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import useCalculoSumaSaldo from "@/app/hooks/useCalculoSumaSaldo";
import { Box, Tabs, Tab, Button, Typography, Paper, TextField, ButtonGroup, 
Modal, useMediaQuery, } from "@mui/material";


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
  border: "2px solid #000",
  boxShadow: 24
};


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
};


export const PedidosC = () => {
  const inputRef = useRef();
  const router = useRouter();
  const [fecha, setFecha] = useState("");
  const { pedido, setPedido } = useAuth();
  const [busqueda, setBusqueda] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosP, setProductosP] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [clienteP, setClienteP] = useState(pedido[0]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tablaProducto, setTablaProducto] = useState([]);
  const [productosConDISP0, setProductosConDIPS0] = useState([]);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  
  const [openM, setOpenM] = useState(false);
  const [value, setValue] = useState(0);
  
  const argumentoPDF = value === 0 ? productosP : productosConDISP0;
  const { sumaSaldoTotal, sumaSaldoTotalDESC } = useCalculoSumaSaldo(productosP, productosConDISP0, value);
  const { generarPDF } = useGenerarPDF(clienteP, argumentoPDF, sumaSaldoTotalDESC);
  const handleChanges = (event, newValue) => {
      setValue(newValue);
  };

  const handleOpenM = () => setOpenM(true);
  const handleCloseM = () => setOpenM(false);

  useEffect(() => {
      conseguirProductos()
      conseguirProductosP()
      conseguirProductosPendientes()
  }, []);

  useEffect(() => {
    if (clienteP?.FECHA_PEDIDO) {
      const obtenerFecha = () => {
        const fechaPedido = new Date(clienteP?.FECHA_PEDIDO);
        const dias = fechaPedido.getDate();
        const mes = fechaPedido.toLocaleString("es-CO", { month: "short" });
        const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
        const anio = fechaPedido.getFullYear();

        const fechaFormateada = `${mesCapitalizado} ${dias}, ${anio}`;
        setFecha(fechaFormateada);
      };
      obtenerFecha();
    }
  }, [clienteP]);

  const conseguirProductos = async () => {
    try {
      const response = await fetch("/api/productos/listar_solo_para_mg", {
        method: "GET",
        headers: { "Content-Type" : "application/json" },
      });
      const datos = await response.json();
      if (datos) {
        setProductos(datos);
        setTablaProducto(datos);
      };
    } catch (error) {
      console.log("error", error);
    }
  };

  const conseguirProductosP = async () => {
    try {
      const response = await fetch(`/api/pedidos/detalle_lineas/${clienteP.PEDIDO}`, {
        method: "GET",
        headers: { "Content-Type" : "application" },
      });
      const datos = await response.json();
      if (datos) {
        setProductosP(datos);
      }
    } catch (error) {
      console.log("error")
    }
  };

  const conseguirProductosPendientes = async () => {
    try {
      const response = await fetch(`/api/pedidos/articulos_pendientes/${clienteP.PEDIDO}`, {
        method: "GET",
        headers: { "Content-Type" : "application/json" }
      });
      const datos = await response.json();
      if (datos) {
        setProductosConDIPS0(datos);
      }
    } catch (error) {
      console.log("error")
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setBusqueda(e.target.value)
    filtrar(e.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    const resultadosBusqueda = tablaProducto.filter((elemento) => {
    const ARTICULO = elemento.ARTICULO && elemento.ARTICULO.toString().toLowerCase();
    const DESCRIPCION = elemento.DESCRIPCION && elemento.DESCRIPCION.toString().toLowerCase();
      if (
          ARTICULO?.includes(terminoBusqueda.toLowerCase()) ||
          DESCRIPCION?.includes(terminoBusqueda.toLowerCase())
      ) {
          return elemento;
      }
      return null; 
    });
    const resultadosFiltrados = resultadosBusqueda.filter((elemento) => elemento !== null);
    setProductos(resultadosFiltrados);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };
 
  const processRowUpdate = (newRow) => {
    const index = productosP.findIndex((row) => row.ARTICULO === newRow.ARTICULO);
      if (index === -1) {
        console.error("ARTICULO NO ENCONTRADO");
        return newRow;
      }
    const updatedRow = { ...newRow, isNew: false };
    const newProductosP = [...productosP];
    newProductosP[index] = updatedRow;
    setProductosP(newProductosP);
    return updatedRow;
  };

  const columnsP = [
    { field: 'ARTICULO', headerName: 'CODIGO', width: 100 },
    { field: 'DESCRIPCION', headerName: 'REFERENCIA', width: 500 },
    { field: 'PRECIO', headerName: 'PRECIO', width: 130,
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      }, editable: true, type: 'number'
    },
    { field: 'CPed', headerName: 'CANT', width: 80, 
      type: 'number', editable: true 
    },
    { field: 'PORC_DCTO', headerName: 'DESC', width: 70,
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(1);
        return `${parseFloat(precio).toLocaleString()}`;
      }, editable: true, type: "number"
    },
    { field: 'PORC_IMPUESTO', headerName: 'IVA', width: 40, 
      valueFormatter: (value) => {
        const iva = Number(value).toFixed(1);
        return `${parseFloat(iva).toLocaleString()}`;
      }, type: "number"
    },
    { field: 'DISP', headerName: 'DISP', width: 70, },
    { field: 'Em', headerName: 'EMP', width: 80 },
   
  ];

  const cerrarP = () => {
    router.push("../")
    localStorage.removeItem('pedidoTemp');
  };
  
  const especial = () => {
    const estado = pedido.U_COMPESPECIAL === "SI" ? null : "SI";
    const body = {
        ...clienteP,
        U_COMPESPECIAL: estado
    };
    setPedido(body);
    setClienteP(body);
  };

  const handleCantidad = (ARTICULO, value) => {
    setCantidades({
      ...cantidades,
      [ARTICULO] : value,
    });
  };

  const handleProducto = () => {
    const productosConCantidades = selectedRows.map((ARTICULO) => {
      const producto = productos.find((prod) => prod.ARTICULO === ARTICULO);
      if (producto && cantidades[ARTICULO]) {
        return { ...producto, CANTIDAD: cantidades[ARTICULO] }; 
      }
      return null;
    }).filter(Boolean);

    setProductosP((prevProductos) => {
      const productosActualizados = [...prevProductos];
  
      productosConCantidades.forEach((producto) => {
        const productoExistente = productosActualizados.find(
          (prod) => prod.ARTICULO === producto.ARTICULO
        );
  
        if (productoExistente) {
          productoExistente.CANTIDAD += producto.CANTIDAD;
        } else {
          productosActualizados.push(producto);
        }
      });
  
      return productosActualizados;
    });

    setSelectedRows([]);
    setCantidades({});
    handleCloseM();
  };


  const columnsM = [
    { field: 'ARTICULO', headerName: 'CODIGO', width: 100 },
    { field: 'DESCRIPCION', headerName: 'REFERENCIA', width: 500, editable: true },
    { field: 'SUBLINEA', headerName: 'SUBLINEA', width: 300 },
    { field: 'PRECIO', headerName: 'PRECIO', width: 130,
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      }, editable: true, type: "number"
    },
    { field: 'CANTIDAD', headerName: 'CANT', width: 80,
      /*renderCell: (params) => {
        return (
          <TextField 
            sx={{ width: "70px" }}
            variant="outlined"
            size="small"
            value={cantidades[params.id] || ""}
            onChange={(e) => handleCantidad(params.id, e.target.value)}
          />
        )
      },*/ type: 'number', editable: true,
    },
    { field: 'PORC_IMPUESTO', headerName: 'IVA', width: 40 },
    { field: 'PRECIOMASIVA', headerName: 'MASIVA', width: 130,
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      }, editable: true
    },
    { field: 'PORC_DCTO', headerName: 'D1', width: 40 },
    { field: 'TOTAL_DISP', headerName: 'DISP', width: 70, },
    { field: 'UNIDAD_EMPAQUE', headerName: 'EMP', width: 80 },
    { field: 'EXIST_REAL', headerName: 'EXISTREAL', width: 90 },
  ];


  const actualizarDisp = async () => {
    try {
      const response = await fetch(`/api/productos/actualizar_disponible/${clienteP.PEDIDO}`, {
        method: "POST",
        headers: { "Content-Type" : "aaplication/json" },
      });
  
      const datos = await response.json();
      console.log("Actualizacion Exitosa.", datos);

      if (response.ok) {
        await conseguirProductosP();
      } else {
        console.error("Error en la actualización:", response.statusText);
      }
    } catch (error) {
      console.error("Error de red", error); 
    }
  };



  return (
    <>
     <Banner />
     <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 3 }}>
        <h2>PEDIDOS</h2>
      </Box>

      <Box sx={{ padding: 2 }}>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <h2><strong>Buscar N°</strong></h2>
            <TextField 
              id="buscador" 
              variant="outlined"
              size="small"
              sx={{ marginRight: 2 }}
            />
          </Box>
          {clienteP?.AUTORIZADONOM === "APROBADO" ? (
            <Button variant="filled" sx={{ bgcolor: "#fa4f4f" }} onClick={generarPDF}>
              {" "}<PrintIcon />{" "}
            </Button>
          ) : (
            <Button variant="filled" sx={{ margin: 1, bgcolor: "#fff64" }} disabled>
              {" "}<PrintIcon />{" "}
            </Button>
          )}
          {/*<Button variant="filled" sx={{ margin: 1, bgcolor: "#fff694" }} onClick={especial}>
            {" "}<StarIcon />{" "}
          </Button>
          <Button variant="filled" sx={{ margin: 1, bgcolor: "#b6ff91" }} onClick={handleOpenM}>
            MG
          </Button>*/}
          <Button variant="filled" sx={{ margin: 1, bgcolor: "#f145af" }} onClick={actualizarDisp}>
            DISP
          </Button>
          <Button variant="filled" sx={{ margin: 1, bgcolor: "#ffa28a" }} onClick={cerrarP}>
            {" "}<HighlightOffIcon />{" "}
          </Button>
        </Box>
      </Box>
    </Box>
   
    <Box sx={{ border: "1px solid #ccc", borderRadius: 1, padding: 2, margin: 3 }}>
      <Grid container spacing={0} alignItems="center" sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body2">
            Estado:
            <strong style={{ color: "red" }}> {clienteP?.ESTADO}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body1">
            Autorización: 
            <strong style={{ color: "green" }}> {clienteP?.AUTORIZADONOM || ""}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body1">
            Impreso:
            <strong> {clienteP?.IMPRESO || ""}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body1">
            Nro: 
            <strong style={{ color: "blue" }}> {clienteP?.PEDIDO || ""}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body1">
            Cliente: 
            <strong> {clienteP?.CLIENTE || ""}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body1">
            <strong> {clienteP?.NOMBRE_RAZON || ""}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body1">
            Fecha: 
            <strong> {fecha || ''}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body1">
            Dirección de Envio:
            <strong> {clienteP?.CIUDAD || ""}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 3}}>
          <Typography variant="body1">
            <strong> {clienteP?.DEPTO || ""}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body1">
            Vend:
            <strong> {clienteP?.VENDEDOR || ""}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <Typography variant="body1">
            Especial:
            <strong style={{ color: "#ff0000" }}> {clienteP?.U_COMPESPECIAL || ""}</strong>
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField 
            label="Finac % /Días"
            id="Finac % /Días"
            variant="standard"
            //defaultValue={clienteP?.RUBRO5 || ""}
            size="small"
            sx={{ width: "95%" }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField 
            label="D ´UNA"
            id="D ´UNA"
            variant="standard"
            //defaultValue={clienteP?.RUBRO2 || ""}
            size="small"
            sx={{ width: "95%" }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField 
            label="Ped. Origen"
            id="Ped. Origen"
            variant="standard"
            //defaultValue={clienteP?.RUBRO3 || ""}
            size="small"
            disabled 
            sx={{ width: "95%" }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField 
            label="Pendiente"
            id="Pendiente"
            variant="standard"
            //defaultValue={clienteP?.RUBRO4 || ""}
            size="small"
            disabled
            sx={{ width: "100%" }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField 
            label="Nota Factura (Doc2)"
            id="Nota Factura (Doc2)"
            variant="standard"
            defaultValue={clienteP?.RUBRO1 || ""}
            size="small"
            sx={{ width: "95%" }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 9 }}>
          <TextField 
            id="observaciones"
            label="Observaciones"
            variant="standard"
            multiline
            rows={1}
            defaultValue={clienteP?.OBSERVACIONES || ""}
            size="small"
            sx={{ width: "100%",  }}
          />
        </Grid>
      </Grid>
    </Box>
 
    <Grid size={{ xs: 12 }}>
      <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={handleChanges} centered>
          <Tab label="Detalles Lineas" {...a11yProps(0)} />
          <Tab label="Articulos Pendientes" {...a11yProps(1)} />
        </Tabs>
      </Box>
  
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ height: 300, width: "100%" }}>
          <DataGrid
            density="compact"
            rows={productosP}
            columns={columnsP}
            getRowId={(row) => row.ARTICULO}
            editMode="row"
            pageSizeOptions={[5, 10, 15]}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 }, }, }}
          />
        </Box>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Box sx={{ height: 300, width: "100%" }}>
          <DataGrid
            density="compact"
            rows={productosConDISP0}
            columns={columnsP}
            pageSizeOptions={[5, 10, 15]}
            getRowId={(row) => row.ARTICULO}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 }, }, }}
          />
        </Box>
      </CustomTabPanel>
    </Grid>
        
    <Paper elevation={3} sx={{ padding: 3, margin: 3, marginTop: 3}}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <ButtonGroup variant="text" aria-label="text button group" sx={{ height: 60 }}>
          <Button sx={{ flexDirection: "column" }}>
            <Typography sx={{ display: "flex", fontSize: 14, paddingRight: 5 }} gutterBottom>{" "}${sumaSaldoTotal}{" "}</Typography>
            <strong>{" "}SUB-TOTAL{" "}</strong>
          </Button>
          <Button sx={{ flexDirection: "column" }}>
            <Typography sx={{ display: "flex", fontSize: 14, paddingRight: 5 }} gutterBottom>{" "}${sumaSaldoTotalDESC}{" "}</Typography>
            <strong>{" "}TOTAL{" "}</strong>
          </Button>
        </ButtonGroup>
      </Box>
    </Paper>

    <Box sx={{ flexDirection: "row", display: "flex", justifyContent: "flex-end" }}>
      <strong>{" "}Editado por: {" "} </strong>
      <Typography sx={{ display: "flex", fontSize: 14, paddingRight: 5 }} gutterBottom>
        {" "}{clienteP?.U_EDITADOPOR || ""}{" "}
      </Typography>
    </Box>


    <Modal
      open={openM}
      onClose={handleCloseM}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
            <h2><strong>PRODUCTOS</strong></h2>
            <Box display="flex" gap={1}>
              <Button variant="contained" color="success" onClick={handleProducto}>Agregar</Button>
              <Button variant="contained" color="error" onClick={handleCloseM}>Cerrar</Button>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", gap: 2, alignItems: "center" }}>
            <TextField
              id="outlined-basic"
              placeholder="Buscar Producto"
              value={busqueda}
              onChange={handleChange}
              inputRef={inputRef}
              sx={{ width: "100%" }}
            />
          </Box> 

          <Box sx={{ width: "100%", height: 480 }}>
            <DataGrid
              density="compact"
              rows={productos}
              columns={columnsM}
              getRowId={(row) => row.ARTICULO}
              pageSize={10}
              rowSelectionModel={selectedRows}
              processRowUpdate={processRowUpdate}
              onRowSelectionModelChange={handleSelectionChange}
              sx={{
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  </>
  );
};

export default PedidosC;




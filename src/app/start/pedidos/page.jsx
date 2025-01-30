"use client";

import Link from "next/link";
import { Conexion } from "@/conexion";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Banner from "@/app/components/banner/banner";
import BotonExcel from "../../hooks/useExportoExcel";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, LinearProgress, TextField, Typography, 
useMediaQuery } from "@mui/material";

const fDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

const columns = [
  { field: "FECHA_PEDIDO", headerName: "FECHA", width: 150,
    renderCell: (params) => fDate(params.value),
  },
  { field: "PEDIDO", headerName: "PEDIDO", width: 160 },
  { field: "ESTADO", headerName: "ESTADO", width: 100 },
  { field: "IMPRESO", headerName: "IMP", width: 80 },
  { field: "AUTORIZADONOM", headerName: "AUTORIZADO", width: 150,
    renderCell: (params) => {
      const AUTORIZADONOM = params.row.AUTORIZADONOM;
      const cellStyle = {
        color:
          AUTORIZADONOM === "APROBADO"
            ? "#00FC00"
            : AUTORIZADONOM === "RETENIDO"
            ? "#FF1507"
            : "#000000",
        backgroundColor: "transparent",
      };
      return <Typography style={cellStyle}>{AUTORIZADONOM}</Typography>;
    },
  },
  { field: "U_COMPESPECIAL", headerName: "ESPECIAL", width: 100 },
  { field: "VENDEDOR", headerName: "VEND", width: 100 },
  { field: "COMENTARIO_CXC", headerName: "AUT. SISTEMA", width: 250 },
  { field: "TOTAL_A_FACTURAR", headerName: "A FACT", width: 120, 
    valueFormart: (value) => {
      const precio = Number(value).toFixed(0);
      return `${parseFloat(precio).toLocaleString()}`;
    },
  },
  { field: "NOMBRE_RAZON", headerName: "CLIENTE", width: 400 },
  { field: "U_CREADOPOR", headerName: "USUARIO MG", width: 120 },
  { field: "DEPTO", headerName: "DEPARTAMENTO", width: 160 },
  { field: "CIUDAD", headerName: "CIUDAD", width: 200 },
];


const Pedidos = () => {
  const router = useRouter();
  const { setPedido } = useAuth();
  const [busqueda, setBusqueda] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [tablaPedido, setTablaPedido] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");


  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await fetch("/api/pedidos/listar", {
          method: "GET",
          headers: { "Content-Type" : "application/json" }
        });
        const datos = await response.json();

        setCargando(false);
        setPedidosFiltrados(datos);
        setTablaPedido(datos);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerPedidos();
  }, []);
  
  
  const handleChange = (e) => {
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    const resultadosBusqueda = tablaPedido.filter((elemento) => {
      const valores = Object.values(elemento).map((value) =>
        value ? value.toString().toLowerCase() : ""
      );
      return valores.some((valor) => valor.includes(terminoBusqueda));
    });
    setPedidosFiltrados(resultadosBusqueda);
  };

  const handleSelection = useCallback((selectionModel) => {
    setSelectedRows(selectionModel);
      if (selectionModel.length > 0) {
        const resultadosFiltrados = tablaPedido.filter((elemento) => {
          const PEDIDO = elemento.PEDIDO;
          if (PEDIDO) {
            const pedidoString = PEDIDO.toString();
            return pedidoString.includes(selectionModel[0]);
          }
          return false;
        });
        localStorage.setItem("pedidoTemp", JSON.stringify(resultadosFiltrados));
        setPedido(resultadosFiltrados);
        router.push("/start/pedidos/pedidosC");
      }
    },
    [pedidosFiltrados]
  );

  return (
    <>
      <Box> {" "}<Banner />{" "} </Box>

      <div className="container">
        {cargando === true ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
      <Box>
        <Grid container direction="column" sx={{ minHeight: "90vh", backgroundColor: "#ffffff", padding: 2 }}>
          <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", alignItems: "center", gap: 2, marginBottom: 2 }}>
            <Grid size={{ xs: 12, sm: 8, md: 6}}>
              <h2><strong>PEDIDOS</strong></h2>
            </Grid>
            <Grid size={{ sx: 6,  }}>
              <Button variant="outlined" sx={{ margin: "10px" }} LinkComponent={Link} href="./crearPedido">{" "}Nuevo{" "}</Button>
            </Grid>
            <Grid size={{ sx: 6 }}>
              <BotonExcel datos={pedidosFiltrados} />
            </Grid>
            <Grid size={{ xs: 12, sm: 8, md: 6}}>
              <TextField
                id="outlined-basic"
                placeholder="Buscar..."
                multiline
                rows={1}
                variant="outlined"
                value={busqueda}
                onChange={handleChange}
                sx={{ width: "100%" }}
              />
            </Grid>
          </Box>

          <Grid size={12} sx={{ flexGrow: 1, marginBottom: 2 }}>
            <Box sx={{ width: "100%", height: isSmallScreen ? 500 : 810 }}>
              <DataGrid
                rows={pedidosFiltrados}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 12 },
                  },
                }}
                pageSizeOptions={[12]}
                onRowSelectionModelChange={handleSelection}
                slots={{ toolbar: GridToolbar }}
                rowSelectionModel={selectedRows}
                getRowId={(row) => row.PEDIDO}
                sx={{
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      )}
    </div>
    </>
  );
};

export default Pedidos;



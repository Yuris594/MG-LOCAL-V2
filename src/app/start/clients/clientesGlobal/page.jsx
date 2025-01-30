"use client";

import Box from "@mui/material/Box";
import { Conexion } from "@/conexion";
import Grid from "@mui/material/Grid2";
import { TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "@/context/authContext";
import { useCallback, useEffect, useState } from "react";


const columns = [
  { field: "CLIENTE", headerName: "NIT", width: 130, headerClassName: 'super-app-theme--header' },
  { field: "NOMBREALIAS", headerName: "NOMBRE", width: 600, headerClassName: 'super-app-theme--header' },
  { field: "DIRECCION", headerName: "DIRECCION", width: 300, headerClassName: 'super-app-theme--header' },
  { field: "TELEFONO1", headerName: "TELEFONO", width: 190, headerClassName: 'super-app-theme--header' },
  { field: "NOMVENDEDOR", headerName: "VENDEDOR", width: 200, headerClassName: 'super-app-theme--header' },
  { field: "SALDO", headerName: "CARTERA", type: "number", width: 120, headerClassName: 'super-app-theme--header',
    valueFormatter: (value) => {
        const precioRedondeado = Number(value).toFixed(0);
        return `${parseFloat(precioRedondeado).toLocaleString()}`;
    }, align: "right",
  },
];

const conseguirClientes = async () => {
  try {
    const response = await fetch("/api/clientes/listar", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

const ClientesGlobal = ({ setOpen, seleccionarCliente }) => {
  const { setCliente } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tablaClientes, setTablaClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const datos = await conseguirClientes();
      if (datos && datos.length > 0) {
          setClientesFiltrados(datos);
          setTablaClientes(datos);
      } else {
          console.log("No se encontraron clientes");
      }
    };
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    const resultadosBusqueda = tablaClientes.filter((elemento) => {
      const CLIENTE = elemento.CLIENTE && elemento.CLIENTE.toString().toLowerCase();
      const NOMVENDEDOR = elemento.NOMVENDEDOR && elemento.NOMVENDEDOR.toString().toLowerCase();
      const NOMBREALIAS = elemento.NOMBREALIAS && elemento.NOMBREALIAS.toLowerCase();

      return (
          CLIENTE?.includes(terminoBusqueda.toLowerCase()) ||
          NOMVENDEDOR?.includes(terminoBusqueda.toLowerCase()) ||
          NOMBREALIAS?.includes(terminoBusqueda.toLowerCase())
      );
    });
    setClientesFiltrados(resultadosBusqueda);
  };

  const handleSelectionChange = useCallback((selectionModel) => {
    setSelectedRows(selectionModel);
    if (selectionModel.length > 0) {
        const resultadosFiltrados = tablaClientes.filter((elemento) => {
            const CLIENTE = elemento.CLIENTE;
            return CLIENTE && CLIENTE.toString().includes(selectionModel[0]);
        });

        localStorage.setItem("clientTemp", JSON.stringify(resultadosFiltrados));
        setCliente(resultadosFiltrados[0]);
        setOpen(false);
        seleccionarCliente(resultadosFiltrados[0]);
    }
  }, [tablaClientes]);

  return (
    <>
      <Grid container direction="column" sx={{ minHeight: "80vh", backgroundColor: "#ffffff", padding: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Grid size={6}>
            <h2><strong>CLIENTES</strong></h2>
          </Grid>
          <Grid size={6}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Buscador..."
              value={busqueda}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
        </Box>

        <Grid size={12} sx={{ flexGrow: 1, marginBottom: 2 }}>
          <Box sx={{ height: 659, width: "100%", '& .super-app-theme--header': { backgroundColor: '#80f5e7', color: '#000000' } }}>
            <DataGrid
              rows={clientesFiltrados}
              columns={columns}
              pageSizeOptions={[5, 10, 20, 30]}
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={selectedRows}
              getRowId={(row) => row.CLIENTE}
              sx={{ backgroundColor: "#ffffff" }}
              initialState={{
                  pagination: {
                      paginationModel: { page: 0, pageSize: 10 },
                  },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ClientesGlobal;

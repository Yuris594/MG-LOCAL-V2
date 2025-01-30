"use client";

import Swal from "sweetalert2";
import { Conexion } from "@/conexion";
import Grid from "@mui/material/Grid2";
import Registro from "./registrar/page";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import UsuarioActualizar from "./actualizar/page";
import Banner from "@/app/components/banner/banner";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, LinearProgress, Modal, TextField, 
useMediaQuery } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: "60vh",  
  maxWidth: "30vw",
  overflowY: "auto",
  overflowX: "hidden",
  padding: "16px",
  bgcolor: "#fff",
  border: "2px solid #000",
  boxShadow: 24, 
};

export function conexion() {
  Swal.fire({
    title: "No existe conexion",
    text: "Verifique la conexion con la empresa o no tiene internet",
    icon: "warning",
    button: "Aceptar",
  });
}

const columns = [
  { field: "PER_Nom", headerName: "NOMBRE", width: 200, editable: true },
  { field: "PER_Usuario", headerName: "USUARIO", width: 150, editable: true },
  { field: "PER_Clave", headerName: "CONTRASEÑA", width: 150, editable: true },
  { field: "IdDiv", headerName: "ID DIVISIÓN", type: "number", width: 120, editable: true },
  { field: "PERAUTOPED", headerName: "AUTO PEDIDOS", type: "number", width: 130, editable: true },
  { field: "CODVEND", headerName: "CÓDIGO VENDEDOR", width: 160, editable: true },
  { field: "PREFIJO", headerName: "PREFIJO", width: 100, editable: true },
  { field: "CONSECUTIVOPED", headerName: "CONSECUTIVO PEDIDOS", type: "number", width: 180, editable: true },
];


function Usuarios() {
  const router = useRouter();
  const { auth } = useAuth();
  const handleOpen = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [openA, setOpenA] = useState(false);
  const [usuario, setUsuario] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState([]);
  const [authLoading, setAuthLoading] = useState();
  const [tablaUsuario, setTablaUsuario] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [cargando, setCargando] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width : 600px)");

  useEffect(() => {
    conseguirUsuarios();
  }, []);

  const handleCloseA = () => {
    setUsuario([]);
    setOpenA(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  };

  const conseguirUsuarios = async () => {
    try {
      const response = await fetch(Conexion.url + '/usuarios/listar', {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const datos = await response.json();
      if (datos) {
        setCargando(false);
        setUsuarios(datos);
        setTablaUsuario(datos);
      }
    } catch (error) {
        console.log(error)
    }
  }

  const filtrar = (terminoBusqueda) => {
    const resultadosBusqueda = tablaUsuario.filter((elemento) => {
      const valores = Object.values(elemento).map((value) =>
        value ? value.toString().toLowerCase() : ""
      );
      return valores.some((valor) => valor.includes(terminoBusqueda));
    });
    setUsuarios(resultadosBusqueda);
  };

  const handleSelection = useCallback((selectionModel) => {
    setSelectedRows(selectionModel);
      if (selectionModel.length > 0) {
        const resultadosFiltrados = tablaUsuario.filter((elemento) => {
          const IdPer = elemento.IdPer;
          if (IdPer) {
            const IdString = IdPer.toString();
            return IdString.includes(selectionModel[0]);
          }
          return false;
        });
        setUsuario(resultadosFiltrados);
        setOpenA(true);
      }
    }, [usuarios]);


  useEffect(() => {
    if (auth !== undefined) {
      setAuthLoading(false);
        if (!auth || auth.IdDiv !== 8) {
          router.push('/start');
          Swal.fire({
            title: "No Autorizado.",
            text: "Usted No Tiene Autorización Para Visualizar Esta Pagina!!",
            icon: "info",
          })
          }
        }
      }, [auth, router]);
  
    if (authLoading) {
      return (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      );
    }
  
    if (!auth || auth.IdDiv !== 8) {
      return null;
    }

  return (
    <>
      <Box>{" "}<Banner />{" "} </Box>
        <Box className="container">
          {cargando === true ? (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          ):(
          <Box style={{ height: "auto", width: "100%" }}>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={style}>
                <Registro onClose={handleClose} />
              </Box>
            </Modal>

            <Modal
              open={openA}
              onClose={handleCloseA}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={style}>
                <UsuarioActualizar usuario={usuario} onClose={handleCloseA} />
              </Box>
            </Modal>

            <Grid container direction="column" sx={{ minHeight: "90vh", backfroundColor: "#ffffff", padding: 2 }}>
              <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", alignItems: "center", gap: 2, marginBottom: 2 }}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <h2><strong>USUARIOS</strong></h2>
                </Grid>
                <Grid size={{ sx: 12, sm: 2, md: 1 }}>
                  <Button variant="outlined" onClick={handleOpen} color="primary">Nuevo Usuario</Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 5 }}>
                  <TextField
                    id="outlined-basic"
                    placeholder="Buscar..."
                    value={busqueda}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Box>

                <Grid size={12} sx={{ flexGrow: 1, marginBottom: 2}}>
                  <Box sx={{ height: isSmallScreen ? 500 : 779, width: "100%" }}>
                    <DataGrid
                      rows={usuarios}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 12 },
                        },
                      }}
                      pageSizeOptions={[12, 36]}
                      getRowId={(row) => row.IdPer}
                      onRowSelectionModelChange={handleSelection}
                      rowSelectionModel={selectedRows}
                      slots={{ toolbar: GridToolbar }}
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
      </Box>
    </>
  );
}

export default Usuarios;

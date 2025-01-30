"use client";

import Link from "next/link";
import Swal from "sweetalert2";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import MapIcon from '@mui/icons-material/Map';
import { Conexion, Global } from "@/conexion";
import { useAuth } from "@/context/authContext";
import StarIcon from '@mui/icons-material/Star';
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import Banner from "@/app/components/banner/banner";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import Favorite from '@mui/icons-material/Favorite';
import UseImportoExcel from "@/app/hooks/useImportoExcel";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import ClientesGlobal from "../../clients/clientesGlobal/page";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useCallback, useEffect, useRef, useState } from "react";
import { DataGrid, GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Button, ButtonGroup, Checkbox, List, ListItem, ListItemText, Modal,
Paper, TextField, Typography, useMediaQuery } from "@mui/material";


const style = {
  top: "50%",
  left: "50%",
  boxShadow: 24,
  padding: "16px",
  maxWidth: "80vw",
  maxHeight: "90vh",
  overflowY: "auto",
  overflowX: "hidden",
  position: "absolute",
  bgcolor: "#ffffff",
  border: "2px solid #000",
  transform: "translate(-50%, -50%)",
};



const CrearPedido = () => {
  const inputRef = useRef();
  const router = useRouter();
  const { auth, cliente } = useAuth();
  const [notas, setNotas] = useState("");
  const [finac, setFinac] = useState("");
  const [total, setTotal] = useState("0");
  const [open, setOpen] = useState(false);
  const [rubro2, setRubro2] = useState("");
  const [openM, setOpenM] = useState(false);
  const [openE, setOpenE] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [subTotal, setSubTotal] = useState("0");
  const [documento, setDocumento] = useState("");
  const [productos, setProductos] = useState([]);
  const [especial, setEspecial] = useState(false);
  const [codVenData, setCodVenData] = useState([]);
  const [cantidades, setCantidades] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tablaProducto, setTablaProducto] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectedData, setSelectedData] = useState(null);
  const [seleccion, setSeleccion] = useState('CREADO POR');
  const [clienteP, setClienteP] = useState(cliente?.[0] || {});
  const [articulosSeleccionados, setArticulosSeleccionados] = useState([]);
  
  const handleOpenM = () => setOpenM(true);
  const handleCloseM = () => setOpenM(false);
  const handleOpenC = () => setOpen(true);
  const handleCloseC = () => setOpen(false);
  const handleOpenE = () => setOpenE(true);
  const handleCloseE = () => setOpenE(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    if (cliente?.[0]) {
      setClienteP(cliente[0]);
    }
  }, [cliente]);

  const seleccionarCliente = (clienteSeleccionado) => {
    setClienteP(clienteSeleccionado);
    cliente[0] = clienteSeleccionado;
  };

  const handleEspecial = (event) => {
    const checked = event.target.checked;
    setEspecial(checked);

    console.log("¿Es especial?", checked ? "Si" : "No");
  };

  const handleImportData = async (data) => {
    if (data.length === 0) {
      setArticulosSeleccionados([]);
      CalcularTotales([]);
      return;
    } 

    const articulosImportados = data.map((row) => {
      const PRECIO = parseFloat(row["PRECIO"]) || 0;
      const cantped = parseFloat(row["CANT"]) || 0;
      const PORC_IMPUESTO = parseFloat(row["IVA"]) || 0;
      const PORC_DCTO = parseFloat(row["DESC"]) || 0;
      
      return {
        ARTICULO: row["CODIGO"],
        PRECIO,
        cantped,
        PORC_IMPUESTO,
        PORC_DCTO,
        DESCRIPCION: row["REFERENCIA"] || '',
        SUBLINEA: row["SUBLINEA"] || '',
        UNIDAD_EMPAQUE: row["EMP"] || '',
        PRECIOMASIVA: row["MASIVA"] || 0,
        TOTAL_DISP: row["DISP"] || 0,
        EXIST_REAL: row["EXIST_REAL"] || 0,
        Total: ((PRECIO * cantped) + (PRECIO * cantped * PORC_IMPUESTO / 100) - (PRECIO * cantped * PORC_DCTO / 100)), 
      }
    });
    setArticulosSeleccionados((prevProductos) =>  [...prevProductos, ...articulosImportados]);
    CalcularTotales(articulosImportados);
  };


  const names = {
    "PEDIDO LOCAL": "61",
    "TELEMERCADEO 1": "301",
    "TELEMERCADEO 2": "300",
    "PUNTO NARANJA I.": "AA",
    "PUNTO NARANJA E.": "EE",
  };

  useEffect(() => {
    const fetchCodVenData = async () => {
      try {
        const response = await fetch(Global.url + '/consecutivo/list', {
          method: "GET",
          headers: { "Content-Type" : "application/json" }
        });
        const data = await response.json();
        setCodVenData(data);
      } catch (error) {
        console.error("Error al obtener los datos de CodVen:", error);
      }
    };

    fetchCodVenData();
  }, []);
  

  const handleSelect = (name) => {
    const codVen = names[name];
    if (codVen) {
      const relaccionData = codVenData.find((item) => item.Codven === codVen);
      if (relaccionData) {
        setSeleccion(name);
        setSelectedData({
          CodVen: relaccionData.Codven,
          Prefijo: relaccionData.Prefijo,
          Consecutivo: relaccionData.Consecutivo,
        });
      } else {
        console.warn(`No se encontraron datos para CodVen: ${codVen}`);
      }
    }
    handleCloseE();
  };


  const processRowUpdate = (newRow) => {
    const index = articulosSeleccionados.findIndex((row) => row.ARTICULO === newRow.ARTICULO);
      if (index === -1) {
        console.error("ARTICULO NO ENCONTRADO");
        return newRow;
      }
    const updatedRow = { ...newRow, isNew: false };
    const newProductosP = [...articulosSeleccionados];
    newProductosP[index] = updatedRow;
    setArticulosSeleccionados(newProductosP);
    CalcularTotales(newProductosP);
    return updatedRow;
  };


  const agregarArticulo = (nuevosArticulos) => {
    const articulosConTotal = nuevosArticulos.map((art) => {
      const precioUnitario = art.PRECIO * (1 + art.PORC_IMPUESTO / 100);
      const cantidad = parseFloat(art.cantped);
      const descuento = parseFloat(art.PORC_DCTO) / 100;
      const total = precioUnitario * cantidad * (1 - descuento);
      return {
        ...art,
        Total: total.toFixed(0),
      };
    });
    const articulosActualizados = [...articulosSeleccionados, ...articulosConTotal];
    setArticulosSeleccionados(articulosActualizados);
    CalcularTotales(articulosActualizados);
  };


  const CalcularTotales = (articulos) => {
    let nuevoSubTotal = 0;
    let nuevoTotal = 0;

    articulos.forEach((art) => {
      const precioBase = parseFloat(art.PRECIO);
      const cantidad = parseFloat(art.cantped);
      const descuento = parseFloat(art.PORC_DCTO) / 100;
      const iva = parseFloat(art.PORC_IMPUESTO) / 100;

      const subTotalArticulo = precioBase * cantidad;
      const totalConDescuento = subTotalArticulo * (1 - descuento);
      const totalArticulo = totalConDescuento * (1 + iva);

      nuevoSubTotal += subTotalArticulo;
      nuevoTotal += totalArticulo;
    });

    const subTotalFormateado = Number(nuevoSubTotal.toFixed(0)).toLocaleString();
    const totalFormateado = Number(nuevoTotal.toFixed(0)).toLocaleString();

    setTotal(totalFormateado);
    setSubTotal(subTotalFormateado);
  };

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await fetch("/api/productos/listar_solo_para_mg", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const datos = await response.json();

        if (datos) {
          setProductos(datos);
          setTablaProducto(datos);
        }
      } catch (error) {
        console.log(error);
      }
    };
    obtenerProductos();
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    const termino = terminoBusqueda.toLowerCase();
    const resultadosBusqueda = Array.isArray(tablaProducto) ? tablaProducto.filter((elemento) => {
      const valores = Object.values(elemento).map((value) =>
        value ? value.toString().toLowerCase() : ""
      );
      return valores.some((valor) => valor.includes(termino));
    })
    : [];
    setProductos(resultadosBusqueda);
  };

  const handleSelectionChange = useCallback((selectionModel) => {
    setSelectedRows(selectionModel);
    if (selectionModel.length > 0) {
      const resultadosFiltrados = tablaProducto.filter((elemento) => {
        const ARTICULO = elemento.ARTICULO;
        if (ARTICULO) {
          const productoString = ARTICULO.toString();
          return productoString.includes(selectionModel[0]);
        }
        return false;
      });
      setTablaProducto(resultadosFiltrados[0]);
    }
  }, [productos]);

  const handleProcessRowUpdate = (newRow) => {
    const updatedRows = productos.map((prod) => 
      prod.ARTICULO === newRow.ARTICULO ? { ...prod, ...newRow } : prod
    );
    setProductos(updatedRows);
    setTablaProducto(updatedRows);
    return newRow;
  };

  const handleCantidad = (ARTICULO, value) => {
    setCantidades({
      ...cantidades,
      [ARTICULO] : value,
    });
  };

  const agregarArticulos = () => {
    const articulosSeleccionados = productos.filter((prod) => cantidades[prod.ARTICULO]);
    agregarArticulo(
      articulosSeleccionados.map((art) => ({
        ...art,
        cantped: cantidades[art.ARTICULO]
      }))
    );
    handleCloseM();
  }

  const columnsM = [
    { field: "ARTICULO", headerName: "CODIGO", width: 130 },
    { field: "DESCRIPCION", headerName: "REFERENCIA", width: 500 },
    { field: "UNIDAD_EMPAQUE", headerName: "EMP", width: 80 },
    { field: "PRECIO", headerName: "PRECIO", width: 130,
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      },
    },
    { field: "CANTIDAD", headerName: "CANT", width: 80, 
      renderCell: (params) => {
        return (
          <TextField 
            value={cantidades[params.id] || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleCantidad(params.id, value);
              }
            }}
            sx={{ width: "70px" }}
            variant="outlined"
            size="small"
            type="text"
            inputProps={{ inputMode: "numeric" }}
          />
        )
      }
    },
    { field: "PORC_IMPUESTO", headerName: "IVA", width: 40 },
    { field: "PORC_DCTO", headerName: "D1", width: 40 },
    { field: "PRECIOMASIVA", headerName: "MASIVA", width: 100,
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      }, 
    },
    { field: "TOTAL_DISP", headerName: "DISP", width: 70, 
      valueFormatter: (value) => {
        const disponible = Number(value).toFixed(0);
        return `${parseFloat(disponible).toLocaleString()}`;
      },
    },
    { field: "EXIST_REAL", headerName: "EXIST-REAL", width: 90, 
      valueFormatter: (value) => {
        const existe = Number(value).toFixed(0);
        return `${parseFloat(existe).toLocaleString()}`;
        
      },
    },
  ];

  const obtenerConse = async () => {
    try {
      const response = await fetch(Global.url + `/pedidos/${selectedData.CodVen}`, {
        method: "GET",
        headers: { "Content-Type" : "application/json" },
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener el consecutivo: ${response.status} ${response.statusText}`);
      }

      const datos = await response.json();
      return datos[0];
    } catch (error) {
      console.error("Error al obtener el consecutivo:", error);
      throw error;
    }
  };

  const enviarPedido = async () => {

    const resultado = await Swal.fire({
      title: "Crear!",
      text: "¿Desea crear el Pedido?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }); 
    
    if(!resultado.isConfirmed) {
      Swal.fire({
        text: "El Pedido no fue creado.",
        icon: "info",
        timer: 3000, 
      });
      return; 
    }

    try {
      const datosConse = await obtenerConse();
      const conseActualizado = datosConse.consecutivo + 1;
      const NUMPED = `${datosConse.Prefijo}${conseActualizado}`; 

      const response = await fetch(Global.url + `/pedidos/PEDIDOS/${selectedData.CodVen}`, {
        method: "PUT",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ Consecutivo: conseActualizado })
      }); 

      if (!response.ok) {
        console.log("Error al actualizar el consecutivo:", response.statusText);
        throw new Error("Error al actualizar el consecutivo");
      } else {
        console.log("Consecutivo actualizado correctamente");
      }
      
      const pedido = {
        PEDIDO: NUMPED,
        FECHA: new Date().toISOString(),
        CLIENTE: clienteP.CLIENTE,
        NOMBRE_CLIENTE: clienteP.NOMBREALIAS,
        DIRECCION_FACTURA: clienteP.DIRECCION,
        CONDICION_PAGO: clienteP.PLAZO_MG,
        VENDEDOR: clienteP.VENDEDOR,
        DIVISION_GEOGRAFICA1: clienteP.CODDEPT,
        DIVISION_GEOGRAFICA2: clienteP.CODCIU,
        U_CREADOPOR: auth.PER_Usuario,
        RUBRO1: documento,
        OBSERVACIONES: notas,
      };

      const encabezadoResponse = await fetch('/api/pedidos/encabezado_pedido', {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(pedido),
      });
  
      if (!encabezadoResponse.ok) {
        const errorResponse = await encabezadoResponse.json();
        console.error("Error al crear el pedido", errorResponse);
        throw new Error("Error al crear el encabezado del pedido");
      } 
        
      console.log("Pedido creado correctamente");     
      
      //Aquí la creación de los detalles de pedidos
      
      Swal.fire({
        title: "¡Éxito!",
        text: "Pedido Fue Creado Correctamente.",
        icon: "success",
        timer: 3000, 
        showConfirmButton: false,
      });

      router.push("../");
      
    } catch (error) {
      console.error("Error:", error.message);
      console.error("Detalles del error:", error); 
      Swal.fire({
        title: "Oops...!",
        text: "Hubo un problema al enviar el pedido.",
        icon: "error",
      });
    }    
  };


  const columns = [
    { field: "ARTICULO", headerName: "CODIGO", width: 100 },
    { field: "DESCRIPCION", headerName: "REFERENCIA", width: 500 },
    { field: "SUBLINEA", headerName: "SUBLINEA", width: 250 },
    { field: "UNIDAD_EMPAQUE", headerName: "EMP", width: 80 },
    { field: "PRECIO", headerName: "PRECIO", width: 130, 
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      }, editable: true, type: "number",
    },
    { field: "cantped", headerName: "CANT", width: 100, 
      editable: true, editable: true, type: "number"
    },
    { field: "PORC_IMPUESTO", headerName: "IVA", width: 70,
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      }, editable: true, type: "number" 
    },
    { field: "PORC_DCTO", headerName: "DESC", width: 70,
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      }, editable: true, type: "number" 
    },
    { field: "PRECIOMASIVA", headerName: "MASIVA", width: 100,
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      }, type: "number" 
    },
    { field: "TOTAL_DISP", headerName: "DISP", width: 70, 
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      }, type: "number" 
    },
    { field: "EXIST_REAL", headerName: "EXIST_REAL", width: 110, 
      valueFormatter: (value) => {
        const precio = Number(value).toFixed(0);
        return `${parseFloat(precio).toLocaleString()}`;
      }, type: "number" 
    },
    { field: "actions", type: "actions", headerName: "", width: 100, 
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: "primary.main" }}
              onClick={handleSaveClick(id)}
            />,

            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              sx={{ color: "primary.button" }}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="secondary"
          />,

          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            className="textPrimary"
            onClick={handleDeleteClick(id)}
            color="error"
          />,
        ];
      },
    },
  ];

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setArticulosSeleccionados((prevSeleccionados) => {
      const articulosActualizados = prevSeleccionados.filter((row) => row.ARTICULO !== id) 
      CalcularTotales(articulosActualizados);
      return articulosActualizados;
    });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = productos.find((row) => row.ARTICULO === id);
    if (editedRow.isNew) {
      setProductos(productos.filter((row) => row.ARTICULO !== id));
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };


  return (
    <>
      <Banner />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 3 }}>
          <h3>CREACIÓN DE PEDIDOS</h3>
        </Box>
        
        <Box sx={{ padding: 2 }}>
          <Button onClick={handleOpenC} variant="filled" sx={{ bgcolor: "#ec57cc", "&:hover": { bgcolor: "#ec1edb " },  }}>
            Clientes
          </Button>
          <Button onClick={handleOpenM} variant="filled" sx={{ bgcolor: "#6cd3ec", "&:hover": { bgcolor: "#36c7e7" }, m: 2 }}>
            Productos-MG
          </Button>
          <Button onClick={handleOpenE} variant="contained" sx={{ bgcolor: "#a449ee", "&:hover": { bgcolor: "#992be2" }, mr: 2 }}>
            {seleccion}
          </Button>
          <UseImportoExcel onImportData={handleImportData} />
          <Button onClick={enviarPedido} variant="filled" sx={{ bgcolor: "#5de46f", "&:hover": { bgcolor: "#3ae92a" }, m: 2 }}>
            Enviar Pedido
          </Button>
          <Button variant="filled" sx={{ bgcolor: "#f13c3c", "&:hover": { bgcolor: "#ec1c27" }, }} LinkComponent={Link} href="../../clients/">
            Cerrar
          </Button>
        </Box>
      </Box>

      <Box>
        <Paper elevation={3} sx={{ padding: 3, margin: "0 auto", marginTop: 3, maxWidth: 1100, width: "100%", backgroundColor: "#ffffff" }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12 }}>
              <Box display="flex" alignItems="center">
                <strong>NOMBRE: </strong>
                <Typography variant="body1" sx={{ marginLeft: 1 }}>{clienteP?.NOMBREALIAS}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box display="flex" alignItems="center">
                <strong>NIT: </strong>
                <Typography variant="body1" sx={{ marginLeft: 1 }}>{clienteP?.CLIENTE}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box display="flex" alignItems="center">
                <PhoneIcon color="primary" sx={{ marginRight: 1 }} />
                <Typography variant="body1">{clienteP?.TELEFONO1}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box display="flex" alignItems="center">
                <LocationOnIcon color="primary" sx={{ marginRight: 1 }} />
                <Typography variant="body1">{clienteP?.DIRECCION}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box display="flex" alignItems="center">
                <LocationCityIcon color="primary" sx={{ marginRight: 1 }} />
                <Typography variant="body1">{clienteP?.CIUDAD}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box display="flex" alignItems="center">
                <MapIcon color="primary" sx={{ marginRight: 1 }} />
                <Typography variant="body1">{clienteP?.DEPARTAMENTO}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box display="flex" alignItems="center">
                <EmojiPeopleIcon color="primary" sx={{ marginRight: 1 }} />
                <Typography variant="body1">{clienteP?.VENDEDOR}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Box display="flex" alignItems="center">
                <EmailIcon color="primary" sx={{ marginRight: 1 }} />
                <Typography variant="body1">{clienteP?.E_MAIL}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box display="flex" alignItems="center">
                <strong>ESPECIAL: </strong>
                <Checkbox 
                  checked={especial}
                  onChange={handleEspecial}
                  icon={<StarBorderIcon />}
                  checkedIcon={<StarIcon style={{ color: "red" }} />}
                  sx={{ ml: 1 }}  
                />
              </Box>
            </Grid>
          </Grid>

          <TextField
            id="nota-factura"
            label="Nota Factura (Doc2)"
            variant="standard"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            color="primary"
            size="small"
            sx={{ 
              flex: 1, 
              minWidth: "350px", 
              maxWidth: "500px",
              marginRight: 2,
            }}
          />
          <TextField
            id="finac"
            label="Finac % /Días"
            variant="standard"
            value={finac}
            onChange={(e) => setFinac(e.target.value)}
            size="small"
            sx={{ 
              flex: 1,
              minWidth: "150px",
              maxWidth: "300px",
              marginRight: 2, 
              borderColor: "#13e2e9", 
            }}
          />
          <TextField
            id="outlined-basic"
            label="D ´UNA"
            variant="standard"
            value={rubro2}
            onChange={(e) => setRubro2(e.target.value)}
            size="small"
            sx={{ 
              flex: 1, 
              minWidth: "150px", 
              maxWidth: "300px",
              marginRight: 2, 
              borderColor: "#13e96c", 
            }}
          />
          <TextField
            id="observaciones"
            label="OBSERVACIONES"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            variant="outlined"
            fullWidth
            size="small"
            sx={{ 
              marginTop: 2,
              borderColor: "#13e95a",
            }}
          />
        </Paper>
      </Box>

      <Box sx={{ width: "97%", height: 450, margin: 3 }}>
        <DataGrid 
          rows={articulosSeleccionados}
          columns={columns}
          editMode="row"
          getRowId={(row) => row.ARTICULO}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 }
            }
          }}
          rowModesModel={rowModesModel}
          pageSizeOptions={[5, 10, 15]}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onRowModesModelChange={handleRowModesModelChange}
          slotProps={{ toolbar: { setArticulosSeleccionados, setRowModesModel } }}
        />
      </Box>

     
      <Paper elevation={3} sx={{ padding: 3, margin: 3, marginTop: 3}}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <ButtonGroup variant="text" aria-label="text button group" sx={{ height: 60 }}>
            <Button sx={{ flexDirection: "column" }}>
              <Typography sx={{ display: "flex", fontSize: 14, paddingRight: 5 }} gutterBottom>{" "}${subTotal}{" "}</Typography>
              <strong>{" "}SUB-TOTAL{" "}</strong>
            </Button>
            <Button sx={{ flexDirection: "column" }}>
              <Typography sx={{ display: "flex", fontSize: 14, paddingRight: 5 }} gutterBottom>{" "}${total}{" "}</Typography>
              <strong>{" "}TOTAL{" "}</strong>
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>

      <Modal
        open={openE}
        onClose={handleCloseE}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ margin: 2 }}>
            <h3>SELECCIONAR VENDEDOR</h3> 
            <List>
              {Object.keys(names).map((name) => (
                <ListItem key={name} button="true" onClick={() => handleSelect(name)}>
                  <Checkbox checked={seleccion === name} icon={<FavoriteBorder />} checkedIcon={<Favorite />} sx={{ color: "green", "&.Mui-checked": { color: "pink" } }} />
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Modal>

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
                <Button variant="contained" color="success" onClick={agregarArticulos}>Agregar</Button>
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
                processRowUpdate={handleProcessRowUpdate}
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


      <Modal
        open={open}
        onClose={handleCloseC}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">

        <Box sx={style}>
          <ClientesGlobal setOpen={setOpen} seleccionarCliente={seleccionarCliente} />
        </Box>
      </Modal>

    </>
  )
}

export default CrearPedido;























/*const ultimoFKidPedidos = parseInt(localStorage.getItem("ultimoPedido"), 10) || 0;
  const nuevoFKidPedidos = ultimoFKidPedidos + 1;

  const detallePedido = articulosSeleccionados.map(art => ({
    FKid_pedidos2: nuevoFKidPedidos,
    FKcodigo_articles: art.ARTICULO,
    Cantidad: art.cantped,
    Precio: art.PRECIO,
    Descuento: art.PORC_DCTO,
    Iva: art.PORC_IMPUESTO,
    Total: art.Total,
    FKNUMPED: NUMPED,
    BODEGA: '1',
  }));
  
  for (const detalle of detallePedido) {
    const detalleResponse = await fetch(Global.url + `/pedidos/${NUMPED}`, {
      method: "POST",
      headers: { "Content-Type" : "application/json" },        
      body: JSON.stringify(detalle),
    });

    console.log(detallePedido)
  
    if (!detalleResponse.ok) {
      const errorResponse = await detalleResponse.json(); 
      console.error("Error al crear el detalle del pedido:", errorResponse);
      throw new Error(`Error al crear el detalle del pedido: ${detalleResponse.status} - ${detalleResponse.statusText}`);
    }
  }
  
  console.log("Detalle del pedido creado correctamente");
  localStorage.setItem("ultimoPedido", nuevoFKidPedidos);*/
    
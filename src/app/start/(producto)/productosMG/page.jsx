"use client";

import { Conexion } from "@/conexion";
import { DataGrid } from "@mui/x-data-grid";
import BotonExcel from "@/app/hooks/useExportoExcel";
import Banner from "../../../components/banner/banner";
import { useCallback, useEffect, useState } from "react";
import { Box, LinearProgress, TextField } from "@mui/material";


const columns = [
  { field: "ARTICULO", headerName: "COD", width: 130 },
  { field: "DESCRIPCION", headerName: "REFERENCIA", width: 700 },
  { field: "SUBLINEA", headerName: "SUBLINEA", width: 200, },
  { field: "TOTAL_DISP", headerName: "DISP", width: 130, 
    valueFormatter: (value) => {
      const dispo = Number(value).toFixed(0);
      return `${parseFloat(dispo).toLocaleString()}`;
    }, type: "number"
  },
  { field: "PRECIO", headerName: "PRECIO", width: 130,
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `${parseFloat(precio).toLocaleString()}`;
    }, type: "number"
  },
  { field: "PORC_IMPUESTO", headerName: "IVA", width: 100, 
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(1);
      return `${parseFloat(precio).toLocaleString()}`;
    }, type: "number"
  },
  { field: "PORC_DCTO", headerName: "DESC", width: 130, 
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(1);
      return `${parseFloat(precio).toLocaleString()}`;
    }, type: "number"
  },
  { field: "PRECIOMASIVA", headerName: "MASIVA", width: 130,
    valueFormatter: (value) => {
      const precio = Number(value).toFixed(0);
      return `${parseFloat(precio).toLocaleString()}`;
    }, type: "number"
  },
  { field: "UNIDAD_EMPAQUE", headerName: "EMP", width: 130 },
  { field: "EXIST_REAL", headerName: "EXIST-REAL", width: 130, 
    valueFormatter: (value) => {
      const existe = Number(value).toFixed(0);
      return `${parseFloat(existe).toLocaleString()}`;
    }, type: "number"
  },
];



const productosMG = () => {
  const [busqueda, setBusqueda] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando2, setCargando2] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tablaProducto, setTablaProducto] = useState([]);

  const conseguirProductos = async () => {
    try {
      const response = await fetch(Conexion.url + '/productos/listar_solo_para_mg', {
        method: "GET",
        headers: { "Content-Type": "application/json", },
      });
      const datos = await response.json()
      if (datos) {
        setProductos(datos);
        setTablaProducto(datos);
        setCargando2(false);
      } else {
        setProductos([]);
        setCargando2(false);
      }
    } catch (error) {
      console.log("Error al obtener usuarios", error);
    }
  };

  useEffect(() => {
    conseguirProductos();
  }, []);
 

  const handleChange = (e) => {
    e.preventDefault();
    setBusqueda(e.target.value);
    filtrar(e.target.value);
  };

  const filtrar = (terminoBusqueda) => {
    const resultadosBusqueda = tablaProducto.filter((elemento) => {
      const valores = Object.values(elemento).map((value) =>
        value ? value.toString().toLowerCase() : ""
      );
      return valores.some((valor) => valor.includes(terminoBusqueda));
    });
    setProductos(resultadosBusqueda);
  };

  const handleSelection = useCallback((selectionModel) => {
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
        setArticulo(resultadosFiltrados[0]);
      }
    },
    [productos]
  );

  return (
    <>
      <Box>{" "}<Banner />{" "}</Box>

      <div className="container">
        {cargando2 === true ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          <Box>
              <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "20%" }}>
                  <h2><strong>PRODUCTOS MG</strong></h2>
                  <BotonExcel datos={productos} />
                </Box>
            
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label="Buscador..."
                  value={busqueda}
                  onChange={handleChange}
                  sx={{ width: "50%" }}
                />
              </Box>
           
              <Box sx={{ width: "100%", height: 770 }}>
                <DataGrid
                  rows={productos}
                  columns={columns}
                  getRowId={(row) => row.ARTICULO}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 12 },
                    },
                  }}
                  rowSelectionModel={selectedRows}
                  onRowSelectionModelChange={handleSelection}
                  pageSizeOptions={[5, 12, 20]}
                  sx={{
                    "& .MuiDataGrid-columnHeaderTitle": {
                      fontWeight: "bold",
                    },
                  }}
                />
              </Box>
          </Box>
        )}
      </div>
    </>
  );
};

export default productosMG;

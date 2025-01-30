'use client';

import * as XLSX from "xlsx";
import { useState } from "react";
import { Button } from "@mui/material";

const BotonExcel = ({ datos }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    if (!Array.isArray(datos) || datos.length === 0) {
      console.error("Datos no están en el formato correcto o están vacíos.");
      return;
    }

    setLoading(true);

    try {
      const libro = XLSX.utils.book_new();
      const hoja = XLSX.utils.json_to_sheet(datos);
      XLSX.utils.book_append_sheet(libro, hoja, "Datos");
      XLSX.writeFile(libro, "datos.xlsx");
    } catch (error) {
      console.error("Error al generar el archivo Excel", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outlined" color="success" onClick={handleDownload} disabled={loading}>
      {loading ? "Loading..." : "Excel"}
    </Button>
  );
};

export default BotonExcel;
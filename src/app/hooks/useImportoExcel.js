"use client";

import React, { useState } from "react";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const UseImportoExcel = ({ onImportData }) => {
  const [fileName, setFileName] = useState("Subir Archivo");
  const [importedData, setImportedData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet);

          if (data.length) {
            setImportedData(data);
            onImportData(data);
          } else {
            console.error("El archivo Excel está vacío.");
            Swal.fire({
              icon: "info",
              title: "El archivo está vacío.",
              text: "Por favor, sube un archivo válido.",
            });
          }
        } catch (error) {
          console.error("Error al procesar el archivo:", error);
          Swal.fire({
            icon: "error",
            title: "Error al procesar el archivo.",
            text: "Por favor, verifica que el formato sea correcto.",
          });
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleRemoveFile = () => {
    setFileName("Subir Archivo");
    setImportedData(null);
    onImportData([]); 
  };

  return (
    <>
      <label htmlFor="upload-file">
        <Button variant="outlined" color="success" component="span">
          {fileName}
        </Button>
      </label>
      <input
        type="file"
        id="upload-file"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      {importedData && (
        <Button
          variant="text"
          color="error"
          onClick={handleRemoveFile}
          style={{ marginLeft: "1rem" }}
        >
          Remover Archivo
        </Button>
      )}
    </>
  );
};

export default UseImportoExcel;





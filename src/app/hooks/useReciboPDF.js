'use client';

import "jspdf-autotable";
import jsPDF from "jspdf";
import { useState } from "react";
import { format } from "date-fns";

const useGenerarPDF = (valores, valores2, auth, caja = {}) => {
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const fecha = format(new Date(), 'dd/MM/yyyy HH:mm:ss');

  const generarPDF = () => {
    const pdf = new jsPDF();
    const columnsParaPDF = [
      { field: 'DESCRIPCION', headerName: 'DESCRIPCIÓN', width: 500 },
      { field: 'PRECIO', headerName: 'PRECIO', width: 200 }
    ];

  const styles = {
    theme: "plain",
    tableWidth: "auto",
    lineColor: [200, 200, 200],
    lineWight: 0.1,
    font: "times",
    fontStyle: "normal",
    textColor: [0, 0, 0],
    display: "flex",
    cellWidth: "auto",
    fontSize: 8,
  };


  const dataToPrint = valores
    .filter(row => row.DESCRIPCION && row.PRECIO)
    .map(row => {
      return columnsParaPDF.map(column => {
        let value = row[column.field];

        if (column.field === "PRECIO") {
          const precioRedondeado = Number(value).toFixed(0);
          value = parseFloat(precioRedondeado).toLocaleString();
        }
        return value;
    });
  });

  function encabezado() {
    pdf.setFontSize(10);
    pdf.setFont("times", "italic");
    pdf.text("Miguel Gomez & Cia", 10, 10);
    pdf.text("Tel: 777777", 10, 15);
    pdf.text("Email: miguelgomez&cia@hotmail.com", 10, 20);
    pdf.text("Website: https://www.miguelgomez.com.co", 10, 25);
    pdf.text("-----------------------------------------------------------------------------------------------------------------------------------------------------------------", 10, 30);
    pdf.setFontSize(8);
    pdf.setFont("times", "italic");
    pdf.text(`Servicio: ${auth.PER_Nom || 'Desconocido'}`, 160, 20);
  }
   
  encabezado()
    pdf.autoTable({
      head: [columnsParaPDF.map(column => column.headerName)], 
      body: dataToPrint, 
      styles,
      startY: 40,
      theme:'plain',
      columnStyles: { cellWidth: "auto" },
    });
  
  function agregarContenido() {
    pdf.setFontSize(10);
    pdf.text(`TOTAL: $${caja.total}`, 12, pdf.autoTable.previous.finalY + 20);
    if (valores2.length > 0) {
      const metodoPago = Object.entries(valores2[0]).map(([key, value]) => {
        return `${key}: ${value}`;
      }).join(', ');
  
      pdf.text(`MÉTODO DE PAGO: ${metodoPago}`, 12, pdf.autoTable.previous.finalY + 30);
    } else {
      pdf.text(`MÉTODO DE PAGO: No especificado`, 12, pdf.autoTable.previous.finalY + 45);
    }  
    pdf.text(`CAMBIO: $${caja.cambio}`, 12, pdf.autoTable.previous.finalY + 40);
    pdf.setFontSize(8);
    pdf.text("_________________________________________________________________________________________________________________________________________________________________", 12, pdf.autoTable.previous.finalY + 55);
    pdf.text(`${fecha}`, 12, pdf.autoTable.previous.finalY + 65);
  }

    agregarContenido()
    pdf.output('dataurlnewwindow');
  }

  return { generarPDF, pdfDataUrl };
}

export default useGenerarPDF;
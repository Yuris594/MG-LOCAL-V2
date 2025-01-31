'use client';

import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { useState } from 'react';
import JsBarcode from 'jsbarcode';
import { format } from 'date-fns';


const generarCodigoBarras = (texto) => {
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, texto, { format: "CODE128" });
    return canvas.toDataURL("image/png"); 
  }
  return null;
};

const useGenerarPDF = (clienteP = {}, productosP = [], sumaSaldoTotalDESC = {}) => {
  const [fecha] = useState(format(new Date(), 'dd/MM/yyyy HH:mm:ss'));
  const codigoBarras = generarCodigoBarras(clienteP?.PEDIDO); 

  const generarPDF = () => {
    if (typeof window === 'undefined') return;

    const pdf = new jsPDF('portrait', 'pt', 'letter');
    const columnsParaPDF = [
      { field: 'ARTICULO', headerName: 'CODIGO', width: 200 },
      { field: 'DESCRIPCION', headerName: 'REFERENCIA', width: 500 },
      { field: 'PRECIO',  headerName: 'PRECIO', width: 200 },
      { field: 'CPed', headerName: 'CANT', width: 200, type: 'number' },
      { field: 'DESP', headerName: 'DESP', width: 250, type: 'number' },
      { field: 'EMPA', headerName: 'EMPA', width: 200, type: 'number' },
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
  

    const dataToPrint = productosP.map(row => {
      const rowData = [];
        columnsParaPDF.forEach(column => {
          let value = row[column.field];

          if (column.field === "PRECIO") {
            const precioRedondeado = Number(value).toFixed(0);
            value = parseFloat(precioRedondeado).toLocaleString();
          }
          rowData.push(value);
        });
        return rowData;
    });

    function encabezado() {
      pdf.setFontSize(20);
      pdf.addImage(`${codigoBarras}`, 220, 10,130,60);
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(13);
      pdf.text("PREFACTURA", 12, 30,);
        if(clienteP.IMPRESO === "S"){
      pdf.text("DUPLICADO", 12, 55,);
      }
      pdf.setFontSize(13);
      pdf.text("FACTURA N°________", 450, 30,);
      pdf.setFontSize(9);
      pdf.text(` ${clienteP.FECHA_PEDIDO}`, 500, 65,);
      pdf.setFontSize(13);
      pdf.text("FECHA", 450, 65,);
      pdf.text("________________________________________________________________________________", 12, 70,);
      pdf.setFontSize(9);
      pdf.text(`CLIENTE:    ${clienteP.NOMBRE_RAZON}`, 12, 85,);
      pdf.text(`NIT/CEDULA:    ${clienteP.CLIENTE}`, 12, 98,);
      pdf.text(`DOC2:    ${clienteP.PEDIDO}`, 340, 98,);
      pdf.text(`PEORI:    ${clienteP.PEDIDO}`, 450, 98,);
      pdf.text(`CIUDAD PPAL:    ${clienteP.CIUDAD}-${clienteP.DEPTO}`, 12, 112,);
      pdf.text(`TEL:    ${clienteP.PEDIDO}`, 340, 112,);
      pdf.text(`D'UNA:    ${clienteP.PEDIDO}`, 450, 112,);
      pdf.text(`DIRECCION Y CIUDAD DE DESPACHO:    ${clienteP.PEDIDO}`, 12, 125,);
      pdf.text(`SOLICITA:   ${clienteP.PEDIDO}`, 340, 125,);
    }

    encabezado()
    pdf.autoTable({
      head: [columnsParaPDF.map(column => column.headerName)], 
      body: dataToPrint, 
      styles,
      startY: 150,
      theme: 'grid',
      styles: {
        lineColor: [0, 0, 0], 
        lineWidth: 0.5, 
        font: "times",
        fontStyle: "normal",
        textColor: [0, 0, 0],
        fontSize: 8,
      },
      headStyles: {
        fillColor: false, 
        textColor: [0, 0, 0], 
        fontStyle: 'bold', 
        lineWidth: 0.5, 
        lineColor: [0, 0, 0]
      },
      columnStyles: { cellWidth: "auto" },
    });

    function agregarContenido() {
      pdf.setFontSize(10);
      pdf.text(`TOTAL ITEMS: ${productosP.length}`, 350, pdf.autoTable.previous.finalY + 20);
      pdf.text(`Total: ${sumaSaldoTotalDESC}`, 470, pdf.autoTable.previous.finalY + 20);
      pdf.text("SEPARADO POR _____________________________________", 12, pdf.autoTable.previous.finalY + 20)
      pdf.text("REVISADO POR ______________________________________", 12, pdf.autoTable.previous.finalY + 40);
      pdf.text("DESPACHADO POR ______________________", 350, pdf.autoTable.previous.finalY + 40);
      pdf.setFontSize(8);
      pdf.text(`VENDEDOR: ${clienteP.VENDEDOR}`, 12, pdf.autoTable.previous.finalY + 65);
      pdf.text(`MODIFICADO POR: ${clienteP.U_EDITADOPOR}`, 350, pdf.autoTable.previous.finalY + 65);
      pdf.text(`AUTORIZADO EN CARTERA POR: ${clienteP.VENDEDOR}`, 12, pdf.autoTable.previous.finalY + 80);
      pdf.text(`FECHA AUTORIZADO: ${clienteP.U_EDITADOPOR}`, 350, pdf.autoTable.previous.finalY + 80);
      pdf.text(`${fecha}`, 12, pdf.autoTable.previous.finalY + 103);
    }

      agregarContenido();

      pdf.output('dataurlnewwindow');
    }
  return { generarPDF };
}


export default useGenerarPDF;
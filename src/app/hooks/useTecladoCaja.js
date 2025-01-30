'use client';

import { useEffect } from "react";

const useTecladoCaja = (productosP, setProductosP, selectedRowsP, opcion) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const keyCode = event.keyCode || event.which;
      if ((keyCode >= 48 && keyCode <= 57) || keyCode === 13) {
        const nuevoValor = String.fromCharCode(keyCode);

        const indiceObjetoEditar = productosP.findIndex(
          (producto) => producto.ARTICULO === selectedRowsP[0]
        );
        const indiceObjetoEditarP = parseFloat(indiceObjetoEditar);

        if (indiceObjetoEditarP !== -1) {
          const productosEditados = [...productosP];
          const valorActual = productosEditados[indiceObjetoEditar][opcion];

          if (valorActual === "0" || valorActual === "") {
            productosEditados[indiceObjetoEditar][opcion] = nuevoValor;
            console.log(valorActual);
          } else {
            productosEditados[indiceObjetoEditar][
              opcion
            ] = `${valorActual}${nuevoValor}`;
            console.log(valorActual);
          }

          setProductosP(productosEditados);
        }
      }
    };

    const handleKeyDown = (event) => {
      const keyCode = event.keyCode || event.which;
      if (keyCode === 8) {
        const indiceObjetoEditar = productosP.findIndex(
          (producto) => producto.ARTICULO === selectedRowsP[0]
        );

        if (
          indiceObjetoEditar !== -1 &&
          productosP[indiceObjetoEditar][opcion]
        ) {
          const productosEditados = [...productosP];
          const valorActual = productosEditados[indiceObjetoEditar][opcion];
          productosEditados[indiceObjetoEditar][opcion] = valorActual.slice(
            0,
            -1
          );

          if (productosEditados[indiceObjetoEditar][opcion] === "") {
            productosEditados[indiceObjetoEditar][opcion] = "0";
          }
          setProductosP(productosEditados);
        }
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [productosP, selectedRowsP, opcion]);
};

export default useTecladoCaja;

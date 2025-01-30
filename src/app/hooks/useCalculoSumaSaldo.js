'use client';

import { useState, useEffect } from 'react';

const useCalculoSumaSaldo = (productosP, productosConDISP0, value) => {
  const [sumaSaldoTotal, setSumaSaldoTotal] = useState(0);
  const [sumaSaldoTotalDESC, setSumaSaldoTotalDESC] = useState(0);

  useEffect(() => {
    const PRDCTO = value === 0 ? productosP : productosConDISP0;
    if (Array.isArray(PRDCTO)) {  
      const sumaSaldo = PRDCTO.reduce((sum, producto) => {
          return sum + producto.CPed * producto.PRECIO;
      }, 0);
      const sumaSaldoDESC = PRDCTO.reduce((sum, producto) => {
        const precioConDescuento = producto.PRECIO * (1 - producto.PORC_DCTO / 100);
        const precioConIVA = precioConDescuento * (1 + producto.PORC_IMPUESTO / 100);
        return sum + producto.CPed * precioConIVA;
      }, 0);
      const precioRedondeado = Number(sumaSaldo).toFixed(0);
      const precioRedondeadoDESC = Number(sumaSaldoDESC).toFixed(0); 
      setSumaSaldoTotal(`${parseFloat(precioRedondeado).toLocaleString()}`);
      setSumaSaldoTotalDESC(`${parseFloat(precioRedondeadoDESC).toLocaleString()}`);
    }
  }, [productosP, productosConDISP0, value]); 

  return { sumaSaldoTotal, sumaSaldoTotalDESC };
}


export default useCalculoSumaSaldo;
'use client';

import { Box, Button, Card, CardContent, Divider, IconButton, InputBase, Paper, Typography } from "@mui/material"
import DirectionsIcon from '@mui/icons-material/Directions';
import useGenerarPDF from "@/app/hooks/useReciboPDF";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from "@/context/authContext";
import { Lora } from "next/font/google";
import Link from "next/link";

  const inter = Lora({ subsets: ['latin'] })

  const bull = (
    <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
      •
    </Box>
  );

  const ReciboCaja = () => {
    const { caja, auth } = useAuth(); 
    const valores = caja ? Object.values(caja) : []; 
    const valores2 = caja && caja.tipoPago ? Object.values(caja.tipoPago) : []; 
    const { generarPDF } = useGenerarPDF(valores, valores2, auth, caja); 

    const cerrarP = () => {
      localStorage.removeItem('pago'); 
      localStorage.removeItem('pedidoTempG'); 
      localStorage.removeItem('clientTemp'); 
      localStorage.removeItem('pedidoTemp'); 
    };

    return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0,0,0,0.1)', }}>

        <Paper className="container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', overflow: "auto"}}>
          <Typography variant="body1" textAlign="center" margin="20px 0" sx={{ fontSize: 50, marginBottom: "15px" }} color="#00796b" gutterBottom>
              Valor a Cancelar: $ {caja.total}
          </Typography>

          <Divider sx={{ fonSize:30 }} orientation="horizontal"></Divider>

          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Box sx={{ with: "50%", margin: 5 }}>
                    
              <h3 style={{ fontSize: 40, margin: 0, marginBottom: 6, padding: 0 }}>
                  ¿Como le gustaria recibir su recibo?
              </h3>
                  
              <Button variant="outlined" color="primary" sx={{ width: 550, marginBottom: 5, backgroundColor: "#00796b", color: "#fff"}} onClick={generarPDF}>Imprimir Recibo</Button>
            
              <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 550, height: 100, }}>
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <MenuIcon />
                </IconButton>

                <InputBase sx={{ ml: 1, flex: 1 }} inputProps={{ 'aria-label': 'search google maps' }}/>

                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>

                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

                <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                    <DirectionsIcon />
                </IconButton>
              </Paper>
            </Box>

            <Box sx={{ width: "50%", bord: 20, }}>
              <Card sx={{ width: "100%", height: "100%" }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBotton: 0}}>
                  <Typography className={inter.className} sx={{ fontSize: 17, flexDirection: 'column' }} color="text.secondary" gutterBottom>
                    ...........Miguel Gómez & Cia.................<br />
                    ...................Tel:777777.................<br />
                    ........Miguelgomoz&cia@hotmail.com...........<br />
                    ........https://www.miguelgomez.com.co/.......<br />
                    ----------------------------------------------<br />
                    ........ Servicio -  {auth?.PER_Nom}.......
                  </Typography>
                </CardContent>

                <CardContent>
                  {valores.map((row, index) => (
                    <Typography component="div" key={index} sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: 0 }}>
                      <span>{row.DESCRIPCION}</span>
                      <span>{row.PRECIO}</span>
                    </Typography>
                  ))}
                </CardContent>

                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 0}}>
                  <h3>
                    -------------------------<br />
                    Total {bull} {caja.total}
                  </h3>
                </CardContent>

                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', paddingTop: 0}}>
                  {valores2.map((row, index) => (
                    <Typography component="div" key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
                      {Object.entries(row).map(([key, value], idx) => (
                        value !== 0 ?
                          <span key={idx}> {key}
                            : {value.toString()} 
                          </span>
                            : null
                      ))}
                    </Typography>
                  ))} 
                </CardContent>

                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 0 }}>
                  <h3>
                    -------------------------<br />
                    Cambio {bull}{} {caja.cambio}
                  </h3>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box sx={{ width: '100%', padding: 0, margin: 0, paddingTop: 12 }}>
            <Button component={Link} href="../../pedidos/pedidosCaja" variant="outlined" 
              sx={{ width: "100%", height: 200, padding: 0, margin: 0, backgroundColor: "#00796b", color: "white" }} onClick={cerrarP}>
              Nuevo Pedido
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default ReciboCaja; 
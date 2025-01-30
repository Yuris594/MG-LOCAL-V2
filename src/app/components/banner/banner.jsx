"use client";

import Link from "next/link";
import Navbar from "./navbar";
import Swal from "sweetalert2";
import { useState } from "react";
import { Lora } from "next/font/google";
import HomeIcon from "@mui/icons-material/Home";
import { useAuth } from "@/context/authContext";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import { AccountCircle, ShoppingBag, Assignment, Person, ReceiptLong, Storefront } from "@mui/icons-material";
import { AppBar, Box, Button, CssBaseline, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";

const inter = Lora({ subsets: ['latin'] })

const Banner = () => {
  const { auth, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [productos, setProductos] = useState(false);


  const handleOpenNavMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setProductos(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseM = () => {
    setProductos(false);
    setAnchorEl(null);
  };

  const cerrarSesion = () => {
    Swal.fire({
      title: "¿Quieres terminar la Sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#09ff00",
      cancelButtonColor: "#fa0000",
      confirmButtonText: "Aceptar"
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    })
  };

  const page = [
    {
      title: "USUARIOS ",
      url: "/start/usuarios/",
      icon: <AccountCircle />,
    },
    {
      title: "PEDIDOS",
      url: "/start/pedidos/",
      icon: <Assignment />,
    },
    {
      title: "CLIENTES",
      url: "/start/clients/",
      icon: <Person />,
    },
    {
      title: "PRODUCTOS",
      icon: <ShoppingBag />,
      onClick: handleClick,
    },
    {
      title: "FACTURAS",
      url: "/start/facturas/",
      icon: <ReceiptLong />,
    },
    {
      title: "CAJA",
      url: "/start/pedidos/pedidosCaja/",
      icon: <Storefront />,
    },
  ];

  return (
    <>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "#262626", width: "auto" }}>
          <Toolbar>
            <IconButton color="inherit" onClick={handleOpenNavMenu} sx={{ display: { xs: "flex", md: "none" } }}>
              <WidgetsOutlinedIcon />
            </IconButton>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {page.map((link) => (
                  <Button sx={{ fontSize: "15px" }}
                    color="inherit"
                    size="large"
                    key={link.title}
                    LinkComponent={Link}
                    href={link.url}
                    onClick={link.onClick}>
                    {link.title}
                  </Button>
                ))}
              </Box>
              <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
              <Button component={Link} href="/start" color="inherit">
                <HomeIcon />
              </Button>
              <Button className={inter.className} color="inherit" sx={{ fontSize: "15px" }}>
                <PersonIcon />
                {auth && auth.PER_Nom}
              </Button>
              <Button color="inherit" onClick={cerrarSesion}>
                <LogoutIcon />
              </Button>
          </Toolbar>
        </AppBar>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={productos}
          onClose={handleCloseM}
          MenuListProps={{ "aria-labelledby": "basic-button" }}
        >
          <MenuItem onClick={handleCloseM} component={Link} href="/start/buscarProd/" >
            Buscar Por Referencias
          </MenuItem>
          <MenuItem onClick={handleCloseM} component={Link} href="/start/productosMG/">
            Lista de Todos Los Productos
          </MenuItem>
        </Menu>

        <Menu 
          id="basic-menu"
          anchorEl={anchorEl}
          MenuListProps={{'aria-labelledby': 'basic-button'}}
          open={Boolean(anchorEl)} 
          onClose={handleCloseNavMenu} 
          sx={{ display: { xs: "flex", md: "none" } }}>
            <Navbar page={page} />
        </Menu>
      </Box>
    </>
  );
};

export default Banner;

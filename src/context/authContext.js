

'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


const AuthContext = createContext({
    login: (authTokens) => {},
    logout: () => {},
});


export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading] = useState(true); 
  const [auth, setAuth] = useState(null); 
  const [cliente, setCliente] = useState({});
  const [pedido, setPedido] = useState({});
  const [caja, setCaja] = useState({});
  

  const login = useCallback(function (authTokens) {
      Cookies.set("authTokens", JSON.stringify(authTokens));
      localStorage.setItem("auth", JSON.stringify(authTokens))
      setAuth(authTokens);
  }, []);

  const logout = useCallback(function () {
    router.push("/");
    Cookies.remove('authTokens')
    localStorage.removeItem('auth');

    setAuth(null)
  }, []);


  //Guardar los datos del usuario para cuando recargue la pagina
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth') || Cookies.get('authTokens');
    const storePedidos = localStorage.getItem("pedido");
    const storeCartera = localStorage.getItem("caja");
    const storeCliente = localStorage.getItem("cliente");

    if (storeCliente) {
      setCliente(JSON.parse(storeCliente));
    }

    if (storePedidos) {
      setPedido(JSON.parse(storePedidos));
    }

    if (storeCartera) {
      setCaja(JSON.parse(storeCartera));
    }
    
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);


  const value = useMemo(() => ({
    auth,
    cliente,
    setCliente, 
    pedido,
    setPedido, 
    caja,
    setCaja, 
    loading,
    login,
    logout,
  }), [auth, cliente, pedido, caja, login, logout]);


  return (
      <AuthContext.Provider value={ value }>
          {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);





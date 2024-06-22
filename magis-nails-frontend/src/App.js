import './App.css';

import LoginPage from './components/login/LoginPage';
import { AuthProvider } from './context/AuthContext';

import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './util/PrivateRoute';
import Home from './components/home/home';
import Usuarios from './components/usuarios/usuarios';
import Reportes from './components/reportes/reportes';
import AgendaServicios from './components/servicios/agenda-servicios';
import Servicios from './components/servicios/servicios-adm';
import AgendaForm from './components/servicios/agenda-form';
import UsuariosForm from './components/usuarios/usuarios-form';
import ServiciosForm from './components/servicios/servicios-form';
import MiCuentaForm from './components/usuarios/mi-cuenta';
import Productos from './components/productos/productos';
import ProductosForm from './components/productos/producto-form';


function App() {
  return (

    <AuthProvider>

      <Routes>

        <Route path='/login' element={<LoginPage />} />
        
              <Route path='/' element={<PrivateRoute />} >
      
                <Route path='/' element={<Home />} />
                <Route path='micuenta' element={<MiCuentaForm />} />
                <Route path='agenda' element={<AgendaServicios />} />
                <Route path='usuarios' element={<Usuarios />} />
                <Route path='servicios' element={<Servicios />} />
                <Route path='productos' element={<Productos />} />
                <Route path='reportes' element={<Reportes />} />      

                <Route path='agenda/form' element={<AgendaForm />} />
                <Route path='usuarios/form' element={<UsuariosForm />} />      
                <Route path='servicios/form' element={<ServiciosForm />} />
                <Route path='productos/form' element={<ProductosForm />} />

                
                {/*<Route path='proformas/nuevo' element={<Proforma />} />  
       */}
              </Route>

      </Routes>

    </AuthProvider>


  );
}

export default App;

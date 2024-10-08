// import React, { useEffect } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';

// const RutaPrivadaAdmin = ({ element }) => {
//   const { isLoggedIn, isAdmin } = useAuth();
//   const navigate = useNavigate();


//   useEffect(() => {
//     // Verificar si el usuario está autenticado y es un administrador
//     if (!isLoggedIn || !isAdmin) {
//       // Si no, redirigir al inicio o a otra página
//       // Puedes ajustar la ruta según tus necesidades
//       navigate('/');
//     }
//   }, [isLoggedIn, isAdmin]);

//   // Si el usuario está autenticado y es un administrador, mostrar el componente
//   return isLoggedIn && isAdmin ? element : <Navigate to="/" />;
// };

// export default RutaPrivadaAdmin;
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RutaPrivadaAdmin = ({ element }) => {
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado y es un administrador
    if (!isLoggedIn || (role !== 3 && role !== 2)) {
      // Si no, redirigir al inicio o a otra página
      navigate('/');
    }
  }, [isLoggedIn, role, navigate]);

  // Si el usuario está autenticado y es un administrador, mostrar el componente
  return isLoggedIn && (role === 3 || role === 2) ? element : <Navigate to="/" />;
};

export default RutaPrivadaAdmin;
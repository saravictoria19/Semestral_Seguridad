// components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = ({ role }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (role === 'admin') {
      // Fetch users if the role is admin
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users', {
            headers: {
              Authorization: localStorage.getItem('token') // Asumiendo que estás almacenando el token en localStorage
            }
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching users', error);
        }
      };
      fetchUsers();
    }
  }, [role]);

    // Función para manejar la redirección a App.jsx
    const handleGoBack = () => {
      window.location.href = '/'; // Asumiendo que App.jsx está en la ruta raíz
    };

  return (
    <div>
      <h2 className="h2-home">Página de inicio</h2>
      {role === 'admin' ? (
        <div>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.username}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="bienvenida">Bienvenido al sistema. Esta es tu página de inicio.</p>
      )}
      <button onClick={handleGoBack} className="btn-home">Regresar a la página principal</button>
    </div>
  );
};

export default Home;

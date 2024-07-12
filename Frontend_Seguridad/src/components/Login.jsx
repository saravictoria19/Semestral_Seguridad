import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const maxAttempts = 4; // Número máximo de intentos fallidos antes de bloquear

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      console.log('Login successful: ', response.data);
      setMessage('Login exitoso');
      window.location.href = '/home'; // Redirigir a la página de inicio después del login exitoso
      // Aquí puedes manejar la redirección después del login exitoso
    } catch (error) {
      console.error('Error al intentar iniciar sesión: ', error);
      setMessage('Usuario o contraseña incorrectos');
      setFailedAttempts(failedAttempts + 1);

      // Si se alcanza el número máximo de intentos fallidos, bloquea el acceso
      if (failedAttempts + 1 === maxAttempts) {
        setMessage('Has alcanzado el número máximo de intentos fallidos. Tu acceso ha sido bloqueado.');
        // Aquí podrías deshabilitar el formulario o hacer otras acciones necesarias
      }
    }
  };

  return (
    <div>
      <h2 className="h2-login">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <label className="label-login">
          Usuario:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <label className="label-login">
          Contraseña:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button type="submit" disabled={failedAttempts >= maxAttempts}>Iniciar Sesión</button>
        {message && <p>{message}</p>}
        <h5 className="h5-login">¿Te acordaste que no tienes cuenta?</h5>
        <a href="/register" className="btn">Registrarse</a>
      </form>
    </div>
  );
};

export default Login;

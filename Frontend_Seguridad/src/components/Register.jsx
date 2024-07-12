import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css'; // Importa tus estilos CSS aquí

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    cedula: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    address: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    // Requerimientos: al menos una mayúscula, un carácter especial y mínimo 8 caracteres
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{8,})$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar contraseña antes de enviar al servidor
    if (!validatePassword(formData.password)) {
      setMessage('La contraseña debe contener al menos una mayúscula, un carácter especial y tener mínimo 8 caracteres.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      console.log('Usuario registrado: ', response.data);
      setMessage('Usuario registrado exitosamente');
      // Aquí puedes manejar la redirección después del registro exitoso
    } catch (error) {
      console.error('Error al intentar registrar usuario: ', error);
      setMessage('Error al registrar usuario');
    }
  };

  return (
    <div className="container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

        <label>Apellido:</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

        <label>Cédula:</label>
        <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} required />

        <label>Usuario:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Teléfono:</label>
        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

        <label>Fecha de Nacimiento:</label>
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />

        <label>Dirección:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />

        <label>Contraseña:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit">Registrarse</button>
        {message && <p>{message}</p>}
      </form>
      <h5>¿Ya tienes cuenta? <a href="/login" className="btn-registrar">Iniciar sesión</a></h5>
    </div>
  );
};

export default Register;

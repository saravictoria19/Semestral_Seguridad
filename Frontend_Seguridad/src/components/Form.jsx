import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ handleSubmit, buttonText, formType }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleSubmit(formData);
      setMessage(`¡${formType === 'register' ? 'Registro' : 'Inicio de sesión'} exitoso!`);
    } catch (error) {
      console.error(`Error al intentar ${formType === 'register' ? 'registrar' : 'iniciar sesión'}: `, error);
      setMessage('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            Usuario:
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>
            Contraseña:
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </label>
        </div>
        <button type="submit">{buttonText}</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Form;

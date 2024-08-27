import  { useState } from 'react';

const UploadForm = () => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('edad', edad);
    formData.append('fotoPerfil', fotoPerfil);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      alert('Datos guardados con éxito: ' + JSON.stringify(result));
    } catch (error) {
      alert('Error al subir los datos');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="edad">Edad:</label>
        <input
          type="number"
          id="edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="fotoPerfil">Foto de Perfil:</label>
        <input
          type="file"
          id="fotoPerfil"
          onChange={(e) => setFotoPerfil(e.target.files[0])}
          required
        />
      </div>

      <button type="submit">Subir</button>
    </form>
  );
};

export default UploadForm;

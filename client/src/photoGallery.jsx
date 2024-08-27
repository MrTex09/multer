import { useState, useEffect } from 'react';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Función para obtener las fotos subidas
    const fetchPhotos = async () => {
      try {
        const response = await fetch('http://localhost:3000/photos');
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Error al obtener las fotos:', error);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div>
      <h2>Galería de Fotos</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ margin: '10px' }}>
            <img
              src={`http://localhost:3000/uploads/${photo.foto_perfil}`}
              alt={photo.nombre}
              style={{ width: '200px', height: 'auto' }}
            />
            <p>{photo.nombre}</p>
            <p>Edad: {photo.edad}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
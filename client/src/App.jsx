
import PhotoGallery from "./photoGallery";
import UploadForm from "./upload";

const App = () => {
  return (
    <div>
      <h1>Subir Foto de Perfil</h1>
      <UploadForm />
      <PhotoGallery/>
    </div>
  );
};

export default App;

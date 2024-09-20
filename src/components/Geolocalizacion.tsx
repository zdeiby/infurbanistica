import React, { useEffect, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';

interface GpsCoordinatesProps {
  onLatLonChange: (lat: string, lon: string) => void;
}

const GpsCoordinates: React.FC<GpsCoordinatesProps> = ({ onLatLonChange }) => {
  const [latitud, setLatitud] = useState<string>('Cargando...');
  const [longitud, setLongitud] = useState<string>('Cargando...');

  const obtenerCoordenadas = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      setLatitud(latitude.toString());
      setLongitud(longitude.toString());

      // Pasar latitud y longitud al componente padre
      onLatLonChange(latitude.toString(), longitude.toString());
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      alert('No se pudo obtener la ubicación.');
    }
  };

  useEffect(() => {
    obtenerCoordenadas(); // Obtener coordenadas al cargar el componente
  }, []);

  return (
    <div>
      <div className="row g-3 was-validated">
        <div className="col-sm">
          <label className="form-label">Latitud:</label>
          <input
            type="text"
            value={latitud}
            placeholder="Latitud"
            className="form-control form-control-sm"
            disabled
          />
        </div>

        <div className="col-sm">
          <label className="form-label">Longitud:</label>
          <input
            type="text"
            value={longitud}
            placeholder="Longitud"
            className="form-control form-control-sm"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default GpsCoordinates;

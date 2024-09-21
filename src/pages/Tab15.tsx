import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonList, IonButton
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import loadSQL from '../models/database';

const getCurrentDateTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const Tab15: React.FC = () => {
  const params = useParams<any>();
  const [db, setDb] = useState<any>(null);
  const [observacion, setObservacion] = useState<string>('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [items, setItems] = useState({
    idfiu: params.ficha,
    observacion: '',
    fecharegistro: getCurrentDateTime(),
    usuario: localStorage.getItem('cedula'),
    estado: 1,
    tabla: 'infraccion_observaciones',
  });

  useEffect(() => {
    loadSQL(setDb, fetchObservacion);
  }, []);

  useEffect(() => {
    fetchObservacion();
  }, [params.ficha,db]);

  const saveDatabase = () => {
    if (db) {
      const data = db.export();
      localStorage.setItem('sqliteDb', JSON.stringify(Array.from(data)));
      const request = indexedDB.open('myDatabase', 1);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('sqliteStore')) {
          db.createObjectStore('sqliteStore');
        }
      };

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(['sqliteStore'], 'readwrite');
        const store = transaction.objectStore('sqliteStore');
        const putRequest = store.put(data, 'sqliteDb');

        putRequest.onsuccess = () => {
          console.log('Data saved to IndexedDB');
        };

        putRequest.onerror = (event: any) => {
          console.error('Error saving data to IndexedDB:', event.target.error);
        };
      };

      request.onerror = (event: any) => {
        console.error('Failed to open IndexedDB:', event.target.error);
      };
    }
  };

  const fetchObservacion = async (database = db) => {
    if (db) {
      const res = await db.exec(`SELECT observacion FROM infraccion_observaciones WHERE idfiu=${params.ficha}`);
      if (res[0]?.values && res[0]?.values.length > 0) {
        setObservacion(res[0].values[0][0]);
        setItems((prevItems) => ({
          ...prevItems,
          observacion: res[0].values[0][0]
        }));
        setButtonDisabled((res[0].values[0][0])?false:true); 

      }
    }
  };

  const handleInputChange = (event: any) => {
    const { value } = event.target;
    setObservacion(value);
    setItems((prevItems) => ({
      ...prevItems,
      observacion: value,
    }));
  };

  const validarCampos = () => {
    const camposObligatorios = ['observacion'];
    for (let campo of camposObligatorios) {
      if (!items[campo]) {
        return false;
      }
    }
    return true;
  };

  const enviar = async (database = db,event: React.MouseEvent<HTMLButtonElement>) => {
    if (!validarCampos()) {
      // alert('Por favor, completa todos los campos obligatorios.');
       return;
     }
     event.preventDefault();
    console.log(items)
    try {
      await db.exec(`INSERT OR REPLACE INTO infraccion_observaciones (
        idfiu, observacion, fecharegistro, usuario, estado, tabla
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        items.idfiu, items.observacion, items.fecharegistro, items.usuario, items.estado, items.tabla
      ]);
      setButtonDisabled(false);
      saveDatabase();
      alert('Observación guardada con éxito');
    } catch (err) {
      console.error('Error al guardar la observación:', err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">11 - OBSERVACIONES</IonTitle>
          <IonTitle slot="end">FICHA: <label style={{ color: '#17a2b8' }}>{params.ficha}</label> </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <form>
        <div className="social-card">
          <span className="label">Ficha:</span>
          <span className="value">{params.ficha}</span>
        </div>
        <div className='shadow p-3 mb-5 bg-white rounded'>
          <IonList>
            <div className="alert alert-primary" role="alert">
              <span className="badge badge-secondary text-dark">11 - OBSERVACIONES</span>
            </div>
            <div className="row g-3 was-validated">
              <div className="col-sm">
                <textarea 
                  placeholder="" 
                  className="form-control" 
                  rows="5" 
                  required 
                  value={observacion}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </IonList>
        </div>
        {/* <div>
          <IonButton color="success" onClick={enviar}>Guardar</IonButton>
          <IonButton routerLink={`/tabs/tab16/${params.ficha}`} disabled={buttonDisabled}>Siguiente</IonButton>
        </div> */}
        <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
       <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/tabs/tab18/${params.ficha}`;} }}> Siguiente</div>
       </div>
       </form>
      </IonContent>
    </IonPage>
  );
};

export default Tab15;

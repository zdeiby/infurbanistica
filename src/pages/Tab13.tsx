import ExploreContainer from '../components/ExploreContainer';
import './Tab4.css';
import React, { useEffect, useState } from 'react';
import { Person } from '../models/person.model';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonSelect, IonList, IonInput, IonButton, IonItem, IonLabel,
  IonBadge, IonSelectOption, IonText, IonDatetimeButton, IonModal, IonDatetime,
  IonIcon
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import loadSQL from '../models/database';

const Tab13: React.FC = () => {
  const params = useParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [db, setDb] = useState<any>(null);
  const [items, setItems] = useState({
    idfiu: '',
    tienemascotas: '',
    cuantos: '',
    cuales: '',
    // albergalos: '',
    // dondelista: '',
    // donde: '',
    // requierealbergue: '',
    fecharegistro: '',
    usuario: '',
    estado: '',
    tabla: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    loadSQL(setDb, fetchUsers);
  }, []);

  const saveDatabase = () => {
    if (db) {
      const data = db.export();
      localStorage.setItem('sqliteDb', JSON.stringify(Array.from(data)));
      const request = indexedDB.open('myDatabase', 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('sqliteStore')) {
          db.createObjectStore('sqliteStore');
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['sqliteStore'], 'readwrite');
        const store = transaction.objectStore('sqliteStore');
        const putRequest = store.put(data, 'sqliteDb');

        putRequest.onsuccess = () => {
          console.log('Data saved to IndexedDB');
        };

        putRequest.onerror = (event) => {
          console.error('Error saving data to IndexedDB:', event.target.error);
        };
      };

      request.onerror = (event) => {
        console.error('Failed to open IndexedDB:', event.target.error);
      };
    }
  };

  const fetchUsers = async (database = db) => {
    if (db) {
      const res = await database.exec(`SELECT * FROM infraccion_mascotas WHERE idfiu=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedPeople = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {});
        });
        setPeople(transformedPeople);
        setButtonDisabled((transformedPeople[0].idfiu)?false:true); 
      } else {
        setItems({
          idfiu: params.ficha,
          tienemascotas: '',
          cuantos: '0',
          cuales: 'NO APLICA',
          // albergalos: '',
          // dondelista: '',
          // donde: 'NO APLICA',
          // requierealbergue: '',
          fecharegistro: getCurrentDateTime(),
          usuario: localStorage.getItem('cedula'),
          estado: '1',
          tabla: 'infraccion_mascotas',
        });
      }
    }
  };

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

  useEffect(() => {
    if (people.length > 0) {
      let data = people[0] || {};
      setItems({
        idfiu: data.idfiu || params.ficha,
        tienemascotas: data.tienemascotas || '',
        cuantos: data.cuantos || '',
        cuales: data.cuales || '',
        // albergalos: data.albergalos || '',
        // dondelista: data.dondelista || '',
        // donde: data.donde || '',
        // requierealbergue: data.requierealbergue || '',
        fecharegistro: data.fecharegistro || '',
        usuario: data.usuario || '',
        estado: data.estado || '',
        tabla: data.tabla || '',
      });
    }
  }, [people]);

  useEffect(() => {
    fetchUsers();
  }, [db]);

  const handleInputChange = (event, field) => {
    const { value } = event.target;
    setItems((prevItems) => {
      const newState = { ...prevItems, [field]: value };
      if (field === 'tienemascotas') {
      //  newState.donde = value  =='2'? '' : 'NO APLICA';
        newState.cuales = value =='2' ? '' : 'NO APLICA';
        newState.cuantos = value =='2'? '0' : '0'; 
       // newState.albergalos = value =='2'? '' : ''; 
       // newState.dondelista = value =='2'? '' : ''; 
       // newState.requierealbergue = value =='2'? '' : '';    
      }

      if (field === 'albergalos') {
    //    newState.dondelista = value  =='2'? '' : '';
      //  newState.donde = value  =='2'? '' : 'NO APLICA';
      //  newState.requierealbergue = value  =='1'? '' : '';

      }
      

      return newState;
    });
  };

  useEffect(() => {
    console.log("Items updated:", items);
  }, [items]);

  const validarCampos = () => {
    // Campos obligatorios generales
    const camposObligatorios = ['tienemascotas'];
  
    // Si tiene mascotas
    if (items.tienemascotas == '2') {
      camposObligatorios.push('cuantos', 'cuales');
      
      // Validar según el valor de albergalos
      // if (items.albergalos == '2') {
      //   camposObligatorios.push('dondelista');
      //   // Validar si la opción seleccionada en dondelista es "OTRO"
      //   if (items.dondelista == '3') {
      //     camposObligatorios.push('donde');
      //   }
      // } else if (items.albergalos == '1') {
      //   camposObligatorios.push('requierealbergue');
      // }
    }
  
    // Verificar que todos los campos obligatorios estén llenos
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
      await db.exec(`INSERT OR REPLACE INTO infraccion_mascotas (idfiu, tienemascotas, cuantos, cuales,  fecharegistro, usuario, estado, tabla)
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          items.idfiu, items.tienemascotas, items.cuantos, items.cuales, items.fecharegistro, items.usuario, items.estado, items.tabla
        ]);

      const respSelect = db.exec(`SELECT * FROM "infraccion_mascotas" WHERE idfiu="${items.idfiu}";`);
      setButtonDisabled(false);
      saveDatabase();
      alert('Datos Guardados con éxito');
    } catch (err) {
      console.error('Error al exportar los datos JSON:', err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">7 - MASCOTAS</IonTitle>
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
              <span className="badge badge-secondary text-dark">14 - MASCOTAS</span>
            </div>
            <div className="row g-3 was-validated ">
              <div className="col-sm">
                <label className="form-label">Tiene mascotas a su cuidado:</label>
                <select value={items.tienemascotas} onChange={(e) => handleInputChange(e, 'tienemascotas')} className="form-control form-control-sm" required>
                  <option value="">SELECCIONE</option>
                  <option value="1">NO</option>
                  <option value="2">SI</option>
                </select>
              </div>
              {(items.tienemascotas =='2')?
              <div className="col-sm">
                <label className="form-label">Cuantos</label>
                <input type="number" value={items.cuantos} onChange={(e) => handleInputChange(e, 'cuantos')} className="form-control form-control-sm" required />
                <small className="form-text text-muted">Solo números, mínimo uno.</small>
              </div>  :''}
                  {(items.tienemascotas =='2')?
                  <div className="col-sm-12">
                <label className="form-label">Cuales:</label>
                <input type="text" value={items.cuales} onChange={(e) => handleInputChange(e, 'cuales')} className="form-control form-control-sm" required />
                <small className="form-text text-muted">Por favor separa cada mascota por comas.</small>
              </div> :''}
                 {/* {(items.tienemascotas =='2')? <div className="col-sm-12">
                <label className="form-label">En caso de ser necesario, tiene donde albergarlos mientras se ubica en un lugar seguro:</label>
                <select value={items.albergalos} onChange={(e) => handleInputChange(e, 'albergalos')} className="form-control form-control-sm" required>
                  <option value="">SELECCIONE</option>
                  <option value="1">NO</option>
                  <option value="2">SI</option>
                </select>
              </div> :''}
                 {(items.tienemascotas =='2' && items.albergalos=='2')? 
                 <div className="col-sm-12">
                <label className="form-label">¿Donde?</label>
                <select value={items.dondelista} onChange={(e) => handleInputChange(e, 'dondelista')} className="form-control form-control-sm" required>
                  <option value="">SELECCIONE</option>
                  <option value="3">OTRO</option>
                  <option value="1">RED FAMILIAR</option>
                  <option value="2">RED SOCIAL</option>
                </select>
              </div> :''}
                 {(items.tienemascotas =='2' && items.albergalos=='2' && items.dondelista=='3')? 
                 <div className="col-sm">
                <label className="form-label">Cual:</label>
                <input type="text" value={items.donde} onChange={(e) => handleInputChange(e, 'donde')} className="form-control form-control-sm" required />
                <small className="form-text text-muted">Informa donde se van a albergar las mascotas.</small>
              </div> :''}
              {(items.tienemascotas =='2' && items.albergalos=='1')? 
                  <div className="col-sm-12">
                <label className="form-label">Requiere albergue para su mascota?</label>
                <select value={items.requierealbergue} onChange={(e) => handleInputChange(e, 'requierealbergue')} className="form-control form-control-sm" required>
                  <option value="">SELECCIONE</option>
                  <option value="3">ABANDONO</option>
                  <option value="1">NO</option>
                  <option value="2">SI</option>
                </select>
                 </div> :''} */}
            </div>
          </IonList>
        </div>

        <br />

        <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
       <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/tabs/tab11/${params.ficha}`;} }}> Siguiente</div>
       </div>
       </form>
      </IonContent>
    </IonPage>
  );
};

export default Tab13;

import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonSelect, IonList, IonInput, IonButton, IonItem, IonLabel,
    IonBadge, IonSelectOption, IonText,
    IonIcon
  } from '@ionic/react';

  import React, { useEffect, useState } from 'react';
  import initSqlJs from 'sql.js';
  import axios from 'axios';
  import loadSQL from '../models/database';
  import { useHistory, useParams } from 'react-router-dom';
  import 'bootstrap/dist/css/bootstrap.min.css';
  
  interface Person {
    idfiu: number;
    ingreso_empleo_formal: string | null;
    ingreso_empleo_informal: string | null;
    ingreso_subsidio: string | null;
    ingreso_pension: string | null;
    ingreso_ayuda: string | null;
    ingreso_otro: string | null;
    ingreso_total: string | null;
    egreso_alimentacion: string | null;
    egreso_educacion: string | null;
    egreso_arriendo: string | null;
    egreso_servicios: string | null;
    egreso_salud: string | null;
    egreso_transporte: string | null;
    egreso_deuda: string | null;
    egreso_otro: string | null;
    egreso_total: string | null;
    fecharegistro: string | null;
    usuario: string | null;
    estado: string | null;
    tabla: string | null;
  }
  
  
  
  
  
  const Tab17: React.FC = () => {
    const params = useParams();
    const [people, setPeople] = useState<Person[]>([]);
    const [db, setDb] = useState<any>(null);
    const [items, setItems] = useState({
      idfiu: '',
      ingreso_empleo_formal: '',
      ingreso_empleo_informal: '',
      ingreso_subsidio: '',
      ingreso_pension: '',
      ingreso_ayuda: '',
      ingreso_otro: '',
      ingreso_total: '',
      egreso_alimentacion: '',
      egreso_educacion: '',
      egreso_arriendo: '',
      egreso_servicios: '',
      egreso_salud: '',
      egreso_transporte: '',
      egreso_deuda: '',
      egreso_otro: '',
      egreso_total: '',
      fecharegistro: '',
      usuario: '',
      estado: '',
      tabla: 'infraccion_socioeconomico',
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
  
    useEffect(() => {
      loadSQL(setDb, fetchUsers);
    }, []);
  
   
  
  
    const saveDatabase = () => {
      if (db) {
        const data = db.export();
        localStorage.setItem('sqliteDb', JSON.stringify(Array.from(data)));
        const request = indexedDB.open('myDatabase', 1); // Asegúrate de usar el mismo nombre de base de datos
    
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
        const res = await database.exec(`SELECT * FROM infraccion_socioeconomico  where idfiu=${params.ficha}`);
        if (res[0]?.values && res[0]?.columns) {
          const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
            return res[0].columns.reduce((obj, col, index) => {
              obj[col] = row[index];
              return obj;
            }, {} as Person);
          });
          setPeople(transformedPeople);
          setButtonDisabled((transformedPeople[0].tipovisita)?false:true); 
      
        }else{
          setItems({
            idfiu: params.ficha,
            ingreso_empleo_formal: '0',
            ingreso_empleo_informal: '0',
            ingreso_subsidio: '0',
            ingreso_pension: '0',
            ingreso_ayuda: '0',
            ingreso_otro: '0',
            ingreso_total: '0',
            egreso_alimentacion: '0',
            egreso_educacion: '0',
            egreso_arriendo: '0',
            egreso_servicios: '0',
            egreso_salud: '0',
            egreso_transporte: '0',
            egreso_deuda: '0',
            egreso_otro: '0',
            egreso_total: '0',
            fecharegistro: getCurrentDateTime(),
            usuario: localStorage.getItem('cedula'),
            estado: '1',
            tabla: 'infraccion_socioeconomico',
          });
        }
      }
  
    };
  
    const getCurrentDateTime = () => {
    const date = new Date();
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const day = String(date.getDate()).padStart(2, '0');
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
    const getCurrentTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };
  
  
   useEffect(() => {
    if (people.length > 0) {
      let data = people[0] || {};
      setItems({
            idfiu: data.fichatecnia || '',
            ingreso_empleo_formal: data.ingreso_empleo_formal || '',
            ingreso_empleo_informal: data.ingreso_empleo_informal || '',
            ingreso_subsidio:data.ingreso_subsidio || '',
            ingreso_pension: data.ingreso_pension || '',
            ingreso_ayuda:data.ingreso_ayuda || '',
            ingreso_otro: data.ingreso_otro || '',
            ingreso_total: data.ingreso_total || '',
            egreso_alimentacion: data.egreso_alimentacion || '',
            egreso_educacion: data.egreso_educacion || '',
            egreso_arriendo: data.egreso_arriendo || '',
            egreso_servicios:data.egreso_servicios || '',
            egreso_salud: data.egreso_salud || '',
            egreso_transporte: data.egreso_transporte || '',
            egreso_deuda: data.egreso_deuda || '',
            egreso_otro: data.egreso_otro || '',
            egreso_total: data.egreso_total || '',
            fecharegistro:  data.fecharegistro || '',
            usuario:  data.usuario || localStorage.getItems('cedula'),
            estado: data.estado || '1',
            tabla: data.tabla || '',

     
      });
    }
  }, [people]); // Ejecuta este efecto cuando `people` cambia
  
  // Llamar a `fetchUsers` en el momento adecuado
  useEffect(() => {
    fetchUsers();
  }, [db]); // Ejecuta este efecto cuando `db` cambia
  
    //saveDatabase();    para guardar la db
  
  
  
  
  
  
    const handleInputChange = (event, field) => {
      const { value } = event.target;
      setItems((prevItems) => ({
        ...prevItems,
        [field]: value,
      }));
  
    };
  
   useEffect(() => {
      console.log("Items updated:", items);
      // Aquí puedes realizar cualquier acción que dependa de que `items` esté actualizado
    }, [items]);
  
    const validarCampos = () => {
      const camposObligatorios = ['motivovisita', 'tipovisita', 'tipo', 'horaatencion', 'fechavisita'];
      for (let campo of camposObligatorios) {
        if (!items[campo]) {
          return false;
        }
      }
      return true;
    };
  
  
    const enviar = async (database = db,event: React.MouseEvent<HTMLButtonElement>) => {
    // event.preventDefault();
     if (!validarCampos()) {
     // alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    event.preventDefault();
      try {
              await db.exec(`INSERT OR REPLACE INTO infraccion_socioeconomico ( idfiu, ingreso_empleo_formal, ingreso_empleo_informal, ingreso_subsidio, ingreso_pension, ingreso_ayuda, ingreso_otro, ingreso_total, egreso_alimentacion, egreso_educacion, egreso_arriendo, egreso_servicios, egreso_salud, egreso_transporte, egreso_deuda, egreso_otro, egreso_total, fecharegistro, usuario, estado, tabla
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`, 
  [ items.idfiu, items.ingreso_empleo_formal, items.ingreso_empleo_informal, items.ingreso_subsidio, items.ingreso_pension, items.ingreso_ayuda, items.ingreso_otro, items.ingreso_total, items.egreso_alimentacion, items.egreso_educacion, items.egreso_arriendo, items.egreso_servicios, items.egreso_salud, items.egreso_transporte, items.egreso_deuda, items.egreso_otro, items.egreso_total, items.fecharegistro, items.usuario, items.estado, items.tabla ]
);
  
            // update ui
            const respSelect = db.exec(`SELECT * FROM "infraccion_socioeconomico"  where idfiu="${items.idfiu}";`);
            setButtonDisabled(false);
            saveDatabase();
            alert('Datos Guardados con éxito');
          }
             catch (err) {
        console.error('Error al exportar los datos JSON:', err);
      }
    }
  
    function sololectura(){
    }
    
    return (
      <IonPage>
        <IonHeader><div className='col-12'>
          <IonToolbar>
            <IonTitle slot="start">10 - ASPECTOS SOCIOECONÓMICOS DEL GRUPO FAMILIAR</IonTitle>
            <IonTitle slot="end">FICHA: <label style={{ color: '#17a2b8' }}>{params.ficha}</label> </IonTitle>
          </IonToolbar></div>
        </IonHeader>
        <IonContent fullscreen><form>
          
          <div className="social-card">
            <span className="label">Ficha: {params.ficha}</span>
          </div>
          <div className="social-card2 text-center">
            <span className="value2">INGRESOS MENSUALES DEL GRUPO FAMILIAR</span>
          </div>
          <br />
         
        <div className=' shadow p-3 mb-5 bg-white rounded'>
        <IonList>
  <div className="row g-3 was-validated">
            <div className="col-sm-4">
              <label  className="form-label">Salario (Empleo formal): $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_empleo_formal')}  value={items.ingreso_empleo_formal || 0} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
              <div className="col-sm-4">
              <label  className="form-label">Ingresos (Empleo Informal): $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_empleo_informal')}  value={items.ingreso_empleo_informal || 0} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Subsidios en dinero: $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_subsidio')}  value={items.ingreso_subsidio || 0} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Pensión: $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_pension')}  value={items.ingreso_pension || 0} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Ayuda Económica: $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_ayuda')}  value={items.ingreso_ayuda || 0} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Otro: $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_otro')}  value={items.ingreso_otro || 0} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">TOTAL: $</label>
              <input disabled onChange={(e) => handleInputChange(e, 'ingreso_total')}  value={items.ingreso_total} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            </div>
  </IonList>

         <br />
          <div className="social-card2 text-center">
            <span className="value2">EGRESOS MENSUALES DEL GRUPO FAMILIAR</span>
          </div>
          <br />
  
  <IonList>
  <div className="row g-3 was-validated ">
            <div className="col-sm-6">
              <label  className="form-label">Hora atencion</label>
              <input onChange={(e) => handleInputChange(e, 'horaatencion')}  value={items.horaatencion} type="time" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-6">
              <label  className="form-label">Fecha visita</label>
              <input onChange={(e) => handleInputChange(e, 'fechavisita')}  value={items.fechavisita} type="date" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
          </div>
  </IonList>
  </div>
  
          {/* </IonList>
          <IonList>
            <IonItem>
              <IonInput labelPlacement="stacked" label="Ficha Técnica" aria-label="Primary input" color="primary" placeholder="Ficha Técnica"></IonInput>
              <IonInput labelPlacement="stacked" label="Hora activación" aria-label="Primary input" color="primary" placeholder="Hora activación" ></IonInput>
            </IonItem>
          </IonList>
          <IonList>
            <IonItem>
  
              <IonInput labelPlacement="stacked" label="Hora de llegada al evento" aria-label="Primary input" color="primary" placeholder="Hora de llegada al evento"></IonInput>
              <IonInput labelPlacement="stacked" label="Hora atención" aria-label="Primary input" color="primary" placeholder="Hora atención" ></IonInput>
            </IonItem>
          </IonList>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Fecha visita</IonLabel>
              <IonInput aria-label="Primary input" color="primary" placeholder="Fecha visita"></IonInput>
            </IonItem>
          </IonList> */}
  
      <br />
         <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
         <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/tabs/tab2/${params.ficha}`;} }}> Siguiente</div>
         </div> 
             </form>
        </IonContent>
      </IonPage>
  
    );
  };
  
  export default Tab17;
  
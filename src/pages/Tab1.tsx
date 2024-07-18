import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonSelect, IonList, IonInput, IonButton, IonItem, IonLabel,
  IonBadge, IonSelectOption, IonText,
  IonIcon
} from '@ionic/react';
import './Tab1.css';
import React, { useEffect, useState } from 'react';
import initSqlJs from 'sql.js';
import axios from 'axios';
import loadSQL from '../models/database';
import { useHistory, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Person {
  fichasocial: number;
  fichatecnia: string;
  motivovisita: string;
  tipovisita: string;
  horaactivacion: string;
  horaatencion: string;
  fechavisita: string;
  fecharegistro: string;
  usuario: string;
  estado: string;
  tabla: string;
  tipo: string;
  declaradafallida: string | null;
  ficharecuperda: string | null;
  horallegadaalevento: string;
  remitir: string | null;
  remitir2: string | null;
}




const Tab1: React.FC = () => {
  const params = useParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [db, setDb] = useState<any>(null);
  const [items, setItems] = useState({
    fichasocial: '',
    fichatecnia: '',
    motivovisita: '',
    tipovisita: '',
    tipo: '',
    horaactivacion: '',
    horallegadaalevento: '',
    horaatencion: '',
    fechavisita: '',
    fecharegistro: '',
    usuario: '',
    estado: '',
    tabla: '',
    declaradafallida: '',
    ficharecuperda: '',
    remitir: '',
    remitir2: '',
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
      const res = await database.exec(`SELECT * FROM c0_informaciondelevento  where fichasocial=${params.ficha}`);
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
          fichasocial:  params.ficha,
          fichatecnia: params.ficha,
          motivovisita: '',
          tipovisita:  '',
          tipo: '',
          horaactivacion:  getCurrentTime(),
          horallegadaalevento:  getCurrentTime(),
          horaatencion: '',
          fechavisita:'',
          fecharegistro: getCurrentDateTime(),
          usuario: localStorage.getItem('cedula'),
          estado: '1',
          tabla:  'c0_informaciondelevento',
          declaradafallida:  '',
          ficharecuperda:  '',
          remitir:  '',
          remitir2:  '',
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
      fichasocial: data.fichasocial || params.ficha,
      fichatecnia: data.fichatecnia || '',
      motivovisita: data.motivovisita || '',
      tipovisita: data.tipovisita || '',
      tipo: data.tipo || '',
      horaactivacion: data.horaactivacion || getCurrentTime(),
      horallegadaalevento: data.horallegadaalevento || getCurrentTime(),
      horaatencion: data.horaatencion || '',
      fechavisita: data.fechavisita || '',
      fecharegistro: data.fecharegistro || '',
      usuario: data.usuario || localStorage.getItems('cedula'),
      estado: data.estado || '1',
      tabla: data.tabla || '',
      declaradafallida: data.declaradafallida || '',
      ficharecuperda: data.ficharecuperda || '',
      remitir: data.remitir || '',
      remitir2: data.remitir2 || '',
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
            await db.exec(`INSERT OR REPLACE INTO c0_informaciondelevento (fichasocial,fichatecnia, motivovisita,tipovisita,horaactivacion
                          ,horaatencion,fechavisita,fecharegistro,usuario,estado,tabla,tipo,declaradafallida,ficharecuperda,horallegadaalevento,
                          remitir,remitir2
                          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`, [items.fichasocial, items.fichatecnia, items.motivovisita, items.tipovisita, items.horaactivacion
              , items.horaatencion, items.fechavisita, items.fecharegistro, items.usuario, items.estado, items.tabla, items.tipo, items.declaradafallida, items.ficharecuperda, 
              items.horallegadaalevento, items.remitir, items.remitir2]);

          // update ui
          const respSelect = db.exec(`SELECT * FROM "c0_informaciondelevento"  where fichasocial="${items.fichasocial}";`);
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
          <IonTitle slot="start">0 INFORMACION DEL EVENTO </IonTitle>
          <IonTitle slot="end">FICHA SOCIAL: <label style={{ color: '#17a2b8' }}>{params.ficha}</label> </IonTitle>
        </IonToolbar></div>
      </IonHeader>
      <IonContent fullscreen><form>
        
        <div className="social-card">
          <span className="label">Ficha social:</span>
          <span className="value">{params.ficha}</span>
        </div>
        <div className="social-card2">
          <span className="label2">Informacion de la Ficha tecnica:</span>
          <span className="value2">Ficha tecnica encontrada en BITACORA de Emergencias. Las horas de Activacion y Llegada se llenaran automaticamente.</span>
        </div>
        <br />
       
      <div className=' shadow p-3 mb-5 bg-white rounded'>
<IonList>
<div className="row g-3 was-validated ">
        <div className="col-sm-4">
        <label  className="form-label">Motivo visita</label>
          <select onChange={(e) => handleInputChange(e, 'motivovisita')}  value={items.motivovisita} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
              <option  value=""> SELECCIONE </option>
              <option value="1"> EMERGENCIA </option>
              <option value="4"> POSTERIOR A EMERGENCIA </option>
              <option value="3"> REVISITA </option>
              <option value="2"> RIESGO </option> 
            </select>
          </div>
          <div className="col-sm-4">
          <label  className="form-label">Tipo visita</label>
          <select onChange={(e) => handleInputChange(e, 'tipovisita')}  value={items.tipovisita} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
           <option value=""> SELECCIONE </option>
           {/*  <option value="2"> FALLIDA </option>
            <option value="5"> FALLIDA - INICIAL EN ACCESS (SOLO SI LA FALLIDA INICIAL ESTA EN ACCES) </option>*/}
            <option value="1"> FICHA SOCIAL </option>
           {/* <option value="4"> LOCAL COMERCIAL </option>
            <option value="3"> NO APLICA FICHA SOCIAL </option>*/}
            </select>
          </div>
          <div className="col-sm-4">
          <label  className="form-label">Bomberos</label>
          <select onChange={(e) => handleInputChange(e, 'tipo')}  value={items.tipo} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
            <option  value="">Selecciona</option>
            <option value="1">SI</option>
            <option value="2">No</option>
            </select>
          </div>

         
          
        </div>
</IonList>

<IonList>
<div className="row g-3 was-validated">
          <div className="col-sm-4">
            <label  className="form-label"># Ficha tecnica</label>
            <input value={params.ficha} onChange={sololectura} type="text" placeholder="" className="form-control form-control-sm  "  required/>
          </div>
          <div className="col-sm-4">
            <label  className="form-label">Hora activacion</label>
            <input onChange={(e) => handleInputChange(e, 'horaactivacion')}  value={items.horaactivacion} disabled type="text" placeholder="" className="form-control form-control-sm  "  required/>
          </div>
          <div className="col-sm-4">
            <label  className="form-label">Hora de llegada</label>
            <input   onChange={(e) => handleInputChange(e, 'horallegadaalevento')}  value={items.horallegadaalevento} disabled type="text" placeholder="" className="form-control form-control-sm  "  required/>
          </div>
        </div>
</IonList>

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

export default Tab1;

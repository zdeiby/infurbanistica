import ExploreContainer from '../components/ExploreContainer';
import './Tab4.css';
import React,{useEffect, useState} from 'react';
import EmployeeItem from './../components/EmployeeItem';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonSelect,IonList, IonInput, IonButton, IonItem, IonLabel, 
  IonBadge,IonSelectOption, IonText, IonDatetimeButton,IonModal,IonDatetime,
  IonIcon} from '@ionic/react';
  import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory, useParams } from 'react-router-dom';
import loadSQL from '../models/database';

interface Person {
  fichasocial: string | null;
  tipoevacuacion: string | null;
  danosvivienda: string | null;
  danosenseres: string | null;
  fecharegistro: string | null;
  usuario: string | null;
  estado: string | null;
  tabla: string | null;
}


const Tab4: React.FC = () => {
  const params = useParams();

  const [people, setPeople] = useState<Person[]>([]);
  const [db, setDb] = useState<any>(null);
  const [items, setItems] = useState({
    fichasocial: '',
    tipoevacuacion: '',
    danosvivienda: '',
    danosenseres: '',
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
      const res = await database.exec(`SELECT * FROM c3_evacuacionydanos WHERE fichasocial=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Person);
        });
        setPeople(transformedPeople);
        setButtonDisabled((transformedPeople[0].tipoevacuacion)?false:true);  
      } else {
        setItems({
          fichasocial: params.ficha,
          tipoevacuacion: '',
          danosvivienda: '',
          danosenseres: '',
          fecharegistro: getCurrentDateTime(),
          usuario: localStorage.getItem('cedula'),
          estado: '1',
          tabla: 'c3_evacuacionydanos',
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
        fichasocial: data.fichasocial || params.ficha,
        tipoevacuacion: data.tipoevacuacion || '',
        danosvivienda: data.danosvivienda || '',
        danosenseres: data.danosenseres || '',
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
    setItems((prevItems) => ({
      ...prevItems,
      [field]: value,
    }));
    console.log(items);
  };

  useEffect(() => {
    console.log("Items updated:", items);
  }, [items]);

  const validarCampos = () => {
    const camposObligatorios = ['tipoevacuacion', 'danosvivienda', 'danosenseres'];
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
      await db.exec(`INSERT OR REPLACE INTO c3_evacuacionydanos (fichasocial, tipoevacuacion, danosvivienda, danosenseres, fecharegistro, usuario, estado, tabla)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          items.fichasocial, items.tipoevacuacion, items.danosvivienda, items.danosenseres, items.fecharegistro, items.usuario, items.estado, items.tabla
        ]);

      const respSelect = db.exec(`SELECT * FROM "c3_evacuacionydanos" WHERE fichasocial="${items.fichasocial}";`);
      setButtonDisabled(false);
      saveDatabase();
      alert('Datos Guardados con éxito');
    } catch (err) {
      console.error('Error al exportar los datos JSON:', err);
    }
  };

  function sololectura() {
  }
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle slot="start">3 - EVALUACION Y DAÑOS</IonTitle>  
        <IonTitle slot="end">FICHA SOCIAL: <label style={{color:'#17a2b8'}}>{params.ficha}</label> </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <form>
    <div className="social-card">
      <span className="label">Ficha social:</span>
      <span className="value">{params.ficha}</span>
    </div>

      <br />

    
<div className=' shadow p-3 mb-5 bg-white rounded'>
<IonList>
<div className="row g-3 was-validated ">
        <div className="col-sm-4">
        <label  className="form-label">Tipo de evacuacion requerida:</label>
          <select onChange={(e) => handleInputChange(e, 'tipoevacuacion')}  value={items.tipoevacuacion} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option><option value="2"> DEFINITIVA </option><option value="3"> NO SE REQUIERE </option><option value="5"> PENDIENTE </option><option value="4"> PREVENTIVA </option><option value="1"> TEMPORAL </option>
            </select>
          </div>
          <div className="col-sm-4">
          <label  className="form-label">Daños en la vivienda:</label>
          <select onChange={(e) => handleInputChange(e, 'danosvivienda')}  value={items.danosvivienda} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option><option value="3"> NO AFECTADO </option><option value="2"> PARCIAL </option><option value="1"> TOTAL </option>
            </select>
          </div>
          <div className="col-sm-4">
          <label  className="form-label">Daños en los enseres:</label>
          <select onChange={(e) => handleInputChange(e, 'danosenseres')}  value={items.danosenseres} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option><option value="3"> NO AFECTADO </option><option value="2"> PARCIAL </option><option value="1"> TOTAL </option>
            </select>
          </div>

         
          
        </div>
</IonList>

</div>

        <br />

    {/* <div><IonButton color="success" onClick={enviar}>Guardar</IonButton><IonButton disabled={buttonDisabled} routerLink={`/tabs/tab5/${params.ficha}`}>Siguiente</IonButton></div> */}
    <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
       <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/tabs/tab5/${params.ficha}`;} }}> Siguiente</div>
       </div>   
    </form>
    </IonContent>
  </IonPage>
  );
};

export default Tab4;

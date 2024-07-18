import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import React,{useEffect, useState} from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonSelect,IonList, IonInput, IonButton, IonItem, IonLabel, 
  IonBadge,IonSelectOption, IonText, IonDatetimeButton,IonModal,IonDatetime,
  IonIcon} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import loadSQL from '../models/database';

interface Person {
  fichasocial: string | null;
  visitadagrd: string | null;
  tipoevento: string | null;
  fecharegistro: string | null;
  usuario: string | null;
  estado: string | null;
  tabla: string | null;
  otro: string | null;
  quebrada: string | null;
  inquilinato: string | null;
}


const Tab2: React.FC = () => {
  const params = useParams();


  const [people, setPeople] = useState<Person[]>([]);
  const [db, setDb] = useState<any>(null);
  const [items, setItems] = useState({
    fichasocial: '',
    visitadagrd: '',
    tipoevento: '',
    fecharegistro : '',
    usuario: '',
    estado: '',
    tabla: '',
    otro: '',
    quebrada: '',
    inquilinato: '',
    
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
      const res = await database.exec(`SELECT * FROM c1_identificacionevento  where fichasocial=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Person);
        });
        setPeople(transformedPeople);
        setButtonDisabled((transformedPeople[0].tipoevento)?false:true);  
      }else{
        setItems({
          fichasocial:  params.ficha,
          visitadagrd: '',
          tipoevento: '',
          fecharegistro:  getCurrentDateTime(),
          usuario: localStorage.getItem('cedula'),
          estado: '1',
          tabla:  'c1_identificacionevento',
          otro: 'NO APLICA',
          quebrada: 'NO APLICA',
          inquilinato: ''
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


 useEffect(() => {
  if (people.length > 0) {
    let data = people[0] || {};
    setItems({
      fichasocial: data.fichasocial || params.ficha,
      visitadagrd: data.visitadagrd || '',
      tipoevento: data.tipoevento || '',
      fecharegistro: data.fecharegistro || '',
      usuario: data.usuario || '',
      estado: data.estado || '',
      tabla: data.tabla || '',
      otro: data.otro || '',
      quebrada: data.quebrada || '',
      inquilinato: data.inquilinato || '',
  
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
    setItems((prevItems) => {
      const newState = { ...prevItems, [field]: value };
      if (field === 'tipoevento') {
        newState.otro = value === '13' ? '' : 'NO APLICA';
      }if (field === 'tipoevento') {
        newState.quebrada = value === '12' ? '' : 'NO APLICA';
      }
      return newState;
    });
  };

 useEffect(() => {
    console.log("Items updated:", items);
    // Aquí puedes realizar cualquier acción que dependa de que `items` esté actualizado
  }, [items]);

  const validarCampos = () => {
    const camposObligatorios = ['visitadagrd', 'tipoevento', 'quebrada', 'otro', 'inquilinato'];
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
        await db.exec(`INSERT OR REPLACE INTO c1_identificacionevento (fichasocial, visitadagrd, tipoevento, fecharegistro, usuario, estado, tabla, otro, quebrada, inquilinato)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, 
        [items.fichasocial, items.visitadagrd, items.tipoevento, items.fecharegistro, items.usuario, items.estado, items.tabla, items.otro, items.quebrada, items.inquilinato]);

          // update ui
          const respSelect = db.exec(`SELECT * FROM "c1_identificacionevento"  where fichasocial="${items.fichasocial}";`);
          saveDatabase();
          alert('Datos Guardados con éxito');
          setButtonDisabled(false);
        }
           catch (err) {
      console.error('Error al exportar los datos JSON:', err);
    }
  }

  function sololectura(){
  }
  


  
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle slot="start">1 - IDENTIFICACION DEL EVENTO </IonTitle>  
        <IonTitle slot="end">FICHA SOCIAL: <label style={{color:'#17a2b8'}}>{params.ficha}</label> </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <form>

    <div className="social-card">
      <span className="label">Ficha social:</span>
      <span className="value">{params.ficha}</span>
    </div>
    {/* <div className="social-card2">
      <span className="label2">Informacion de la Ficha tecnica:</span>
      <span className="value2">Ficha tecnica encontrada en BITACORA de Emergencias. Las horas de Activacion y Llegada se llenaran automaticamente.</span>
    </div> */}
      <br />
      
      <div className=' shadow p-3 mb-5 bg-white rounded'>
  <IonList>
  <div className="row g-3 was-validated ">
          <div className="col-sm-6">
              <label  className="form-label">Fecha visita DAGRD:</label>
              <input type="date" onChange={(e) => handleInputChange(e, 'visitadagrd')} value={items.visitadagrd} className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-6">
            <label  className="form-label">Tipo de evento:</label>
            <select onChange={(e) => handleInputChange(e, 'tipoevento')} value={items.tipoevento} className="form-control form-control-sm"  aria-describedby="validationServer04Feedback" required>
                <option value=""> SELECCIONE </option>
                <option value="10"> AVENIDA TORRENCIAL </option>
                <option value="6"> COLAPSO DE LA VIVIENDA </option>
                <option value="8"> DETERIORO ESTRUCTURAL </option>
                <option value="9"> HUMEDADES </option>
                <option value="1"> INCENDIO </option>
                <option value="12"> INUNDACION </option>
                <option value="2"> MOVIMIENTO EN MASA </option>
                <option value="13"> OTROS </option>
                <option value="7"> RIESGO </option>
                {/*<option value="5"> TECNOLOGICO </option>*/}
                <option value="4"> TERREMOTO </option>
                <option value="3"> TERRORISMO </option>
                <option value="11"> VOLADURA DE TECHO </option> 
              </select>
            </div>
            {(items.tipoevento =='13')? 
            <div className="col-sm-12">
              <label  className="form-label">Cuales:</label>
              <input type="text" onChange={(e) => handleInputChange(e, 'otro')} value={items.otro ||''} placeholder="" className="form-control form-control-sm  "  required/>
            </div>:'' }
            {(items.tipoevento =='12')? 
            <div className="col-sm-12">
              <label  className="form-label">Motivo:</label>
              <input type="text" onChange={(e) => handleInputChange(e, 'quebrada')} value={items.quebrada || ''} placeholder="" className="form-control form-control-sm  "  required/>
            </div>:'' }
          </div>
  </IonList>

  <IonList>
  <div className="row g-3 was-validated ">

            <div className="col-sm">
            <label  className="form-label">Es inquilinato:</label>
            <select onChange={(e) => handleInputChange(e, 'inquilinato')}  value={items.inquilinato} className="form-control form-control-sm"  aria-describedby="validationServer04Feedback" required>
                <option value=""> SELECCIONE </option>
                <option value="1"> NO </option><option value="2"> SI </option>
              </select>
            </div>
            </div> 
  </IonList>

  
  </div>
   <br /><br />
    {/* <div><IonButton color="success" onClick={enviar}>Guardar</IonButton><IonButton disabled={buttonDisabled} routerLink={`/tabs/tab3/${params.ficha}`}>Siguiente</IonButton></div> */}
    <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
       <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/tabs/tab3/${params.ficha}`;} }}> Siguiente</div>
       </div>
       </form>
    </IonContent>
  </IonPage>
  );
};

export default Tab2;

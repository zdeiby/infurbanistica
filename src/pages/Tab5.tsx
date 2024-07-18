import ExploreContainer from '../components/ExploreContainer';
import './Tab4.css';
import React,{useEffect, useState} from 'react';
import EmployeeItem from '../components/EmployeeItem';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonSelect,IonList, IonInput, IonButton, IonItem, IonLabel, 
  IonBadge,IonSelectOption, IonText, IonDatetimeButton,IonModal,IonDatetime,
  IonIcon} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import loadSQL from '../models/database';

interface Person {
  fichasocial: string | null;
  tipovivienda: string | null;
  materialpisos: string | null;
  materialpisosotro: string | null;
  materialparedes: string | null;
  materialtechos: string | null;
  fecharegistro: string | null;
  usuario: string | null;
  estado: string | null;
  tabla: string | null;
}



const Tab5: React.FC = () => {
  const params = useParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [db, setDb] = useState<any>(null);
  const [items, setItems] = useState({
    fichasocial: '',
    tipovivienda: '',
    materialpisos: '',
    materialpisosotro: '',
    materialparedes: '',
    materialtechos: '',
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
      const res = await database.exec(`SELECT * FROM c4_datosdelavivienda WHERE fichasocial=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Person);
        });
        setPeople(transformedPeople);
        setButtonDisabled((transformedPeople[0].tipovivienda)?false:true);
      } else {
        setItems({
          fichasocial: params.ficha,
          tipovivienda: '',
          materialpisos: '',
          materialpisosotro: '',
          materialparedes: '',
          materialtechos: '',
          fecharegistro: getCurrentDateTime(),
          usuario: localStorage.getItem('cedula'),
          estado: '1',
          tabla: 'c4_datosdelavivienda',
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
        tipovivienda: data.tipovivienda || '',
        materialpisos: data.materialpisos || '',
        materialpisosotro: data.materialpisosotro || '',
        materialparedes: data.materialparedes || '',
        materialtechos: data.materialtechos || '',
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
      if (field === 'materialpisos') {
        newState.materialpisosotro = value === '6' ? '' : 'NO APLICA';
      }
      return newState;
    });
  };

  useEffect(() => {
    console.log("Items updated:", items);
  }, [items]);

  const validarCampos = () => {
    const camposObligatorios = ['tipovivienda', 'materialpisos', 'materialpisosotro', 'materialparedes', 'materialtechos'];
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
      await db.exec(`INSERT OR REPLACE INTO c4_datosdelavivienda (fichasocial, tipovivienda, materialpisos, materialpisosotro, materialparedes, materialtechos, fecharegistro, usuario, estado, tabla)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          items.fichasocial, items.tipovivienda, items.materialpisos, items.materialpisosotro, items.materialparedes, items.materialtechos, items.fecharegistro, items.usuario, items.estado, items.tabla
        ]);

      const respSelect = db.exec(`SELECT * FROM "c4_datosdelavivienda" WHERE fichasocial="${items.fichasocial}";`);
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
        <IonTitle slot="start">4 - DATOS DE LA VIVIENDA</IonTitle>  
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
        <div className="col-sm-6">
        <label  className="form-label">Tipo de vivienda:</label>
          <select onChange={(e) => handleInputChange(e, 'tipovivienda')}  value={items.tipovivienda} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option><option value="2"> APARTAMENTO </option><option value="1"> CASA </option><option value="3"> HABITACION </option><option value="6"> LOCAL </option><option value="5"> PREFABRICADA </option><option value="4"> RANCHO </option>   
            </select>
          </div>
          <div className="col-sm-6">
          <label  className="form-label">Material predominante de pisos:</label>
          <select onChange={(e) => handleInputChange(e, 'materialpisos')} value={items.materialpisos} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option><option value="1"> BALDOSA </option><option value="2"> CEMENTO </option><option value="3"> MADERA </option><option value="6"> OTROS </option><option value="5"> PIEDRA </option><option value="4"> TIERRA </option>
            </select>
          </div>
          {(items.materialpisos =='6')? 
          <div className="col-sm-12">
              <label  className="form-label">Cuales:</label>
              <input type="text" onChange={(e) => handleInputChange(e, 'materialpisosotro')} value={items.materialpisosotro} placeholder="" className="form-control form-control-sm  "  required/>
            </div> :'' }
          <div className="col-sm-6">
          <label  className="form-label">Material predominante de paredes:</label>
          <select onChange={(e) => handleInputChange(e, 'materialparedes')} value={items.materialparedes} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option><option value="3"> BAREQUE </option><option value="7"> DESECHOS(CARTON, LATAS, PLASTICO) </option><option value="1"> LADRILLO </option><option value="4"> MADERA </option><option value="6"> PREFABRICADA </option><option value="2"> TAPIA </option><option value="5"> ZINC </option>
            </select>
          </div>
          <div className="col-sm-6">
          <label  className="form-label">Material predominante de techos:</label>
          <select onChange={(e) => handleInputChange(e, 'materialtechos')} value={items.materialtechos} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option><option value="6"> BAREQUE </option><option value="5"> DESECHOS(CARTON, LATA, PLASTICO) </option><option value="3"> ETERNIT </option><option value="1"> LOSA </option><option value="7"> MADERA </option><option value="2"> TEJA DE BARRO </option><option value="4"> ZINC </option> 
            </select>
          </div>

         
          
        </div>
</IonList>
</div>

        <br />

    {/* <div><IonButton color="success" onClick={enviar}>Guardar</IonButton><IonButton disabled={buttonDisabled} routerLink={`/tabs/tab6/${params.ficha}`}>Siguiente</IonButton></div> */}
    <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
       <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/tabs/tab6/${params.ficha}`;} }}> Siguiente</div>
       </div>
    </form>
    </IonContent>
  </IonPage>
  );
};

export default Tab5;

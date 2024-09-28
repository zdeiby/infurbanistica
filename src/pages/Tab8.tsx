import ExploreContainer from '../components/ExploreContainer';
import './Tab4.css';
import React, { useEffect, useState } from 'react';
import EmployeeItem from '../components/EmployeeItem';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonSelect, IonList, IonInput, IonButton, IonItem, IonLabel,
  IonBadge, IonSelectOption, IonText, IonDatetimeButton, IonModal, IonDatetime,
  IonIcon
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import loadSQL from '../models/database';

interface Person {
  idfiu: string | null;
  tenenciadelavivienda: string | null;
  propietario: string | null;
  propietariotel1: string | null;
  propietariotel2: string | null;
  escritura: string | null;
  compraventa: string | null;
  promesa: string | null;
  posesion: string | null;
  impuestopredial: string | null;
  serviciospublicos: string | null;
  matriculapredial: string | null;
  extrajuicio: string | null;
  ninguno: string | null;
  otro: string | null;
  cualdocumentos: string | null;
  unidadproductuva: string | null;
  cualunidadproductiva: string | null;
  fecharegistro: string | null;
  usuario: string | null;
  estado: string | null;
  tabla: string | null;
}



const Tab8: React.FC = () => {
  const params = useParams();
 
  const [people, setPeople] = useState<Person[]>([]);
  const [db, setDb] = useState<any>(null);
  const [items, setItems] = useState({
    idfiu: '',
    tenenciadelavivienda: '',
    propietario: '',
    propietariotel1: '',
    propietariotel2: '',
    escritura: '',
    compraventa: '',
    promesa: '',
    posesion: '',
    impuestopredial: '',
    serviciospublicos: '',
    matriculapredial: '',
    extrajuicio: '',
    ninguno: '',
    otro: '',
    cualdocumentos: '',
    unidadproductuva: '',
    cualunidadproductiva: '',
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
      const res = await database.exec(`SELECT * FROM infraccion_tenencia_vivienda WHERE idfiu=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Person);
        });
        setPeople(transformedPeople);
        setButtonDisabled((transformedPeople[0].tenenciadelavivienda)?false:true); 
      } else {
        setItems({
          idfiu: params.ficha,
          tenenciadelavivienda: '',
          propietario: '',
          propietariotel1: '',
          propietariotel2: '',
          escritura: '1',
          compraventa: '1',
          promesa: '1',
          posesion: '1',
          impuestopredial: '1',
          serviciospublicos: '1',
          matriculapredial: '1',
          extrajuicio: '1',
          ninguno: '1',
          otro: '1',
          cualdocumentos: '',
          unidadproductuva: '',
          cualunidadproductiva: '',
          fecharegistro: getCurrentDateTime(),
          usuario: localStorage.getItem('cedula'),
          estado: '1',
          tabla: 'infraccion_tenencia_vivienda',
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
        tenenciadelavivienda: data.tenenciadelavivienda || '',
        propietario: data.propietario || '',
        propietariotel1: data.propietariotel1 || '',
        propietariotel2: data.propietariotel2 || '',
        escritura: data.escritura || '',
        compraventa: data.compraventa || '',
        promesa: data.promesa || '',
        posesion: data.posesion || '',
        impuestopredial: data.impuestopredial || '',
        serviciospublicos: data.serviciospublicos || '',
        matriculapredial: data.matriculapredial || '',
        extrajuicio: data.extrajuicio || '',
        ninguno: data.ninguno || '',
        otro: data.otro || '',
        cualdocumentos: data.cualdocumentos || '',
        unidadproductuva: data.unidadproductuva || '',
        cualunidadproductiva: data.cualunidadproductiva || '',
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
      if (field === 'tenenciadelavivienda') {
        newState.propietario = value === '4' ? '' : '';
        newState.propietariotel1 = value === '1' ? '' : '';
        newState.propietariotel2 = value === '6' ? '' : '';
      } if (field === 'otro') {
        newState.cualdocumentos = value === '2' ? '' : '';
      } 
      if (field === 'unidadproductuva') {
        newState.cualunidadproductiva = value === '2' ? '' : '';
      } 

      
      return newState;
    });
  };

  useEffect(() => {
    console.log("Items updated:", items);
  }, [items]);

  const validarCampos = () => {
    const camposObligatorios = ['tenenciadelavivienda', 'unidadproductuva','cualunidadproductiva'];
    if (items.tenenciadelavivienda === '2' || items.tenenciadelavivienda === '3') {
      camposObligatorios.push('propietario');
    }
    if (items.unidadproductuva === '1') {
      let index = camposObligatorios.indexOf('cualunidadproductiva');
      if (index !== -1) {
          camposObligatorios.splice(index, 1);
      }
  }
  
  
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
      await db.exec(`INSERT OR REPLACE INTO infraccion_tenencia_vivienda (idfiu, tenenciadelavivienda, propietario, propietariotel1, propietariotel2, escritura, compraventa, promesa, posesion, impuestopredial, serviciospublicos, matriculapredial, extrajuicio, ninguno, otro, cualdocumentos, unidadproductuva, cualunidadproductiva, fecharegistro, usuario, estado, tabla)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);`,
        [
          items.idfiu, items.tenenciadelavivienda, items.propietario, items.propietariotel1, items.propietariotel2, items.escritura, items.compraventa, items.promesa, items.posesion,
          items.impuestopredial, items.serviciospublicos, items.matriculapredial, items.extrajuicio, items.ninguno, items.otro, items.cualdocumentos, items.unidadproductuva, items.cualunidadproductiva,
          items.fecharegistro, items.usuario, items.estado, items.tabla
        ]);

      const respSelect = db.exec(`SELECT * FROM "infraccion_tenencia_vivienda" WHERE idfiu="${items.idfiu}";`);
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
          <IonTitle slot="start">3 - TENENCIA DE LA VIVIENDA</IonTitle>
          <IonTitle slot="end">FICHA: <label style={{ color: '#17a2b8' }}>{params.ficha}</label> </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <form>
      <div className="social-card">
      <span className="label">Ficha:</span>
      <span className="value">{params.ficha}</span>
    </div>

        <div className=' shadow p-3 mb-5 bg-white rounded'>
          <IonList>
            <div className="alert alert-primary" role="alert">
              <span className="badge badge-secondary text-dark">3 - TENENCIA DE LA VIVIENDA</span>
            </div>
            <div className="row g-3 was-validated ">
              <div className="col-sm">
                <label className="form-label">Tenencia de la vivienda:</label>
                <select onChange={(e) => handleInputChange(e, 'tenenciadelavivienda')} value={items.tenenciadelavivienda} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value=""> SELECCIONE </option><option value="2"> ALQUILADA </option><option value="4"> INVADIDA </option><option value="5"> POSESION </option><option value="3"> PRESTADA </option><option value="1"> PROPIA </option><option value="6"> SUCESION </option>                </select>
              </div>
              {(items.tenenciadelavivienda =='2' ||items.tenenciadelavivienda =='3')? 
              <div className="col-sm">
                <label className="form-label" >Propietario/poseedor</label>
                <input type="text"  onChange={(e) => handleInputChange(e, 'propietario')} value={items.propietario} className="form-control form-control-sm  " required/>
              </div>
              :'' }

            </div>
          </IonList> 
          <IonList>{(items.tenenciadelavivienda =='2' ||items.tenenciadelavivienda =='3')?
            <div className="row g-3 was-validated ">
              <div className="col-sm">
                <label className="form-label" >Telefono1 del propietario:</label>
                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'propietariotel1')} value={items.propietariotel1} className="form-control form-control-sm  " />
              <small>Minimo 10 digitos, si es fijo debe incluir el 604.</small>
              </div>
            </div>:'' }
        </IonList>
        <IonList>{(items.tenenciadelavivienda =='2' ||items.tenenciadelavivienda =='3')?
            <div className="row g-3 was-validated ">
              <div className="col-sm">
                <label className="form-label" >Telefono2 del propietario:</label>
                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'propietariotel2')} value={items.propietariotel2} className="form-control form-control-sm  " />
                <small>Minimo 10 digitos, si es fijo debe incluir el 604.</small>
              </div>
            </div>:'' }
        </IonList>
        </div>
        <div className=' shadow p-3 mb-2 pt-0 bg-white rounded'>
          <IonList>
            <div className="alert alert-primary" role="alert">
              <span className="badge badge-secondary text-dark">4 - DOCUMENTOS DE LA VIVIENDA</span>
            </div>
            <div className="row g-3 was-validated ">
              <div className="col-sm-6">
                <label className="form-label">Escritura:</label>
                <select onChange={(e) => handleInputChange(e, 'escritura')} value={items.escritura} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div> <div className="col-sm-6">
                <label className="form-label">Compraventa:</label>
                <select onChange={(e) => handleInputChange(e, 'compraventa')} value={items.compraventa}className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div> <div className="col-sm-6">
                <label className="form-label">Promesa de compraventa:</label>
                <select onChange={(e) => handleInputChange(e, 'promesa')} value={items.promesa} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div> <div className="col-sm-6">
                <label className="form-label">Posesion:</label>
                <select onChange={(e) => handleInputChange(e, 'posesion')} value={items.posesion} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div> <div className="col-sm-6">
                <label className="form-label">Impuesto predial:</label>
                <select onChange={(e) => handleInputChange(e, 'impuestopredial')} value={items.impuestopredial} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div> <div className="col-sm-6">
                <label className="form-label">Servicios Publicos:</label>
                <select onChange={(e) => handleInputChange(e, 'serviciospublicos')} value={items.serviciospublicos} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div> <div className="col-sm-6">
                <label className="form-label">Matricula predial:</label>
                <select onChange={(e) => handleInputChange(e, 'matriculapredial')} value={items.matriculapredial} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div> <div className="col-sm-6">
                <label className="form-label">Extrajuicio:</label>
                <select onChange={(e) => handleInputChange(e, 'extrajuicio')} value={items.extrajuicio} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div> <div className="col-sm-6">
                <label className="form-label">Ninguno:</label>
                <select onChange={(e) => handleInputChange(e, 'ninguno')} value={items.ninguno} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div>
              <div className="col-sm-6">
                <label className="form-label">Otro:</label>
                <select onChange={(e) => handleInputChange(e, 'otro')} value={items.otro} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div>
              {(items.otro =='2')?
              <div className="col-sm">
                <label className="form-label" >Cual</label>
                <input type="text" placeholder="" onChange={(e) => handleInputChange(e, 'cualdocumentos')} value={items.cualdocumentos} className="form-control form-control-sm  " required/>
              </div> :''}
              
            </div>
          </IonList>
          <IonList>
            <div className="row g-3 was-validated ">
            <div className="col-sm">
                <label className="form-label">La vivienda cuenta con unidad productiva:</label>
                <select onChange={(e) => handleInputChange(e, 'unidadproductuva')} value={items.unidadproductuva} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                <option value=""> Seleccione </option>
                <option value="1"> NO </option>
                <option value="2"> SI </option>
                </select>
              </div>
              {(items.unidadproductuva =='2')?
              <div className="col-sm">
                <label className="form-label" >Cual</label>
                <input type="text" placeholder="" onChange={(e) => handleInputChange(e, 'cualunidadproductiva')} value={items.cualunidadproductiva} className="form-control form-control-sm  " required/>
              </div>:''}
            </div>
          </IonList>

        </div>


        <br />

        {/* <div><IonButton color="success" onClick={enviar}>Guardar</IonButton><IonButton disabled={buttonDisabled} routerLink={`/tabs/tab9/${params.ficha}`}>Siguiente</IonButton></div> */}

        <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
       <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/tabs/tab6/${params.ficha}`;} }}> Siguiente</div>
       </div>
       </form>
      </IonContent>
    </IonPage>
  );
};

export default Tab8;

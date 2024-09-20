import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';
import React,{useEffect, useState} from 'react';
import EmployeeItem from './../components/EmployeeItem';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonSelect,IonList, IonInput, IonButton, IonItem, IonLabel, 
  IonBadge,IonSelectOption, IonText, IonDatetimeButton,IonModal,IonDatetime,
  IonIcon} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import GpsCoordinates from '../components/Geolocalizacion';
import 'bootstrap/dist/css/bootstrap.min.css';
import loadSQL from '../models/database';

interface Person {
  idfiu: string | null;
  fechaentrevista:string | null;
  codigosticker:string | null;
  solicitudrequerimiento: string | null;
  direccion: string | null;
  comuna: string | null;
  barrio: string | null;
  ruralurbano: string | null;
  sector: string | null;
  telefono1: string | null;
  telefono2: string | null;
  correo: string | null;
  estrato: string | null;
  fecharegistro: string | null;
  usuario: string | null;
  estado: string | null;
  tabla: string | null;
  dirCampo1: string | null;
  dirCampo2: string | null;
  dirCampo3: string | null;
  dirCampo4: string | null;
  dirCampo5: string | null;
  dirCampo6: string | null;
  dirCampo7: string | null;
  dirCampo8: string | null;
  dirCampo9: string | null;
  longitud: string | null;
  latitud: string | null;
}

interface Comuna {
  id: number;
  descripcion: string;
  estado: number;
}

interface Barrio {
  id: number;
  descripcion: string;
  comuna: number;
  estado: number;
}


const Tab3: React.FC = () => {

  const params = useParams();


  const [people, setPeople] = useState<Person[]>([]);
  const [db, setDb] = useState<any>(null);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [items, setItems] = useState({
    idfiu: '',
    fechaentrevista:'',
    codigosticker:'',
    solicitudrequerimiento:'',
    direccion: '',
    comuna: '',
    barrio: '',
    ruralurbano: '',
    sector: '',
    telefono1: '',
    telefono2: '',
    correo: '',
    estrato: '',
    fecharegistro: '',
    usuario: '',
    estado: '',
    tabla: '',
    dirCampo1: '',
    dirCampo2: '',
    dirCampo3: '',
    dirCampo4: '',
    dirCampo5: '',
    dirCampo6: '',
    dirCampo7: '',
    dirCampo8: '',
    dirCampo9: '',
    longitud: '',
    latitud: '',
    
  });

  const [items2, setItems2] = useState({
    idfiu: '',
    fechaentrevista:'',
    codigosticker:'',
    solicitudrequerimiento:'',
    direccion: '',
    comuna: '',
    barrio: '',
    ruralurbano: '',
    sector: '',
    telefono1: '',
    telefono2: '',
    correo: '',
    estrato: '',
    fecharegistro: '',
    usuario: '',
    estado: '',
    tabla: '',
    dirCampo1: '',
    dirCampo2: '',
    dirCampo3: '',
    dirCampo4: '',
    dirCampo5: '',
    dirCampo6: '',
    dirCampo7: '',
    dirCampo8: '',
    dirCampo9: '',
    longitud: '',
    latitud: '',
    
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    loadSQL(setDb, fetchUsers);
    fetchBarrios();
    fetchComunas();
    
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
      const res = await database.exec(`SELECT * FROM infraccion_localizacion  where idfiu=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Person);
        });
        setPeople(transformedPeople); 
        setButtonDisabled((transformedPeople[0].comuna)?false:true);  
      }else{
        setItems({
          idfiu: params.ficha,
          fechaentrevista:'',
          codigosticker:'',
          solicitudrequerimiento:'',
          direccion: '',
          comuna: '',
          barrio: '',
          ruralurbano: '',
          sector: '',
          telefono1: '',
          telefono2: '',
          correo: '',
          estrato: '',
          fecharegistro: getCurrentDateTime(),
          usuario: localStorage.getItem('cedula'),
          estado: '1',
          tabla: 'infraccion_localizacion',
          dirCampo1: '',
          dirCampo2: '',
          dirCampo3: '',
          dirCampo4: '',
          dirCampo5: '',
          dirCampo6: '',
          dirCampo7: '',
          dirCampo8: '',
          dirCampo9: '',
          longitud: '',
          latitud: '',
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


  const handleLatLonChange = (lat: string, lon: string) => {   // para la geolocalizacion
    setItems((prevItems) => ({
      ...prevItems,
      latitud: lat,
      longitud: lon,
    }));
  };


 useEffect(() => {
  if (people.length > 0) {
    let data = people[0] || {};
    console.log('Loaded data:', data); // Verificar datos cargados
    setItems({
      idfiu: data.idfiu || params.ficha,
      fechaentrevista:data.fechaentrevista || '',
      codigosticker:data.codigosticker || '',
      solicitudrequerimiento:data.solicitudrequerimiento || '',
      direccion: data.direccion || '',
      comuna: data.comuna || '',
      barrio: data.barrio || '',
      ruralurbano: data.ruralurbano || '',
      sector: data.sector || '',
      telefono1: data.telefono1 || '',
      telefono2: data.telefono2 || '',
      correo: data.correo || '',
      estrato: data.estrato || '',
      fecharegistro: data.fecharegistro || '',
      usuario: data.usuario || '',
      estado: data.estado || '',
      tabla: data.tabla || '',
      dirCampo1: data.dirCampo1 || '',
      dirCampo2: data.dirCampo2 || '',
      dirCampo3: data.dirCampo3 || '',
      dirCampo4: data.dirCampo4 || '',
      dirCampo5: data.dirCampo5 || '',
      dirCampo6: data.dirCampo6 || '',
      dirCampo7: data.dirCampo7 || '',
      dirCampo8: data.dirCampo8 || '',
      dirCampo9: data.dirCampo9 || '',
      longitud: data.longitud || '',
      latitud: data.latitud || '',
  
    });
  }
}, [people]); // Ejecuta este efecto cuando `people` cambia

// Llamar a `fetchUsers` en el momento adecuado
useEffect(() => {
  fetchUsers();
  fetchBarrios();
  fetchComunas();
}, [db]); // Ejecuta este efecto cuando `db` cambia

//   const handleInputChange = (event, field) => {
//     const { value } = event.target;
//     setItems((prevItems) => ({
//       ...prevItems,
//       [field]: value,
//     }));
// //console.log(items)
//   };

 useEffect(() => {
    console.log("Items updated:", items);
    // Aquí puedes realizar cualquier acción que dependa de que `items` esté actualizado
  }, [items]);
  

  const validarCampos = () => {
    const camposObligatorios = ['dirCampo1', 'dirCampo2', 'dirCampo5', 
      'dirCampo8', 'ruralurbano',
    'comuna', 'barrio','telefono1','estrato'];
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
      await db.exec(`INSERT OR REPLACE INTO infraccion_localizacion (idfiu,fechaentrevista, codigosticker, solicitudrequerimiento,  direccion, comuna, barrio, ruralurbano, sector, telefono1, telefono2, correo, estrato, fecharegistro, usuario, estado, tabla, dirCampo1, dirCampo2, dirCampo3, dirCampo4, dirCampo5, dirCampo6, dirCampo7, dirCampo8, dirCampo9, longitud, latitud)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?);`,
          [
            items.idfiu, items.fechaentrevista, items.codigosticker, items.solicitudrequerimiento, items.direccion, items.comuna, items.barrio, items.ruralurbano, items.sector, items.telefono1, items.telefono2, items.correo, items.estrato,
            items.fecharegistro, items.usuario, items.estado, items.tabla, items.dirCampo1, items.dirCampo2, items.dirCampo3, items.dirCampo4, items.dirCampo5, items.dirCampo6,
            items.dirCampo7, items.dirCampo8, items.dirCampo9, items.longitud, items.latitud
          ]);

          // update ui
          const respSelect = db.exec(`SELECT * FROM "infraccion_localizacion" WHERE idfiu="${items.idfiu}";`);
          setButtonDisabled(false);
          saveDatabase();
          alert('Datos Guardados con éxito');
        }
           catch (err) {
      console.error('Error al exportar los datos JSON:', err);
    }
  }

  //  const handleInputChange2 = (e, fieldName) => {
  //    const selectedOption = e.target.options[e.target.selectedIndex];
  //    const selectedText = selectedOption.innerHTML;

  //    if(selectedOption)

  //    setItems2((items2) => ({
  //      ...items2,
  //      [fieldName]: selectedText,
  //    }));
  //  };


  const valueToDescriptionMap = {
    dirCampo1: {
      '1': 'AUTOPISTA',
      '2': 'AVENIDA',
      '3': 'AVENIDA CALLE',
      '4': 'AVENIDA CARRERA',
      '5': 'BULEVAR',
      '6': 'CALLE',
      '7': 'CARRERA',
      '8': 'CIRCULAR',
      '10': 'CIRCUNVALAR',
      '11': 'CTAS CORRIDAS',
      '12': 'DIAGONAL',
      '9': 'KILOMETRO',
      '20': 'OTRA',
      '13': 'PASAJE',
      '14': 'PASEO',
      '15': 'PEATONAL',
      '16': 'TRANSVERSAL',
      '17': 'TRONCAL',
      '18': 'VARIANTE',
      '19': 'VIA'
    },
    dirCampo4: {
      '1': 'SUR',
      '2': 'NORTE',
      '3': 'ESTE',
      '4': 'OESTE',
      '5': 'BIS'
    },
    dirCampo7: {
      '1': 'SUR',
      '2': 'NORTE',
      '3': 'ESTE',
      '4': 'OESTE',
      '5': 'BIS'
    },
    // Agrega más campos si es necesario
  };
  

  const handleInputChange = (e, fieldName) => {
    const { value, options, selectedIndex, tagName } = e.target;
    let newValue = value;
    let newText = value;
  
    if (tagName === 'SELECT') {
      newValue = options[selectedIndex].value; // Valor numérico para lógica interna
      newText = options[selectedIndex].text; // Texto descriptivo para UI
  
      // No actualizar si el valor es el por defecto
      if (newValue === "") {
        newValue = "";
        newText = "";
      }
    }
  
    // Actualizar `items` con el valor numérico
    setItems(prevItems => ({
      ...prevItems,
      [fieldName]: newValue
    }));
  
    // Actualizar `items2` con el texto descriptivo
    setItems2(prevItems2 => ({
      ...prevItems2,
      [fieldName]: newText
    }));
  };
  
  
  useEffect(() => {
    const newDireccion = [
      items2.dirCampo1 || valueToDescriptionMap.dirCampo1[items.dirCampo1],
      items.dirCampo2,
      items.dirCampo3,
      items2.dirCampo4 || valueToDescriptionMap.dirCampo4[items.dirCampo4],
      items.dirCampo5,
      items.dirCampo6,
      items2.dirCampo7 || valueToDescriptionMap.dirCampo7[items.dirCampo7],
      items.dirCampo8,
      '||',
      items.dirCampo9
    ].filter(Boolean).join(' ');
  
    setItems(prevItems => ({
      ...prevItems,
      direccion: newDireccion
    }));
  }, [
    items.dirCampo1, items.dirCampo2, items.dirCampo3, 
    items.dirCampo4, items.dirCampo5, items.dirCampo6, 
    items.dirCampo7, items.dirCampo8, items.dirCampo9,
  ]);
  
  
  
  

  //  useEffect(() => {
  //    const newDireccion =((items2.dirCampo1 == '')?'':items2.dirCampo1)+items.dirCampo2+''+items.dirCampo3
  //    +((items2.dirCampo4 == '')?'':items2.dirCampo4)+items.dirCampo5+' '+items.dirCampo6+((items2.dirCampo7 == '')?'':items2.dirCampo7)+items.dirCampo8
  //    +' || '+items.dirCampo9;
  //          setItems(prevItems => ({ ...prevItems, direccion: newDireccion }));

    
  //  }, [items2.dirCampo1, items2.dirCampo2, items2.dirCampo3, items2.dirCampo4, items2.dirCampo5, items2.dirCampo6, items2.dirCampo7, items2.dirCampo8, items2.dirCampo9]);

  //  useEffect(()=>{
  //   const newDireccion =((items2.dirCampo1 == ' SELECCIONE ')?'':items2.dirCampo1)+items.dirCampo2+' '+items.dirCampo3
  //   +((items2.dirCampo4 == ' SELECCIONE ')?'':items2.dirCampo4)+items.dirCampo5+' '+items.dirCampo6+((items2.dirCampo7 == ' SELECCIONE ')?'':items2.dirCampo7)+items.dirCampo8
  //   +' || '+items.dirCampo9;
  //   setItems(prevItems => ({ ...prevItems, direccion: newDireccion }));
  //  },[items2.dirCampo1, items.dirCampo2, items.dirCampo3, items2.dirCampo4, items.dirCampo5, items.dirCampo6, items2.dirCampo7, items.dirCampo8, items.dirCampo9])

  const fetchBarrios = async () => {
    if (db) {
      const res = await db.exec(`SELECT *  FROM t1_barrios`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedProgramas: Barrio[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Barrio);
        });
        setBarrios(transformedProgramas);
      }
    }
  };
  const fetchComunas = async () => {
    if (db) {
      const res = await db.exec(`SELECT *  FROM t1_comunas`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedProgramas: Comuna[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Comuna);
        });
        setComunas(transformedProgramas);
      }
    }
  };
  function handleInputChange2(){
    
  }
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle slot="start">1 - LOCALIZACION DEL EVENTO </IonTitle>  
        <IonTitle slot="end">FICHA: <label style={{color:'#17a2b8'}}>{params.ficha}</label> </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
    <form>
      

    <div className="social-card">
      <span className="label">Ficha:</span>
      <span className="value">{params.ficha}</span>
    </div>

    <IonList>
  <div className="row g-3 was-validated p-3">
               <div className="col-sm-3">
                  <label  className="form-label" >Fecha de la entrevista:</label>
                  <input type="date" onChange={(e) => handleInputChange(e, 'fechaentrevista')} value={items.fechaentrevista} placeholder="" className="form-control form-control-sm  "  />
                </div>

                <div className="col-sm-3">
                  <label  className="form-label" >N° Sticker:</label>
                  <input type="text" onChange={(e) => handleInputChange(e, 'codigosticker')} value={items.codigosticker} placeholder="" className="form-control form-control-sm  "  />
                </div>
                <div className="col-sm-3">
                  <label  className="form-label" >Solicitud / Requerimiento</label>
                  <input type="text" onChange={(e) => handleInputChange(e, 'solicitudrequerimiento')} value={items.solicitudrequerimiento} placeholder="" className="form-control form-control-sm  "  />
                </div>

          </div>
          
  </IonList>

    <div className="social-card2">
      <span className="label2">Dirección de residencia</span>
      <span className="value2">
      Ingrese la dirección según el siguiente ejemplo, diligenciando los campos requeridos que identifiquen la dirección actual; los campos que no requiera los pude dejar en blanco.
      Vaya verificando en el recuadro inferior "Dirección" el resultado.
      Ejemplo:
      </span>
      <span className="value2">
      Vía principal: CARRERA 42 B SUR
      </span>
      <span className="value2">
      Vía secundaria: 25 A ESTE - 135
      </span>
      <span className="value2">

      Complemento: Apartamento 101
      </span>
    </div> 
      <br />

      <div className=' shadow p-3 mb-5 bg-white rounded'>

        
  <IonList>
  <div className="row g-3 was-validated ">
          <div className="col-sm">
                    <label  className="form-label">Via principal:</label>
                    <select  onChange={(e) => {
                        handleInputChange(e, 'dirCampo1');
                        handleInputChange2(e,'dirCampo1'); // Llama a otra función si es necesario
                      }} value={items.dirCampo1 || items2.dirCampo1} className="form-control form-control-sm" id="vprincipal" aria-describedby="validationServer04Feedback" required>
                        <option value=""> SELECCIONE </option>
                        <option value="1"> AUTOPISTA </option>
                        <option value="2"> AVENIDA </option>
                        <option value="3"> AVENIDA CALLE </option>
                        <option value="4"> AVENIDA CARRERA </option>
                        <option value="5"> BULEVAR </option>
                        <option value="6"> CALLE </option>
                        <option value="7"> CARRERA </option>
                        <option value="8"> CIRCULAR </option>
                        <option value="10"> CIRCUNVALAR </option>
                        <option value="11"> CTAS CORRIDAS </option>
                        <option value="12"> DIAGONAL </option>
                        <option value="9"> KILOMETRO </option>
                        <option value="20"> OTRA </option>
                        <option value="13"> PASAJE </option>
                        <option value="14"> PASEO </option>
                        <option value="15"> PEATONAL </option>
                        <option value="16"> TRANSVERSAL </option>
                        <option value="17"> TRONCAL </option>
                        <option value="18"> VARIANTE </option>
                        <option value="19"> VIA </option> 
                    </select>
                    </div>
          
            <div className="col-sm">
              <label  className="form-label" style={{color: 'white'}}>.</label>
              <input type="text" placeholder="" onChange={(e) =>{
                        handleInputChange(e, 'dirCampo2')
                        handleInputChange2(e, 'dirCampo2')}
                       } value={items.dirCampo2} className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm">
              <label  className="form-label" style={{color: 'white'}}>.</label>
              <input type="text" onChange={(e) => {
                        handleInputChange(e, 'dirCampo3')
                        handleInputChange2(e, 'dirCampo3')}}  value={items.dirCampo3} placeholder="" className="form-control form-control-sm  "  />
            </div>
            <div className="col-sm">
                    <label  className="form-label" style={{color: 'white'}}>.</label>
                    <select onChange={(e) => {
                        handleInputChange(e, 'dirCampo4');
                        handleInputChange2(e,'dirCampo4'); // Llama a otra función si es necesario
                      }}  value={items.dirCampo4} className="form-control form-control-sm"  aria-describedby="validationServer04Feedback" >
                    <option value=""> SELECCIONE </option>
                    <option value="5"> BIS </option>
                    <option value="3"> ESTE </option>
                    <option value="2"> NORTE </option>
                    <option value="4"> OESTE </option>
                    <option value="1"> SUR </option>   
                    </select>
                    </div>

                <div className="simbolo col-sm-1">
                <label ><br/></label>
                <h4>#</h4>
            </div>    
          </div>
          
         
  </IonList>

  <IonList>
  <div className="row g-3 was-validated ">
  <div className="col-sm">
              <label  className="form-label" >Via secundaria:</label>
              <input type="number" onChange={(e) => 
                  {      handleInputChange(e, 'dirCampo5') 
                     handleInputChange2(e, 'dirCampo5')}
                      }  value={items.dirCampo5} placeholder="" className="form-control form-control-sm  "  required/>
            </div>

            
          
            <div className="col-sm">
              <label  className="form-label" style={{color: 'white'}}>.</label>
              <input type="text" onChange={(e) => 
                        {handleInputChange(e, 'dirCampo6')
                          handleInputChange2(e, 'dirCampo6')
                        }
                   // Llama a otra función si es necesario
                      }  value={items.dirCampo6} placeholder="" className="form-control form-control-sm  "  />
            </div>


            <div className="col-sm">
                    <label  className="form-label" style={{color: 'white'}}>.</label>
                    <select onChange={(e) => {
                        handleInputChange(e, 'dirCampo7');
                        handleInputChange2(e,'dirCampo7'); // Llama a otra función si es necesario
                      }}  value={items.dirCampo7} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" >
                    <option value=""> SELECCIONE </option>
                    <option value="5"> BIS </option>
                    <option value="3"> ESTE </option>
                    <option value="2"> NORTE </option>
                    <option value="4"> OESTE </option>
                    <option value="1"> SUR </option> 
                    </select>
              </div>

              <div className="simbolo col-sm-1 ">
                <label ><br/></label>
                <h4>-</h4>
            </div>


            <div className="col-sm">
              <label  className="form-label" style={{color: 'white'}}>.</label>
              <input type="number" onChange={(e) => 
                       { handleInputChange(e, 'dirCampo8')
                        handleInputChange2(e, 'dirCampo8')
                       }
                      }  value={items.dirCampo8} placeholder="" className="form-control form-control-sm  " aria-describedby="validationServer04Feedback" required/>
            </div>
            
          </div>
  </IonList>

  <IonList>
  <div className="row g-3 was-validated ">
            <div className="col-sm">
              <label  className="form-label" >Complemento</label>
              <input type="text" onChange={(e) => 
                        {handleInputChange(e, 'dirCampo9')
                          handleInputChange2(e, 'dirCampo9')
                        }}  value={items.dirCampo9} placeholder="" className="form-control form-control-sm  "  />
            </div>
          </div>
  </IonList>
<hr />
  <IonList>
  <div className="row g-3 was-validated ">
            <div className="col-sm">
              <label  className="form-label" >Direccion:</label>
              <input disabled type="text"  value={items.direccion}   placeholder="" className="form-control form-control-sm  " />
            </div>
          </div>
  </IonList>
  <hr />

  <IonList>
  <div className="row g-3 was-validated ">
            <div className="col-sm">
                    <label  className="form-label" >Rural/Urbano</label>
                    <select onChange={(e) => handleInputChange(e, 'ruralurbano')}  value={items.ruralurbano} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                    <option value=""> SELECCIONE </option>
                    <option value="2"> RURAL </option>
                    <option value="1"> URBANO </option>
                    </select>
              </div>

                <div className="col-sm">
                  <label  className="form-label" >Sector:</label>
                  <input type="text" onChange={(e) => handleInputChange(e, 'sector')} value={items.sector} placeholder="" className="form-control form-control-sm  "  />
                </div>

          </div>
  </IonList>


  <IonList>
  <div className="row g-3 was-validated ">
            <div className="col-sm">
                    <label  className="form-label" >Comuna</label>
                    <select onChange={(e) => handleInputChange(e, 'comuna')} value={items.comuna} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                    <option value=""> SELECCIONE </option>
                    {comunas.map((programa) => (
                    <option key={programa.id} value={programa.id}>{programa.descripcion}</option>
                  ))}
                    </select>
              </div>
            <div className="col-sm">
                    <label  className="form-label" >Barrio</label>
                    <select onChange={(e) => handleInputChange(e, 'barrio')} value={items.barrio} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                    <option value=""> SELECCIONE </option>
                    {barrios
                        .filter(programa => programa.comuna == parseInt(items.comuna))
                        .map((programa) => (
                          <option key={programa.id} value={programa.id}>{programa.descripcion}</option>
                        ))
                        }
                    </select>
              </div>
          </div>
  </IonList>

  <IonList>
  <div className="row g-3 was-validated ">
            <div className="col-sm">
              <label  className="form-label" >Telefono1:</label>
              <input type="number" onChange={(e) => handleInputChange(e, 'telefono1')} value={items.telefono1} placeholder="" className="form-control form-control-sm  "  required/>
            <small  className="form-label">Minimo 10 digitos, si es fijo debe incluir el 604.</small>
            </div>

            <div className="col-sm">
              <label  className="form-label" >Telefono2:</label>
              <input  type="number" onChange={(e) => handleInputChange(e, 'telefono2')} value={items.telefono2} placeholder="" className="form-control form-control-sm  "  />
              <small  className="form-label">Minimo 10 digitos, si es fijo debe incluir el 604.</small>
            </div>
          </div>
  </IonList>

  <IonList>
  <GpsCoordinates onLatLonChange={handleLatLonChange} />
  <div className="row g-3 was-validated ">
            <div className="col-sm">
              <label  className="form-label" >Latitud:</label>
              <input onChange={(e) => handleInputChange(e, 'latitud')} value={items.latitud} type="text" placeholder="" className="form-control form-control-sm  "  />
            </div>

            <div className="col-sm">
              <label  className="form-label" >Longitud:</label>
              <input  type="text" onChange={(e) => handleInputChange(e, 'longitud')} value={items.longitud} placeholder="" className="form-control form-control-sm  "  />
            </div>
          </div>
  </IonList>

  <IonList>
  <div className="row g-3 was-validated ">
            <div className="col-sm">
              <label  className="form-label" >Correo electronico:</label>
              <input type="text" onChange={(e) => handleInputChange(e, 'correo')} value={items.correo} placeholder="" className="form-control form-control-sm  "  />
            </div>

            <div className="col-sm">
                    <label  className="form-label" >Estrato:</label>
                    <select onChange={(e) => handleInputChange(e, 'estrato')} value={items.estrato} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                    <option value=""> SELECCIONE </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    </select>
              </div>
          </div>
  </IonList>


  </div>

        <br />

    {/* <div><IonButton color="success" onClick={enviar}>Guardar</IonButton><IonButton disabled={buttonDisabled} routerLink={`/tabs/tab4/${params.ficha}`}>Siguiente</IonButton></div> */}
    <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
       <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/tabs/tab7/${params.ficha}`;} }}> Siguiente</div>
       </div>    
       </form>
    </IonContent>
  </IonPage>
  );
};

export default Tab3;

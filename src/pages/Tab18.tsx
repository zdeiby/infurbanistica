import './Tab4.css';
import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonList, IonButton
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomDataTable from '../components/DataTable';
import loadSQL from '../models/database';

interface Person {
    idfiu: number | null;
    tipodefamilia: string | null;
    nacionalidad: string | null;
    condicionmigrante: string | null;
    etpv: string | null;
    tipodedocumento: string | null;
    numerodedocumento: string | null;
    nombre1: string | null;
    nombre2: string | null;
    apellido1: string | null;
    apellido2: string | null;
    fechadenacimiento: string | null;
    telefono: string | null;
    relacion: string | null;
    fecharegistro: string | null;
    usuario: number | null;
    estado: number | null;
    tabla: string | null;
  }
  

  interface Reddeapoyo {
    id: number;                    // ID del integrante
    idfiu: number;                 // ID de la ficha
    nombre1: string | null;         // Primer nombre
    nombre2: string | null;         // Segundo nombre (opcional)
    apellido1: string | null;       // Primer apellido
    apellido2: string | null;       // Segundo apellido (opcional)
    tipodedocumento: string | null; // Tipo de documento
    numerodedocumento: string | null; // Número de documento
    nacionalidad: string | null;    // Nacionalidad de la persona
    fechadenacimiento: string | null; // Fecha de nacimiento
    telefono: string | null;        // Teléfono
    condicionmigrante: string | null; // Condición migratoria
    etpv: string | null;
    relacion: string | null;        // Relación con la unidad habitacional
    fecharegistro: string | null;   // Fecha de registro
    usuario: number | null;         // Usuario que hizo el registro
    estado: number | null;          // Estado del registro (activo/inactivo)
  }
  



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


const Tab18: React.FC = () => {
  const params = useParams();
  const history = useHistory();
  const [people, setPeople] = useState<Person[]>([]);
  const [reddeapoyo, setReddeapoyo] = useState<Reddeapoyo[]>([]);
  const [db, setDb] = useState<any>(null);
  const [numReddeapoyo, setNumReddeapoyo] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedIntegrante, setSelectedIntegrante] = useState(null);

  const [items, setItems] = useState({
    idfiu: params.ficha,
    tipodefamilia: '',          // Indica si hay personas que no forman parte del hogar
    nacionalidad: '',           // Nacionalidad de la persona
    condicionmigrante: '',      // Condición migratoria (Irregular, Regular, etc.)
    etpv:'',
    tipodedocumento: '',        // Tipo de documento (Cédula, Pasaporte, etc.)
    numerodedocumento: '',      // Número de documento de identidad
    nombre1: '',                // Primer nombre
    nombre2: '',                // Segundo nombre (opcional)
    apellido1: '',              // Primer apellido
    apellido2: '',              // Segundo apellido (opcional)
    fechadenacimiento: '',      // Fecha de nacimiento
    telefono: '',               // Número de teléfono
    relacion: '',               // Relación con la unidad habitacional
    fecharegistro: getCurrentDateTime(), // Fecha de registro actual
    usuario: localStorage.getItem('cedula') || '', // Usuario que está haciendo la inserción
    estado: '1',                // Estado activo
    tabla: 'infraccion_no_integrantes', // Nombre de la tabla
});

const [items2, setItems2] = useState({
    idfiu: params.ficha,
    tipodefamilia: '',          // Indica si hay personas que no forman parte del hogar
    nacionalidad: '',           // Nacionalidad de la persona
    condicionmigrante: '',      // Condición migratoria (Irregular, Regular, etc.)
    etpv:'',
    tipodedocumento: '',        // Tipo de documento (Cédula, Pasaporte, etc.)
    numerodedocumento: '',      // Número de documento de identidad
    nombre1: '',                // Primer nombre
    nombre2: '',                // Segundo nombre (opcional)
    apellido1: '',              // Primer apellido
    apellido2: '',              // Segundo apellido (opcional)
    fechadenacimiento: '',      // Fecha de nacimiento
    telefono: '',               // Número de teléfono
    relacion: '',               // Relación con la unidad habitacional
    fecharegistro: getCurrentDateTime(), // Fecha de registro actual
    usuario: localStorage.getItem('cedula') || '', // Usuario que está haciendo la inserción
    estado: '1',                // Estado activo
    tabla: 'infraccion_no_integrantes', // Nombre de la tabla
});

 

  useEffect(() => {
    loadSQL(setDb, () => {
      fetchUsers();
    });
  }, [params.ficha]);

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

  const fetchUsers = async () => {
    if (db) {
      const res = await db.exec(`SELECT * FROM infraccion_no_integrantes WHERE idfiu=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Person);
        });
        // setPeople(transformedPeople);
      } else {
        setItems({
          ...items,
          fecharegistro: getCurrentDateTime(),
          usuario: parseInt(localStorage.getItem('cedula') || '0', 10),
        });
      }
      }
  };
  
  const fetchReddeapoyo = async () => {
    if (db) {
      const res = await db.exec(`
        SELECT
        r.id, 
        r.idfiu, 
        naci.descripcion as nacionalidad, 
        r.condicionmigrante, 
        r.tipodedocumento, 
        r.numerodedocumento, 
        r.nombre1, 
        r.nombre2, 
        r.apellido1, 
        r.apellido2, 
        r.fechadenacimiento, 
        r.telefono, 
        r.relacion,
        r.etpv
      FROM 
        infraccion_no_integrantes r
   left JOIN 
        t1_paises naci ON r.nacionalidad = naci.id
      WHERE 
        r.idfiu=${params.ficha}
      `);
  
      if (res[0]?.values && res[0]?.columns) {
        const transformedReddeapoyo: Reddeapoyo[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Reddeapoyo);
        });
  
        setReddeapoyo(transformedReddeapoyo);
        setNumReddeapoyo(transformedReddeapoyo.length);
      }
    }
    console.log('red de apoyo', reddeapoyo);
  };
  
  useEffect(() => {
    if (people.length > 0) {
      let data = people[0] || {};
      setItems({
        idfiu: data.idfiu || params.ficha,
        tipodefamilia: data.tipodefamilia || '',
        nacionalidad: data.nacionalidad || '',
        condicionmigrante: data.condicionmigrante || '',
        etpv:data.etpv || '',
        tipodedocumento: data.tipodedocumento || '',
        numerodedocumento: data.numerodedocumento || '',
        nombre1: data.nombre1 || '',
        nombre2: data.nombre2 || '',
        apellido1: data.apellido1 || '',
        apellido2: data.apellido2 || '',
        fechadenacimiento: data.fechadenacimiento || '',
        telefono: data.telefono || '',
        relacion: data.relacion || '',
        fecharegistro: data.fecharegistro || getCurrentDateTime(),
        usuario: data.usuario || localStorage.getItem('cedula') || '',
        estado: data.estado || '1',
        tabla: 'infraccion_no_integrantes',
      });
    }
  }, [people]);
  

  useEffect(() => {
    fetchUsers();
    fetchReddeapoyo();
  }, [db, params.ficha]);

  const handleInputChange = (event, field) => {
    const { value } = event.target;
    setItems((prevItems) => {
      const newState = { ...prevItems, [field]: value };
  
      if (field === 'tipodefamilia') {
        newState.nacionalidad = '';
        newState.condicionmigrante = '';
        newState.etpv='';
        newState.tipodedocumento = '';
        newState.numerodedocumento = '';
        newState.nombre1 = '';
        newState.nombre2 = '';
        newState.apellido1 = '';
        newState.apellido2 = '';
        newState.fechadenacimiento = '';
        newState.telefono = '';
        newState.relacion = '';
      } else if (field === 'tipodedocumento') {
        // Aquí manejas el caso especial para el tipo de documento
        if (value === '13' || value === '14') {
          newState.numerodedocumento = 'NO APLICA';
        } else {
          // Limpiar el número de documento si el tipo cambia a uno que no sea especial
          newState.numerodedocumento = '';
        }
      } else if (field === 'numerodedocumento' && (prevItems.tipodedocumento === '13' || prevItems.tipodedocumento === '14')) {
        // Prevenir la actualización del número de documento si el tipo es especial
        return prevItems;
      }
  
    
      return newState;
    });
  };
  
  console.log(items, 'items uno');
  
  useEffect(() => {
    console.log("Items updated:", items);
  }, [items]);
  
  const validarCampos = () => {
    // // Campos obligatorios generales
    // const camposObligatorios = ['tipodefamilia'];
  
    // // Si tipodefamilia es '2', agregar campos adicionales
    // if (items.tipodefamilia === '2') {
    //   camposObligatorios.push('nacionalidad', 'tipodedocumento', 'numerodedocumento', 'nombre1', 'apellido1', 'fechadenacimiento', 'relacion');
  
    //   // Si hay alguna condición específica para nacionalidad o relación, agregar más validaciones aquí
    //   if (items.nacionalidad !== '1') {
    //     camposObligatorios.push('condicionmigrante'); // Por ejemplo, si la persona no es de Colombia
    //   }
    // }
  
    // // Verificación de los campos obligatorios
    // for (let campo of camposObligatorios) {
    //   if (!items[campo]) {
    //     return false;
    //   }
    // }
    // return true;
  };
  
  const generarNuevoIdParaFiu = async (idfiu) => {
    try {
      // Obtener todos los IDs existentes para el idfiu dado
      const res = await db.exec(`SELECT id FROM infraccion_no_integrantes WHERE idfiu = ? ORDER BY id ASC`, [idfiu]);
  
      const idsExistentes = res[0]?.values.map(row => row[0]); // Obtener todos los IDs como un array
  
      if (!idsExistentes || idsExistentes.length === 0) {
        return 1; // Si no hay registros previos para este idfiu, devolver 1
      }
  
      // Buscar el primer ID faltante en la secuencia
      for (let i = 1; i <= idsExistentes.length; i++) {
        if (!idsExistentes.includes(i)) {
          return i; // Devolver el primer número faltante en la secuencia
        }
      }
  
      // Si no falta ningún número en la secuencia, devolver el siguiente ID disponible
      return idsExistentes.length + 1;
    } catch (err) {
      console.error('Error al generar el nuevo ID:', err);
      return null;
    }
  };
  
  const enviar = async (database = db, event: React.MouseEvent<HTMLButtonElement>) => {
    // if (!validarCampos()) {
    //   return;
    // }
    event.preventDefault();
  
    try {
      // Generar un nuevo id basado en los valores de idfiu
      const nuevoId = await generarNuevoIdParaFiu(items.idfiu);
  
      if (nuevoId === null) {
        alert('Error al generar el nuevo ID');
        return;
      }
  
      await db.exec(`
        INSERT OR REPLACE INTO infraccion_no_integrantes 
        (id, idfiu, tipodefamilia, nacionalidad, condicionmigrante, etpv,tipodedocumento, numerodedocumento, nombre1, nombre2, apellido1, apellido2, fechadenacimiento, telefono, relacion, fecharegistro, usuario, estado, tabla)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          nuevoId,  // El nuevo ID generado
          items.idfiu,
          items.tipodefamilia,
          items.nacionalidad,
          items.condicionmigrante,
          items.etpv,
          items.tipodedocumento,
          items.numerodedocumento,
          items.nombre1,
          items.nombre2,
          items.apellido1,
          items.apellido2,
          items.fechadenacimiento,
          items.telefono,
          items.relacion,
          items.fecharegistro,
          items.usuario,
          items.estado,
          items.tabla
        ]
      );
  
      saveDatabase();
      alert('Datos Guardados con éxito');
      fetchReddeapoyo(); // Actualizar la lista de reddeapoyo después de guardar
  
      // Limpiar los campos
      setItems({
        idfiu: params.ficha,
        tipodefamilia: items.tipodefamilia,
        nacionalidad: '',
        condicionmigrante: '',
        etpv:'',
        tipodedocumento: '',
        numerodedocumento: '',
        nombre1: '',
        nombre2: '',
        apellido1: '',
        apellido2: '',
        fechadenacimiento: '',
        telefono: '',
        relacion: '',
        fecharegistro: getCurrentDateTime(),
        usuario: localStorage.getItem('cedula') || '',
        estado: '1',
        tabla: 'infraccion_no_integrantes',
      });
  
    } catch (err) {
      console.error('Error al guardar los datos:', err);
    }
  };
  
  
  



  const eliminarIntegrante = async (idfiu, id) => {
    console.log('Eliminando integrante:', idfiu, id);
    try {
      // Eliminar el registro de la tabla infraccion_no_integrantes basado en idfiu y id
      await db.exec(`DELETE FROM infraccion_no_integrantes WHERE id = ? AND idfiu = ?`, [id, idfiu]);
      console.log('Integrante eliminado de la base de datos');
  
      // Actualizar la lista de red de apoyo
      setReddeapoyo((prevReddeapoyo) => {
        const updatedReddeapoyo = prevReddeapoyo.filter(integrante => integrante.idfiu !== idfiu || integrante.id !== id);
        setNumReddeapoyo(updatedReddeapoyo.length);
        return updatedReddeapoyo;
      });
      saveDatabase();
      alert('Integrante eliminado con éxito');
    } catch (err) {
      console.error('Error al eliminar el integrante:', err);
    }
  };
  
  
  const columns = [
    {
      name: 'Eliminar',
      selector: row => (
        <>
          <div className='btn btn-info btn-sm text-light' onClick={() => eliminarIntegrante(row.idfiu, row.id)}>
            Eliminar
          </div>
          <button
            className="btn btn-info btn-sm text-light"
            type="button"
            onClick={() => {
              setSelectedIntegrante(row);
              setShowModal(true);
            }}
          >
            Ver
          </button>
        </>
      ),
      sortable: true,
      style: {
        whiteSpace: 'nowrap',
        overflow: 'visible'
      },
      minwidth: '200px'
    },
    {
      name: 'Nombre',
      selector: row => `${row.nombre1} ${row.apellido1}`, // Concatenando nombre y apellido
      sortable: true,
      style: {
        whiteSpace: 'nowrap',
        overflow: 'visible'
      },
      minwidth: '200px'
    },
    {
      name: 'Documento',
      selector: row => row.numerodedocumento, // Muestra el número de documento
      sortable: true,
    },
    {
      name: 'Teléfono',
      selector: row => row.telefono, // Asume que el campo se llama 'telefono'
      sortable: true,
    },
    
  ];
  
  


  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };











  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">12 - NO HACEN PARTE DEL HOGAR</IonTitle>
          <IonTitle slot="end">FICHA: <label style={{ color: '#17a2b8' }}>{params.ficha}</label> </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen><form>
        <div className="alert alert-warning">
          <span className="color-light">En este capítulo, debe registrar únicamente a las personas que residen en la unidad
             habitacional pero que no forman parte del hogar. En caso de <strong>NO</strong> existir 
             personas en esta condición, dar clic en el botón Siguiente para continuar.</span>
          {/* <span className="value">{params.ficha}</span> */}
        </div>

        <div className=' shadow p-3 mb-5 bg-white rounded'>
          <IonList>
            <div className="alert alert-primary" role="alert">
              <span className="badge badge-secondary text-dark">12 - NO HACEN PARTE DEL HOGAR</span>
            </div>
            <div className="row g-3 was-validated ">
              <div className="col-sm">
                <label className="form-label">¿En su hogar hay personas que residen en la unidad habitacional pero que no forman parte del hogar?</label>
                <select onChange={(e) => handleInputChange(e, 'tipodefamilia')} value={items.tipodefamilia} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" >
                  <option value=""> SELECCIONE </option><option value="1"> NO </option><option value="2"> SI </option>
                </select>
              </div>
              <div className="col-sm">
                <blockquote className="blockquote text-center">
                  <p className="mb-0">
                  </p><h6>Numero de personas que no hacen parte del hogar:</h6>
                  <p></p>
                  <p className="mb-0">
                  </p><h5 id="numerointegrantes">{numReddeapoyo}</h5>
                  <p></p>
                </blockquote>
              </div>

            </div>
          </IonList>

          {(items.tipodefamilia == '2') ?
            <IonList>
         <div className="row g-3 was-validated ">
             <div className="col-sm-12">
                 <label className="form-label">Nacionalidad:</label>
                 <select onChange={(e) => handleInputChange(e, 'nacionalidad')} value={items.nacionalidad} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" >
                   <option value=""> SELECCIONE </option>
                   <option value="3"> AFGANISTAN </option>
                   <option value="4"> ALBANIA </option>
                   <option value="5"> ALEMANIA </option>
                   <option value="6"> ANDORRA </option>
                   <option value="7"> ANGOLA </option>
                   <option value="8"> ANGUILLA </option>
                   <option value="9"> ANTIGUA Y BARBUDA </option>
                   <option value="10"> ANTILLAS HOLANDESAS </option>
                   <option value="11"> ARABIA SAUDI </option>
                   <option value="12"> ARGELIA </option>
                   <option value="13"> ARGENTINA </option>
                   <option value="14"> ARMENIA </option>
                   <option value="15"> ARUBA </option>
                   <option value="16"> AUSTRALIA </option>
                   <option value="17"> AUSTRIA </option>
                   <option value="18"> AZERBAIYAN </option><option value="19"> BAHAMAS </option><option value="20"> BAHREIN </option><option value="21"> BANGLADESH </option><option value="22"> BARBADOS </option><option value="23"> BELARUS </option><option value="24"> BELGICA </option><option value="25"> BELICE </option><option value="26"> BENIN </option><option value="27"> BERMUDAS </option><option value="28"> BHUTÁN </option><option value="29"> BOLIVIA </option><option value="30"> BOSNIA Y HERZEGOVINA </option><option value="31"> BOTSWANA </option><option value="32"> BRASIL </option><option value="33"> BRUNEI </option><option value="34"> BULGARIA </option><option value="35"> BURKINA FASO </option><option value="36"> BURUNDI </option><option value="37"> CABO VERDE </option><option value="38"> CAMBOYA </option><option value="39"> CAMERUN </option><option value="40"> CANADA </option><option value="41"> CHAD </option><option value="42"> CHILE </option><option value="43"> CHINA </option><option value="44"> CHIPRE </option><option value="1"> COLOMBIA </option><option value="45"> COMORES </option><option value="46"> CONGO </option><option value="47"> COREA </option><option value="48"> COREA DEL NORTE  </option><option value="49"> COSTA DE MARFIL </option><option value="50"> COSTA RICA </option><option value="51"> CROACIA </option><option value="52"> CUBA </option><option value="53"> DINAMARCA </option><option value="54"> DJIBOUTI </option><option value="55"> DOMINICA </option><option value="56"> ECUADOR </option><option value="57"> EGIPTO </option><option value="58"> EL SALVADOR </option><option value="59"> EMIRATOS ARABES UNIDOS </option><option value="60"> ERITREA </option><option value="61"> ESLOVENIA </option><option value="62"> ESPAÑA </option><option value="63"> ESTADOS UNIDOS DE AMERICA </option><option value="64"> ESTONIA </option><option value="65"> ETIOPIA </option><option value="66"> FIJI </option><option value="67"> FILIPINAS </option><option value="68"> FINLANDIA </option><option value="69"> FRANCIA </option><option value="70"> GABON </option><option value="71"> GAMBIA </option><option value="72"> GEORGIA </option><option value="73"> GHANA </option><option value="74"> GIBRALTAR </option><option value="75"> GRANADA </option><option value="76"> GRECIA </option><option value="77"> GROENLANDIA </option><option value="78"> GUADALUPE </option><option value="79"> GUAM </option><option value="80"> GUATEMALA </option><option value="81"> GUAYANA FRANCESA </option><option value="82"> GUERNESEY </option><option value="83"> GUINEA </option><option value="84"> GUINEA ECUATORIAL </option><option value="85"> GUINEA-BISSAU </option><option value="86"> GUYANA </option><option value="87"> HAITI </option><option value="88"> HONDURAS </option><option value="89"> HONG KONG </option><option value="90"> HUNGRIA </option><option value="91"> INDIA </option><option value="92"> INDONESIA </option><option value="93"> IRAN </option><option value="94"> IRAQ </option><option value="95"> IRLANDA </option><option value="96"> ISLA DE MAN </option><option value="97"> ISLA NORFOLK </option><option value="98"> ISLANDIA </option><option value="99"> ISLAS ALAND </option><option value="100"> ISLAS CAIMÁN </option><option value="101"> ISLAS COOK </option><option value="102"> ISLAS DEL CANAL </option><option value="103"> ISLAS FEROE </option><option value="104"> ISLAS MALVINAS </option><option value="105"> ISLAS MARIANAS DEL NORTE </option><option value="106"> ISLAS MARSHALL </option><option value="107"> ISLAS PITCAIRN </option><option value="108"> ISLAS SALOMON </option><option value="109"> ISLAS TURCAS Y CAICOS </option><option value="110"> ISLAS VIRGENES BRITANICAS </option><option value="111"> ISLAS VÍRGENES DE LOS ESTADOS UNIDOS </option><option value="112"> ISRAEL </option><option value="113"> ITALIA </option><option value="114"> JAMAICA </option><option value="115"> JAPON </option><option value="116"> JERSEY </option><option value="117"> JORDANIA </option><option value="118"> KAZAJSTAN </option><option value="119"> KENIA </option><option value="120"> KIRGUISTAN </option><option value="121"> KIRIBATI </option><option value="122"> KUWAIT </option><option value="123"> LAOS </option><option value="124"> LESOTHO </option><option value="125"> LETONIA </option><option value="126"> LIBANO </option><option value="127"> LIBERIA </option><option value="128"> LIBIA </option><option value="129"> LIECHTENSTEIN </option><option value="130"> LITUANIA </option><option value="131"> LUXEMBURGO </option><option value="132"> MACAO </option><option value="133"> MACEDONIA  </option><option value="134"> MADAGASCAR </option><option value="135"> MALASIA </option><option value="136"> MALAWI </option><option value="137"> MALDIVAS </option><option value="138"> MALI </option><option value="139"> MALTA </option><option value="140"> MARRUECOS </option><option value="141"> MARTINICA </option><option value="142"> MAURICIO </option><option value="143"> MAURITANIA </option><option value="144"> MAYOTTE </option><option value="145"> MEXICO </option><option value="146"> MICRONESIA </option><option value="147"> MOLDAVIA </option><option value="148"> MONACO </option><option value="149"> MONGOLIA </option><option value="150"> MONTENEGRO </option><option value="151"> MONTSERRAT </option><option value="152"> MOZAMBIQUE </option><option value="153"> MYANMAR </option><option value="154"> NAMIBIA </option><option value="155"> NAURU </option><option value="156"> NEPAL </option><option value="157"> NICARAGUA </option><option value="158"> NIGER </option><option value="159"> NIGERIA </option><option value="160"> NIUE </option><option value="161"> NORUEGA </option><option value="162"> NUEVA CALEDONIA </option><option value="163"> NUEVA ZELANDA </option><option value="164"> OMAN </option><option value="165"> OTROS PAISES  O TERRITORIOS DE AMERICA DEL NORTE </option><option value="166"> OTROS PAISES O TERRITORIOS  DE SUDAMERICA </option><option value="167"> OTROS PAISES O TERRITORIOS DE AFRICA </option><option value="168"> OTROS PAISES O TERRITORIOS DE ASIA </option><option value="169"> OTROS PAISES O TERRITORIOS DE LA UNION EUROPEA </option><option value="170"> OTROS PAISES O TERRITORIOS DE OCEANIA </option><option value="171"> OTROS PAISES O TERRITORIOS DEL CARIBE Y AMERICA CENTRAL </option><option value="172"> OTROS PAISES O TERRITORIOS DEL RESTO DE EUROPA </option><option value="173"> PAISES BAJOS </option><option value="174"> PAKISTAN </option><option value="175"> PALAOS </option><option value="176"> PALESTINA </option><option value="177"> PANAMA </option><option value="178"> PAPUA NUEVA GUINEA </option><option value="179"> PARAGUAY </option><option value="180"> PERU </option><option value="181"> POLINESIA FRANCESA </option><option value="182"> POLONIA </option><option value="183"> PORTUGAL </option><option value="184"> PUERTO RICO </option><option value="185"> QATAR </option><option value="186"> REINO UNIDO </option><option value="187"> REP.DEMOCRATICA DEL CONGO </option><option value="188"> REPUBLICA CENTROAFRICANA </option><option value="189"> REPUBLICA CHECA </option><option value="190"> REPUBLICA DOMINICANA </option><option value="191"> REPUBLICA ESLOVACA </option><option value="192"> REUNION </option><option value="193"> RUANDA </option><option value="194"> RUMANIA </option><option value="195"> RUSIA </option><option value="196"> SAHARA OCCIDENTAL </option><option value="197"> SAMOA </option><option value="198"> SAMOA AMERICANA </option><option value="199"> SAN BARTOLOME </option><option value="200"> SAN CRISTOBAL Y NIEVES </option><option value="201"> SAN MARINO </option><option value="202"> SAN MARTIN (PARTE FRANCESA) </option><option value="203"> SAN PEDRO Y MIQUELON  </option><option value="204"> SAN VICENTE Y LAS GRANADINAS </option><option value="205"> SANTA HELENA </option><option value="206"> SANTA LUCIA </option><option value="207"> SANTA SEDE </option><option value="208"> SANTO TOME Y PRINCIPE </option><option value="209"> SENEGAL </option><option value="210"> SERBIA </option><option value="211"> SEYCHELLES </option><option value="212"> SIERRA LEONA </option><option value="213"> SINGAPUR </option><option value="214"> SIRIA </option><option value="215"> SOMALIA </option><option value="216"> SRI LANKA </option><option value="217"> SUDAFRICA </option><option value="218"> SUDAN </option><option value="219"> SUECIA </option><option value="220"> SUIZA </option><option value="221"> SURINAM </option><option value="222"> SVALBARD Y JAN MAYEN </option><option value="223"> SWAZILANDIA </option><option value="224"> TADYIKISTAN </option><option value="225"> TAILANDIA </option><option value="226"> TANZANIA </option><option value="227"> TIMOR ORIENTAL </option><option value="228"> TOGO </option><option value="229"> TOKELAU </option><option value="230"> TONGA </option><option value="231"> TRINIDAD Y TOBAGO </option><option value="232"> TUNEZ </option><option value="233"> TURKMENISTAN </option><option value="234"> TURQUIA </option><option value="235"> TUVALU </option><option value="236"> UCRANIA </option><option value="237"> UGANDA </option><option value="238"> URUGUAY </option><option value="239"> UZBEKISTAN </option><option value="240"> VANUATU </option><option value="2"> VENEZUELA </option><option value="241"> VIETNAM </option><option value="242"> WALLIS Y FORTUNA </option><option value="243"> YEMEN </option><option value="244"> ZAMBIA </option><option value="245"> ZIMBABWE </option>
                 </select>
               </div>
               </div>
            </IonList> : ''}
          {(items.tipodefamilia == '2' && items.nacionalidad != '1') ? 
          <IonList>
        <div className="row g-3 was-validated ">
             <div className="col-sm-6">
                <label className="form-label">Condición migratoria:</label>
                <select onChange={(e) => handleInputChange(e, 'condicionmigrante')} value={items.condicionmigrante} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" >
                <option value=""> SELECCIONE </option><option value="1"> IRREGULAR </option><option value="3"> REFUGIADO </option><option value="2"> REGULAR </option><option value="4"> RETORNADO </option>  
                </select>
                </div>
                </div>
          </IonList> : ''}
          {(items.tipodefamilia == '2'  && items.nacionalidad != '1' && items.condicionmigrante == '1') ? 
          <IonList>
             <div className="row g-3 was-validated ">
             <div className="col-sm-6">
                <label className="form-label">Ha iniciado trámites para el Estatuto Temporal de Protección para Migrantes Venezolanos (ETPV):</label>
                <select onChange={(e) => handleInputChange(e, 'etpv')} value={items.etpv} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" >
                <option value=""> SELECCIONE </option><option value="1"> NO </option><option value="2"> SI </option>
                </select>
                </div>
                </div>
          </IonList> : ''}
          {(items.tipodefamilia == '2' ) ? 
          <IonList>
           
           <>   <div className="row g-3 was-validated ">
                  <div className="col-sm-6">
                    <label className="form-label">Tipo de documento:</label>
                    <select 
                      onChange={(e) => handleInputChange(e, 'tipodedocumento')}  
                      value={items.tipodedocumento} 
                      className="form-control form-control-sm"
                      
                    >
                    <option value=""> SELECCIONE </option>
                    <option value="15"> ACTA DE NACIMIENTO </option>
                    <option value="1"> CÉDULA DE CIUDADANÍA </option>
                    <option value="4"> CÉDULA DE EXTRANJERÍA </option>
                    <option value="8"> CÉDULA VENEZOLANA </option>
                    <option value="12"> DNI -DOCUMENTO NACIONAL DE IDENTIDAD </option>
                    <option value="10"> NES-NÚMERO ESTABLECIDO POR LA SECRETARÍA DE EDUCACIÓN </option>
                    <option value="9"> NIT: NÚMERO ÚNICO DE IDENTIFICACIÓN TRIBUTARIA </option>
                    <option value="13"> NO TIENE -NO POSEE DOCUMENTOS DE IDENTIDAD </option>
                    <option value="11"> NUIP: NÚMERO ÚNICO DE IDENTIFICACIÓN PERSONAL </option>
                    <option value="5"> PASAPORTE </option>
                    <option value="6"> PET-PERMISO ESPECIAL DE PERMANENCIA </option>
                    <option value="7"> PPT-PERMISO POR PROTECCIÓN TEMPORAL </option>
                    <option value="3"> REGISTRO CIVIL </option>
                    <option value="16"> SALVOCONDUCTO </option>
                    <option value="14"> SIN DATO - NO INFORMA SOBRE DOCUMENTO DE IDENTIDAD </option>
                    <option value="2"> TARJETA DE IDENTIDAD </option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                  <label className="form-label" >Numero de documento:</label>


                  <input 
                        type="text" 
                        onChange={(e) => {
                            if (items.tipodedocumento !== '13' && items.tipodedocumento !== '14') {
                            handleInputChange(e, 'numerodedocumento');  // Permitir la escritura solo si no es 'NO APLICA'
                            } else {
                            // Actualiza el campo a "NO APLICA" si el tipo de documento es '13' o '14'
                            setItems((prevItems) => ({ ...prevItems, numerodedocumento: 'NO APLICA' }));
                            }
                        }} 
                        value={(items.tipodedocumento === '13' || items.tipodedocumento === '14') ? 'NO APLICA' : items.numerodedocumento} 
                        placeholder="" 
                        className="form-control form-control-sm"  
                         
                        readOnly={items.tipodedocumento === '13' || items.tipodedocumento === '14'}  // Desactivar edición si es NO APLICA
                        />




                </div>
                <div className="row g-3 was-validated ">
                    <div className="col-sm-3">
                    <label className="form-label" >Primer nombre:</label>
                    <input type="text" onChange={(e) => handleInputChange(e, 'nombre1')} value={items.nombre1} placeholder="" className="form-control form-control-sm  "  />
                    </div>
                    <div className="col-sm-3">
                    <label className="form-label" >Segundo nombre:</label>
                    <input type="text" onChange={(e) => handleInputChange(e, 'nombre2')} value={items.nombre2} placeholder="" className="form-control form-control-sm  " />
                    </div>
                    <div className="col-sm-3">
                    <label className="form-label" >Primer apellido:</label>
                    <input type="text" onChange={(e) => handleInputChange(e, 'apellido1')} value={items.apellido1} placeholder="" className="form-control form-control-sm  "  />
                    </div>
                    <div className="col-sm-3">
                    <label className="form-label" >Segundo apellido:</label>
                    <input type="text" onChange={(e) => handleInputChange(e, 'apellido2')} value={items.apellido2} placeholder="" className="form-control form-control-sm  " />
                    </div>
                    </div>
               <div className="row g-3 was-validated ">
  
               <div className="col-sm">
                 <label className="form-label" >Fecha de nacimiento</label>
                 <input type="date" onChange={(e) => handleInputChange(e, 'fechadenacimiento')} value={items.fechadenacimiento} placeholder="" className="form-control form-control-sm  "  />
               </div>
               <div className="form-group col-sm">
                 <blockquote className="blockquote text-center">
                   <p className="mb-0"></p><h6>Edad:</h6><p></p>
                   <p className="mb-0"></p><h5 id="edad">{calculateAge(items.fechadenacimiento) || '0'}</h5><p></p>
                 </blockquote>
               </div>
             </div>
  
            <div className="col-sm">
            <label  className="form-label" >Telefono:</label>
            <input type="number" onChange={(e) => handleInputChange(e, 'telefono')} value={items.telefono} placeholder="" className="form-control form-control-sm  "  />
            <small  className="form-label">Minimo 10 digitos, si es fijo debe incluir el 604.</small>
            </div>


            <div className="col-sm-6">
                <label className="form-label">Relación con unidad habitacional:</label>
                <select onChange={(e) => handleInputChange(e, 'relacion')} value={items.relacion} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" >
                <option value=""> SELECCIONE </option><option value="2"> SI </option><option value="1"> NO </option>
                </select>
                </div>
                </div>
            </>


          </IonList> : ''}

        </div>



        <div className=' shadow p-3 mb-2 pt-0 bg-white rounded'>
          <IonList>
            <div className="alert alert-primary" role="alert">
              <span className="badge badge-secondary text-dark">PERSONAS QUE RESIDEN PERO NO HACEN DEL HOGAR</span>
            </div>
            <CustomDataTable
              title="Integrantes"
              data={reddeapoyo}
              columns={columns} />
          </IonList>
        </div>

        <br />

        {showModal && selectedIntegrante && (
  <div className={`modal ${showModal ? "d-block" : "d-none"} modalnew modal-backdropnew`} tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document"><br /><br /><br />
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body text-center">
          <div className="modal-body text-center">
            <table className="table table-bordered table-striped">
              <tbody>
                <tr>
                  <th scope="row">Nombre</th>
                  <td>{selectedIntegrante.nombre1 +' '+ selectedIntegrante.apellido1 || 'N/A'}</td>
                </tr>
                <tr>
                  <th scope="row">Tipo de documento</th>
                  <td>{selectedIntegrante.tipodedocumento || 'N/A'}</td>
                </tr>
                <tr>
                  <th scope="row">Documento</th>
                  <td>
                        {selectedIntegrante.tipodedocumento === '15' ? 'ACTA DE NACIMIENTO' :
                        selectedIntegrante.tipodedocumento === '1' ? 'CÉDULA DE CIUDADANÍA' :
                        selectedIntegrante.tipodedocumento === '4' ? 'CÉDULA DE EXTRANJERÍA' :
                        selectedIntegrante.tipodedocumento === '8' ? 'CÉDULA VENEZOLANA' :
                        selectedIntegrante.tipodedocumento === '12' ? 'DNI - DOCUMENTO NACIONAL DE IDENTIDAD' :
                        selectedIntegrante.tipodedocumento === '10' ? 'NES - NÚMERO ESTABLECIDO POR LA SECRETARÍA DE EDUCACIÓN' :
                        selectedIntegrante.tipodedocumento === '9' ? 'NIT: NÚMERO ÚNICO DE IDENTIFICACIÓN TRIBUTARIA' :
                        selectedIntegrante.tipodedocumento === '13' ? 'NO TIENE - NO POSEE DOCUMENTOS DE IDENTIDAD' :
                        selectedIntegrante.tipodedocumento === '11' ? 'NUIP: NÚMERO ÚNICO DE IDENTIFICACIÓN PERSONAL' :
                        selectedIntegrante.tipodedocumento === '5' ? 'PASAPORTE' :
                        selectedIntegrante.tipodedocumento === '6' ? 'PET - PERMISO ESPECIAL DE PERMANENCIA' :
                        selectedIntegrante.tipodedocumento === '7' ? 'PPT - PERMISO POR PROTECCIÓN TEMPORAL' :
                        selectedIntegrante.tipodedocumento === '3' ? 'REGISTRO CIVIL' :
                        selectedIntegrante.tipodedocumento === '16' ? 'SALVOCONDUCTO' :
                        selectedIntegrante.tipodedocumento === '14' ? 'SIN DATO - NO INFORMA SOBRE DOCUMENTO DE IDENTIDAD' :
                        selectedIntegrante.tipodedocumento === '2' ? 'TARJETA DE IDENTIDAD' : 'N/A'}
                        </td>

                </tr>
                <tr>
                  <th scope="row">Nacionalidad</th>
                  <td>{selectedIntegrante.nacionalidad || 'N/A'}</td>
                </tr>
                <tr>
                  <th scope="row">Condición migrante</th>
                  <td>{selectedIntegrante.condicionmigrante === '1' ? 'IRREGULAR' :
                        selectedIntegrante.condicionmigrante === '2' ? 'REFUGIADO' :
                        selectedIntegrante.condicionmigrante === '3' ? 'REGULAR' :
                        selectedIntegrante.condicionmigrante === '4' ? 'RETORNADO' : 'N/A'}</td>
                </tr>
                <tr>
                  <th scope="row">ETPV</th>
                  <td>{((selectedIntegrante.etpv === '1') ? 'NO' : (selectedIntegrante.etpv === '2') ? 'SI' : '') || 'N/A'}</td>
                </tr>
                <tr>
                  <th scope="row">Fecha de nacimiento</th>
                  <td>{selectedIntegrante.fechadenacimiento || 'N/A'}</td>
                </tr>
                <tr>
                  <th scope="row">Relación con unidad habitacional</th>
                  <td>{((selectedIntegrante.relacion === '1') ? 'NO' : (selectedIntegrante.relacion === '2') ? 'SI' : '') || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


        {/* <div><IonButton color="success" onClick={enviar}>Guardar</IonButton><IonButton routerLink={`/tabs/tab12/${params.ficha}`}>Siguiente</IonButton></div> */}
        <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
       <div className={`btn btn-primary `} onClick={() => {  window.location.href = `/tabs/tab16/${params.ficha}`; }}> Siguiente</div>
       </div>
       </form>

      </IonContent>
    </IonPage>
  );
};

export default Tab18;

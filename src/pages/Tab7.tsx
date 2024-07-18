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
  idfiu: string | null;
  tiempovivienda: string | null;
  tiempoviviendaunidad: string | null;
  tiempomedellin: string | null;
  tiempomedellinunidad: string | null;
  dondeviviaantes: string | null;
  otrodepartamento: string | null;
  otropais: string | null;
  otromunicipio: string | null;
  otracomuna: string | null;
  otrobarrio: string | null;
  fecharegistro: string | null;
  usuario: string | null;
  estado: string | null;
  tabla: string | null;
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

const Tab7: React.FC = () => {
  const params = useParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [db, setDb] = useState<any>(null);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [items, setItems] = useState({
    idfiu: '',
    tiempovivienda: '',
    tiempoviviendaunidad: '',
    tiempomedellin: '',
    tiempomedellinunidad: '',
    dondeviviaantes: '',
    otrodepartamento: '',
    otropais: '',
    otromunicipio: '',
    otracomuna: '',
    otrobarrio: '',
    fecharegistro: '',
    usuario: '',
    estado: '',
    tabla: '',
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
      const res = await database.exec(`SELECT * FROM infraccion_tiempo_vivienda WHERE idfiu=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Person);
        });
        setPeople(transformedPeople);
        setButtonDisabled((transformedPeople[0].tiempovivienda)?false:true);  
      } else {
        setItems({
          idfiu: params.ficha,
          tiempovivienda: '',
          tiempoviviendaunidad: '',
          tiempomedellin: '',
          tiempomedellinunidad: '',
          dondeviviaantes: '',
          otrodepartamento: '',
          otropais: '',
          otromunicipio: '',
          otracomuna: '',
          otrobarrio: '',
          fecharegistro: getCurrentDateTime(),
          usuario: localStorage.getItem('cedula'),
          estado: '1',
          tabla: 'infraccion_tiempo_vivienda',
        });
      }
    }
  };

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
        tiempovivienda: data.tiempovivienda || '',
        tiempoviviendaunidad: data.tiempoviviendaunidad || '',
        tiempomedellin: data.tiempomedellin || '',
        tiempomedellinunidad: data.tiempomedellinunidad || '',
        dondeviviaantes: data.dondeviviaantes || '',
        otrodepartamento: data.otrodepartamento || '',
        otropais: data.otropais || '',
        otromunicipio: data.otromunicipio || '',
        otracomuna: data.otracomuna || '',
        otrobarrio: data.otrobarrio || '',
        fecharegistro: data.fecharegistro || '',
        usuario: data.usuario || '',
        estado: data.estado || '',
        tabla: data.tabla || '',
      });
    }
  }, [people]);

  useEffect(() => {
    fetchUsers();
    fetchBarrios();
    fetchComunas();
  }, [db]);

  const handleInputChange = (event, field) => {
    const { value } = event.target;
    setItems((prevItems) => {
      const newState = { ...prevItems, [field]: value };
      if (field === 'dondeviviaantes') {
        newState.otrodepartamento = value === '5' ? '' : newState.otrodepartamento;
        newState.otropais = value === '6' ? '' : newState.otropais;
        newState.otromunicipio = value === '4' ? '' : newState.otromunicipio;
        newState.otrobarrio = value === '2' ? '' : newState.otrobarrio;
        newState.otracomuna = value === '2' ? '' : newState.otracomuna;
      }
      return newState;
    });
  };
  

  useEffect(() => {
    console.log("Items updated:", items);
  }, [items]);
  
  const validarCampos = () => {
    const camposObligatorios = [
      'tiempovivienda', 'tiempoviviendaunidad', 
      'tiempomedellin', 'tiempomedellinunidad', 
      'dondeviviaantes'
    ];
  
    const camposCondicionales = {
      '5': 'otrodepartamento',
      '6': 'otropais',
      '4': 'otromunicipio',
      '2': ['otracomuna', 'otrobarrio']
    };
  
    // Verificar campos obligatorios
    for (let campo of camposObligatorios) {
      if (!items[campo]) {
        return false;
      }
    }
  
    // Verificar campos condicionales
    const valorDondeViviaAntes = items.dondeviviaantes;
    if (camposCondicionales[valorDondeViviaAntes]) {
      const campos = Array.isArray(camposCondicionales[valorDondeViviaAntes]) ? camposCondicionales[valorDondeViviaAntes] : [camposCondicionales[valorDondeViviaAntes]];
      for (let campo of campos) {
        if (!items[campo]) {
          return false;
        }
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
      await db.exec(`INSERT OR REPLACE INTO infraccion_tiempo_vivienda (idfiu, tiempovivienda, tiempoviviendaunidad, tiempomedellin, tiempomedellinunidad, dondeviviaantes, otrodepartamento, otropais, otromunicipio, otracomuna, otrobarrio, fecharegistro, usuario, estado, tabla)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          items.idfiu, items.tiempovivienda, items.tiempoviviendaunidad, items.tiempomedellin, items.tiempomedellinunidad, items.dondeviviaantes, items.otrodepartamento, items.otropais, items.otromunicipio, items.otracomuna, items.otrobarrio, items.fecharegistro, items.usuario, items.estado, items.tabla
        ]);

      const respSelect = db.exec(`SELECT * FROM "infraccion_tiempo_vivienda" WHERE idfiu="${items.idfiu}";`);
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
        <IonTitle slot="start">2 - TIEMPO EN LA VIVIENDA</IonTitle>  
        <IonTitle slot="end">FICHA: <label style={{color:'#17a2b8'}}>{params.ficha}</label> </IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
<form>
    <div className="social-card">
      <span className="label">Ficha:</span>
      <span className="value">{params.ficha}</span>
    </div>
   
      <br />

      <div className=' shadow p-3 mb-5 bg-white rounded'>
<IonList>
<div className="row g-3 was-validated ">
          <div className="col-sm-6">
              <label  className="form-label" >Hace cuanto habita en esta vivienda: - Tiempo</label>
              <input type="number"  onChange={(e) => handleInputChange(e, 'tiempovivienda')} value={items.tiempovivienda} placeholder="" className="form-control form-control-sm  "  required/>
            </div>
          <div className="col-sm-6">
          <label  className="form-label">Unidad de tiempo:</label>
          <select onChange={(e) => handleInputChange(e, 'tiempoviviendaunidad')} value={items.tiempoviviendaunidad} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option>
          <option value="1"> AÑOS </option>
          <option value="3"> DÍAS </option>
          <option value="2"> MESES </option> 
          </select>
          </div>
        </div>
</IonList>
<IonList>
<div className="row g-3 was-validated ">
          <div className="col-sm-6">
              <label  className="form-label" >Hace cuanto habita en Medellín: - Tiempo</label>
              <input type="number" onChange={(e) => handleInputChange(e, 'tiempomedellin')} value={items.tiempomedellin} placeholder="" className="form-control form-control-sm  "  required/>
            </div>
          <div className="col-sm-6">
          <label  className="form-label">Unidad de tiempo:</label>
          <select onChange={(e) => handleInputChange(e, 'tiempomedellinunidad')} value={items.tiempomedellinunidad} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option>
          <option value="1"> AÑOS </option>
          <option value="3"> DÍAS </option>
          <option value="2"> MESES </option>
          </select>
          </div>
        </div>
</IonList>
<IonList>
<div className="row g-3 was-validated ">
          <div className="col-sm">
          <label  className="form-label">Dónde vivía antes:</label>
          <select onChange={(e) => handleInputChange(e, 'dondeviviaantes')} value={items.dondeviviaantes} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value="">SELECCIONE </option><option value="4"> MUNICIPIO DE ANTIOQUIA </option><option value="2"> OTRO BARRIO DE MEDELLIN </option><option value="5"> OTRO DEPARTAMENTO </option><option value="6"> OTRO PAIS </option><option value="1"> SIEMPRE HA VIVIDO EN ESTE BARRIO </option>
          </select>
          </div>
        </div>
</IonList>
<IonList>

<div className="row g-3 was-validated ">
      {(items.dondeviviaantes =='5')? 
          <div className="col-sm-12">
          <label  className="form-label">Cual departamento:</label>
          <select onChange={(e) => handleInputChange(e, 'otrodepartamento')} value={items.otrodepartamento} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option><option value="28"> AMAZONAS </option><option value="24"> ARAUCA </option><option value="27"> ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA </option><option value="1"> ATLÁNTICO </option><option value="2"> BOGOTÁ, D.C. </option><option value="3"> BOLÍVAR </option><option value="4"> BOYACÁ </option><option value="5"> CALDAS </option><option value="6"> CAQUETÁ </option><option value="25"> CASANARE </option><option value="7"> CAUCA </option><option value="8"> CESAR </option><option value="11"> CHOCÓ </option><option value="9"> CÓRDOBA </option><option value="10"> CUNDINAMARCA </option><option value="29"> GUAINÍA </option><option value="30"> GUAVIARE </option><option value="12"> HUILA </option><option value="13"> LA GUAJIRA </option><option value="14"> MAGDALENA </option><option value="15"> META </option><option value="16"> NARIÑO </option><option value="17"> NORTE DE SANTANDER </option><option value="26"> PUTUMAYO </option><option value="18"> QUINDIO </option><option value="19"> RISARALDA </option><option value="20"> SANTANDER </option><option value="21"> SUCRE </option><option value="22"> TOLIMA </option><option value="23"> VALLE DEL CAUCA </option><option value="31"> VAUPÉS </option><option value="32"> VICHADA </option>    
          </select>
          </div>:'' }
          {(items.dondeviviaantes =='6')? 
          <div className="col-sm-12">
          <label  className="form-label">Cual pais:</label>
          <select onChange={(e) => handleInputChange(e, 'otropais')} value={items.otropais} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
            <option value=""> SELECCIONE </option><option value="3"> AFGANISTAN </option><option value="4"> ALBANIA </option><option value="5"> ALEMANIA </option><option value="6"> ANDORRA </option><option value="7"> ANGOLA </option><option value="8"> ANGUILLA </option><option value="9"> ANTIGUA Y BARBUDA </option><option value="10"> ANTILLAS HOLANDESAS </option><option value="11"> ARABIA SAUDI </option><option value="12"> ARGELIA </option><option value="13"> ARGENTINA </option><option value="14"> ARMENIA </option><option value="15"> ARUBA </option><option value="16"> AUSTRALIA </option><option value="17"> AUSTRIA </option><option value="18"> AZERBAIYAN </option><option value="19"> BAHAMAS </option><option value="20"> BAHREIN </option><option value="21"> BANGLADESH </option><option value="22"> BARBADOS </option><option value="23"> BELARUS </option><option value="24"> BELGICA </option><option value="25"> BELICE </option><option value="26"> BENIN </option><option value="27"> BERMUDAS </option><option value="28"> BHUTÁN </option><option value="29"> BOLIVIA </option><option value="30"> BOSNIA Y HERZEGOVINA </option><option value="31"> BOTSWANA </option><option value="32"> BRASIL </option><option value="33"> BRUNEI </option><option value="34"> BULGARIA </option><option value="35"> BURKINA FASO </option><option value="36"> BURUNDI </option><option value="37"> CABO VERDE </option><option value="38"> CAMBOYA </option><option value="39"> CAMERUN </option><option value="40"> CANADA </option><option value="41"> CHAD </option><option value="42"> CHILE </option><option value="43"> CHINA </option><option value="44"> CHIPRE </option><option value="1"> COLOMBIA </option><option value="45"> COMORES </option><option value="46"> CONGO </option><option value="47"> COREA </option><option value="48"> COREA DEL NORTE  </option><option value="49"> COSTA DE MARFIL </option><option value="50"> COSTA RICA </option><option value="51"> CROACIA </option><option value="52"> CUBA </option><option value="53"> DINAMARCA </option><option value="54"> DJIBOUTI </option><option value="55"> DOMINICA </option><option value="56"> ECUADOR </option><option value="57"> EGIPTO </option><option value="58"> EL SALVADOR </option><option value="59"> EMIRATOS ARABES UNIDOS </option><option value="60"> ERITREA </option><option value="61"> ESLOVENIA </option><option value="62"> ESPAÑA </option><option value="63"> ESTADOS UNIDOS DE AMERICA </option><option value="64"> ESTONIA </option><option value="65"> ETIOPIA </option><option value="66"> FIJI </option><option value="67"> FILIPINAS </option><option value="68"> FINLANDIA </option><option value="69"> FRANCIA </option><option value="70"> GABON </option><option value="71"> GAMBIA </option><option value="72"> GEORGIA </option><option value="73"> GHANA </option><option value="74"> GIBRALTAR </option><option value="75"> GRANADA </option><option value="76"> GRECIA </option><option value="77"> GROENLANDIA </option><option value="78"> GUADALUPE </option><option value="79"> GUAM </option><option value="80"> GUATEMALA </option><option value="81"> GUAYANA FRANCESA </option><option value="82"> GUERNESEY </option><option value="83"> GUINEA </option><option value="84"> GUINEA ECUATORIAL </option><option value="85"> GUINEA-BISSAU </option><option value="86"> GUYANA </option><option value="87"> HAITI </option><option value="88"> HONDURAS </option><option value="89"> HONG KONG </option><option value="90"> HUNGRIA </option><option value="91"> INDIA </option><option value="92"> INDONESIA </option><option value="93"> IRAN </option><option value="94"> IRAQ </option><option value="95"> IRLANDA </option><option value="96"> ISLA DE MAN </option><option value="97"> ISLA NORFOLK </option><option value="98"> ISLANDIA </option><option value="99"> ISLAS ALAND </option><option value="100"> ISLAS CAIMÁN </option><option value="101"> ISLAS COOK </option><option value="102"> ISLAS DEL CANAL </option><option value="103"> ISLAS FEROE </option><option value="104"> ISLAS MALVINAS </option><option value="105"> ISLAS MARIANAS DEL NORTE </option><option value="106"> ISLAS MARSHALL </option><option value="107"> ISLAS PITCAIRN </option><option value="108"> ISLAS SALOMON </option><option value="109"> ISLAS TURCAS Y CAICOS </option><option value="110"> ISLAS VIRGENES BRITANICAS </option><option value="111"> ISLAS VÍRGENES DE LOS ESTADOS UNIDOS </option><option value="112"> ISRAEL </option><option value="113"> ITALIA </option><option value="114"> JAMAICA </option><option value="115"> JAPON </option><option value="116"> JERSEY </option><option value="117"> JORDANIA </option><option value="118"> KAZAJSTAN </option><option value="119"> KENIA </option><option value="120"> KIRGUISTAN </option><option value="121"> KIRIBATI </option><option value="122"> KUWAIT </option><option value="123"> LAOS </option><option value="124"> LESOTHO </option><option value="125"> LETONIA </option><option value="126"> LIBANO </option><option value="127"> LIBERIA </option><option value="128"> LIBIA </option><option value="129"> LIECHTENSTEIN </option><option value="130"> LITUANIA </option><option value="131"> LUXEMBURGO </option><option value="132"> MACAO </option><option value="133"> MACEDONIA  </option><option value="134"> MADAGASCAR </option><option value="135"> MALASIA </option><option value="136"> MALAWI </option><option value="137"> MALDIVAS </option><option value="138"> MALI </option><option value="139"> MALTA </option><option value="140"> MARRUECOS </option><option value="141"> MARTINICA </option><option value="142"> MAURICIO </option><option value="143"> MAURITANIA </option><option value="144"> MAYOTTE </option><option value="145"> MEXICO </option><option value="146"> MICRONESIA </option><option value="147"> MOLDAVIA </option><option value="148"> MONACO </option><option value="149"> MONGOLIA </option><option value="150"> MONTENEGRO </option><option value="151"> MONTSERRAT </option><option value="152"> MOZAMBIQUE </option><option value="153"> MYANMAR </option><option value="154"> NAMIBIA </option><option value="155"> NAURU </option><option value="156"> NEPAL </option><option value="157"> NICARAGUA </option><option value="158"> NIGER </option><option value="159"> NIGERIA </option><option value="160"> NIUE </option><option value="161"> NORUEGA </option><option value="162"> NUEVA CALEDONIA </option><option value="163"> NUEVA ZELANDA </option><option value="164"> OMAN </option><option value="165"> OTROS PAISES  O TERRITORIOS DE AMERICA DEL NORTE </option><option value="166"> OTROS PAISES O TERRITORIOS  DE SUDAMERICA </option><option value="167"> OTROS PAISES O TERRITORIOS DE AFRICA </option><option value="168"> OTROS PAISES O TERRITORIOS DE ASIA </option><option value="169"> OTROS PAISES O TERRITORIOS DE LA UNION EUROPEA </option><option value="170"> OTROS PAISES O TERRITORIOS DE OCEANIA </option><option value="171"> OTROS PAISES O TERRITORIOS DEL CARIBE Y AMERICA CENTRAL </option><option value="172"> OTROS PAISES O TERRITORIOS DEL RESTO DE EUROPA </option><option value="173"> PAISES BAJOS </option><option value="174"> PAKISTAN </option><option value="175"> PALAOS </option><option value="176"> PALESTINA </option><option value="177"> PANAMA </option><option value="178"> PAPUA NUEVA GUINEA </option><option value="179"> PARAGUAY </option><option value="180"> PERU </option><option value="181"> POLINESIA FRANCESA </option><option value="182"> POLONIA </option><option value="183"> PORTUGAL </option><option value="184"> PUERTO RICO </option><option value="185"> QATAR </option><option value="186"> REINO UNIDO </option><option value="187"> REP.DEMOCRATICA DEL CONGO </option><option value="188"> REPUBLICA CENTROAFRICANA </option><option value="189"> REPUBLICA CHECA </option><option value="190"> REPUBLICA DOMINICANA </option><option value="191"> REPUBLICA ESLOVACA </option><option value="192"> REUNION </option><option value="193"> RUANDA </option><option value="194"> RUMANIA </option><option value="195"> RUSIA </option><option value="196"> SAHARA OCCIDENTAL </option><option value="197"> SAMOA </option><option value="198"> SAMOA AMERICANA </option><option value="199"> SAN BARTOLOME </option><option value="200"> SAN CRISTOBAL Y NIEVES </option><option value="201"> SAN MARINO </option><option value="202"> SAN MARTIN (PARTE FRANCESA) </option><option value="203"> SAN PEDRO Y MIQUELON  </option><option value="204"> SAN VICENTE Y LAS GRANADINAS </option><option value="205"> SANTA HELENA </option><option value="206"> SANTA LUCIA </option><option value="207"> SANTA SEDE </option><option value="208"> SANTO TOME Y PRINCIPE </option><option value="209"> SENEGAL </option><option value="210"> SERBIA </option><option value="211"> SEYCHELLES </option><option value="212"> SIERRA LEONA </option><option value="213"> SINGAPUR </option><option value="214"> SIRIA </option><option value="215"> SOMALIA </option><option value="216"> SRI LANKA </option><option value="217"> SUDAFRICA </option><option value="218"> SUDAN </option><option value="219"> SUECIA </option><option value="220"> SUIZA </option><option value="221"> SURINAM </option><option value="222"> SVALBARD Y JAN MAYEN </option><option value="223"> SWAZILANDIA </option><option value="224"> TADYIKISTAN </option><option value="225"> TAILANDIA </option><option value="226"> TANZANIA </option><option value="227"> TIMOR ORIENTAL </option><option value="228"> TOGO </option><option value="229"> TOKELAU </option><option value="230"> TONGA </option><option value="231"> TRINIDAD Y TOBAGO </option><option value="232"> TUNEZ </option><option value="233"> TURKMENISTAN </option><option value="234"> TURQUIA </option><option value="235"> TUVALU </option><option value="236"> UCRANIA </option><option value="237"> UGANDA </option><option value="238"> URUGUAY </option><option value="239"> UZBEKISTAN </option><option value="240"> VANUATU </option><option value="2"> VENEZUELA </option><option value="241"> VIETNAM </option><option value="242"> WALLIS Y FORTUNA </option><option value="243"> YEMEN </option><option value="244"> ZAMBIA </option><option value="245"> ZIMBABWE </option>
          </select>
          </div>:'' }
          {(items.dondeviviaantes =='4')? 
          <div className="col-sm-12">
          <label  className="form-label">Cual municipio de Antioquia:</label>
          <select onChange={(e) => handleInputChange(e, 'otromunicipio')} value={items.otromunicipio} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
              <option value=""> SELECCIONE </option><option value="1"> ABEJORRAL </option><option value="2"> ABRIAQUÍ </option><option value="3"> ALEJANDRÍA </option><option value="4"> AMAGÁ </option><option value="5"> AMALFI </option><option value="6"> ANDES </option><option value="7"> ANGELÓPOLIS </option><option value="8"> ANGOSTURA </option><option value="9"> ANORÍ </option><option value="11"> ANZÁ </option><option value="12"> APARTADÓ </option><option value="13"> ARBOLETES </option><option value="14"> ARGELIA </option><option value="15"> ARMENIA </option><option value="16"> BARBOSA </option><option value="18"> BELLO </option><option value="17"> BELMIRA </option><option value="19"> BETANIA </option><option value="20"> BETULIA </option><option value="22"> BRICEÑO </option><option value="23"> BURITICÁ </option><option value="24"> CÁCERES </option><option value="25"> CAICEDO </option><option value="26"> CALDAS </option><option value="27"> CAMPAMENTO </option><option value="28"> CAÑASGORDAS </option><option value="29"> CARACOLÍ </option><option value="30"> CARAMANTA </option><option value="31"> CAREPA </option><option value="33"> CAROLINA </option><option value="34"> CAUCASIA </option><option value="35"> CHIGORODÓ </option><option value="36"> CISNEROS </option><option value="21"> CIUDAD BOLÍVAR </option><option value="37"> COCORNÁ </option><option value="38"> CONCEPCIÓN </option><option value="39"> CONCORDIA </option><option value="40"> COPACABANA </option><option value="41"> DABEIBA </option><option value="42"> DONMATÍAS </option><option value="43"> EBÉJICO </option><option value="44"> EL BAGRE </option><option value="32"> EL CARMEN DE VIBORAL </option><option value="103"> EL SANTUARIO </option><option value="45"> ENTRERRÍOS </option><option value="46"> ENVIGADO </option><option value="47"> FREDONIA </option><option value="48"> FRONTINO </option><option value="49"> GIRALDO </option><option value="50"> GIRARDOTA </option><option value="51"> GÓMEZ PLATA </option><option value="52"> GRANADA </option><option value="53"> GUADALUPE </option><option value="54"> GUARNE </option><option value="55"> GUATAPÉ </option><option value="56"> HELICONIA </option><option value="57"> HISPANIA </option><option value="58"> ITAGÜÍ </option><option value="59"> ITUANGO </option><option value="60"> JARDÍN </option><option value="61"> JERICÓ </option><option value="62"> LA CEJA </option><option value="63"> LA ESTRELLA </option><option value="64"> LA PINTADA </option><option value="65"> LA UNIÓN </option><option value="66"> LIBORINA </option><option value="67"> MACEO </option><option value="68"> MARINILLA </option><option value="69"> MONTEBELLO </option><option value="70"> MURINDÓ </option><option value="71"> MUTATÁ </option><option value="72"> NARIÑO </option><option value="74"> NECHÍ </option><option value="73"> NECOCLÍ </option><option value="75"> OLAYA </option><option value="76"> PEÑOL </option><option value="77"> PEQUE </option><option value="78"> PUEBLORRICO </option><option value="79"> PUERTO BERRÍO </option><option value="80"> PUERTO NARE </option><option value="81"> PUERTO TRIUNFO </option><option value="82"> REMEDIOS </option><option value="83"> RETIRO </option><option value="84"> RIONEGRO </option><option value="85"> SABANALARGA </option><option value="86"> SABANETA </option><option value="87"> SALGAR </option><option value="88"> SAN ANDRÉS DE CUERQUÍA </option><option value="89"> SAN CARLOS </option><option value="90"> SAN FRANCISCO </option><option value="91"> SAN JERÓNIMO </option><option value="92"> SAN JOSÉ DE LA MONTAÑA </option><option value="93"> SAN JUAN DE URABÁ </option><option value="94"> SAN LUIS </option><option value="95"> SAN PEDRO DE LOS MILAGROS </option><option value="96"> SAN PEDRO DE URABÁ </option><option value="97"> SAN RAFAEL </option><option value="98"> SAN ROQUE </option><option value="99"> SAN VICENTE FERRER </option><option value="100"> SANTA BÁRBARA </option><option value="10"> SANTA FÉ DE ANTIOQUIA </option><option value="101"> SANTA ROSA DE OSOS </option><option value="102"> SANTO DOMINGO </option><option value="104"> SEGOVIA </option><option value="105"> SONSÓN </option><option value="106"> SOPETRÁN </option><option value="107"> TÁMESIS </option><option value="108"> TARAZÁ </option><option value="109"> TARSO </option><option value="110"> TITIRIBÍ </option><option value="111"> TOLEDO </option><option value="112"> TURBO </option><option value="113"> URAMITA </option><option value="114"> URRAO </option><option value="115"> VALDIVIA </option><option value="116"> VALPARAÍSO </option><option value="117"> VEGACHÍ </option><option value="118"> VENECIA </option><option value="119"> VIGÍA DEL FUERTE </option><option value="120"> YALÍ </option><option value="121"> YARUMAL </option><option value="122"> YOLOMBÓ </option><option value="123"> YONDÓ </option><option value="124"> ZARAGOZA </option>
          </select>
          </div>:'' }
          {(items.dondeviviaantes =='2')? 
          <div className="col-sm">
          <label  className="form-label">En cual Comuna:</label>
          <select onChange={(e) => handleInputChange(e, 'otracomuna')} value={items.otracomuna} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
          <option value=""> SELECCIONE </option>
          {comunas.map((programa) => (
                    <option key={programa.id} value={programa.id}>{programa.descripcion}</option>
                  ))}
          </select>
          </div>:'' }
          {(items.dondeviviaantes =='2')? 
          <div className="col-sm">
          <label  className="form-label">Cual Barrio:</label>
          <select onChange={(e) => handleInputChange(e, 'otrobarrio')} value={items.otrobarrio} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
         <option value=""> SELECCIONE </option>
         {barrios
                        .filter(programa => programa.comuna == parseInt(items.otracomuna))
                        .map((programa) => (
                          <option key={programa.id} value={programa.id}>{programa.descripcion}</option>
                        ))
                        }
          </select>
          </div>:'' }
        </div>
</IonList>



  <br />  

</div>

        <br />

    {/* <div><IonButton color="success" onClick={enviar}>Guardar</IonButton><IonButton disabled={buttonDisabled} routerLink={`/tabs/tab8/${params.ficha}`} >Siguiente</IonButton></div> */}
    <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
       <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/tabs/tab8/${params.ficha}`;} }}> Siguiente</div>
       </div>
    </form>
    </IonContent>
  </IonPage>
  );
};

export default Tab7;

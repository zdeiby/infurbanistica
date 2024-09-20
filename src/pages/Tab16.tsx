import './Tab4.css';
import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonButton } from '@ionic/react';
import { useParams, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TouchPad from '../components/TouchPad';
import loadSQL from '../models/database';

interface Autorizacion {
  idfiu: number;
  idintegrante: number | null;
  entidad: string | null;
  diligenciadopor: number | null;
  acepto: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
  nameFile: string | null;
  apoyosocial: string | null;
  draw_dataUrl: Blob | null;
  draw_dataUrlImage: Blob | null;
  nameFirma: string | null;
  autorizofirma: string | null;
  residen: string | null;
  condicionmigratoria: string | null;
  tipodedocumento: string | null;
  numerodedocumento: string | null;
  nombre: string | null;
  fechadenacimiento: string | null;
  telefono: string | null;
  nacionalidad:string | null;
  idseguimiento: number | null;
  firmatitular: string | null;
}

const Tab16: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const idayuda = queryParams.get('idayuda');
  const [db, setDb] = useState<any>(null);
  const [autorizacion, setAutorizacion] = useState<Autorizacion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    loadSQL(setDb, fetchAutorizacion);
    fetchIntegrantes(); 
  }, []);

  useEffect(() => {
    fetchIntegrantes(); 
  }, [params.ficha,db]);

  const fetchAutorizacion = async (database = db) => {
    if (database) {
      const res = await database.exec(`SELECT * FROM infraccion_autorizacion WHERE idfiu=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedData = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Autorizacion);
        });
        setAutorizacion(transformedData[0] || null);
        setButtonDisabled((transformedData[0].idintegrante)?false:true);  
        if (transformedData[0]?.draw_dataUrlImage) {
          setPreview(transformedData[0].draw_dataUrlImage);
        }
      } else {
        setAutorizacion({
          idfiu: parseInt(params.ficha),
          idintegrante: null,
          entidad: '',

          diligenciadopor: null,
          acepto: '',
          fecharegistro: getCurrentDateTime(),
          usuario: parseInt(localStorage.getItem('cedula') || '0', 10),
          estado: 2,
          tabla: 'infraccion_autorizacion',
          nameFile: '',
          apoyosocial: '',
          draw_dataUrl: null,
          draw_dataUrlImage:null,
          nameFirma: `infraccion_autorizacion_${params.ficha}`,
          autorizofirma: '',
          residen:'',
          nacionalidad:'',
          condicionmigratoria:'',
          tipodedocumento:'',
          numerodedocumento:'',
          nombre:'',
          fechadenacimiento:'',
          telefono:'',
          idseguimiento: null,
          firmatitular: '',
        });
      }
    }
  };

  const fetchIntegrantes = async (database = db) => {
    if (database) {
      const res = await database.exec(`SELECT idintegrante, nombre1, nombre2, apellido1, apellido2 FROM infraccion_integrante_familiar WHERE idfiu=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedIntegrantes: Integrante[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Integrante);
        });
        setIntegrantes(transformedIntegrantes);
      }
    }
  };
  

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof Autorizacion) => {
    const { value } = event.target;
    setAutorizacion((prev) => {
      if (!prev) return prev;
  
      const newState = { ...prev, [field]: value };
  
      if (field === 'diligenciadopor') {
        newState.entidad = value === '24' ? '' : 'COMISION SOCIAL';
      } 
      if (field === 'autorizofirma') {
        newState.firmatitular = value === '2' ? '' : '';
        newState.draw_dataUrl= value === '2' ? '' : '';
      }
  
      return newState;
    });
  };

  function dataURLToBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("image")) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setPreview(base64data);
        setAutorizacion((prev) => prev ? { ...prev, draw_dataUrlImage: base64data, nameFile: file.name } : prev);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };
  

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview('');
    }
  }, [image]);

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

  const validarCampos = () => {
    const camposObligatorios = ['idintegrante', 'entidad', 'diligenciadopor', 'autorizofirma'];
  
   
    if (autorizacion?.autorizofirma === '2') {
      camposObligatorios.push('firmatitular');
    }
  
    for (let campo of camposObligatorios) {
      if (!autorizacion[campo]) {
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

    if (!autorizacion) return;
    try {
      await db.exec(`INSERT OR REPLACE INTO infraccion_autorizacion 
      (idfiu, idintegrante, entidad, diligenciadopor, acepto, fecharegistro, usuario, estado, tabla, 
      nameFile, apoyosocial, draw_dataUrl, nameFirma, autorizofirma,nacionalidad,
      idseguimiento, firmatitular,draw_dataUrlImage,
      residen,
      condicionmigratoria,
      tipodedocumento,
      numerodedocumento,
      nombre,
      fechadenacimiento,
      telefono
) 
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?,?,?,?,?,?,?,?);`,
        [
          autorizacion.idfiu, autorizacion.idintegrante, autorizacion.entidad,
          autorizacion.diligenciadopor, autorizacion.acepto, autorizacion.fecharegistro, autorizacion.usuario, autorizacion.estado,
          autorizacion.tabla, autorizacion.nameFile, autorizacion.apoyosocial, autorizacion.draw_dataUrl, autorizacion.nameFirma,
          autorizacion.autorizofirma, autorizacion.nacionalidad, autorizacion.idseguimiento, autorizacion.firmatitular,autorizacion.draw_dataUrlImage,
          autorizacion.residen,
          autorizacion.condicionmigratoria,
          autorizacion.tipodedocumento,
          autorizacion.numerodedocumento,
          autorizacion.nombre,
          autorizacion.fechadenacimiento,
          autorizacion.telefono
        ]);

      saveDatabase();
     //alert('Datos Guardados con éxito');
      fetchAutorizacion(); // Actualizar los datos después de guardar
    } catch (err) {
      console.error('Error al exportar los datos JSON:', err);
    } try {
      await db.exec(`UPDATE infraccion_localizacion 
        SET estado = 2 
        WHERE idfiu = ?;`,
        [
          autorizacion.idfiu
        ]);
  
      saveDatabase();
      alert('Estado actualizado con éxito');
      fetchAutorizacion(); // Actualizar los datos después de guardar
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
    }
  };

  const handleSave = (url: Blob) => {
    setAutorizacion((prev) => prev ? { ...prev, draw_dataUrl: url } : prev);
  };


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
          <IonTitle slot="start">12 - INFORMACION DE QUIEN RESPONDE LA ENCUESTA</IonTitle>
          <IonTitle slot="end">FICHA: <label style={{ color: '#17a2b8' }}>{params.ficha}</label> </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
 <form>
        <div className="social-card">
          <span className="label">Ficha: {params.ficha}</span>
          <span className="value"></span>
        </div>

        <br />
       
        <div className='shadow p-3 mb-5 bg-white rounded'>
          <IonList>
            <div className="row g-3 was-validated ">
              <div className="col-sm-6">
                <label className="form-label">Nombre de quien responde la entrevista:</label>
                <select value={autorizacion?.idintegrante || ''} onChange={(e) => handleInputChange(e, 'idintegrante')} className="form-control form-control-sm" aria-describedby="validationServer04Feedback" required>
                  <option value=""> SELECCIONE </option>
                  {integrantes.map((integrante) => (
                    <option key={integrante.idintegrante} value={integrante.idintegrante}>
                      {`${integrante.nombre1} ${integrante.nombre2} ${integrante.apellido1} ${integrante.apellido2}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group col-sm">
                <label>Adjuntar archivo:</label>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <div onClick={() => fileInputRef.current?.click()} className="btn btn-info btn-sm text-light">
                      Cargar Imagen
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    <div className="btn btn-info btn-sm text-light" type="button" onClick={() => (preview ? setShowModal(true) : alert('Cargar un archivo'))}>
                      Ver
                    </div>
                  </div>
                  <input type="text" id="nameFile" className="form-control form-control-sm" placeholder="" value={autorizacion?.nameFile || ''} disabled />
                </div>
              </div>
            </div>
          </IonList>
          <IonList>
            <div className="row g-3 was-validated ">
              <div className="col-sm-4">
                <label className="form-label">Quien diligencia la ficha:</label>
                <select value={autorizacion?.diligenciadopor || ''} onChange={(e) => handleInputChange(e, 'diligenciadopor')} className="form-control form-control-sm" aria-describedby="validationServer04Feedback" required>
                <option value=""> SELECCIONE </option><option value="76"> ANA BEATRIZ FIGUEROA TORRES </option><option value="24"> APOYO  SOCIAL </option><option value="34"> APOYO SOCIAL DOS </option><option value="8"> BEATRIZ EUGENIA MONCADA GONZALEZ </option><option value="6"> DANIEL  TORO VASQUEZ </option><option value="29"> DANIELA SANDOVAL GARZON </option><option value="7"> DEISY YOHANA GIRALDO ZULUAGA </option><option value="5"> ESTER LUCIA ROJAS ARENAS </option><option value="13"> JOHANA ANDREA CIFUENTES LONGAS </option><option value="21"> LINA MARCELA PEREZ ARAQUE </option><option value="87"> MARITZA  OROZCO MARTINEZ </option><option value="4"> MARYORY LINDEY ABELLO LONDOÑO </option><option value="32"> PAULA ANDREA MIRA MENESES </option><option value="33"> SANDRA JULIANA HERRERA HENAO </option><option value="88"> VIVIANA YANET CALLEJAS DUQUE </option><option value="22"> YEIDY TATIANA HIGUITA </option><option value="9"> YULIET ANDREA LOPEZ RODRIGUEZ </option>
                </select>
              </div>
              {/* <div className="col-sm-4">
                <label className="form-label" >Nombre apoyo social:</label>
                <input type="text" onChange={(e) => handleInputChange(e, 'apoyosocial')} value={autorizacion?.apoyosocial || ''} placeholder="" className="form-control form-control-sm" required />
              </div> */}
              <div className="col-sm-4">
                <label className="form-label" >Entidad:</label>
                <input type="text" onChange={(e) => handleInputChange(e, 'entidad')} value={autorizacion?.entidad || ''} placeholder="" className="form-control form-control-sm" required />
              </div>
              {/* <div className="col-sm">
                <label className="form-label">Requiere seguimiento:</label>
                <select value={autorizacion?.requerieseguimiento || ''} onChange={(e) => handleInputChange(e, 'requerieseguimiento')} className="form-control form-control-sm" aria-describedby="validationServer04Feedback" required>
                  <option value=""> SELECCIONE </option>
                  <option value="1"> NO </option>
                  <option value="2"> SI </option>
                </select>
              </div> */}
             {/* {(autorizacion?.requerieseguimiento == '2' )?
              <div className="col">
                <label className="form-label" >Fecha probable:</label>
                <input type="date" onChange={(e) => handleInputChange(e, 'fechaprobable')} value={autorizacion?.fechaprobable || ''} placeholder="" className="form-control form-control-sm" required />
                <small className="form-text text-muted">La fecha para el primer seguimiento no puede ser superior a un mes.</small>
              </div> :''} */}
            </div>
          </IonList>
        </div>
        <div className='shadow p-3 mb-5 bg-white rounded'>
          <IonList>
            <div className="social-card2">
              <span className="label2">AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES:</span>
              <span className="value2">
                El titular de los datos personales consignados en este documento, da su consentimiento de manera libre, espontánea, consciente, expresa, inequívoca, previa e informada, para que la Alcaldía de Medellín realice la recolección, almacenamiento, uso, circulación, indexación, analítica, supresión, procesamiento, compilación, intercambio, actualización y disposición de los datos que ha suministrado y, en general, realice el tratamiento de los datos personales conforme lo dispone la Ley 1581 del 17 de octubre de 2021, el Decreto 1377 del 27 de junio de 2013 y el Decreto 1096 del 28 de diciembre de 2018 (política para el tratamiento de datos personales en el Municipio de Medellín distrito especial). La Alcaldía de Medellín, como responsable del tratamiento de los datos personales aquí consignados, en cumplimiento de las normas mencionadas, informa al titular de los datos personales que le asisten los siguientes derechos: acceder a sus datos personales; conocer, actualizar y rectificar sus datos personales; solicitar prueba de la autorización otorgada; revocar la autorización y/o solicitar la supresión del dato; presentar quejas ante la Superintendencia de Industria y Comercio y; en general, todos los derechos consignados en el artículo 8 de la Ley 1581 de 2012.
                <br /><br />
                Con la firma de este documento se garantiza que la información consignada en la atención es veraz y corresponde a la brindada por mí.
              </span>
            </div>
            <br/>
            <div className="row g-3 was-validated ">
              <div className="col-sm-6">
                <label className="form-label">En esta unidad habitacional residen personas que no hacen parte de este hogar?</label>
                <select value={autorizacion?.residen || ''} onChange={(e) => handleInputChange(e, 'residen')} className="form-control form-control-sm" aria-describedby="validationServer04Feedback" >
                  <option value=""> SELECCIONE </option>
                  <option value="1"> NO </option>
                  <option value="2"> SI </option>
                </select>
              </div>
              {(autorizacion?.residen == '2' )?
              <>
               <div className="col-sm-12">
                 <label className="form-label">Nacionalidad:</label>
                 <select onChange={(e) => handleInputChange(e, 'nacionalidad')} value={autorizacion.nacionalidad} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" >
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

              </>

              :''}
            {(autorizacion?.residen == '2' && autorizacion.nacionalidad  )?
              <div className="col-sm-6">
                <label className="form-label">Condición migratoria:</label>
                <input 
                type="text" 
                onChange={(e) => handleInputChange(e, 'condicionmigratoria')} 
                value={autorizacion?.condicionmigratoria} 
                placeholder="" 
                className="form-control form-control-sm" 
              />
              </div>
              :''}


                {(autorizacion?.residen == '2') ? (
                   <>
                  <div className="col-sm-6">
                    <label className="form-label">Tipo de documento:</label>
                    <select 
                      onChange={(e) => handleInputChange(e, 'tipodedocumento')} 
                      value={autorizacion.tipodedocumento} 
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
                  <input type="number" onChange={(e) => handleInputChange(e, 'numerodedocumento')} value={autorizacion.numerodedocumento} placeholder="" className="form-control form-control-sm  "  />
                </div>
               <div className="col-sm-6">
               <label className="form-label">Nombre:</label>
               <input type="text" onChange={(e) => handleInputChange(e, 'nombre')} value={autorizacion.nombre} placeholder="" className="form-control form-control-sm  " />                              
             </div>
               <div className="row g-3 was-validated ">
  
               <div className="col-sm">
                 <label className="form-label" >Fecha de nacimiento</label>
                 <input type="date" onChange={(e) => handleInputChange(e, 'fechadenacimiento')} value={autorizacion.fechadenacimiento} placeholder="" className="form-control form-control-sm  "  />
               </div>
               <div className="form-group col-sm">
                 <blockquote className="blockquote text-center">
                   <p className="mb-0"></p><h6>Edad:</h6><p></p>
                   <p className="mb-0"></p><h5 id="edad">{calculateAge(autorizacion.fechadenacimiento) || '0'}</h5><p></p>
                 </blockquote>
               </div>
             </div>
  
            <div className="col-sm">
            <label  className="form-label" >Telefono:</label>
            <input type="number" onChange={(e) => handleInputChange(e, 'telefono')} value={autorizacion.telefono} placeholder="" className="form-control form-control-sm  "  />
            <small  className="form-label">Minimo 10 digitos, si es fijo debe incluir el 604.</small>
            </div>
            </>
                ) : ''}


            </div>
            <br />
            <div className="row g-3 was-validated ">
              <div className="col-sm-6">
                <label className="form-label">Autorizo el tratamiento de datos:</label>
                <select value={autorizacion?.autorizofirma || ''} onChange={(e) => handleInputChange(e, 'autorizofirma')} className="form-control form-control-sm" aria-describedby="validationServer04Feedback" required>
                  <option value=""> SELECCIONE </option>
                  <option value="1"> NO </option>
                  <option value="2"> SI </option>
                </select>
              </div>
              {(autorizacion?.autorizofirma == '2' )?
              <div className="col-sm-6">
                <label className="form-label">Firma el representante del hogar:</label>
                <select value={autorizacion?.firmatitular || ''} onChange={(e) => handleInputChange(e, 'firmatitular')} className="form-control form-control-sm" aria-describedby="validationServer04Feedback" required>
                  <option value=""> SELECCIONE </option>
                  <option value="1"> NO </option>
                  <option value="2"> SI </option>
                </select>
              </div>:''}
            </div>
          </IonList>
        </div>
        {(autorizacion?.autorizofirma=='2')?
        <div className='shadow p-3 mb-5 bg-white rounded'>
          <div className="col-sm">
            <div className="alert alert-info" role="alert">
              <strong>FIRMA DEL USUARIO:</strong> En este módulo puedes pedir al usuario que realice su firma a mano alzada, esta informacion se visualizará en el PDF. En el siguiente cuadro realiza la firma y cuando esté firmado oprime el botón <strong>Cargar Firma</strong>
            </div>
          </div>
          <div className=' text-center pb-4 pt-4'>
          <img src={autorizacion?.draw_dataUrl}  alt="" />
          </div>

          <TouchPad onSave={handleSave} />
        </div> :''}

        {/* <div>
          <IonButton color="success" onClick={enviar}>Guardar</IonButton>
          <IonButton routerLink={'/cobertura'}>Siguiente</IonButton>
        </div> */}
         <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
       <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/cobertura`;} }}> Siguiente</div> 
       </div>
       </form>
        {preview && (
          <>
            <div className={`modal ${showModal ? "d-block" : "d-none"} modalnew modal-backdropnew`} tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document"><br /><br /><br />
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <img src={preview} alt="Preview" style={{ width: "100%", height: "auto" }} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab16;


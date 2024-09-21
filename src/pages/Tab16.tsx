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
      (idfiu, idintegrante, entidad, diligenciadopor, acepto, fecharegistro, usuario, estado, tabla, nameFile, apoyosocial, draw_dataUrl, nameFirma, autorizofirma, idseguimiento, firmatitular,draw_dataUrlImage) 
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);`,
        [
          autorizacion.idfiu, autorizacion.idintegrante, autorizacion.entidad,
          autorizacion.diligenciadopor, autorizacion.acepto, autorizacion.fecharegistro, autorizacion.usuario, autorizacion.estado,
          autorizacion.tabla, autorizacion.nameFile, autorizacion.apoyosocial, autorizacion.draw_dataUrl, autorizacion.nameFirma,
          autorizacion.autorizofirma, autorizacion.idseguimiento, autorizacion.firmatitular,autorizacion.draw_dataUrlImage,
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
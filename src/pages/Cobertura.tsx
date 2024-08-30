import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonList, useIonViewDidEnter, IonLabel, IonItem, IonAccordion, IonAccordionGroup, IonSearchbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from "axios";
import loadSQL from '../models/database';
import './ProgressBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { isPlatform } from '@ionic/react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';



interface LocalizacionEvento {
  idfiu: number;
  fechaentrevista: string | null;
  codigosticker: string | null;
  solicitudrequerimiento: string | null;
  direccion: string | null;
  comuna: number | null;
  barrio: number | null;
  ruralurbano: number | null;
  sector: string | null;
  telefono1: string | null;
  telefono2: string | null;
  correo: string | null;
  estrato: number | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
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
interface TiempoEnLaVivienda {
  idfiu: number;
  tiempovivienda: number | null;
  tiempoviviendaunidad: string | null;
  tiempomedellin: number | null;
  tiempomedellinunidad: string | null;
  dondeviviaantes: number | null;
  otrodepartamento: string | null;
  otropais: string | null;
  otromunicipio: string | null;
  otracomuna: string | null;
  otrobarrio: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}

interface TenenciaYDocumentosVivienda {
  idfiu: number;
  tenenciadelavivienda: number | null;
  propietario: string | null;
  propietariotel1: string | null;
  propietariotel2: string | null;
  escritura: number | null;
  compraventa: number | null;
  promesa: number | null;
  posesion: number | null;
  impuestopredial: number | null;
  serviciospublicos: number | null;
  matriculapredial: number | null;
  extrajuicio: number | null;
  ninguno: number | null;
  otro: number | null;
  cualdocumentos: string | null;
  unidadproductuva: number | null;
  cualunidadproductiva: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}
interface ServiciosPublicos {
  idfiu: number;
  energia: number | null;
  acueducto: number | null;
  alcantarillado: number | null;
  gas: number | null;
  telefono: number | null;
  telefonofijo: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}
interface Integrante {
  idintegrante: number;
  idfiu: number | null;
  codigosibis: string | null;
  tipodedocumento: number | null;
  nacionalidad: number | null;
  numerodedocumento: string | null;
  nombre1: string | null;
  nombre2: string | null;
  apellido1: string | null;
  apellido2: string | null;
  fechadenacimiento: string | null;
  sexo: number | null;
  orientacionsexual: number | null;
  identidaddegenero: number | null;
  etnia: number | null;
  estadocivil: number | null;
  gestantelactante: string | null;
  escolaridad: number | null;
  parentesco: number | null;
  discapacidad: number | null;
  regimendesalud: number | null;
  enfermedades: number | null;
  actividad: number | null;
  ocupacion: number | null;
  estadousuario: number | null;
  campesino: number | null;
  desplazado: number | null;
  sisbenizado: number | null;
  victima: number | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
  origen: string | null;
  condicionespecial: string | null;
  otrocondicionespecial: string | null;
}
interface Mascotas {
  idfiu: number;
  tienemascotas: number | null;
  cuantos: number | null;
  cuales: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}

interface RedDeApoyo {
  idredapoyo: number;
  idfiu: number | null;
  ubicacion: string | null;
  nombreauto: string | null;
  parentesco: string | null;
  direccion: string | null;
  comuna: string | null;
  barrio: string | null;
  ruralurbano: string | null;
  sector: string | null;
  telefono1: string | null;
  telefono2: string | null;
  dirCampo1: string | null;
  dirCampo2: string | null;
  dirCampo3: string | null;
  dirCampo4: string | null;
  dirCampo5: string | null;
  dirCampo6: string | null;
  dirCampo7: string | null;
  dirCampo8: string | null;
  dirCampo9: string | null;
  pais: string | null;
  departamento: string | null;
  municipio: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}

interface InfraccionSocioeconomico {
  idfiu: number;
  ingreso_empleo_formal: number;
  ingreso_empleo_informal: number;
  ingreso_subsidio: number;
  ingreso_pension: number;
  ingreso_ayuda: number;
  ingreso_otro: number;
  ingreso_total: number;
  egreso_alimentacion: number;
  egreso_educacion: number;
  egreso_arriendo: number;
  egreso_servicios: number;
  egreso_salud: number;
  egreso_transporte: number;
  egreso_deuda: number;
  egreso_otro: number;
  egreso_total: number;
  fecharegistro: string | null;
  usuario: string | null;
  estado: string | null;
  tabla: string | null;
}

interface Observaciones {
  idfiu: number;
  observacion: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}

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
  draw_dataUrlImage: Blob | null;
  nameFile: string | null;
  apoyosocial: string | null;
  draw_dataUrl: Blob | null;
  nameFirma: string | null;
  autorizofirma: string | null;
  idseguimiento: number | null;
  firmatitular: string | null;
}
interface RedApoyoIntegrantes {
  idfiu: number;
  reddeapoyo: number | null;
  fecharegistro: string | null; // Usando string para datetime, ya que TypeScript no tiene un tipo datetime nativo.
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}


async function getFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('myDatabase', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('sqliteStore')) {
        db.createObjectStore('sqliteStore');
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('sqliteStore')) {
        resolve(null);
        return;
      }

      const transaction = db.transaction(['sqliteStore'], 'readonly');
      const store = transaction.objectStore('sqliteStore');
      const getRequest = store.get('sqliteDb');

      getRequest.onsuccess = (event) => {
        const data = event.target.result;
        if (data) {
          resolve(data);
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = (event) => {
        reject(event.target.error);
      };
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}


const Cobertura: React.FC = () => {

  const [db, setDb] = useState<any>(null);
  const [localizacioneventos, setLocalizacionEventos] = useState<LocalizacionEvento[]>([]);  
  const [tiempoEnLaVivienda, setTiempoEnLaVivienda] = useState<TiempoEnLaVivienda[]>([]);
  const [tenenciaYDocumentosVivienda, setTenenciaYDocumentosVivienda] = useState<TenenciaYDocumentosVivienda[]>([]);
  const [serviciosPublicos, setServiciosPublicos] = useState<ServiciosPublicos[]>([]);
  const [integrante, setIntegrante] = useState<Integrante[]>([]);
  const [mascotas, setMascotas] = useState<Mascotas[]>([]);
  const [redDeApoyo, setRedDeApoyo] = useState<RedDeApoyo[]>([]);  
  const [redApoyoIntegrantes, setRedApoyoIntegrantes] = useState<RedApoyoIntegrantes[]>([]);
  const [socioEconomico, setSocioEconomico] = useState<InfraccionSocioeconomico[]>([]);
  const [observaciones, setObservaciones] = useState<Observaciones[]>([]);
  const [autorizacion, setAutorizacion] = useState<Autorizacion[]>([]);


  const [sincro, setSincro] = useState<any>(false);
  const [porcentaje, setPorcentaje] = useState<any>(1);
  const [showModal, setShowModal] = useState(false);
  const [dbContent, setDbContent] = useState<Uint8Array | null>(null);

  useEffect(() => {
    const fetchDatabaseContent = async () => {
      const savedDb = await getFromIndexedDB();
      if (savedDb) {
        setDbContent(new Uint8Array(savedDb));
      } else {
        console.error('No database found in IndexedDB');
      }
    };

    fetchDatabaseContent();
  }, []);

  const getCurrentDateTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  };

  const downloadFile = async () => {
    if (!dbContent) {
      console.error('No database content to download');
      return;
    }

    const fileName = `${localStorage.getItem('cedula')}_${getCurrentDateTime()}.sqlite`;
    const blob = new Blob([dbContent], { type: 'application/octet-stream' });

    if (isPlatform('hybrid')) {
      try {
        const base64Data = await convertBlobToBase64(blob);
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data as string,
          directory: Directory.Documents,
        });

        alert('Archivo descargado exitosamente, busque el archivo en almacenamiento Documents');
      } catch (error) {
        console.error('Error al guardar el archivo:', error);
        alert('Error al guardar el archivo');
      }
    } else {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const convertBlobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };


  // hook for sqlite db


  useEffect(() => {
    const syncData = async () => {
      await loadSQL(setDb, fetchLocalizacionEvento);
      await fetchTiempoEnLaVivienda();
      await fetchTenenciaYDocumentosVivienda();
      await fetchServiciosPublicos();
      await fetchIntegrante();
      await fetchMascotas();
      await fetchRedDeApoyo();
      await fetchRedApoyoIntegrantes();
      await fetchSocioEconomico();
      await fetchObservaciones();
      await fetchAutorizacion();
 
    };
    syncData();
  }, []);

  useEffect(() => {
    const syncData = async () => {
       await fetchLocalizacionEvento();
      await fetchTiempoEnLaVivienda();
      await fetchTenenciaYDocumentosVivienda();
      await fetchServiciosPublicos();
      await fetchIntegrante();
      await fetchMascotas();
      await fetchRedDeApoyo();      
      await fetchObservaciones();
      await fetchAutorizacion();
      await fetchRedApoyoIntegrantes();
      await fetchSocioEconomico();

 
    };
    syncData();
  }, [db]);



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



  const fetchLocalizacionEvento = async (database = db) => {
    if (database) {
      const res = await database.exec('SELECT * FROM "infraccion_localizacion";');
      if (res[0]?.values && res[0]?.columns) {
        const transformedEventos: LocalizacionEvento[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as LocalizacionEvento);
        });
        setLocalizacionEventos(transformedEventos); // Asegúrate de que `setEventos` es la función correcta para actualizar el estado con los nuevos datos
      }
    }
  };

  const fetchTiempoEnLaVivienda = async (database = db) => {
     if (database) {
       const res = await database.exec('SELECT * FROM "infraccion_tiempo_vivienda";');
       if (res[0]?.values && res[0]?.columns) {
         const transformedTiempos: TiempoEnLaVivienda[] = res[0].values.map((row: any[]) => {
           return res[0].columns.reduce((obj, col, index) => {
             obj[col] = row[index];
             return obj;
           }, {} as TiempoEnLaVivienda);
         });
         setTiempoEnLaVivienda(transformedTiempos); // Asegúrate de que `setTiempoEnLaVivienda` es la función correcta para actualizar el estado con los nuevos datos
       }
     }
  };

  const fetchTenenciaYDocumentosVivienda = async (database = db) => {
     if (database) {
       const res = await database.exec('SELECT * FROM "infraccion_tenencia_vivienda";');
       if (res[0]?.values && res[0]?.columns) {
         const transformedDocumentos: TenenciaYDocumentosVivienda[] = res[0].values.map((row: any[]) => {
           return res[0].columns.reduce((obj, col, index) => {
             obj[col] = row[index];
             return obj;
           }, {} as TenenciaYDocumentosVivienda);
         });
         setTenenciaYDocumentosVivienda(transformedDocumentos); // Asegúrate de que `setTenenciaYDocumentosVivienda` es la función correcta para actualizar el estado con los nuevos datos
       }
     }
  };

  const fetchServiciosPublicos = async (database = db) => {
     if (database) {
       const res = await database.exec('SELECT * FROM "infraccion_servicios_publicos";');
       if (res[0]?.values && res[0]?.columns) {
         const transformedServicios: ServiciosPublicos[] = res[0].values.map((row: any[]) => {
           return res[0].columns.reduce((obj, col, index) => {
             obj[col] = row[index];
             return obj;
           }, {} as ServiciosPublicos);
         });
         setServiciosPublicos(transformedServicios); // Asegúrate de que `setServiciosPublicos` es la función correcta para actualizar el estado con los nuevos datos
       }
     }
  };

  const fetchIntegrante = async (database = db) => {
     if (database) {
       const res = await database.exec('SELECT * FROM "infraccion_integrante_familiar";');
       if (res[0]?.values && res[0]?.columns) {
         const transformedIntegrantes: Integrante[] = res[0].values.map((row: any[]) => {
           return res[0].columns.reduce((obj, col, index) => {
             obj[col] = row[index];
             return obj;
           }, {} as Integrante);
         });
         setIntegrante(transformedIntegrantes); // Asegúrate de que `setIntegrante` es la función correcta para actualizar el estado con los nuevos datos
       }
     }
  };

  const fetchMascotas = async (database = db) => {
     if (database) {
       const res = await database.exec('SELECT * FROM "infraccion_mascotas";');
       if (res[0]?.values && res[0]?.columns) {
         const transformedMascotas: Mascotas[] = res[0].values.map((row: any[]) => {
           return res[0].columns.reduce((obj, col, index) => {
             obj[col] = row[index];
             return obj;
           }, {} as Mascotas);
         });
         setMascotas(transformedMascotas); // Asegúrate de que `setMascotas` es la función correcta para actualizar el estado con los nuevos datos
       }
     }
  };

  const fetchRedDeApoyo = async (database = db) => {
     if (database) {
       const res = await database.exec('SELECT * FROM "infraccion_integrante_red_apoyo";');
       if (res[0]?.values && res[0]?.columns) {
         const transformedRed: RedDeApoyo[] = res[0].values.map((row: any[]) => {
           return res[0].columns.reduce((obj, col, index) => {
             obj[col] = row[index];
             return obj;
           }, {} as RedDeApoyo);
         });
         setRedDeApoyo(transformedRed); // Asegúrate de que `setRedDeApoyo` es la función correcta para actualizar el estado con los nuevos datos
       }
     }
  };

  const fetchSocioEconomico = async (database = db) => {
     if (database) {
       const res = await database.exec('SELECT * FROM "infraccion_socioeconomico";');
       if (res[0]?.values && res[0]?.columns) {
         const transformedAyudas: InfraccionSocioeconomico[] = res[0].values.map((row: any[]) => {
           return res[0].columns.reduce((obj, col, index) => {
             obj[col] = row[index];
             return obj;
           }, {} as InfraccionSocioeconomico);
         });
         setSocioEconomico(transformedAyudas); // Asegúrate de que `setAyudasEntregadas` es la función correcta para actualizar el estado con los nuevos datos
       }
     }
  };

  const fetchObservaciones = async (database = db) => {
     if (database) {
       const res = await database.exec('SELECT * FROM "infraccion_observaciones";');
       if (res[0]?.values && res[0]?.columns) {
         const transformedObservaciones: Observaciones[] = res[0].values.map((row: any[]) => {
           return res[0].columns.reduce((obj, col, index) => {
             obj[col] = row[index];
             return obj;
           }, {} as Observaciones);
         });
         setObservaciones(transformedObservaciones); // Asegúrate de que `setObservaciones` es la función correcta para actualizar el estado con los nuevos datos
       }
     }
  };

  const fetchAutorizacion = async (database = db) => {
     if (database) {
       const res = await database.exec('SELECT * FROM "infraccion_autorizacion";');
       if (res[0]?.values && res[0]?.columns) {
         const transformedAutorizaciones: Autorizacion[] = res[0].values.map((row: any[]) => {
           return res[0].columns.reduce((obj, col, index) => {
             obj[col] = row[index];
             return obj;
           }, {} as Autorizacion);
         });
         setAutorizacion(transformedAutorizaciones); // Asegúrate de que `setAutorizacion` es la función correcta para actualizar el estado con los nuevos datos
       }
     }
  };

  const fetchRedApoyoIntegrantes = async (database = db) => {
     if (database) {
       const res = await database.exec('SELECT * FROM "infraccion_red_apoyo";');
       if (res[0]?.values && res[0]?.columns) {
         const transformedRedApoyo: RedApoyoIntegrantes[] = res[0].values.map((row: any[]) => {
           return res[0].columns.reduce((obj, col, index) => {
             obj[col] = row[index];
             return obj;
           }, {} as RedApoyoIntegrantes);
         });
         setRedApoyoIntegrantes(transformedRedApoyo); // Asegúrate de que `setRedApoyoIntegrantes` es la función correcta para actualizar el estado con los nuevos datos
       }
     }
  };



  const sincronizacion = async () => {
    await saveDatabase();
    await fetchLocalizacionEvento(); 
    await fetchTiempoEnLaVivienda();
    await fetchTenenciaYDocumentosVivienda();
    await fetchServiciosPublicos();
    await fetchIntegrante();
    await fetchMascotas();
    await fetchSocioEconomico();
    await fetchObservaciones();
    await fetchAutorizacion();
    await fetchRedApoyoIntegrantes();


    setSincro(true);
    setPorcentaje(0);
    closeModal();
    try {  //https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_localizacion
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_localizacion', localizacioneventos, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(10)
     // await openModal('Error al guardar', 'danger','ligth');
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }

    try {
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_tiempo_vivienda', tiempoEnLaVivienda, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
      setPorcentaje(20)
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }

    try {
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_tenencia_vivienda', tenenciaYDocumentosVivienda, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
      setPorcentaje(30)
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }

    try {
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_servicios_publicos', serviciosPublicos, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
      setPorcentaje(40)
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_mascotas', mascotas, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(50)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_integrante_red_apoyo', redDeApoyo, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(60)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }

    try {
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_red_apoyo', redApoyoIntegrantes, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(65)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }
    
    
    
    
    try {
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_integrante_familiar', integrante, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(70)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_socioeconomico', socioEconomico, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(80)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_observaciones', observaciones, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(90)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }

// SINCRONIZAR DE BAJADA USUARIOS
    try {
      const response = await axios.get('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_info');
      const jsonData = response.data;
     // setProgramas(jsonData);
     console.log(jsonData)
      for (const item of jsonData) {
        await db.run(`INSERT OR REPLACE INTO t1_comision (id_usuario, cedula, contrasena, estado) VALUES (?, ?, ?, ?);`, [
          item.ID_USUARIO, item.CEDULA, item.CONTRASENA,item.ESTADO
        ]);
      }

      saveDatabase();
      fetchLocalizacionEvento();
    } catch (err) {
      console.error('Error al exportar los datos JSON: t1_programas', err);
    }

    try {
      const response = await axios.post('https://zdeiby.castelancarpinteyro.com/apicomision/index.php/Welcome/fc_guardar_infraccion_autorizacion', autorizacion, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      //await openModal('Error al guardar', 'danger','ligth');
      setPorcentaje(100)
      console.log(response.data);
      await openModal('Sincronización efectiva', 'success','light','none');
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }

    setSincro(false);


  }




  const history = useHistory();
  const cedula = localStorage.getItem('cedula'); // Obtener 'cedula' de localStorage

  useEffect(() => {
    // Comprobar si 'cedula' existe, si no, redirigir a 'login'
    if (!cedula) {
      history.push('/login');
    }
  }, [cedula, history]); // Dependencias del efecto



  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const toggleAccordion = () => {
    if (!accordionGroup.current) {
      return;
    }
    const nativeEl = accordionGroup.current;

    if (nativeEl.value === 'second') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'second';
    }
  };

  const handleEditClick = (idfiu: string) => {
    window.location.href = `/tabs/tab3/${idfiu}`;
  };

  const [searchText, setSearchText] = useState('');


  const filteredPeople = localizacioneventos.filter((localizacioneventos) => {
    return (
      (localizacioneventos.estado || '').toString().toLowerCase().includes(searchText.toLowerCase()) ||
      (localizacioneventos.idfiu || '').toString().toLowerCase().includes(searchText.toLowerCase()) ||
      (localizacioneventos.fechaentrevista || '').toString().toLowerCase().includes(searchText.toLowerCase()) ||
      (localizacioneventos.codigosticker || '').toString().toLowerCase().includes(searchText.toLowerCase()) ||
      (localizacioneventos.barrio || '').toString().toLowerCase().includes(searchText.toLowerCase()) ||
      (localizacioneventos.direccion || '').toString().toLowerCase().includes(searchText.toLowerCase()) ||
      (localizacioneventos.fecharegistro || '').toString().toLowerCase().includes(searchText.toLowerCase()) ||
      (localizacioneventos.usuario || '').toString().toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const [modalResolve, setModalResolve] = useState<null | (() => void)>(null);
  const [texto, setTextoModal] = useState<null | (() => void)>(null);
  const [color, setColorModal] = useState<null | (() => void)>(null);
  const [mensaje, setMensaje] = useState<null | (() => void)>(null);
  const [displaymodal, setDisplaymodal] = useState<null | (() => void)>(null);

  const openModal = (mensaje,color,texto,displaymodal='') => {
    setTextoModal(texto);
    setColorModal(color);
    setMensaje(mensaje);
    setDisplaymodal(displaymodal);
    return new Promise<void>((resolve) => {
      setModalResolve(() => resolve);
      setShowModal(true);
    });
  };

  const closeModal = () => {
    setShowModal(false);
    
    if (modalResolve) {
      modalResolve();
    }
  };

  const aceptar = () => {
   setSincro(false)
  };

 
  return (

    <IonPage>
      {(sincro) ? <>
        <div className="container">
          <div className="progress-container">
            <label htmlFor="">Sincronizando</label>
            <div className="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
              <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${porcentaje}%` }}></div>
            </div>
          </div>
        </div>
        <div className={`modal fade ${showModal ? 'show d-block' : 'd-none'} `} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog ">
          <div className={`modal-content bg-${color} text-light`}>
          
              <h1 className="modal-title fs-5" id="staticBackdropLabel"></h1>
            
            <div className="modal-body">
              {mensaje}
            </div>
            <div className="d-flex pt-2 pb-2 p-2 text-right d-flex justify-content-end">
              {/* <button type="button" className="btn btn-light" style={{ display: `${displaymodal}` }} onClick={aceptar}>Cancelar</button>&nbsp;  */}
              <button type="button" className={`btn btn-${color}`}  onClick={closeModal}>Continuar</button>
            </div>
          </div>
        </div>
      </div>
  
        </>


        : <>
          {cedula ? (

            <>
              <IonHeader>
                <IonToolbar>
                  <IonTitle slot="start">Cobertura</IonTitle>
                  <IonButton color="danger" slot="end" onClick={() => {
                    //localStorage.removeItem('cedula');
                    window.location.href = `/tabs/tab3/${Math.random().toString().substr(2, 5)}${cedula}`;
                  }}>Crear Ficha</IonButton>
                  <IonButton slot="end" color="success" onClick={downloadFile}>Descargar bd</IonButton>
                  <IonButton slot="end" onClick={() => {
                    localStorage.removeItem('cedula');
                    history.push('/login'); // Redirigir a login después de borrar 'cedula'
                  }}>Cerrar Sesión</IonButton>
                </IonToolbar>
              </IonHeader>
              <IonContent fullscreen>

                <IonList>
                  <IonItem lines="none">
                    <div className="ion-align-items-center" style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                      <IonLabel style={{ width: '20%' }}>Opciones</IonLabel>
                      <IonLabel style={{ width: '25%' }}>Estado ficha</IonLabel>
                      <IonLabel style={{ width: '25%' }}>Ficha</IonLabel>
                      <IonLabel style={{ width: '25%' }}>Profesional</IonLabel>
                    </div>
                  </IonItem>
                </IonList>

                <IonList>
                  {filteredPeople.map((localizacioneventos, idx) =>
                    <IonAccordionGroup key={idx}>
                      <IonAccordion value="first">
                        <IonItem slot="header" color="light">
                          <IonLabel>
                            <IonButton onClick={() => handleEditClick(localizacioneventos.idfiu)}>
                              Editar
                            </IonButton>
                          </IonLabel>
                          <IonLabel>
                            <h2>{(localizacioneventos.estado == '1') ? 'Abierta' : 'Cerrada'}</h2>
                          </IonLabel>
                          <IonLabel>
                            <h2>{localizacioneventos.idfiu}</h2>
                          </IonLabel>
                          <IonLabel>
                            <h2>{localizacioneventos.usuario}</h2>
                          </IonLabel>


                        </IonItem>

                        <div className="ion-padding" slot="content">
                          <IonList>

                            <IonItem>
                              <IonLabel>
                                <p>Fecha de entrevista</p>
                                <h2>{localizacioneventos.fechaentrevista}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Télefono</p>
                                <h2>{localizacioneventos.telefono1}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Código Sticker</p>
                                <h2>{localizacioneventos.codigosticker}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Dirección</p>
                                <h2>{localizacioneventos.direccion}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Fecha Registro</p>
                                <h2>{localizacioneventos.fecharegistro}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Tipo de evento</p>
                                <h2>{localizacioneventos.tipo}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Comuna</p>
                                <h2>{localizacioneventos.comuna}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Barrio</p>
                                <h2>{localizacioneventos.barrio}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Sector</p>
                                <h2>{localizacioneventos.name}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Dirección</p>
                                <h2>{localizacioneventos.name}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Profesional</p>
                                <h2>{localizacioneventos.usuario}</h2>
                              </IonLabel>
                            </IonItem>
                            <IonItem>
                              <IonLabel>
                                <p>Digitador</p>
                                <h2>{localizacioneventos.name}</h2>
                              </IonLabel>
                            </IonItem>
                          </IonList>
                        </div>
                      </IonAccordion>

                    </IonAccordionGroup>


                  )}
                </IonList>

              </IonContent>
              <IonSearchbar
                value={searchText}
                onIonInput={(e) => setSearchText(e.detail.value)}
                placeholder="Buscar por estado, ficha, nombre, etc."
              />
              <IonButton onClick={sincronizacion}>Sincronización subida de información</IonButton>

            </>
          ) : ''}

        </>}
    </IonPage>
  );
};

export default Cobertura;

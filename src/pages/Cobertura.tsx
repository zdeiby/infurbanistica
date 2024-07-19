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


interface Person {
  fichasocial: number;
  fichatecnia: string;
  motivovisita: number;
  tipovisita: string;
  horaactivacion: string;
  horaatencion: string;
  fechavisita: string;
  fecharegistro: string;
  usuario: number;
  estado: string;
  tabla: string;
  tipo: number;
  declaradafallida: string | null;
  ficharecuperda: string | null;
  horallegadaalevento: string;
  remitir: string | null;
  remitir2: string | null;
}

interface IdentificacionEvento {
  fichasocial: number;
  visitadagrd: string | null;
  tipoevento: number | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
  otro: string | null;
  quebrada: string | null;
  inquilinato: string | null;
}

interface LocalizacionEvento {
  idfiu: number;
  fechaentrevista: string | null;
  codigosticker: string | null;
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

interface EvacuacionYDanios {
  fichasocial: number;
  tipoevacuacion: number | null;
  danosvivienda: number | null;
  danosenseres: number | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}

interface DatosDeLaVivienda {
  fichasocial: number;
  tipovivienda: number | null;
  materialpisos: number | null;
  materialpisosotro: string | null;
  materialparedes: number | null;
  materialtechos: number | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}
interface ServiciosPublicos {
  fichasocial: number;
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

interface TiempoEnLaVivienda {
  fichasocial: number;
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
  fichasocial: number;
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

interface ConformacionFamiliar {
  fichasocial: number;
  tipodefamilia: number | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
  observacion: string | null;
  nameFile: string | null;
}

interface DatosGeneralesRemisiones {
  idremision: number;
  idintegrante: number;
  fichasocial: number;
  programa: number;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
  observacion: string | null;
  motivo: string | null;
}

interface RedDeApoyo {
  idredapoyo: number;
  fichasocial: number | null;
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
interface AyudasEntregadas {
  idayudas: number;
  fichasocial: number;
  paquetealimentario: number | null;
  tipoa: number | null;
  tipob: number | null;
  tipoc: number | null;
  noalimentarias: number | null;
  quienoa: string | null;
  factura: string | null;
  dcocina: number | null;
  daseohogar: number | null;
  daseofamiliar: number | null;
  dasehombre: number | null;
  daseomujer: number | null;
  daseonna: number | null;
  daseoinfantil: number | null;
  daseoespecial: number | null;
  dcolchonetas: number | null;
  dcobijas: number | null;
  dsabanas: number | null;
  dalmohadas: number | null;
  enitdad: string | null;
  otros: number | null;
  cuales: string | null;
  entidadotros: string | null;
  fechadeentrega: string | null;
  idintegrante: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
  tipoentraga: number | null;
  ococina: number | null;
  acocina: number | null;
  oaseohogar: number | null;
  aaseohogar: number | null;
  oaseofamiliar: number | null;
  aaseofamiliar: number | null;
  oasehombre: number | null;
  aasehombre: number | null;
  oaseomujer: number | null;
  aaseomujer: number | null;
  oaseonna: number | null;
  aaseonna: number | null;
  oaseoinfantil: number | null;
  aaseoinfantil: number | null;
  oaseoespecial: number | null;
  aaseoespecial: number | null;
  ocolchonetas: number | null;
  acolchonetas: number | null;
  ocobijas: number | null;
  acobijas: number | null;
  osabanas: number | null;
  asabanas: number | null;
  oalmohadas: number | null;
  aalmohadas: number | null;
  quienpaq: string | null;
  cualpaq: string | null;
  quienasis: string | null;
  cualasis: string | null;
  asistencialiamentaria: number | null;
  redentrega: number | null;
  entregado: number | null;
  observacion: string | null;
  paquete1: string | null;
  paquete2: string | null;
  paquete3: string | null;
  paquete4: string | null;
  documentorecibeayuda: string | null;
  nombrerecibeayuda: string | null;
  nameFirma: string | null;
  draw_dataUrl: Blob | null;
}

interface Integrante {
  idintegrante: number;
  fichasocial: number | null;
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
}
interface Mascotas {
  fichasocial: number;
  tienemascotas: number | null;
  cuantos: number | null;
  cuales: string | null;
  albergalos: string | null;
  dondelista: string | null;
  donde: string | null;
  requierealbergue: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}
interface UbicacionPosteriorAtencionSocial {
  fichasocial: number;
  ubicacionposterior: number;
  cualtemporal: string | null;
  dondeauxilio: string | null;
  nombreauto: string | null;
  parentesco: string | null;
  prestada: string | null;
  cuallugardistinto: string | null;
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
  ubicacion: string | null;
  pais: string | null;
  departamento: string | null;
  municipio: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}
interface IntegrantesUbicacionPos {
  idintegrante: number;
  fichasocial: number;
  ubicacionposterior: number | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}
interface Observaciones {
  fichasocial: number;
  observacion: string | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}

interface Autorizacion {
  fichasocial: number;
  idintegrante: number | null;
  entidad: string | null;
  requerieseguimiento: number | null;
  fechaprobable: string | null;
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
interface Remisiones {
  fichasocial: number;
  remisiones: number | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
}

interface RedApoyoIntegrantes {
  fichasocial: number;
  reddeapoyo: number | null;
  fecharegistro: string | null;
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
  const [people, setPeoplec0] = useState<Person[]>([]);
  const [eventos, setEventos] = useState<IdentificacionEvento[]>([]);
  const [localizacioneventos, setLocalizacionEventos] = useState<LocalizacionEvento[]>([]);
  const [evacuacionYDanios, setEvacuacionYDanios] = useState<EvacuacionYDanios[]>([]);
  const [datosDeLaVivienda, setDatosDeLaVivienda] = useState<DatosDeLaVivienda[]>([]);
  const [serviciosPublicos, setServiciosPublicos] = useState<ServiciosPublicos[]>([]);
  const [tiempoEnLaVivienda, setTiempoEnLaVivienda] = useState<TiempoEnLaVivienda[]>([]);
  const [tenenciaYDocumentosVivienda, setTenenciaYDocumentosVivienda] = useState<TenenciaYDocumentosVivienda[]>([]);
  const [conformacionFamiliar, setConformacionFamiliar] = useState<ConformacionFamiliar[]>([]);
  const [datosGeneralesRemisiones, setDatosGeneralesRemisiones] = useState<DatosGeneralesRemisiones[]>([]);
  const [redDeApoyo, setRedDeApoyo] = useState<RedDeApoyo[]>([]);
  const [ayudasEntregadas, setAyudasEntregadas] = useState<AyudasEntregadas[]>([]);
  const [integrante, setIntegrante] = useState<Integrante[]>([]);
  const [mascotas, setMascotas] = useState<Mascotas[]>([]);
  const [ubicacionPosterior, setUbicacionPosterior] = useState<UbicacionPosteriorAtencionSocial[]>([]);
  const [integrantesUbicacionPos, setIntegrantesUbicacionPos] = useState<IntegrantesUbicacionPos[]>([]);
  const [observaciones, setObservaciones] = useState<Observaciones[]>([]);
  const [autorizacion, setAutorizacion] = useState<Autorizacion[]>([]);
  const [remisiones, setRemisiones] = useState<Remisiones[]>([]);
  const [redApoyoIntegrantes, setRedApoyoIntegrantes] = useState<RedApoyoIntegrantes[]>([]);
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
      await loadSQL(setDb, fetchUsers);
      await fetchIdentificacionEvento();
      await fetchLocalizacionEvento();
      await fetchEvacuacionYDanios();
      await fetchDatosDeLaVivienda();
      await fetchServiciosPublicos();
      await fetchTiempoEnLaVivienda();
      await fetchTenenciaYDocumentosVivienda();
      await fetchConformacionFamiliar();
      await fetchDatosGeneralesRemisiones();
      await fetchRedDeApoyo();
      await fetchAyudasEntregadas()
      await fetchIntegrante();
      await fetchMascotas();
      await fetchUbicacionPosterior();
      await fetchIntegrantesUbicacionPos();
      await fetchObservaciones();
      await fetchAutorizacion();
      await fetchRemisiones();
      await fetchRedApoyoIntegrantes();
    };
    syncData();
  }, []);

  useEffect(() => {
    const syncData = async () => {
      await fetchIdentificacionEvento();
      await fetchLocalizacionEvento();
      await fetchEvacuacionYDanios();
      await fetchDatosDeLaVivienda();
      await fetchServiciosPublicos();
      await fetchTiempoEnLaVivienda();
      await fetchTenenciaYDocumentosVivienda();
      await fetchConformacionFamiliar();
      await fetchDatosGeneralesRemisiones();
      await fetchRedDeApoyo();
      await fetchAyudasEntregadas()
      await fetchIntegrante();
      await fetchMascotas();
      await fetchUbicacionPosterior();
      await fetchIntegrantesUbicacionPos();
      await fetchObservaciones();
      await fetchAutorizacion();
      await fetchRemisiones();
      await fetchRedApoyoIntegrantes();
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


  const fetchUsers = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c0_informaciondelevento";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as Person);
    //     });
    //     setPeoplec0(transformedPeople);

    //   }
    // }

  };

  const fetchIdentificacionEvento = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c1_identificacionevento";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedEventos: IdentificacionEvento[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as IdentificacionEvento);
    //     });
    //     setEventos(transformedEventos);
    //   }
    // }
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

  const fetchEvacuacionYDanios = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c3_evacuacionydanos";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedDanios: EvacuacionYDanios[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as EvacuacionYDanios);
    //     });
    //     setEvacuacionYDanios(transformedDanios); // Asegúrate de que `setEvacuacionYDanios` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };

  const fetchDatosDeLaVivienda = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c4_datosdelavivienda";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedViviendas: DatosDeLaVivienda[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as DatosDeLaVivienda);
    //     });
    //     setDatosDeLaVivienda(transformedViviendas); // Asegúrate de que `setDatosDeLaVivienda` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };
  const fetchServiciosPublicos = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c5_serviciospublicos";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedServicios: ServiciosPublicos[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as ServiciosPublicos);
    //     });
    //     setServiciosPublicos(transformedServicios); // Asegúrate de que `setServiciosPublicos` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };
  const fetchTiempoEnLaVivienda = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c6_tiempoenlavivienda";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedTiempos: TiempoEnLaVivienda[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as TiempoEnLaVivienda);
    //     });
    //     setTiempoEnLaVivienda(transformedTiempos); // Asegúrate de que `setTiempoEnLaVivienda` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };

  const fetchTenenciaYDocumentosVivienda = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c78_tenenciaydocumentosvivienda";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedDocumentos: TenenciaYDocumentosVivienda[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as TenenciaYDocumentosVivienda);
    //     });
    //     setTenenciaYDocumentosVivienda(transformedDocumentos); // Asegúrate de que `setTenenciaYDocumentosVivienda` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };

  const fetchConformacionFamiliar = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c9_conformacionfamiliar";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedFamilias: ConformacionFamiliar[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as ConformacionFamiliar);
    //     });
    //     setConformacionFamiliar(transformedFamilias); // Asegúrate de que `setConformacionFamiliar` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };

  const fetchDatosGeneralesRemisiones = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c10_datosgeneralesremisiones";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedRemisiones: DatosGeneralesRemisiones[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as DatosGeneralesRemisiones);
    //     });
    //     setDatosGeneralesRemisiones(transformedRemisiones); // Asegúrate de que `setDatosGeneralesRemisiones` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };

  const fetchRedDeApoyo = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c11_reddeapoyo";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedRed: RedDeApoyo[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as RedDeApoyo);
    //     });
    //     setRedDeApoyo(transformedRed); // Asegúrate de que `setRedDeApoyo` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };
  const fetchAyudasEntregadas = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c12_ayudasentregadas";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedAyudas: AyudasEntregadas[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as AyudasEntregadas);
    //     });
    //     setAyudasEntregadas(transformedAyudas); // Asegúrate de que `setAyudasEntregadas` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };

  const fetchIntegrante = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c131_integrante";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedIntegrantes: Integrante[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as Integrante);
    //     });
    //     setIntegrante(transformedIntegrantes); // Asegúrate de que `setIntegrante` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };

  const fetchMascotas = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c14_mascotas";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedMascotas: Mascotas[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as Mascotas);
    //     });
    //     setMascotas(transformedMascotas); // Asegúrate de que `setMascotas` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };
  const fetchUbicacionPosterior = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c15_ubicacionposterioratencionsocial";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedUbicaciones: UbicacionPosteriorAtencionSocial[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as UbicacionPosteriorAtencionSocial);
    //     });
    //     setUbicacionPosterior(transformedUbicaciones); // Asegúrate de que `setUbicacionPosterior` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };
  const fetchIntegrantesUbicacionPos = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c151_integrantesubicaciopos";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedIntegrantes: IntegrantesUbicacionPos[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as IntegrantesUbicacionPos);
    //     });
    //     setIntegrantesUbicacionPos(transformedIntegrantes); // Asegúrate de que `setIntegrantesUbicacionPos` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };
  const fetchObservaciones = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c16_observaciones";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedObservaciones: Observaciones[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as Observaciones);
    //     });
    //     setObservaciones(transformedObservaciones); // Asegúrate de que `setObservaciones` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };
  const fetchAutorizacion = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c17_autorizacion";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedAutorizaciones: Autorizacion[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as Autorizacion);
    //     });
    //     setAutorizacion(transformedAutorizaciones); // Asegúrate de que `setAutorizacion` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };

  const fetchRemisiones = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c101_remisiones";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedRemisiones: Remisiones[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as Remisiones);
    //     });
    //     setRemisiones(transformedRemisiones); // Asegúrate de que `setRemisiones` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };
  const fetchRedApoyoIntegrantes = async (database = db) => {
    // if (database) {
    //   const res = await database.exec('SELECT * FROM "c111_reddeapoyo";');
    //   if (res[0]?.values && res[0]?.columns) {
    //     const transformedRedApoyo: RedApoyoIntegrantes[] = res[0].values.map((row: any[]) => {
    //       return res[0].columns.reduce((obj, col, index) => {
    //         obj[col] = row[index];
    //         return obj;
    //       }, {} as RedApoyoIntegrantes);
    //     });
    //     setRedApoyoIntegrantes(transformedRedApoyo); // Asegúrate de que `setRedApoyoIntegrantes` es la función correcta para actualizar el estado con los nuevos datos
    //   }
    // }
  };





  const sincronizacion = async () => {
    //await  fetchUsers();
    await fetchIdentificacionEvento();
    await saveDatabase();
    await fetchLocalizacionEvento();
    await fetchEvacuacionYDanios();
    await fetchDatosDeLaVivienda();
    await fetchServiciosPublicos();
    await fetchTiempoEnLaVivienda();
    await fetchTenenciaYDocumentosVivienda();
    await fetchConformacionFamiliar();
    await fetchDatosGeneralesRemisiones();

    await fetchRedDeApoyo();
    await fetchAyudasEntregadas();
    await fetchIntegrante();
    await fetchMascotas();
    await fetchUbicacionPosterior();
    await fetchIntegrantesUbicacionPos();
    await fetchObservaciones();
    await fetchAutorizacion();
    await fetchRemisiones();
    await fetchRedApoyoIntegrantes();
    setSincro(true);
    setPorcentaje(0);
    closeModal();
    try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap0', people, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(5)
     // await openModal('Error al guardar', 'danger','ligth');
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }

    try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap1', eventos, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
      setPorcentaje(10)
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }

    try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap2', localizacioneventos, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
      setPorcentaje(15)
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }

    try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap3', evacuacionYDanios, {
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
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap4', datosDeLaVivienda, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(25)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap5', serviciosPublicos, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(30)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap6', tiempoEnLaVivienda, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(35)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap78', tenenciaYDocumentosVivienda, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(40)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap9', conformacionFamiliar, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(45)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    }



    try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap10', datosGeneralesRemisiones, {
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
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap11', redDeApoyo, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(55)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap12', ayudasEntregadas, {
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
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap131', integrante, {
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
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap14', mascotas, {
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
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap15', ubicacionPosterior, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(75)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap151', integrantesUbicacionPos, {
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
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap16', observaciones, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(85)
      console.log(response.data);
    } catch (error) {
      console.error('Error al guardar los datos', error);
      await openModal('Error al guardar', 'danger','ligth');
      alert('Error al guardar los datos');
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap17', autorizacion, {
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
    } try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap101', remisiones, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPorcentaje(95)
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
      fetchUsers();
    } catch (err) {
      console.error('Error al exportar los datos JSON: t1_programas', err);
    }






    try {
      const response = await axios.post('https://aws.cah.org.co/comision/cah/index.php/app_comisionsocial/welcome/fc_guardarcap111', redApoyoIntegrantes, {
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

    // try {
    //   const response = await axios.get('/jsonstablas/t1_programas.json');
    //   const jsonData = response.data;
    //  // setProgramas(jsonData);

    //   for (const item of jsonData) {
    //     await db.run(`INSERT OR REPLACE INTO t1_programas (id, descripcion, estado, tipo, usuario, tabla, fecharegistro) VALUES (?, ?, ?, ?, ?, ?, ?);`, [
    //       item.id, item.descripcion, item.estado, item.tipo, item.usuario, item.tabla, item.fecharegistro
    //     ]);
    //   }

    //   saveDatabase();
    //   fetchUsers();
    // } catch (err) {
    //   console.error('Error al exportar los datos JSON: t1_programas', err);
    // }

    // try {
    //   const response = await axios.get('/jsonstablas/t1_parentesco.json');
    //   const jsonData = response.data;
    //  // setProgramas(jsonData);

    //   for (const item of jsonData) {
    //     await db.run(`INSERT OR REPLACE INTO t1_parentesco  (id, descripcion, estado) VALUES (?, ?, ?);`, [
    //       item.id, item.descripcion, item.estado
    //     ]);
    //   }

    //   saveDatabase();
    //   fetchUsers();
    // } catch (err) {
    //   console.error('Error al exportar los datos JSON: t1_parentesco ', err);
    // }

    // try {
    //   const response = await axios.get('/jsonstablas/t1_comunas.json');
    //   const jsonData = response.data;
    //  // setProgramas(jsonData);

    //   for (const item of jsonData) {
    //     await db.run(`INSERT OR REPLACE INTO t1_comunas  (id, descripcion, estado) VALUES (?, ?, ?);`, [
    //       item.id, item.descripcion, item.estado
    //     ]);
    //   }

    //   saveDatabase();
    //   fetchUsers();
    // } catch (err) {
    //   console.error('Error al exportar los datos JSON: t1_comunas ', err);
    // }


    // try {
    //   const response = await axios.get('/jsonstablas/t1_barrios.json');
    //   const jsonData = response.data;
    //  // setProgramas(jsonData);

    //   for (const item of jsonData) {
    //     await db.run(`INSERT OR REPLACE INTO t1_barrios   (id, descripcion, comuna, estado) VALUES (?, ?, ?, ?);`, [
    //       item.id, item.descripcion, item.comuna, item.estado, 
    //     ]);
    //   }

    //   saveDatabase();
    //   fetchUsers();
    // } catch (err) {
    //   console.error('Error al exportar los datos JSON: t1_barrios  ', err);
    // }


    // try {
    //   const response = await axios.get('/jsonstablas/t1_ubicacionposterior.json');
    //   const jsonData = response.data;
    //  // setProgramas(jsonData);

    //   for (const item of jsonData) {
    //     await db.run(`INSERT OR REPLACE INTO t1_ubicacionposterior (id, descripcion, estado) VALUES (?, ?, ?);`, [
    //       item.id, item.descripcion, item.estado, 
    //     ]);
    //   }

    //   saveDatabase();
    //   fetchUsers();
    //   window.alert('sincronizacion exitosa')
    // } catch (err) {
    //   console.error('Error al exportar los datos JSON: t1_ubicacionposterior  ', err);
    // }


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

  const handleEditClick = (fichasocial: string) => {
    window.location.href = `/tabs/tab3/${fichasocial}`;
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

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
  idintegrante: number | null;
  fichasocial: number | null;
  programa: number | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
  observacion: string | null;
  motivo: string | null;
}

interface Remision {
  fichasocial: number;
  remisiones: number | null;
  fecharegistro: string | null;
  usuario: number | null;
  estado: number | null;
  tabla: string | null;
  programa: string | null; // nombre del programa
  integrante: string | null; // nombre del integrante
}

interface Integrante {
  idintegrante: number;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  parentesco: string;
  descripcion: String;
}

interface Programa {
  id: number;
  descripcion: string;
  estado: number;
  tipo: number;
  usuario: number;
  tabla: string;
  fecharegistro: string;
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

const Tab10: React.FC = () => {
  const params = useParams<{ ficha: string }>();
  const history = useHistory();

  const [people, setPeople] = useState<Person[]>([]);
  const [remisiones, setRemisiones] = useState<Remision[]>([]);
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [db, setDb] = useState<any>(null);
  const [numRemisiones, setNumRemisiones] = useState(0);
  const [selectedIntegrante, setSelectedIntegrante] = useState(null);
 // const [buttonDisabled, setButtonDisabled] = useState(true);

  const [items, setItems] = useState({
    idintegrante: '',
    fichasocial: params.ficha,
    programa: '',
    fecharegistro: getCurrentDateTime(),
    usuario: localStorage.getItem('cedula') || '',
    estado: '1',
    tabla: 'c10_datosgeneralesremisiones',
    observacion: '',
    motivo: '',
  });

  useEffect(() => {
    loadSQL(setDb, () => {
      fetchUsers();
      fetchRemisiones();
      fetchProgramas();
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
      const res = await db.exec(`SELECT * FROM c10_datosgeneralesremisiones WHERE fichasocial=${params.ficha}`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Person);
        });
        setPeople(transformedPeople);
       // setButtonDisabled((transformedPeople[0].tipodefamilia)?false:true);  
      } else {
        setItems({
          ...items,
          fecharegistro: getCurrentDateTime(),
          usuario: parseInt(localStorage.getItem('cedula') || '0', 10),
        });
      }

      const integrantesRes = await db.exec(`
        SELECT ig.idintegrante, ig.nombre1, ig.nombre2, ig.apellido1, ig.apellido2, tp.descripcion, ig.parentesco 
        FROM c131_integrante ig
        JOIN t1_parentesco tp ON ig.parentesco=tp.id 
        WHERE fichasocial=${params.ficha}`);
      if (integrantesRes[0]?.values && integrantesRes[0]?.columns) {
        const transformedIntegrantes: Integrante[] = integrantesRes[0].values.map((row: any[]) => {
          return integrantesRes[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Integrante);
        });
        setIntegrantes(transformedIntegrantes);
        console.log(transformedIntegrantes)
      }
    }
  };

  const fetchProgramas = async () => {
    if (db) {
      const res = await db.exec(`SELECT *  FROM t1_programas`);
      if (res[0]?.values && res[0]?.columns) {
        const transformedProgramas: Programa[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Programa);
        });
        setProgramas(transformedProgramas);
      }
    }
  };

  const fetchRemisiones = async () => {
    if (db) {
      const res = await db.exec(`
        SELECT r.*, p.descripcion as programa, p.id as codigoprograma, i.nombre1 || ' ' || i.nombre2 || ' ' || i.apellido1 || ' ' || i.apellido2 AS integrante
        FROM c10_datosgeneralesremisiones r
        JOIN c131_integrante i ON r.idintegrante = i.idintegrante
        JOIN t1_programas p ON r.programa = p.id
        WHERE r.fichasocial=${params.ficha}
      `);
      if (res[0]?.values && res[0]?.columns) {
        const transformedRemisiones: Remision[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Remision);
        });
        setRemisiones(transformedRemisiones);
        setNumRemisiones(transformedRemisiones.length);
      }
    }
  };

  useEffect(() => {
    if (people.length > 0) {
      let data = people[0] || {};
      setItems({
        idintegrante: data.idintegrante || '',
        fichasocial: data.fichasocial || params.ficha,
        programa: data.programa || '',
        fecharegistro: data.fecharegistro || '',
        usuario: data.usuario || '',
        estado: data.estado || '',
        tabla: data.tabla || '',
        observacion: data.observacion || '',
        motivo: data.motivo || '',
      });
    }
  }, [people]);

  useEffect(() => {
    fetchUsers();
    fetchProgramas();
    fetchRemisiones();
  }, [db, params.ficha]);

  const handleInputChange = (event, field) => {
    const { value } = event.target;
    setItems((prevItems) => {
      const newState = { ...prevItems, [field]: value };
      if (field === 'tipodefamilia') {
        newState.programa = value ? '' : '';
        newState.idintegrante = value ? '' : '';
        newState.observacion = value ? '' : '';

      }
      return newState;
    });
  };

  useEffect(() => {
    console.log("Items updated:", items);
  }, [items]);

  const enviar = async () => {
    console.log(items);
    try {
      if (items.tipodefamilia == '1' || items.tipodefamilia == '2' && items.idintegrante !== '') {
        await db.exec(`INSERT OR REPLACE INTO c10_datosgeneralesremisiones (idintegrante, fichasocial, programa, fecharegistro, usuario, estado, tabla, observacion, motivo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            items.idintegrante, items.fichasocial, items.programa, items.fecharegistro, items.usuario, items.estado, items.tabla, items.observacion, items.motivo
          ]);
      }

      if (items.tipodefamilia == '1' || items.tipodefamilia == '2') {
        await db.exec(`INSERT OR REPLACE INTO c101_remisiones (fichasocial, remisiones, fecharegistro, usuario, estado, tabla)
      VALUES (?, ?, ?, ?, ?, ?);`,
          [
            items.fichasocial, 1, items.fecharegistro, items.usuario, items.estado, '101_remisiones'
          ]);
      }

      saveDatabase();
      alert('Datos Guardados con éxito');
      fetchRemisiones(); // Actualizar la lista de remisiones después de guardar
     // setButtonDisabled(false);
      setItems({ idintegrante: '',
        fichasocial: params.ficha,
        programa: '',
        fecharegistro: getCurrentDateTime(),
        usuario: localStorage.getItem('cedula') || '',
        estado: '1',
        tabla: 'c10_datosgeneralesremisiones',
        observacion: '',
        motivo: '',})
    } catch (err) {
      console.error('Error al exportar los datos JSON:', err);
    }
  };

  const eliminarRemision = async (idintegrante, codigoprograma) => {
    console.log('Eliminando remisión:', idintegrante, codigoprograma);
    try {
      await db.exec(`DELETE FROM c10_datosgeneralesremisiones WHERE idintegrante = ? AND programa = ?`, [idintegrante, codigoprograma]);
      console.log('Remisión eliminada en la base de datos');

      setRemisiones(prevRemisiones => {
        const updatedRemisiones = prevRemisiones.filter(remision => remision.idintegrante !== idintegrante || remision.codigoprograma !== codigoprograma);
        setNumRemisiones(updatedRemisiones.length);
        return updatedRemisiones;
      });

      alert('Remisión eliminada con éxito');
    } catch (err) {
      console.error('Error al eliminar la remisión:', err);
    }
  };
  const [showModal, setShowModal] = useState(false);

  const columns = [
    {
      name: 'Ver Observacion',
      selector: row => (
        <>
          <button
            className='btn btn-info btn-sm text-light'
            onClick={() => eliminarRemision(row.idintegrante, row.codigoprograma)}
          >
            eliminar
          </button>&nbsp;
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
      minWidth: '200px'
    },
    {
      name: 'Programa',
      selector: row => row.programa,
      sortable: true,
      style: {
        whiteSpace: 'nowrap',
        overflow: 'visible'
      },
      minWidth: '500px'
    },
    {
      name: 'Integrante',
      selector: row => row.integrante,
      sortable: true,
      style: {
        whiteSpace: 'nowrap',
        overflow: 'visible'
      },
      minWidth: '400px'
    }
  ];
  console.log('remisiones', remisiones)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">10 - DATOS GENERALES (REMISIONES)</IonTitle>
          <IonTitle slot="end">FICHA SOCIAL: <label style={{ color: '#17a2b8' }}>{params.ficha}</label> </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="social-card">
          <span className="label">Ficha social:</span>
          <span className="value">{params.ficha}</span>
        </div>

        <div className='shadow p-3 mb-5 bg-white rounded'>
          <IonList>
            <div className="alert alert-primary" role="alert">
              <span className="badge badge-secondary text-dark">9 - CONFORMACION DEL HOGAR</span>
            </div>
            <div className="row g-3 was-validated">
              <div className="col-sm">
                <label className="form-label">El caso es remitido?</label>
                <select onChange={(e) => handleInputChange(e, 'tipodefamilia')} value={items.tipodefamilia || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                  <option value="">SELECCIONE</option>
                  <option value="3">NO</option>
                  <option value="2">SI - INSPECCION</option>
                  <option value="1">SI - PROGRAMA</option>
                </select>
              </div>
              <div className="col-sm">
                <blockquote className="blockquote text-center">
                  <p className="mb-0"></p>
                  <h6>Numero de remisiones:</h6>
                  <p></p>
                  <p className="mb-0"></p>
                  <h5 id="numerointegrantes">{numRemisiones}</h5>
                  <p></p>
                </blockquote>
              </div>
            </div>
          </IonList>
          {(items.tipodefamilia == '2' || items.tipodefamilia == '1') ? <IonList>
            <div className="row g-3 was-validated">
              <div className="col-sm">
                <label className="form-label">Nombre del programa / Inspeccion</label>
                <select onChange={(e) => handleInputChange(e, 'programa')} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                  <option value="" selected>SELECCIONE</option>
                  {items.tipodefamilia === '1' && programas.filter(programa => programa.tipo === 1).map((programa) => (
                    <option key={programa.id} value={programa.id}>{programa.descripcion}</option>
                  ))}
                  {items.tipodefamilia === '2' && programas.filter(programa => programa.tipo === 2).map((programa) => (
                    <option key={programa.id} value={programa.id}>{programa.descripcion}</option>
                  ))}

                </select>
              </div>
              <div className="col-sm">
                <label className="form-label">Integrante del hogar:</label>
                <select onChange={(e) => handleInputChange(e, 'idintegrante')} value={items.idintegrante} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                  <option value="">SELECCIONE</option>
                    { integrantes
                    .filter(integrante => integrante.parentesco == '1')
                    .map((integrante) => (
                      <option key={integrante.idintegrante} value={integrante.idintegrante}>
                        {`${integrante.nombre1} ${integrante.nombre2} ${integrante.apellido1} ${integrante.apellido2} - ${integrante.descripcion}`}
                      </option>
                    )) } 
                     {(items.tipodefamilia === '1' && items.programa !='1' && items.programa !='2' && items.programa !='' ) ? integrantes
                     .filter(integrante => integrante.parentesco >= '2')
                     .map((integrante) => (
                       <option key={integrante.idintegrante} value={integrante.idintegrante}>
                         {`${integrante.nombre1} ${integrante.nombre2} ${integrante.apellido1} ${integrante.apellido2} - ${integrante.descripcion}`}
                       </option>
                     )) : ''}
                      {/* {(items.programa != '1' || items.programa != '2' || items.programa != '' && items.tipodefamilia == '1') ? integrantes
                     .filter(integrante => integrante.parentesco != '1')
                     .map((integrante) => (
                       <option key={integrante.idintegrante} value={integrante.idintegrante}>
                         {`${integrante.nombre1} ${integrante.nombre2} ${integrante.apellido1} ${integrante.apellido2} - ${integrante.descripcion}`}
                       </option>
                     )) : ''} */}
                   
                </select>
              </div>
            </div><hr />
            <div className="alert alert-primary" role="alert">
              <span className="badge badge-secondary text-dark">OBSERVACIONES</span>
            </div>
            <div className="row g-3 was-validated">
              <div className="col-sm">
                <textarea placeholder="" onChange={(e) => handleInputChange(e, 'observacion')} value={items.observacion} className="form-control" rows="5" required />
              </div>
            </div>
          </IonList> : ''}
        </div>
        <div className='shadow p-3 mb-2 pt-0 bg-white rounded'>
          <IonList>
            <div className="alert alert-primary" role="alert">
              <span className="badge badge-secondary text-dark">INTEGRANTES REMITIDOS</span>
            </div>
            <CustomDataTable
              title="Integrantes"
              data={remisiones}
              columns={columns}
            />
          </IonList>
        </div>

        <br />



        {showModal &&  selectedIntegrante &&(
          <>
            {/* Bootstrap Modal */}
            <div className={`modal ${showModal ? "d-block" : "d-none"} modalnew modal-backdropnew `} tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document"><br /><br /><br />
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body text-center">
                  {selectedIntegrante.observacion}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div><IonButton color="success" onClick={enviar}>Guardar</IonButton><IonButton  routerLink={`/tabs/tab11/${params.ficha}`}>Siguiente</IonButton></div>

      </IonContent>
    </IonPage>
  );
};

export default Tab10;
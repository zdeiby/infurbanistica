import ExploreContainer from '../components/ExploreContainer';
import './Tab4.css';
import React, { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonList, IonButton
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomDataTable from '../components/DataTable';
import loadSQL from '../models/database'; // Asegúrate de tener esta función para cargar tu base de datos SQLite

const Tab12: React.FC = () => {
  const params = useParams();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    loadSQL(setDb, fetchData);
  }, []);

  const fetchData = async (database = db) => {
    if (database) {
      const res = await database.exec(`
        SELECT a.idayudas, a.paquetealimentario, a.asistencialiamentaria, a.noalimentarias, a.otros, a.entregado, a.fechadeentrega, 
               i.idintegrante, i.nombre1, i.nombre2, i.apellido1, i.apellido2
        FROM c12_ayudasentregadas a
        JOIN c131_integrante i ON a.idintegrante = i.idintegrante
        WHERE a.fichasocial = ${params.ficha}
      `);

      if (res[0]?.values && res[0]?.columns) {
        const transformedData = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {});
        });
        setData(transformedData);
      }
    }
  };

  const deleteRecord = async (idayudas) => {
    if (db) {
      try {
        await db.exec(`DELETE FROM c12_ayudasentregadas WHERE idayudas = ${idayudas}`);
        setData(data.filter(item => item.idayudas !== idayudas)); // Actualiza el estado local para reflejar la eliminación
        alert('Registro eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar el registro:', error);
      }
    }
  };

  const columns = [
    {
      name: 'Opciones',
      selector: row => <button className='btn btn-success btn-sm' onClick={() => history.push(`/tabs/tabayudas/${params.ficha}?idayuda=${row.idayudas}`)}>Ver/Editar</button>,
      sortable: true,
    },
    {
      name: 'Eliminar',
      selector: row => <button className='btn btn-danger btn-sm' onClick={() => deleteRecord(row.idayudas)}>Eliminar</button>,
      sortable: true,
    },
    {
      name: 'Paquete alimentario',
      selector: row => row.paquetealimentario === 1 ? 'SI' : 'NO',
      sortable: true,
    },
    {
      name: 'Asistencia alimentaria',
      selector: row => row.asistencialiamentaria === 1 ? 'SI' : 'NO',
      sortable: true,
    },
    {
      name: 'No alimentarias',
      selector: row => row.noalimentarias === 1 ? 'SI' : 'NO',
      sortable: true,
    },
    {
      name: 'Otros',
      selector: row => row.otros === 1 ? 'SI' : 'NO',
      sortable: true,
    },
    {
      name: 'Entregado',
      selector: row => row.entregado === 1 ? 'SI' : 'NO',
      sortable: true,
    },
    {
      name: 'Fecha de entrega',
      selector: row => row.fechadeentrega,
      sortable: true,
    },
    {
      name: 'Integrante',
      selector: row => `${row.nombre1} ${row.nombre2} ${row.apellido1} ${row.apellido2}`,
      sortable: true,
    }
  ];

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

  const enviar = async () => {
    saveDatabase();
    window.alert('Guardado')
    };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">12 - AYUDAS HUMANITARIAS ENTREGADAS</IonTitle>
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
              <span className="badge badge-secondary text-dark">12 - AYUDAS HUMANITARIAS ENTREGADAS</span>
            </div>
            <div className="row g-3 was-validated">
              <div className="col-sm">
                <blockquote className="blockquote text-center">
                  <p className="mb-0"></p>
                  <h6>Numero de ayudas entregadas:</h6>
                  <p></p>
                  <p className="mb-0"></p>
                  <h5 id="numerointegrantes">{data.length}</h5>
                  <p></p>
                </blockquote>
              </div>
            </div>
          </IonList>
        </div>
        <div className='shadow p-3 mb-2 pt-0 bg-white rounded'>
          <IonList>
            <div className="alert alert-primary" role="alert">
              <span className="badge badge-secondary text-dark">AYUDAS REGISTRADAS</span>
              <IonButton routerLink={`/tabs/tabayudas/${params.ficha}`}>
                Ingresar nueva ayuda
              </IonButton>
            </div>
            <CustomDataTable title="Ayudas" data={data} columns={columns} />
          </IonList>
        </div>
        <br />
        <div>
          <IonButton color="success" onClick={enviar}>Guardar</IonButton>
          <IonButton routerLink={`/tabs/tab13/${params.ficha}`}>Siguiente</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab12;

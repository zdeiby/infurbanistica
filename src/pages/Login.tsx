import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonGrid, IonCol, IonRow, IonHeader,IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonList, useIonViewDidEnter, IonLabel, IonItem, IonAccordion, IonAccordionGroup, IonSearchbar } from '@ionic/react';
import axios from "axios";
import loadSQL from '../models/database';
import './Login.css';
import LogoCAH from '../imagenes/logocah.png';

interface Person {
    cedula: string;
    contrasena: string;
  }

const Login = () => {


    //   const handleLogin = () => {
    //     // Aquí puedes manejar el inicio de sesión
    //     console.log(`Username: ${username}`);
    //     console.log(`Password: ${password}`);
    //   };



    
  const [db, setDb] = useState<any>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');



  // hook for sqlite db


  useEffect(() => {
    loadSQL(setDb, fetchUsers);
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
    if (database) {
      const res = await database.exec('SELECT * FROM t1_comision where estado=1;');
      if (res[0]?.values && res[0]?.columns) {
        const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
          return res[0].columns.reduce((obj, col, index) => {
            obj[col] = row[index];
            return obj;
          }, {} as Person);
        });
        setPeople(transformedPeople);
      }
    }

  };


  const sincronizacion = async () => {
    fetchUsers();
    saveDatabase();
    console.log(people)
  

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
      const response = await axios.get('/jsonstablas/t1_programas.json');
      const jsonData = response.data;
     // setProgramas(jsonData);

      for (const item of jsonData) {
        await db.run(`INSERT OR REPLACE INTO t1_programas (id, descripcion, estado, tipo, usuario, tabla, fecharegistro) VALUES (?, ?, ?, ?, ?, ?, ?);`, [
          item.id, item.descripcion, item.estado, item.tipo, item.usuario, item.tabla, item.fecharegistro
        ]);
      }

      saveDatabase();
      fetchUsers();
    } catch (err) {
      console.error('Error al exportar los datos JSON: t1_programas', err);
    }

    try {
      const response = await axios.get('/jsonstablas/t1_parentesco.json');
      const jsonData = response.data;
     // setProgramas(jsonData);

      for (const item of jsonData) {
        await db.run(`INSERT OR REPLACE INTO t1_parentesco  (id, descripcion, estado) VALUES (?, ?, ?);`, [
          item.id, item.descripcion, item.estado
        ]);
      }

      saveDatabase();
      fetchUsers();
    } catch (err) {
      console.error('Error al exportar los datos JSON: t1_parentesco ', err);
    }

    try {
      const response = await axios.get('/jsonstablas/t1_comunas.json');
      const jsonData = response.data;
     // setProgramas(jsonData);

      for (const item of jsonData) {
        await db.run(`INSERT OR REPLACE INTO t1_comunas  (id, descripcion, estado) VALUES (?, ?, ?);`, [
          item.id, item.descripcion, item.estado
        ]);
      }

      saveDatabase();
      fetchUsers();
    } catch (err) {
      console.error('Error al exportar los datos JSON: t1_comunas ', err);
    }
    
    
    try {
      const response = await axios.get('/jsonstablas/t1_barrios.json');
      const jsonData = response.data;
     // setProgramas(jsonData);

      for (const item of jsonData) {
        await db.run(`INSERT OR REPLACE INTO t1_barrios   (id, descripcion, comuna, estado) VALUES (?, ?, ?, ?);`, [
          item.id, item.descripcion, item.comuna, item.estado, 
        ]);
      }

      saveDatabase();
      fetchUsers();
    } catch (err) {
      console.error('Error al exportar los datos JSON: t1_barrios  ', err);
    }

    try {
      const response = await axios.get('/jsonstablas/t1_paises.json');
      const jsonData = response.data;
     // setProgramas(jsonData);

      for (const item of jsonData) {
        await db.run(`INSERT OR REPLACE INTO t1_paises   (id, descripcion, codigo, estado) VALUES (?, ?, ?, ?);`, [
          item.id, item.descripcion, item.codigo, item.estado, 
        ]);
      }

      saveDatabase();
      fetchUsers();
    } catch (err) {
      console.error('Error al exportar los datos JSON: t1_paises  ', err);
    }


    try {
      const response = await axios.get('/jsonstablas/t1_ubicacionposterior.json');
      const jsonData = response.data;
     // setProgramas(jsonData);

      for (const item of jsonData) {
        await db.run(`INSERT OR REPLACE INTO t1_ubicacionposterior (id, descripcion, estado) VALUES (?, ?, ?);`, [
          item.id, item.descripcion, item.estado, 
        ]);
      }

      saveDatabase();
      fetchUsers();
      window.alert('sincronizacion exitosa')
    } catch (err) {
      console.error('Error al exportar los datos JSON: t1_ubicacionposterior  ', err);
    }





  }


        const handleLogin = () => {
            const user = people.find(person => person.cedula === username && person.contrasena === password);
            
            if (user) {
            localStorage.setItem('cedula', username);
            window.location.href = '/cobertura'; // Redirige a la página de inicio
            } else {
            alert('Credenciales incorrectas');
            }
        };

    return (

        <IonPage>
            <IonContent>
                <IonHeader>
                    <IonToolbar >
                        <IonTitle >Infracción Urbanística </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonGrid>
                    <IonCol style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img height="50%" width="50%" src={LogoCAH} alt="Logo" />
                    </IonCol>
                    <IonRow>
                        <IonCol>
                        {(people[0]?.cedula)?    <IonItem >
                                <IonInput label="Usuario" labelPlacement="floating" fill="outline" placeholder="Ingrese Usuario"
                                    value={username}
                                    onIonInput={(e) => setUsername(e.detail.value)}
                                    type="text"
                                />
                            </IonItem> :''}
                        </IonCol>
                    </IonRow>  
                    <IonRow>
                        <IonCol>
                           {(people[0]?.cedula)? <IonItem>
                                <IonInput type="password" label="Contraseña" labelPlacement="floating" fill="outline" placeholder="Ingrese Contraseña"
                                    value={password}
                                    onIonInput={(e) => setPassword(e.detail.value)}
                                />
                            </IonItem> :''}
                        </IonCol>
                    </IonRow>  <hr></hr>
                    {(people[0]?.cedula)?  <IonButton expand="full" color="secondary" onClick={handleLogin}>Iniciar Sesión</IonButton>:''}
                    {(people[0]?.cedula)?'':  <IonButton expand="full" onClick={sincronizacion}>Sincronización bajada de información</IonButton> }

                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Login;


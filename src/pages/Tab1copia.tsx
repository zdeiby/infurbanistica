import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonInput, IonButton, IonItem, IonLabel } from '@ionic/react';
import './Tab1.css';
import React, { useEffect, useState } from 'react';
import initSqlJs from 'sql.js';
import axios from 'axios';
import loadSQL from '../models/database';
import { useHistory, useParams } from 'react-router-dom';

const Tab1Copia: React.FC = () => {

  const [db, setDb] = useState<any>(null);
  const [users, setUsers] = useState<Array<{ id: number, name: string, surname: string, age: number }>>([]);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [age, setAge] = useState('');

  const params = useParams();
 
    const handleClick = async () => {

       console.log(users)

      const params = users;
  
      try {
        const response = await axios.post('https://www.unidadfamiliamedellin.com.co/metodologia2servidor/index.php/infopersonal/c_infopersonalapi/fc_actividadesapi', params, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log(response.data);
        alert('Datos guardados exitosamente');
      } catch (error) {
        console.error('Error al guardar los datos', error);
        alert('Error al guardar los datos');
      }
    };
  

  useEffect(() => {
    loadSQL(setDb, fetchUsers);
  }, []);

  const saveDatabase = () => {
    if (db) {
      const data = db.export();
      localStorage.setItem('sqliteDb', JSON.stringify(Array.from(data)));
    }
  };

  const addUser = () => {
    if (db) {
      db.run('INSERT OR REPLACE INTO users (id, name, surname, age) VALUES (?, ?, ?, ?);', [id, name, surname, age]);
      fetchUsers();
      saveDatabase();
      clearInputFields();
    }
  };

  const deleteUser = (userId: number) => {
    if (db) {
      db.run('DELETE FROM users WHERE id = ?;', [userId]);
      fetchUsers();
      saveDatabase();
    }
  };

  const fetchUsers = (database = db) => {
    if (database) {
      const res = database.exec('SELECT * FROM users;');
      if (res.length > 0) {
        const rows = res[0].values.map((row: any) => ({
          id: row[0],
          name: row[1],
          surname: row[2],
          age: row[3],
        }));
        setUsers(rows);
      }
    }
  };

  const downloadDatabase = () => {
    if (db) {
      const data = db.export();
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'database.sqlite';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const clearInputFields = () => {
    setId(null);
    setName('');
    setSurname('');
    setAge('');
  };

  const handleUserClick = (user) => {
    console.log('User clicked:', user);
    setId(user.id);
    setName(user.name);
    setSurname(user.surname);
    setAge(user.age);
  };

  const history = useHistory();
  const cedula = localStorage.getItem('cedula'); // Obtener 'cedula' de localStorage

  useEffect(() => {
    // Comprobar si 'cedula' existe, si no, redirigir a 'login'
    if (!cedula) {
      history.push('/login');
    }
  }, [cedula, history]); // Dependencias del efecto



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">0 INFORMACION DEL EVENTO </IonTitle>  
          <IonTitle slot="end">FICHA SOCIAL: 40093 </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="container">
        
          <div className="input-container">
            <IonItem>
              <IonLabel position="floating">ID (opcional) </IonLabel>
              <IonInput
                type="number"
                value={id === null ? '' : id}
                 onIonInput={(e) => setId(e.detail.value ? parseInt(e.detail.value, 10) : null)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">nombre {params.ficha}</IonLabel>
              <IonInput
                value={name}
                 onIonInput={(e) => setName(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">apellido</IonLabel>
              <IonInput
                value={surname}
                 onIonInput={(e) => setSurname(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">edad</IonLabel>
              <IonInput
                type="number"
                value={age}
                 onIonInput={(e) => setAge(parseInt(e.detail.value!, 10))}
              />
            </IonItem>

            <IonButton expand="full" onClick={addUser}>AÑADIR O REEMPLAZAR</IonButton>
            <IonButton expand="full" color="secondary" onClick={downloadDatabase}>DESCARGAR BASE DE DATOS</IonButton>
            <IonButton expand="full" color="secondary" onClick={handleClick}>SINCRONIZAR</IonButton>
          </div>
          <h3>Usuarios</h3>
          <div className="list-container" style={{ height: '200px', overflowY: 'scroll' }}>
            <IonList>
              {users.map((user) => (
                <IonItem key={user.id}>
                    {user.id}  {user.name} {user.surname}, años: {user.age}
                    <IonButton slot="end" color="primary" onClick={() => handleUserClick(user)}>Editar</IonButton>
                  <IonButton slot="end" color="danger" onClick={() => deleteUser(user.id)}>Eliminar</IonButton>     
                </IonItem>
              ))}
            </IonList>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1Copia;

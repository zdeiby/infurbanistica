import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonList, IonInput, IonButton
  } from '@ionic/react';
  
  import React, { useEffect, useState } from 'react';
  import loadSQL from '../models/database';
  import { useParams } from 'react-router-dom';
  import 'bootstrap/dist/css/bootstrap.min.css';
  
  interface Person {
    idfiu: number;
    ingreso_empleo_formal: string;
    ingreso_empleo_informal: string;
    ingreso_subsidio: string;
    ingreso_pension: string;
    ingreso_ayuda: string;
    ingreso_otro: string;
    ingreso_total: string;
    egreso_alimentacion: string;
    egreso_educacion: string;
    egreso_arriendo: string;
    egreso_servicios: string;
    egreso_salud: string;
    egreso_transporte: string;
    egreso_deuda: string;
    egreso_otro: string;
    egreso_total: string;
    fecharegistro: string;
    usuario: string;
    estado: string;
    tabla: string;
  }
  
  const Tab17: React.FC = () => {
    const getCurrentDateTime = () => {
        const date = new Date();
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };
    
    const params = useParams<{ ficha: string }>();
    const [people, setPeople] = useState<Person[]>([]);
    const [db, setDb] = useState<any>(null);
    const [items, setItems] = useState<Person>({
      idfiu: Number(params.ficha),
      ingreso_empleo_formal: '0',
      ingreso_empleo_informal: '0',
      ingreso_subsidio: '0',
      ingreso_pension: '0',
      ingreso_ayuda: '0',
      ingreso_otro: '0',
      ingreso_total: '0',
      egreso_alimentacion: '0',
      egreso_educacion: '0',
      egreso_arriendo: '0',
      egreso_servicios: '0',
      egreso_salud: '0',
      egreso_transporte: '0',
      egreso_deuda: '0',
      egreso_otro: '0',
      egreso_total: '0',
      fecharegistro: getCurrentDateTime(),
      usuario: localStorage.getItem('cedula') || '',
      estado: '1',
      tabla: 'infraccion_socioeconomico',
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);
  
    useEffect(() => {
      loadSQL(setDb, fetchUsers);
    }, []);
  
    useEffect(() => {
      if (db) fetchUsers(db);
    }, [db]);
  
    useEffect(() => {
      if (people.length > 0) {
        const data = people[0];
        setItems((prevItems) => ({
          ...prevItems,
          ...data,
          ingreso_total: calculateTotalIngresos(data).toString(),
          egreso_total: calculateTotalEgresos(data).toString(),
        }));
      }
    }, [people]);
  
    const fetchUsers = async (database = db) => {
        if (database) {
          const res = await database.exec(`SELECT * FROM infraccion_socioeconomico WHERE idfiu=${params.ficha}`);
          if (res[0]?.values && res[0]?.columns) {
            const transformedPeople: Person[] = res[0].values.map((row: any[]) => {
              return res[0].columns.reduce((obj, col, index) => {
                obj[col] = row[index] !== '' ? row[index].toString() : '0'; // Convertir valores null a '0'
                return obj;
              }, {} as Person);
            });
            setPeople(transformedPeople);
            setButtonDisabled(!transformedPeople[0].idfiu);
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
          store.put(data, 'sqliteDb').onsuccess = () => {
            console.log('Data saved to IndexedDB');
          };
        };
      }
    };
  
  
    const calculateTotalIngresos = (items) => {
      return [
        'ingreso_empleo_formal',
        'ingreso_empleo_informal',
        'ingreso_subsidio',
        'ingreso_pension',
        'ingreso_ayuda',
        'ingreso_otro'
      ].reduce((total, field) => total + parseFloat(items[field] || '0'), 0);
    };
  
    const calculateTotalEgresos = (items) => {
      return [
        'egreso_alimentacion',
        'egreso_educacion',
        'egreso_arriendo',
        'egreso_servicios',
        'egreso_salud',
        'egreso_transporte',
        'egreso_deuda',
        'egreso_otro'
      ].reduce((total, field) => total + parseFloat(items[field] || '0'), 0);
    };
  
    const handleInputChange = (event, field) => {
      const { value } = event.target;
      setItems((prevItems) => {
        const updatedItems = {
          ...prevItems,
          [field]: value,
        };
        return {
          ...updatedItems,
          ingreso_total: calculateTotalIngresos(updatedItems).toString(),
          egreso_total: calculateTotalEgresos(updatedItems).toString(),
        };
      });
    };
  

  
    const enviar = async (database = db, event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      try {
        await database.exec(`INSERT OR REPLACE INTO infraccion_socioeconomico (
          idfiu, ingreso_empleo_formal, ingreso_empleo_informal, ingreso_subsidio, ingreso_pension,
          ingreso_ayuda, ingreso_otro, ingreso_total, egreso_alimentacion, egreso_educacion, egreso_arriendo,
          egreso_servicios, egreso_salud, egreso_transporte, egreso_deuda, egreso_otro, egreso_total, fecharegistro,
          usuario, estado, tabla
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
          [
            items.idfiu, items.ingreso_empleo_formal, items.ingreso_empleo_informal, items.ingreso_subsidio, items.ingreso_pension,
            items.ingreso_ayuda, items.ingreso_otro, items.ingreso_total, items.egreso_alimentacion, items.egreso_educacion,
            items.egreso_arriendo, items.egreso_servicios, items.egreso_salud, items.egreso_transporte, items.egreso_deuda,
            items.egreso_otro, items.egreso_total, items.fecharegistro, items.usuario, items.estado, items.tabla
          ]);
        saveDatabase();
        alert('Datos Guardados con éxito');
        fetchUsers(); // Actualizar los datos después de guardar
      } catch (err) {
        console.error('Error al exportar los datos JSON:', err);
      }
    };
  
    return (
      <IonPage>
        <IonHeader><div className='col-12'>
          <IonToolbar>
            <IonTitle slot="start">10 - ASPECTOS SOCIOECONÓMICOS DEL GRUPO FAMILIAR</IonTitle>
            <IonTitle slot="end">FICHA: <label style={{ color: '#17a2b8' }}>{params.ficha}</label> </IonTitle>
          </IonToolbar></div>
        </IonHeader>
        <IonContent fullscreen><form>
          
          <div className="social-card">
            <span className="label">Ficha: {params.ficha}</span>
          </div>
          <div className="social-card2 text-center">
            <span className="value2">INGRESOS MENSUALES DEL GRUPO FAMILIAR</span>
          </div>
          <br />
         
        <div className=' shadow p-3 mb-5 bg-white rounded'>
        <IonList>
  <div className="row g-3 was-validated">
            <div className="col-sm-4">
              <label  className="form-label">Salario (Empleo formal): $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_empleo_formal' )}  value={items.ingreso_empleo_formal} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
              <div className="col-sm-4">
              <label  className="form-label">Ingresos (Empleo Informal): $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_empleo_informal')}  value={items.ingreso_empleo_informal } type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Subsidios en dinero: $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_subsidio')}  value={items.ingreso_subsidio} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Pensión: $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_pension')}  value={items.ingreso_pension } type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Ayuda Económica: $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_ayuda')}  value={items.ingreso_ayuda } type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Otro: $</label>
              <input onChange={(e) => handleInputChange(e, 'ingreso_otro')}  value={items.ingreso_otro} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">TOTAL: $</label>
              <input disabled onChange={(e) => handleInputChange(e, 'ingreso_total')}  value={items.ingreso_total} type="number" placeholder="" className="form-control form-control-sm  "  />
            </div>
            </div>
  </IonList>

         <br />
          <div className="social-card2 text-center">
            <span className="value2">EGRESOS MENSUALES DEL GRUPO FAMILIAR</span>
          </div>
          <br />
  
  <IonList>
  <div className="row g-3 was-validated">
            <div className="col-sm-4">
              <label  className="form-label">Alimentación: $</label>
              <input onChange={(e) => handleInputChange(e, 'egreso_alimentacion')}  value={items.egreso_alimentacion} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
              <div className="col-sm-4">
              <label  className="form-label">Educación: $</label>
              <input onChange={(e) => handleInputChange(e, 'egreso_educacion')}  value={items.egreso_educacion} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Arriendo: $</label>
              <input onChange={(e) => handleInputChange(e, 'egreso_arriendo')}  value={items.egreso_arriendo } type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Servicios: $</label>
              <input onChange={(e) => handleInputChange(e, 'egreso_servicios')}  value={items.egreso_servicios} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Salud: $</label>
              <input onChange={(e) => handleInputChange(e, 'egreso_salud')}  value={items.egreso_salud} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Transporte: $</label>
              <input onChange={(e) => handleInputChange(e, 'egreso_transporte')}  value={items.egreso_transporte} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Deudas: $</label>
              <input  onChange={(e) => handleInputChange(e, 'egreso_deuda')}  value={items.egreso_deuda} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            <div className="col-sm-4">
              <label  className="form-label">Otros: $</label>
              <input  onChange={(e) => handleInputChange(e, 'egreso_otro')}  value={items.egreso_otro} type="number" placeholder="" className="form-control form-control-sm  "  required/>
            </div>
            </div>
  </IonList>
  <IonList>
  <div className="row g-3 was-validated">
  <div className="col-sm-4">
              <label  className="form-label">TOTAL: $</label>
              <input disabled onChange={(e) => handleInputChange(e, 'egreso_total')}  value={items.egreso_total} type="number" placeholder="" className="form-control form-control-sm  "  />
            </div>
            </div>
            </IonList>
  </div>

      <br />
         <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
         <div className={`btn btn-primary ${buttonDisabled ? 'disabled' : ''}`} onClick={() => { if (!buttonDisabled) {  window.location.href = `/tabs/tab15/${params.ficha}`;} }}> Siguiente</div>
         </div> 
             </form>
        </IonContent>
      </IonPage>
  
    );
  };
  
  export default Tab17;
  
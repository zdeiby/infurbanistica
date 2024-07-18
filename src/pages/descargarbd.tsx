import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import initSqlJs from 'sql.js';
import { isPlatform } from '@ionic/react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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

const DownloadDatabase: React.FC = () => {
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

  const downloadFile = async () => {
    if (!dbContent) {
      console.error('No database content to download');
      return;
    }

    const fileName = 'database.sqlite';
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Descargar Base de Datos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton onClick={downloadFile}>Descargar Base de Datos</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DownloadDatabase;

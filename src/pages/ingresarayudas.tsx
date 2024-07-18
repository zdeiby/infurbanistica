import './Tab4.css';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import loadSQL from '../models/database';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonList, IonButton
} from '@ionic/react';
import TouchPad from '../components/TouchPad';

interface Ayudas {
    idayudas: number | null;
    fichasocial: number;
    paquetealimentario: number | null;
    tipoa: number | null;
    tipob: number | null;
    tipoc: number | null;
    noalimentarias: number | null;
    quiendoa: string | null;
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
    nombre1: string;
    nombre2: string;
    apellido1: string;
    apellido2: string;
}


const IngresarAyudas: React.FC = () => {
    const location = useLocation();
    const params = useParams();
    const queryParams = new URLSearchParams(location.search);
    const idayudas = queryParams.get('idayuda');
    const [ayudas, setAyudas] = useState<Ayudas[]>([]);
    const [db, setDb] = useState<any>(null);
    const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
    const [bloobs, setBloobs] = useState('');
    const [items, setItems] = useState<Ayudas>({
        idayudas: null,
        fichasocial: parseInt(params.ficha),
        paquetealimentario: null,
        tipoa: null,
        tipob: null,
        tipoc: null,
        noalimentarias: null,
        quiendoa: '',
        factura: '',
        dcocina: null,
        daseohogar: null,
        daseofamiliar: null,
        dasehombre: null,
        daseomujer: null,
        daseonna: null,
        daseoinfantil: null,
        daseoespecial: null,
        dcolchonetas: null,
        dcobijas: null,
        dsabanas: null,
        dalmohadas: null,
        enitdad: '',
        otros: null,
        cuales: '',
        entidadotros: '',
        fechadeentrega: '',
        idintegrante: '',
        fecharegistro: '',
        usuario: parseInt(localStorage.getItem('cedula') || '0', 10),
        estado: 1,
        tabla: 'c12_ayudasentregadas',
        tipoentraga: null,
        ococina: null,
        acocina: null,
        oaseohogar: null,
        aaseohogar: null,
        oaseofamiliar: null,
        aaseofamiliar: null,
        oasehombre: null,
        aasehombre: null,
        oaseomujer: null,
        aaseomujer: null,
        oaseonna: null,
        aaseonna: null,
        oaseoinfantil: null,
        aaseoinfantil: null,
        oaseoespecial: null,
        aaseoespecial: null,
        ocolchonetas: null,
        acolchonetas: null,
        ocobijas: null,
        acobijas: null,
        osabanas: null,
        asabanas: null,
        oalmohadas: null,
        aalmohadas: null,
        quienpaq: '',
        cualpaq: '',
        quienasis: '',
        cualasis: '',
        asistencialiamentaria: null,
        redentrega: null,
        entregado: null,
        observacion: '',
        paquete1: '',
        paquete2: '',
        paquete3: '',
        paquete4: '',
        documentorecibeayuda: '',
        nombrerecibeayuda: '',
        nameFirma: '',
        draw_dataUrl: null,
    });
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        loadSQL(setDb, fetchAyudas);
    }, []);

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

    const fetchAyudas = async (database = db) => {
        if (db) {
            const res = await database.exec(`SELECT * FROM c12_ayudasentregadas WHERE fichasocial=${params.ficha} and idayudas=${idayudas}`);
            if (res[0]?.values && res[0]?.columns) {
                const transformedAyudas: Ayudas[] = res[0].values.map((row: any[]) => {
                    return res[0].columns.reduce((obj, col, index) => {
                        obj[col] = row[index];
                        return obj;
                    }, {} as Ayudas);
                });
                setAyudas(transformedAyudas);
            } else {
                setItems({
                    idayudas: null,
                    fichasocial: parseInt(params.ficha),
                    paquetealimentario: null,
                    tipoa: 0,
                    tipob: 0,
                    tipoc: 0,
                    noalimentarias: null,
                    quiendoa: '',
                    factura: '',
                    dcocina: 0,
                    daseohogar: 0,
                    daseofamiliar: 0,
                    dasehombre: 0,
                    daseomujer: 0,
                    daseonna: 0,
                    daseoinfantil: 0,
                    daseoespecial: 0,
                    dcolchonetas: 0,
                    dcobijas: 0,
                    dsabanas: 0,
                    dalmohadas: 0,
                    enitdad: '',
                    otros: null,
                    cuales: 'NO APLICA',
                    entidadotros: '',
                    fechadeentrega: '',
                    idintegrante: '',
                    fecharegistro: getCurrentDateTime(),
                    usuario: parseInt(localStorage.getItem('cedula') || '0', 10),
                    estado: 1,
                    tabla: 'c12_ayudasentregadas',
                    tipoentraga: null,
                    ococina: 0,
                    acocina: 0,
                    oaseohogar: 0,
                    aaseohogar: 0,
                    oaseofamiliar: 0,
                    aaseofamiliar: 0,
                    oasehombre: 0,
                    aasehombre: 0,
                    oaseomujer: 0,
                    aaseomujer: 0,
                    oaseonna: 0,
                    aaseonna: 0,
                    oaseoinfantil: 0,
                    aaseoinfantil: 0,
                    oaseoespecial: 0,
                    aaseoespecial: 0,
                    ocolchonetas: 0,
                    acolchonetas: 0,
                    ocobijas: 0,
                    acobijas: 0,
                    osabanas: 0,
                    asabanas: 0,
                    oalmohadas: 0,
                    aalmohadas: 0,
                    quienpaq: '',
                    cualpaq: 'NO APLICA',
                    quienasis: '',
                    cualasis: 'NO APLICA',
                    asistencialiamentaria: null,
                    redentrega: null,
                    entregado: null,
                    observacion: '',
                    paquete1: '',
                    paquete2: '',
                    paquete3: '',
                    paquete4: '',
                    documentorecibeayuda: '',
                    nombrerecibeayuda: '',
                    nameFirma: '',
                    draw_dataUrl: null,
                });
            }
        }

        const integrantesRes = await db.exec(`SELECT idintegrante, nombre1, nombre2, apellido1, apellido2 FROM c131_integrante WHERE fichasocial=${params.ficha}`);
        if (integrantesRes[0]?.values && integrantesRes[0]?.columns) {
            const transformedIntegrantes: Integrante[] = integrantesRes[0].values.map((row: any[]) => {
                return integrantesRes[0].columns.reduce((obj, col, index) => {
                    obj[col] = row[index];
                    return obj;
                }, {} as Integrante);
            });
            setIntegrantes(transformedIntegrantes);
        }
    };

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

    useEffect(() => {
        if (ayudas.length > 0) {
            let data = ayudas[0] || {};
            setItems({
                idayudas: data.idayudas || null,
                fichasocial: data.fichasocial || parseInt(params.ficha),
                paquetealimentario: data.paquetealimentario || null,
                tipoa: data.tipoa || null,
                tipob: data.tipob || null,
                tipoc: data.tipoc || null,
                noalimentarias: data.noalimentarias || null,
                quiendoa: data.quiendoa || '',
                factura: data.factura || '',
                dcocina: data.dcocina || null,
                daseohogar: data.daseohogar || null,
                daseofamiliar: data.daseofamiliar || null,
                dasehombre: data.dasehombre || null,
                daseomujer: data.daseomujer || null,
                daseonna: data.daseonna || null,
                daseoinfantil: data.daseoinfantil || null,
                daseoespecial: data.daseoespecial || null,
                dcolchonetas: data.dcolchonetas || null,
                dcobijas: data.dcobijas || null,
                dsabanas: data.dsabanas || null,
                dalmohadas: data.dalmohadas || null,
                enitdad: data.enitdad || '',
                otros: data.otros || null,
                cuales: data.cuales || '',
                entidadotros: data.entidadotros || '',
                fechadeentrega: data.fechadeentrega || '',
                idintegrante: data.idintegrante || '',
                fecharegistro: data.fecharegistro || '',
                usuario: data.usuario || parseInt(localStorage.getItem('cedula') || '0', 10),
                estado: data.estado || 1,
                tabla: data.tabla || 'c12_ayudasentregadas',
                tipoentraga: data.tipoentraga || null,
                ococina: data.ococina || null,
                acocina: data.acocina || null,
                oaseohogar: data.oaseohogar || null,
                aaseohogar: data.aaseohogar || null,
                oaseofamiliar: data.oaseofamiliar || null,
                aaseofamiliar: data.aaseofamiliar || null,
                oasehombre: data.oasehombre || null,
                aasehombre: data.aasehombre || null,
                oaseomujer: data.oaseomujer || null,
                aaseomujer: data.aaseomujer || null,
                oaseonna: data.oaseonna || null,
                aaseonna: data.aaseonna || null,
                oaseoinfantil: data.oaseoinfantil || null,
                aaseoinfantil: data.aaseoinfantil || null,
                oaseoespecial: data.oaseoespecial || null,
                aaseoespecial: data.aaseoespecial || null,
                ocolchonetas: data.ocolchonetas || null,
                acolchonetas: data.acolchonetas || null,
                ocobijas: data.ocobijas || null,
                acobijas: data.acobijas || null,
                osabanas: data.osabanas || null,
                asabanas: data.asabanas || null,
                oalmohadas: data.oalmohadas || null,
                aalmohadas: data.aalmohadas || null,
                quienpaq: data.quienpaq || '',
                cualpaq: data.cualpaq || '',
                quienasis: data.quienasis || '',
                cualasis: data.cualasis || '',
                asistencialiamentaria: data.asistencialiamentaria || null,
                redentrega: data.redentrega || null,
                entregado: data.entregado || null,
                observacion: data.observacion || '',
                paquete1: data.paquete1 || '',
                paquete2: data.paquete2 || '',
                paquete3: data.paquete3 || '',
                paquete4: data.paquete4 || '',
                documentorecibeayuda: data.documentorecibeayuda || '',
                nombrerecibeayuda: data.nombrerecibeayuda || '',
                nameFirma: data.nameFirma || '',
                draw_dataUrl: data.draw_dataUrl || null,
            });
        }
    }, [ayudas]);

    useEffect(() => {
        fetchAyudas();
    }, [db]);

    const handleInputChange = (event, field) => {
        const { value } = event.target;
        setItems((prevItems) => {
            const newState = { ...prevItems, [field]: value };
            if (field === 'paquetealimentario') {
              newState.tipoa = value ? 0 : '';
              newState.paquete1 = value ? null : '';
              newState.paquete2 = value ? null : '';
              newState.paquete3 = value ? null : '';
              newState.paquete4 = value ? null : '';
              newState.quienpaq = value ? '' : '';
              newState.cualpaq = value =='1'? 'NO APLICA' : 'NO APLICA';

            }
            if (field === 'quienpaq') {
                newState.cualpaq = value =='1'? 'NO APLICA' : '';
              }

              if (field === 'quienasis') {
                newState.cualasis = value =='1'? 'NO APLICA' : '';
              }

              if (field === 'asistencialiamentaria') {
                newState.tipob = value ? null : '';
                newState.quienasis = value ? null : '';
                newState.cualasis = value =='1'? 'NO APLICA' : 'NO APLICA';
  
              }


              if (field === 'quiendoa') {

                //ACNUR
                newState.acocina = value =='1'|| value =='2'? '0' : '';
                newState.aaseohogar = value =='1'|| value =='2'? '0' : '';
                newState.aaseofamiliar = value =='1'|| value =='2'? '0' : '';
                newState.aasehombre = value =='1'|| value =='2'? '0' : '';
                newState.aaseomujer = value =='1'|| value =='2'? '0' : '';
                newState.aaseonna = value =='1'|| value =='2'? '0' : '';
                newState.aaseoinfantil = value =='1'|| value =='2'? '0' : '';
                newState.aaseoespecial = value =='1'|| value =='2'? '0' : '';
                newState.acolchonetas = value =='1'|| value =='2'? '0' : '';
                newState.asabanas = value =='1'|| value =='2'? '0' : '';
                newState.aalmohadas = value =='1'|| value =='2'? '0' : '';
                newState.acobijas = value =='1'|| value =='2'? '0' : '';

                //DAGRD
                newState.dcocina = value =='1'|| value =='2'? '0' : '';
                newState.daseohogar = value =='1'|| value =='2'? '0' : '';
                newState.daseofamiliar = value =='1'|| value =='2'? '0' : '';
                newState.dasehombre = value =='1'|| value =='2'? '0' : '';
                newState.daseomujer = value =='1'|| value =='2'? '0' : '';
                newState.daseonna = value =='1'|| value =='2'? '0' : '';
                newState.daseoinfantil = value =='1'|| value =='2'? '0' : '';
                newState.daseoespecial = value =='1'|| value =='2'? '0' : '';
                newState.dcolchonetas = value =='1'|| value =='2'? '0' : '';
                newState.dsabanas = value =='1'|| value =='2'? '0' : '';
                newState.dalmohadas = value =='1'|| value =='2'? '0' : '';
                newState.dcobijas = value =='1'|| value =='2'? '0' : '';
                //OID

                newState.ococina = value =='1'|| value =='2'? '0' : '';
                newState.oaseohogar = value =='1'|| value =='2'? '0' : '';
                newState.oaseofamiliar = value =='1'|| value =='2'? '0' : '';
                newState.oasehombre = value =='1'|| value =='2'? '0' : '';
                newState.oaseomujer = value =='1'|| value =='2'? '0' : '';
                newState.oaseonna = value =='1'|| value =='2'? '0' : '';
                newState.oaseoinfantil = value =='1'|| value =='2'? '0' : '';
                newState.oaseoespecial = value =='1'|| value =='2'? '0' : '';
                newState.ocolchonetas = value =='1'|| value =='2'? '0' : '';
                newState.osabanas = value =='1'|| value =='2'? '0' : '';
                newState.oalmohadas = value =='1'|| value =='2'? '0' : '';
                newState.ocobijas = value =='1'|| value =='2'? '0' : '';
                

              }

              if (field === 'noalimentarias') {

                //AGNUR
                newState.quiendoa = value ? '' : '';
                newState.acocina = value ? '0' : '';
                newState.aaseohogar = value ? '0' : '';
                newState.aaseofamiliar = value ? '0' : '';
                newState.aasehombre = value ? '0' : '';
                newState.aaseomujer = value ? '0' : '';
                newState.aaseonna = value ? '0' : '';
                newState.aaseoinfantil = value ? '0' : '';
                newState.aaseoespecial = value ? '0' : '';
                newState.acolchonetas = value ? '0' : '';
                newState.asabanas = value ? '0' : '';
                newState.aalmohadas = value ? '0' : '';
                newState.acobijas = value ? '0' : '';

                //DAGRD
                
                newState.dcocina = value ? '0' : '';
                newState.daseohogar = value ? '0' : '';
                newState.daseofamiliar = value ? '0' : '';
                newState.dasehombre = value ? '0' : '';
                newState.daseomujer = value ? '0' : '';
                newState.daseonna = value ? '0' : '';
                newState.daseoinfantil = value ? '0' : '';
                newState.daseoespecial = value ? '0' : '';
                newState.dcolchonetas = value ? '0' : '';
                newState.dsabanas = value ? '0' : '';
                newState.dalmohadas = value ? '0' : '';
                newState.dcobijas = value ? '0' : '';

                //OID

                newState.ococina = value ? '0' : '';
                newState.oaseohogar = value ? '0' : '';
                newState.oaseofamiliar = value ? '0' : '';
                newState.oasehombre = value ? '0' : '';
                newState.oaseomujer = value ? '0' : '';
                newState.oaseonna = value ? '0' : '';
                newState.oaseoinfantil = value ? '0' : '';
                newState.oaseoespecial = value ? '0' : '';
                newState.ocolchonetas = value ? '0' : '';
                newState.osabanas = value ? '0' : '';
                newState.oalmohadas = value ? '0' : '';
                newState.ocobijas = value ? '0' : '';
              }

              if (field === 'quienasis') {
                newState.cualasis = value =='1'? 'NO APLICA' : '';
              }

              if (field === 'otros') {
                newState.entidadotros = value ? '' : '';
                newState.cuales = value =='2'? '' : 'NO APLICA';
                newState.tipoc = value ? '0' : '0';
  
              }

              if (field === 'redentrega') {
                newState.nombrerecibeayuda = value ? '' : '';
                newState.documentorecibeayuda = value ? '' : 'NO APLICA';
                newState.idintegrante = value ? '0' : '0';
  
              }





            return newState;
          });
    };

    useEffect(() => {
        console.log("Items updated:", items);
    }, [items]);

    const validarCampos = () => {
        // Lista de campos obligatorios dependiendo de las condiciones
        const camposObligatorios = [
            'paquetealimentario',
            'asistencialiamentaria',
            'noalimentarias',
            'otros',
            'redentrega',
            'idintegrante',
            'fechadeentrega',
            'entregado',
            'tipoentraga',
            'observacion'
        ];
    
        // Añadir campos adicionales según las condiciones
        if (items.paquetealimentario == '2') {
            camposObligatorios.push( 'quienpaq');
            if (items.quienpaq == '2') {
                camposObligatorios.push('cualpaq');
            }
        }
        if (items.asistencialiamentaria == '2') {
            camposObligatorios.push( 'quienasis');
            if (items.quienasis == '2') {
                camposObligatorios.push('cualasis');
            }
        }
        if (items.noalimentarias == '2') {
            camposObligatorios.push( 'quiendoa');
        }
        if (items.otros == '2') {
           // camposObligatorios.push('entidadotros', 'cuales', 'tipoc');
        }

    
        for (let campo of camposObligatorios) {
            if (!items[campo]) {
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
        console.log(items)
        try {
            await db.exec(`INSERT OR REPLACE INTO c12_ayudasentregadas (idayudas, fichasocial, paquetealimentario, tipoa, tipob, tipoc, noalimentarias, quiendoa, factura, dcocina, daseohogar, daseofamiliar, dasehombre, daseomujer, daseonna, daseoinfantil, daseoespecial, dcolchonetas, dcobijas, dsabanas, dalmohadas, enitdad, otros, cuales, entidadotros, fechadeentrega, idintegrante, fecharegistro, usuario, estado, tabla, tipoentraga, ococina, acocina, oaseohogar, aaseohogar, oaseofamiliar, aaseofamiliar, oasehombre, aasehombre, oaseomujer, aaseomujer, oaseonna, aaseonna, oaseoinfantil, aaseoinfantil, oaseoespecial, aaseoespecial, ocolchonetas, acolchonetas, ocobijas, acobijas, osabanas, asabanas, oalmohadas, aalmohadas, quienpaq, cualpaq, quienasis, cualasis, asistencialiamentaria, redentrega, entregado, observacion, paquete1, paquete2, paquete3, paquete4, documentorecibeayuda, nombrerecibeayuda, nameFirma, draw_dataUrl)
            VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    items.idayudas, items.fichasocial, items.paquetealimentario, items.tipoa, items.tipob, items.tipoc, items.noalimentarias, items.quiendoa, items.factura, items.dcocina, items.daseohogar, items.daseofamiliar, items.dasehombre, items.daseomujer, items.daseonna, items.daseoinfantil, items.daseoespecial, items.dcolchonetas, items.dcobijas, items.dsabanas, items.dalmohadas, items.enitdad, items.otros, items.cuales, items.entidadotros, items.fechadeentrega, items.idintegrante, items.fecharegistro, items.usuario, items.estado, items.tabla, items.tipoentraga, items.ococina, items.acocina, items.oaseohogar, items.aaseohogar, items.oaseofamiliar, items.aaseofamiliar, items.oasehombre, items.aasehombre, items.oaseomujer, items.aaseomujer, items.oaseonna, items.aaseonna, items.oaseoinfantil, items.aaseoinfantil, items.oaseoespecial, items.aaseoespecial, items.ocolchonetas, items.acolchonetas, items.ocobijas, items.acobijas, items.osabanas, items.asabanas, items.oalmohadas, items.aalmohadas, items.quienpaq, items.cualpaq, items.quienasis, items.cualasis, items.asistencialiamentaria, items.redentrega, items.entregado, items.observacion, items.paquete1, items.paquete2, items.paquete3, items.paquete4, items.documentorecibeayuda, items.nombrerecibeayuda, items.nameFirma, items.draw_dataUrl
                ]);

            saveDatabase();
            alert('Datos Guardados con éxito');
            fetchAyudas(); // Actualizar la lista de ayudas después de guardar
        } catch (err) {
            console.error('Error al exportar los datos JSON:', err);
        }
    };

    const handleSave = (url) => {
        console.log('URL de Blob:', url);
        setBloobs(url);
        setItems((prevItems) => ({
            ...prevItems,
            draw_dataUrl: url
        }));
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle slot="start">12 - INGRESAR NUEVA AYUDA HUMANITARIA</IonTitle>
                    <IonTitle slot="end">FICHA SOCIAL: <label style={{ color: '#17a2b8' }}>{params.ficha}</label> </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
            <form>
                <div className="social-card">
                    <span className="label">Ficha social: {params.ficha}</span>
                    <span className="value">ID Ayuda: {idayudas}</span>
                    <span className="value"></span>
                </div>

                <br />

                <div className=' shadow p-3 mb-5 bg-white rounded'>
                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm-6">
                                <label className="form-label">Paquete alimentario:</label>
                                <select onChange={(e) => handleInputChange(e, 'paquetealimentario')} value={items.paquetealimentario || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option><option value="1"> NO </option><option value="2"> SI </option>
                                </select>
                            </div>
                            {(items.paquetealimentario == '2') ?
                                <div className="col-sm-6">
                                    <label className="form-label" >Cantidad:</label>
                                    <input type="number" min={0} max={4} onChange={(e) => handleInputChange(e, 'tipoa')} value={items.tipoa || ''} placeholder="" className="form-control form-control-sm  "  />
                                </div> : ''}
                        </div>
                    </IonList>
                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Paquete 1</label>
                                <input type="number" onChange={(e) => handleInputChange(e, 'paquete1')} value={items.paquete1 || ''} disabled={(items.tipoa ==1 || items.tipoa ==2 || items.tipoa ==3 || items.tipoa ==4)?false:true} placeholder="" className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Paquete 2</label>
                                <input type="number" onChange={(e) => handleInputChange(e, 'paquete2')} value={items.paquete2 || ''} disabled={(items.tipoa ==2 || items.tipoa ==3 || items.tipoa ==4)?false:true} placeholder="" className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Paquete 3</label>
                                <input type="number" onChange={(e) => handleInputChange(e, 'paquete3')} value={items.paquete3 || ''} disabled={(items.tipoa ==3 || items.tipoa ==4 )?false:true} placeholder="" className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Paquete 4</label>
                                <input type="number" onChange={(e) => handleInputChange(e, 'paquete4')} value={items.paquete4 || ''} disabled={(items.tipoa ==4)?false:true} placeholder="" className="form-control form-control-sm  " />
                            </div>
                        </div>
                    </IonList>
                    <IonList>
                        <div className="row g-3 was-validated ">
                        {(items.paquetealimentario == '2') ?<div className="col-sm-6">
                                <label className="form-label">Que entidad:</label>
                                <select onChange={(e) => handleInputChange(e, 'quienpaq')} value={items.quienpaq || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option><option value="1"> COMISIÓN SOCIAL </option><option value="2"> OTRA </option>
                                </select>
                            </div> :''}
                            {(items.quienpaq == '2')?
                            <div className="col-sm-6">
                                <label className="form-label" >Cual:</label>
                                <input type="text" onChange={(e) => handleInputChange(e, 'cualpaq')} value={items.cualpaq} placeholder="" className="form-control form-control-sm  " required />
                            </div>:''}
                        </div>
                    </IonList>



                    <IonList>
                        <div className="alert alert-primary" role="alert">
                            <span className="badge badge-secondary text-dark">ASISTENCIA ALIMENTARIA EN EMERGENCIA</span>
                        </div>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm-6">
                                <label className="form-label">Asistencia alimentaria en emergencia:</label>
                                <select onChange={(e) => handleInputChange(e, 'asistencialiamentaria')} value={items.asistencialiamentaria || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option><option value="1"> NO </option><option value="2"> SI </option>
                                </select>
                            </div>
                            {(items.asistencialiamentaria == '2') ?  <div className="col-sm-6">
                                <label className="form-label" >Cuantos:</label>
                                <input type="number" onChange={(e) => handleInputChange(e, 'tipob')} value={items.tipob || ''} placeholder="" className="form-control form-control-sm  "  />
                            </div> :''} {(items.asistencialiamentaria == '2') ?
                            <div className="col-sm-6">
                                <label className="form-label">Que entidad:</label>
                                <select onChange={(e) => handleInputChange(e, 'quienasis')} value={items.quienasis || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option><option value="1"> COMISIÓN SOCIAL </option><option value="2"> OTRA </option>
                                </select>
                            </div>:''}
                            {(items.quienasis == '2') ?
                            <div className="col-sm-6">
                                <label className="form-label" >Cual:</label>
                                <input type="text" onChange={(e) => handleInputChange(e, 'cualasis')} value={items.cualasis || ''} placeholder="" className="form-control form-control-sm  " required />
                            </div>:''}
                        </div>
                    </IonList>



                    <IonList>
                        <div className="alert alert-primary" role="alert">
                            <span className="badge badge-secondary text-dark">AYUDAS NO ALIMENTARIAS</span>
                        </div>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm-12">
                                <label className="form-label">No alimentarias:</label>
                                <select onChange={(e) => handleInputChange(e, 'noalimentarias')} value={items.noalimentarias || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option><option value="1"> NO </option><option value="2"> SI </option>
                                </select>
                            </div>
                            {(items.noalimentarias == '2') ? 
                            <div className="col-sm-6">
                                <label className="form-label" >Factura:</label>
                                <input type="text" onChange={(e) => handleInputChange(e, 'factura')} value={items.factura || 'NO APLICA'} placeholder="" className="form-control form-control-sm  " required />
                            </div> :''}
                            {(items.noalimentarias == '2') ? 
                            <div className="col-sm-6">
                                <label className="form-label">Quien entrega (DAGRD - OIM - ACNUR):</label>
                                <select onChange={(e) => handleInputChange(e, 'quiendoa')} value={items.quiendoa || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option><option value="3"> ACNUR </option><option value="1"> DAGRD </option><option value="2"> OIM </option>
                                </select>
                            </div>:''}
                        </div>
                    </IonList>
                    {/*ACNUR */}
                    {(items.quiendoa == '3' && items.noalimentarias == '2') ? <> 
                     <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Hombre:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'acocina')} value={items.acocina || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Dama:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'aaseohogar')} value={items.aaseohogar || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Niño:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'aaseofamiliar')} value={items.aaseofamiliar || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Bebe:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'aasehombre')} value={items.aasehombre || '0'} className="form-control form-control-sm  " />
                            </div>
                        </div>
                    </IonList>
                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Bebe con Pañales:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'aaseomujer')} value={items.aaseomujer || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Abrigo:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'aaseonna')} value={items.aaseonna || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Colchonetas:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'aaseoinfantil')} value={items.aaseoinfantil || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Almohada:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'aaseoespecial')} value={items.aaseoespecial || '0'} className="form-control form-control-sm  " />
                            </div>
                        </div>
                    </IonList>
                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Pañales etapa 1:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'acolchonetas')} value={items.acolchonetas || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Pañales etapa 2:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'acobijas')} value={items.acobijas || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Pañales etapa 3:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'asabanas')} value={items.asabanas || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Pañales etapa 4:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'aalmohadas')} value={items.aalmohadas || '0'} className="form-control form-control-sm  " />
                            </div>
                        </div>
                    </IonList> </> :''}

                    {/*DAGRD */}
                    {(items.quiendoa == '1' && items.noalimentarias == '2') ? <> 

                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Kit de cocina:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'dcocina')} value={items.dcocina || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Aseo Hogar:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'daseohogar')} value={items.daseohogar || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Familiar:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'daseofamiliar')} value={items.daseofamiliar || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Hombre:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'dasehombre')} value={items.dasehombre || '0'} className="form-control form-control-sm  " />
                            </div>
                        </div>
                    </IonList>
                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Mujer:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'daseomujer')} value={items.daseomujer || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Niño (a):</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'daseonna')} value={items.daseonna || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Bebe:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'daseoinfantil')} value={items.daseoinfantil || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Especial:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'daseoespecial')} value={items.daseoespecial || '0'} className="form-control form-control-sm  " />
                            </div>
                        </div>
                    </IonList>
                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Colchonetas:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'daseoespecial')} value={items.daseoespecial || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Cobijas:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'dcobijas')} value={items.dcobijas || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Sabanas:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'dsabanas')} value={items.dsabanas || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Almohadas:</label>
                                <input type="number" min={0} placeholder="" onChange={(e) => handleInputChange(e, 'dalmohadas')} value={items.dalmohadas || '0'} className="form-control form-control-sm  " />
                            </div>
                        </div>
                    </IonList> </> :''}

                    {/*OIM */}

                    {(items.quiendoa == '2' && items.noalimentarias == '2') ? <> 
                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Kit de cocina:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'ococina')} value={items.ococina || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Hábitat:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'oaseohogar')} value={items.oaseohogar || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Menaje Familiar:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'oaseofamiliar')} value={items.oaseofamiliar || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit climatico Adultos y Adolescentes:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'oasehombre')} value={items.oasehombre || '0'} className="form-control form-control-sm  " />
                            </div>
                        </div>
                    </IonList>
                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Kit climatico NN:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'oaseomujer')} value={items.oaseomujer || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Hombre:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'oaseonna')} value={items.oaseonna || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Mujer y Adolescentes:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'oaseoinfantil')} value={items.oaseoinfantil || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene NN:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'oaseoespecial')} value={items.oaseoespecial || '0'} className="form-control form-control-sm  " />
                            </div>
                        </div>
                    </IonList>
                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Kit Higiene Bebe:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'ocolchonetas')} value={items.ocolchonetas || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Gestantes:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'ocobijas')} value={items.ocobijas || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit escolar Primaria:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'osabanas')} value={items.osabanas || '0'} className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm">
                                <label className="form-label" >Kit Escolar Bachillerato:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'oalmohadas')} value={items.oalmohadas || '0'} className="form-control form-control-sm  " />
                            </div>
                        </div>
                    </IonList> </> :''}

                    <IonList>
                        <div className="alert alert-primary" role="alert">
                            <span className="badge badge-secondary text-dark">OTRAS AYUDAS</span>
                        </div>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm-6">
                                <label className="form-label">Otras ayudas:</label>
                                <select onChange={(e) => handleInputChange(e, 'otros')} value={items.otros || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option><option value="1"> NO </option><option value="2"> SI </option>
                                </select>
                            </div> {(items.otros == '2') ?
                            <div className="col-sm-6">
                                <label className="form-label" >Que entidad:</label>
                                <input type="text" onChange={(e) => handleInputChange(e, 'entidadotros')} value={items.entidadotros || ''} placeholder="" className="form-control form-control-sm  " />
                            </div>:''}{(items.otros == '2') ?
                            <div className="col-sm-6">
                                <label className="form-label" >Cuales:</label>
                                <input type="text" onChange={(e) => handleInputChange(e, 'cuales')} value={items.cuales || ''} placeholder="" className="form-control form-control-sm  " />
                            </div>:''}{(items.otros == '2') ?
                            <div className="col-sm-6">
                                <label className="form-label" >Cuantos:</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'tipoc')} value={items.tipoc || ''} className="form-control form-control-sm  " required />
                            </div> :''}
                        </div>
                    </IonList>

                    <IonList>
                        <div className="alert alert-primary" role="alert">
                            <span className="badge badge-secondary text-dark">ENTREGA DE AYUDA</span>
                        </div>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm-6">
                                <label className="form-label">Quien recibe la ayuda:</label>
                                <select onChange={(e) => handleInputChange(e, 'redentrega')} value={items.redentrega || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option><option value="1"> INTEGRANTE DEL HOGAR </option><option value="2"> RED FAMILIAR O RED SOCIAL </option>
                                </select>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label">Integrante que recibe o autotiza:</label>
                                <select onChange={(e) => handleInputChange(e, 'idintegrante')} value={items.idintegrante || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option>
                                    {integrantes.map((integrante) => (
                                        <option key={integrante.idintegrante} value={integrante.idintegrante}>
                                            {`${integrante.nombre1} ${integrante.nombre2} ${integrante.apellido1} ${integrante.apellido2}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" >Nombre de quién recibe ayuda</label>
                                <input type="text" onChange={(e) => handleInputChange(e, 'nombrerecibeayuda')} value={items.nombrerecibeayuda || ''} disabled={(items.redentrega == '2' )?false:true} placeholder="" className="form-control form-control-sm  " />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" >Documento de identidad de quién recibe ayuda</label>
                                <input type="number" placeholder="" onChange={(e) => handleInputChange(e, 'documentorecibeayuda')} value={items.documentorecibeayuda || ''} disabled={(items.redentrega == '2' )?false:true} className="form-control form-control-sm  "  />
                            </div>
                        </div>
                    </IonList>


                    <IonList>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <label className="form-label" >Fecha de entrega:</label>
                                <input type="date" onChange={(e) => handleInputChange(e, 'fechadeentrega')} value={items.fechadeentrega || ''} placeholder="" className="form-control form-control-sm  " required/>
                            </div>
                            <div className="col-sm">
                                <label className="form-label">La ayuda fue entregada:</label>
                                <select onChange={(e) => handleInputChange(e, 'entregado')} value={items.entregado || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option><option value="1"> NO </option><option value="2"> SI </option>
                                </select>
                            </div>
                            <div className="col-sm">
                                <label className="form-label">Tipo de entrega:</label>
                                <select onChange={(e) => handleInputChange(e, 'tipoentraga')} value={items.tipoentraga || ''} className="form-control form-control-sm" id="pregunta2_3" aria-describedby="validationServer04Feedback" required>
                                    <option value=""> SELECCIONE </option><option value="1"> PRIMERA ENTREGA </option><option value="2"> SEGUIMIENTO </option>
                                </select>
                            </div>
                        </div>
                    </IonList>

                    <IonList>
                        <div className="alert alert-primary" role="alert">
                            <span className="badge badge-secondary text-dark">OBSERVACIONES</span>
                        </div>
                        <div className="row g-3 was-validated ">
                            <div className="col-sm">
                                <textarea type="text" rows="5" onChange={(e) => handleInputChange(e, 'observacion')} value={items.observacion || ''} placeholder="" className="form-control form-control-sm  " required/>
                            </div>
                        </div>
                    </IonList>{(items.redentrega == '2' )?<>
                    <IonList> 
                        <div className="alert alert-primary" role="alert">
                            <span className="badge badge-secondary text-dark">FIRMA DEL USUARIO QUIÉN RECIBE LA AYUDA:</span>
                            <span className='badge text-dark'>En este módulo puedes pedir al usuario que realice su firma a mano alzada, esta informacion se visualizara en el PDF. En el siguiente cuadro realiza la firma y cuando este fimado oprime el boton</span>


                            <br /> <span className="badge badge-secondary text-dark">Cargar Firma</span>
                        </div>
                        <div className=' text-center'>
                            <img src={items.draw_dataUrl} alt="" />
                        </div><hr />
                    </IonList>

                    <TouchPad onSave={handleSave}></TouchPad>

                    <br />  </>:''}

                </div>

                <br />

                <div><button className='btn btn-success' type="submit" onClick={(e)=>(enviar(db,e))}>Guardar</button>&nbsp;
                <div className="btn btn-primary" onClick={() => window.location.href = `/tabs/tab12/${params.ficha}`}>Volver</div>
                </div>
                 </form>
            </IonContent> 
        </IonPage>
    );
};

export default IngresarAyudas;

import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IonList } from '@ionic/react';

function TouchPad({ onSave }) {
    const sigCanvas = useRef({});
    const [penColor, setPenColor] = useState('#000000'); // Usando un color inicial en formato hexadecimal
    const [imageURL, setImageURL] = useState(''); // Estado para almacenar la imagen de la firma
    const [blobURL, setBlobURL] = useState(''); 

    // Limpia el canvas de la firma
    const clearCanvas = () => {
        sigCanvas.current.clear();
        setImageURL(''); // También limpia la imagen mostrada
        setBlobURL('');
    };

    const dataURLToBlob = (dataURL) => {
        const parts = dataURL.split(';base64,');
        const byteString = atob(parts[1]);
        const mimeString = parts[0].split(':')[1];

        const buffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(buffer);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        return new Blob([buffer], { type: mimeString });
    };

    // Guarda la imagen de la firma
    const saveSignature = () => {
        if (sigCanvas.current.isEmpty()) {
            alert('Por favor, firma antes de guardar.');
            return;
        }
        const image = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        setImageURL(image); // Guarda la imagen de la firma en el estado
        const blob = dataURLToBlob(image);
        const url=image // = URL.createObjectURL(blob);
        setBlobURL(url); // Guarda la URL del blob en el estado

        if (onSave) {
            onSave(url); // Llama a la función de devolución de llamada si está definida
        }
    };

    return (

        <div className='text-center shadow  bg-white rounded'>
            <div style={{ marginBottom: '10px' }}>
                <div className='btn btn-success btn-sm' onClick={saveSignature}>Cargar Firma</div>
                <div className='btn btn-danger btn-sm' onClick={clearCanvas} style={{ marginLeft: '5px' }}>Limpiar Firma</div>
                <label style={{ marginLeft: '10px', }}>
                    COLOR:
                    <input 
                        className='btn  btn-sm'
                        type="color"
                        value={penColor}
                        onChange={(e) => setPenColor(e.target.value)}
                    />
                </label>
            </div>
            <SignaturePad
                ref={sigCanvas}
                penColor={penColor}
                canvasProps={{
                    width: 500, // Asegúrate de que el canvas tenga un tamaño fijo o se adapte adecuadamente
                    height: 200,
                    className: 'sigCanvas',
                    style: { border: '1px solid #ccc' }
                }}
            />
            <hr />
            {/* {imageURL && (
                <div style={{ marginTop: '10px', justifyContent:'center' }} className='d-flex center'>
                    <img src={imageURL} alt="Firma del usuario" style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
                </div>
            )} */}
            <div style={{ marginTop: '10px' }}>
                Aquí aparecerá la firma del usuario cargada.
            </div>
        </div>

    );
}

export default TouchPad;

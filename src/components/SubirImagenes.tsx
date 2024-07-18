import React, { useState, useRef, useEffect } from 'react';
import SubirImagenesCss from './SubirImagenes.css';
function SubirImagenes() {
    const [image, setImage] = useState(null);  // Estado para almacenar la imagen
    const [preview, setPreview] = useState('');  // Estado para la URL de previsualización de la imagen
    const [showModal, setShowModal] = useState(false);  // Estado para mostrar/ocultar el modal

    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];  // Obtiene el archivo de la entrada del usuario
        if (file && file.type.startsWith("image")) {
            setImage(file);  // Actualiza el estado de la imagen
        } else {
            setImage(null);
        }
    };

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);  // Establece la URL de previsualización de la imagen
            };
            reader.readAsDataURL(image);
        } else {
            setPreview('');
        }
    }, [image]);

    return (
        <div>
            <div className="form-group col-sm">
                <label>Adjuntar archivo:</label>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <button onClick={() => fileInputRef.current.click()} className="btn btn-info btn-sm text-light">
                            Cargar Imagen
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />
                        <button className="btn btn-info btn-sm text-light" type="button" onClick={() => setShowModal(true)}>
                            Ver
                        </button>
                    </div>
                    <input type="text" id="nameFile" className="form-control form-control-sm" placeholder="" value={image ? image.name : ''} disabled />
                </div>
            </div>
            {preview && (
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
                                <div className="modal-body">
                                    <img src={preview} alt="Preview" style={{ width: "100%", height: "auto" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default SubirImagenes;

import React, { useState } from 'react';

const AddIntegrantesModal = ({ showModal, handleCloseModal, handleSaveIntegrantes, allIntegrantes }) => {
  const [selectedIntegrantes, setSelectedIntegrantes] = useState([]);

  const handleCheckboxChange = (event, integrante) => {
    const { checked } = event.target;
    setSelectedIntegrantes((prevSelected) =>
      checked ? [...prevSelected, integrante] : prevSelected.filter((i) => i !== integrante)
    );
  };

  const handleSave = () => {
    handleSaveIntegrantes(selectedIntegrantes);
    handleCloseModal();
  };

  return (
    <>
      {showModal && (
        <div className={`modal ${showModal ? "d-block" : "d-none"} modalnew modal-backdropnew`} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document"><br /><br /><br />
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" aria-label="Close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h5>Agregar Integrantes</h5>
                {allIntegrantes.map((integrante) => (
                  <div key={integrante.idintegrante}>
                    <input
                      type="checkbox"
                      id={`integrante-${integrante.idintegrante}`}
                      onChange={(event) => handleCheckboxChange(event, integrante.idintegrante)}
                    />
                    <label htmlFor={`integrante-${integrante.idintegrante}`}>
                      {integrante.nombre1} {integrante.apellido1}
                    </label>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddIntegrantesModal;

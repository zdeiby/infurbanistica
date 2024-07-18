import React from "react";
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonList ,useIonViewDidEnter, IonLabel,IonItem,IonAccordion, IonAccordionGroup, } from '@ionic/react';
import { Person } from "../models/person.model";
import { useHistory } from 'react-router-dom';

const EmployeeItem: React.FC<{person:Person}> = ({person})=> {
    const history = useHistory();
    const handleEditClick = () => {
        console.log("Ficha a editar:", person.ficha); // Solo un ejemplo, aquí iría la lógica real
        // Aquí puedes agregar la lógica para editar la ficha, como abrir un modal o cambiar de página
        // Por ejemplo:
        // openEditModal(person.ficha);
        // o
        //history.push(`/tabs/tab1/${person.ficha}`);
        window.location.href = `/tabs/tab1/${person.ficha}`;
      };

    return (
<>
<IonAccordionGroup >
<IonAccordion value="first">
  <IonItem slot="header" color="light">
  <IonLabel>  
    <IonButton onClick={handleEditClick}>
        Editar
    </IonButton> 
            </IonLabel>
            <IonLabel> 
            <h2>{person.name}</h2>
            </IonLabel>
            <IonLabel>
            <h2>{person.ficha}</h2>
            </IonLabel>
            <IonLabel>
            <h2>{person.ficha}</h2>
            </IonLabel>

            
  </IonItem>
  
  <div className="ion-padding" slot="content">
    <IonList>
          
        <IonItem>
            <IonLabel> 
            <p>Recupera Fallida</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel> 
            <p>Inquilinato</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel>
            <p>Remisión aprobada</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel>
            <p>Motivo visita</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel>
            <p>Fecha visita</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel>
            <p>Tipo de evento</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel>
            <p>Comuna</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel>
            <p>Barrio</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel>
            <p>Sector</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel>
            <p>Dirección</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel>
            <p>Profesional</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
        <IonItem>
            <IonLabel>
            <p>Digitador</p>
            <h2>{person.name}</h2>
            </IonLabel>
        </IonItem>
    </IonList>
  </div>
</IonAccordion>

</IonAccordionGroup>

        </>
    );
}

export default EmployeeItem;


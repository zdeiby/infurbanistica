import { Redirect, Route,useParams } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  setupIonicReact, IonButton
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Tab5 from './pages/Tab5';
import Tab6 from './pages/Tab6';
import Tab7 from './pages/Tab7';
import Tab8 from './pages/Tab8';
import Tab9 from './pages/Tab9';
import Tab10 from './pages/Tab10';
import Tab11 from './pages/Tab11';
import Tab12 from './pages/Tab12';
import Tab13 from './pages/Tab13';
import Tab14 from './pages/Tab14';
import Tab15 from './pages/Tab15';
import Tab16 from './pages/Tab16';
import Tab1Copia from './pages/Tab1copia';
import Tab17 from './pages/tab17';
import Login from './pages/Login';
import IngresarIntegrantes from './pages/IngresarIntegrantes';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';
import Cobertura from './pages/Cobertura';
import MenuLat from './components/MenuLat';
import IngresarAyudas from './pages/ingresarayudas';
import EditarUbi from './pages/ubicacionposterioreditar';
import DownloadDatabase from './pages/descargarbd';
import Tab18 from './pages/Tab18';

setupIonicReact();

const App: React.FC = () => {
  
  return(
  <IonApp>
    <IonReactRouter>
      <MenuLat />
      <IonRouterOutlet >
        <Route exact path="/cobertura">
          <Cobertura />
        </Route>
        <Route exact path="/copia">
          <Tab1Copia />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route> 
        <Route exact path="/descargardb">
          <DownloadDatabase />
        </Route>
        <Route path="/tabs" >
          <IonPage id="main">
            <IonHeader>
              <IonToolbar>
                <IonMenuButton slot="start" />
                <IonTitle>Numerales Realizados</IonTitle> 
                <IonButton slot="end" color="success" onClick={() => {
                window.location.href = '/cobertura';
              }}>Ir a cobertura</IonButton>
                <IonButton slot="end" onClick={() => {
                localStorage.removeItem('cedula');
                window.location.href = '/login';
              }}>Cerrar Sesión</IonButton>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonRouterOutlet>
                <Route exact path="/tabs/tab1/:ficha">
                  <Tab1 />
                </Route>
                <Route exact path="/tabs/tabintegrantes/:ficha">
                  <IngresarIntegrantes /> 
                </Route>
                <Route exact path="/tabs/tabeditarubicaciones/:ficha">
                  <EditarUbi /> 
                </Route>
                <Route exact path="/tabs/tabayudas/:ficha">
                  <IngresarAyudas /> 
                </Route>
                <Route exact path="/tabs/tab2/:ficha">
                  <Tab2 />
                </Route>
                <Route exact path="/tabs/tab3/:ficha">
                  <Tab3 />
                </Route>
                <Route exact path="/tabs/tab4/:ficha">
                  <Tab4 />
                </Route>
                <Route exact path="/tabs/tab5/:ficha">
                  <Tab5 />
                </Route>
                <Route exact path="/tabs/tab6/:ficha">
                  <Tab6 />
                </Route>
                <Route exact path="/tabs/tab7/:ficha">
                  <Tab7 />
                </Route>
                <Route exact path="/tabs/tab8/:ficha">
                  <Tab8 />
                </Route>
                <Route exact path="/tabs/tab9/:ficha">
                  <Tab9 />
                </Route>
                <Route exact path="/tabs/tab10/:ficha">
                  <Tab10 />
                </Route>
                <Route exact path="/tabs/tab11/:ficha">
                  <Tab11 />
                </Route>
                <Route exact path="/tabs/tab12/:ficha">
                  <Tab12 />
                </Route>
                <Route exact path="/tabs/tab13/:ficha">
                  <Tab13 />
                </Route>
                <Route exact path="/tabs/tab14/:ficha">
                  <Tab14 />
                </Route>
                <Route exact path="/tabs/tab15/:ficha">
                  <Tab15 />
                </Route>
                <Route exact path="/tabs/tab16/:ficha">
                  <Tab16 />
                </Route>
                <Route exact path="/tabs/tab18/:ficha">
                  <Tab18 />
                </Route>
                <Route exact path="/tabs/tab17/:ficha">
                  <Tab17 />
                </Route>
                <Route exact path="/tabs">
                  <Redirect to="/login" />
                </Route>
              </IonRouterOutlet>
            </IonContent>
          </IonPage>
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);
};

export default App;

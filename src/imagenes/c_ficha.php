<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');

class  C_ficha extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->helper('url');
        $this->load->library('session');
        $this->load->model(array('/comisionsocial/m_ficha', '/general/m_herramientas'));
        $this->load->library('user_agent');

        if( $this->session->userdata('usuario') == '')
        {
            redirect(base_url()."index.php/login/acceso/");
        }

    }


    public function informacionevento($page = '0_informaciondelevento')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '0_informaciondelevento';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
		$datos['fichatecnia'] = 'Pendiente';
		$datos['motivovisita'] = '';
		$datos['horaactivacion'] = '';
        $datos['horaatencion'] = '';
        $datos['fechavisita'] = '';
        $datos['opcmotivovisita'] = '';
        $datos['tipo'] = '';
        $datos['tipovisita'] = '';
        $datos['horallegadaalevento'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['fichatecnia'] = $arrayg->fichatecnia;
            $datos['motivovisita'] = $arrayg->motivovisita;
            $datos['horaactivacion'] = $arrayg->horaactivacion;
            $datos['horaatencion'] = $arrayg->horaatencion;
            $datos['fechavisita'] = $arrayg->fechavisita;
            $datos['tipo'] = $arrayg->tipo;
            $datos['siguiente'] =  '';
            $datos['tipovisita'] =  $arrayg->tipovisita;
            $datos['horallegadaalevento'] = $arrayg->horallegadaalevento;
		}

        $datos['opcmotivovisita'] = $this->m_herramientas->mostrarselect('t1_motivovisita');
        $datos['t1_tipovisita'] = $this->m_herramientas->mostrarselect('t1_tipovisita');

        $datos['sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');

        $datosb['botones'] = $this->botoneracap($id);
        if($datos['tipovisita'] == '4')
        {
            $datosb['botones'] = $this->botoneralocal($id);
        }        

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function identificaciondelevento($page = '1_identificacionevento')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '1_identificacionevento';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['visitadagrd'] = '';
		$datos['tipoevento'] = '';
        $datos['otro'] = 'NO APLICA';
        $datos['quebrada'] = 'NO APLICA';
        $datos['inquilinato'] = '1';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['visitadagrd'] = $arrayg->visitadagrd;
            $datos['tipoevento'] = $arrayg->tipoevento;
            $datos['otro'] = $arrayg->otro;
            $datos['quebrada'] = $arrayg->quebrada;
            $datos['inquilinato'] = $arrayg->inquilinato;

            $datos['siguiente'] =  '';
		}

        //verificar si es emergencia
        $arraygeneralmotivo = $this->m_herramientas->mostrarconid('0_informaciondelevento', 'fichasocial ='.$id);
		$datos['motivovisita'] = '';
        $datos['deshabilitaremergencia'] = 'required';
        $datos['mensajeemergecencia'] = '';

		foreach($arraygeneralmotivo as $arrayg)
		{
            $datos['motivovisita'] = $arrayg->motivovisita;
		}
        if ($datos['motivovisita'] == '1')
        {
            $datos['deshabilitaremergencia'] = '';
            $datos['mensajeemergecencia'] = '<small id="tel1Help" class="form-text text-muted">La fecha 01/01/1900 es la fecha no aplica por defecto.</small>';

            if($datos['visitadagrd'] == '')
            {
                $datos['visitadagrd'] = '1900-01-01';
            }


        }
        //fin verficar si es emergencia

        $datos['opctipoevento'] = $this->m_herramientas->mostrarselect('t1_tipodeevento');
        $datos['t1_sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');
        
        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function localizaciondelevento($page = '2_localizaciondelevento')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '2_localizaciondelevento';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['barrio'] = '';
        $datos['comuna'] = '';
        $datos['correo'] = '';
        $datos['dirCampo1'] = '';
        $datos['dirCampo2'] = '';
        $datos['dirCampo3'] = '';
        $datos['dirCampo4'] = '';
        $datos['dirCampo5'] = '';
        $datos['dirCampo6'] = '';
        $datos['dirCampo7'] = '';
        $datos['dirCampo8'] = '';
        $datos['dirCampo9'] = '';
        $datos['direccion'] = '';
        $datos['estrato'] = '';
        $datos['ruralurbano'] = '';
        $datos['sector'] = '';
        $datos['telefono1'] = '';
        $datos['telefono2'] = '';
        $datos['latitud'] = '';
        $datos['longitud'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['barrio'] = $arrayg->barrio;
            $datos['comuna'] = $arrayg->comuna;
            $datos['correo'] = $arrayg->correo;
            $datos['dirCampo1'] = $arrayg->dirCampo1;
            $datos['dirCampo2'] = $arrayg->dirCampo2;
            $datos['dirCampo3'] = $arrayg->dirCampo3;
            $datos['dirCampo4'] = $arrayg->dirCampo4;
            $datos['dirCampo5'] = $arrayg->dirCampo5;
            $datos['dirCampo6'] = $arrayg->dirCampo6;
            $datos['dirCampo7'] = $arrayg->dirCampo7;
            $datos['dirCampo8'] = $arrayg->dirCampo8;
            $datos['dirCampo9'] = $arrayg->dirCampo9;
            $datos['direccion'] = $arrayg->direccion;
            $datos['estrato'] = $arrayg->estrato;
            $datos['ruralurbano'] = $arrayg->ruralurbano;
            $datos['sector'] = $arrayg->sector;
            $datos['telefono1'] = $arrayg->telefono1;
            $datos['telefono2'] = $arrayg->telefono2;
            $datos['latitud'] = $arrayg->latitud;
            $datos['longitud'] = $arrayg->longitud;
            $datos['siguiente'] =  '';
            
		}

        $datos['t1_dir_orientacion'] = $this->m_herramientas->mostrarselect('t1_dir_orientacion');
        $datos['t1_dir_tipo_via'] = $this->m_herramientas->mostrarselect('t1_dir_tipo_via');
        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_barrios'] = $this->m_herramientas->mostrarselect('t1_barrios');
        $datos['t1_ruralurbano'] = $this->m_herramientas->mostrarselect('t1_ruralurbano');


        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function evaluacionydanos($page = '3_evacuacionydanos')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '3_evacuacionydanos';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['tipoevacuacion'] = '';
		$datos['danosvivienda'] = '';
        $datos['danosenseres'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['tipoevacuacion'] = $arrayg->tipoevacuacion;
            $datos['danosvivienda'] = $arrayg->danosvivienda;
            $datos['danosenseres'] = $arrayg->danosenseres;

            $datos['siguiente'] =  '';
		}

        $datos['t1_tipoevacuacion'] = $this->m_herramientas->mostrarselect('t1_tipoevacuacion');
        $datos['t1_tipodanos'] = $this->m_herramientas->mostrarselect('t1_tipodanos');

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function datosdelavivienda($page = '4_datosdelavivienda')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '4_datosdelavivienda';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
		$datos['tipovivienda'] = '';
		$datos['materialpisos'] = '';
		$datos['materialpisosotro'] = '';
        $datos['materialparedes'] = '';
        $datos['materialtechos'] = '';


		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['tipovivienda'] = $arrayg->tipovivienda;
            $datos['materialpisos'] = $arrayg->materialpisos;
            $datos['materialpisosotro'] = $arrayg->materialpisosotro;
            $datos['materialparedes'] = $arrayg->materialparedes;
            $datos['materialtechos'] = $arrayg->materialtechos;
            
            $datos['siguiente'] =  '';
		}

        $datos['opctipovivienda'] = $this->m_herramientas->mostrarselect('t1_tipovivienda');
        $datos['opcmaterialpredominantetecho'] = $this->m_herramientas->mostrarselect('t1_materialpredominantetecho');
        $datos['opcmaterialpredominantepisos'] = $this->m_herramientas->mostrarselect('t1_materialpredominantepisos');
        $datos['opcmaterialpredominanteparedes'] = $this->m_herramientas->mostrarselect('t1_materialpredominanteparedes');

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function serviciospublicos($page = '5_serviciospublicos')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '5_serviciospublicos';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
		$datos['energia'] = '';
		$datos['acueducto'] = '';
		$datos['alcantarillado'] = '';
        $datos['gas'] = '';
        $datos['telefono'] = '';
        $datos['telefonofijo'] = '';


		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['energia'] = $arrayg->energia;
            $datos['acueducto'] = $arrayg->acueducto;
            $datos['alcantarillado'] = $arrayg->alcantarillado;
            $datos['gas'] = $arrayg->gas;
            $datos['telefono'] = $arrayg->telefono;
            $datos['telefonofijo'] = $arrayg->telefonofijo;
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_tiposerviciospublicos_energia'] = $this->m_herramientas->mostrarselect('t1_tiposerviciospublicos_energia');
        $datos['t1_tiposerviciospublicos_acueducto'] = $this->m_herramientas->mostrarselect('t1_tiposerviciospublicos_acueducto');
        $datos['t1_tiposerviciospublicos_alcantarillado'] = $this->m_herramientas->mostrarselect('t1_tiposerviciospublicos_alcantarillado');
        $datos['t1_tiposerviciospublicos_telefono'] = $this->m_herramientas->mostrarselect('t1_tiposerviciospublicos_telefono');
        $datos['t1_tiposerviciospublicos_gas'] = $this->m_herramientas->mostrarselect('t1_tiposerviciospublicos_gas');

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function tiempoenlavivienda($page = '6_tiempoenlavivienda')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '6_tiempoenlavivienda';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['tiempovivienda'] = '';
        $datos['tiempoviviendaunidad'] = '';
        $datos['tiempomedellin'] = '';
        $datos['tiempomedellinunidad'] = '';
        $datos['dondeviviaantes'] = '';
        $datos['otrodepartamento'] = '';
        $datos['otropais'] = '';
        $datos['otracomuna'] = '';
        $datos['otrobarrio'] = '';
        $datos['otromunicipio'] = '';


		foreach($arraygeneral as $arrayg)
		{
            $datos['tiempovivienda'] = $arrayg->tiempovivienda;
            $datos['tiempoviviendaunidad'] = $arrayg->tiempoviviendaunidad;
            $datos['tiempomedellin'] = $arrayg->tiempomedellin;
            $datos['tiempomedellinunidad'] = $arrayg->tiempomedellinunidad;
            $datos['dondeviviaantes'] = $arrayg->dondeviviaantes;
            $datos['otrodepartamento'] = $arrayg->otrodepartamento;
            $datos['otropais'] = $arrayg->otropais;
            $datos['otracomuna'] = $arrayg->otracomuna;
            $datos['otrobarrio'] = $arrayg->otrobarrio;
            $datos['otromunicipio'] = $arrayg->otromunicipio;
            
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_barrios'] = $this->m_herramientas->mostrarselect('t1_barrios');
        $datos['t1_diasmesesanos'] = $this->m_herramientas->mostrarselect('t1_diasmesesanos');
        $datos['t1_dondeviviaantes'] = $this->m_herramientas->mostrarselectconid('t1_dondeviviaantes','id not in (3)');
        $datos['t1_municipiosantioquia'] = $this->m_herramientas->mostrarselect('t1_municipiosantioquia');
        $datos['t1_paises'] = $this->m_herramientas->mostrarselect('t1_paises');
        $datos['t1_departamentos'] = $this->m_herramientas->mostrarselect('t1_departamentos');

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function tenenciaydocumentosvivienda($page = '78_tenenciaydocumentosvivienda')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '78_tenenciaydocumentosvivienda';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['tenenciadelavivienda'] = '';
        $datos['propietario'] = '';
        $datos['propietariotel1'] = '';
        $datos['propietariotel2'] = '';
        $datos['escritura'] = '';
        $datos['compraventa'] = '';
        $datos['promesa'] = '';
        $datos['posesion'] = '';
        $datos['impuestopredial'] = '';
        $datos['serviciospublicos'] = '';
        $datos['matriculapredial'] = '';
        $datos['extrajuicio'] = '';
        $datos['ninguno'] = '';
        $datos['otro'] = '';
        $datos['cualdocumentos'] = '';
        $datos['unidadproductuva'] = '';
        $datos['cualunidadproductiva'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['tenenciadelavivienda'] = $arrayg->tenenciadelavivienda;
            $datos['propietario'] = $arrayg->propietario;
            $datos['propietariotel1'] = $arrayg->propietariotel1;
            $datos['propietariotel2'] = $arrayg->propietariotel2;
            $datos['escritura'] = $arrayg->escritura;
            $datos['compraventa'] = $arrayg->compraventa;
            $datos['promesa'] = $arrayg->promesa;
            $datos['posesion'] = $arrayg->posesion;
            $datos['impuestopredial'] = $arrayg->impuestopredial;
            $datos['serviciospublicos'] = $arrayg->serviciospublicos;
            $datos['matriculapredial'] = $arrayg->matriculapredial;
            $datos['extrajuicio'] = $arrayg->extrajuicio;
            $datos['ninguno'] = $arrayg->ninguno;
            $datos['otro'] = $arrayg->otro;
            $datos['cualdocumentos'] = $arrayg->cualdocumentos;
            $datos['unidadproductuva'] = $arrayg->unidadproductuva;
            $datos['cualunidadproductiva'] = $arrayg->cualunidadproductiva;
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');
        $datos['t1_tenenciadelavivienda'] = $this->m_herramientas->mostrarselect('t1_tenenciadelavivienda');

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function mascotas($page = '14_mascotas')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '14_mascotas';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['tienemascotas'] = '';
        $datos['cuantos'] = '';
        $datos['albergalos'] = '';
        $datos['donde'] = '';
        $datos['cuales'] = '';
        $datos['requierealbergue'] = '';
        $datos['dondelista'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['tienemascotas'] = $arrayg->tienemascotas;
            $datos['cuantos'] = $arrayg->cuantos;
            $datos['albergalos'] = $arrayg->albergalos;
            $datos['donde'] = $arrayg->donde;
            $datos['cuales'] = $arrayg->cuales;
            $datos['requierealbergue'] = $arrayg->requierealbergue;
            $datos['dondelista'] = $arrayg->dondelista;
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');
        $datos['t1_dondealbergue'] = $this->m_herramientas->mostrarselect('t1_dondealbergue');
        $datos['t1_requierealbergue'] = $this->m_herramientas->mostrarselect('t1_requierealbergue');

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function ubicacionposterioratencionsocial($page = '15_ubicacionposterioratencionsocial')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '15_ubicacionposterioratencionsocial';

        $id = $this->input->get('fichasocial');

        if(empty($this->input->get('ubicacionposterior')))
        {
            $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);
        }
        else
        {
            $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id.' and ubicacionposterior = '. $this->input->get('ubicacionposterior'));
        }        

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['ubicacionposterior'] = '';
        $datos['cualtemporal'] = '';
        $datos['dondeauxilio'] = '';
        $datos['nombreauto'] = '';
        $datos['parentesco'] = '';
        $datos['prestada'] = '';
        $datos['cuallugardistinto'] = '';
        $datos['direccion'] = '';
        $datos['comuna'] = '';
        $datos['barrio'] = '';
        $datos['ruralurbano'] = '';
        $datos['sector'] = '';
        $datos['telefono1'] = '';
        $datos['telefono2'] = '';
        $datos['dirCampo1'] = '';
        $datos['dirCampo2'] = '';
        $datos['dirCampo3'] = '';
        $datos['dirCampo4'] = '';
        $datos['dirCampo5'] = '';
        $datos['dirCampo6'] = '';
        $datos['dirCampo7'] = '';
        $datos['dirCampo8'] = '';
        $datos['dirCampo9'] = '';
        $datos['ubicacion'] = '';
        $datos['pais'] = '';
        $datos['departamento'] = '';
        $datos['municipio'] = '';
        

		foreach($arraygeneral as $arrayg)
		{
            $datos['ubicacionposterior'] = $arrayg->ubicacionposterior;
            $datos['cualtemporal'] = $arrayg->cualtemporal;
            $datos['dondeauxilio'] = $arrayg->dondeauxilio;
            $datos['nombreauto'] = $arrayg->nombreauto;
            $datos['parentesco'] = $arrayg->parentesco;
            $datos['prestada'] = $arrayg->prestada;
            $datos['cuallugardistinto'] = $arrayg->cuallugardistinto;
            $datos['direccion'] = $arrayg->direccion;
            $datos['comuna'] = $arrayg->comuna;
            $datos['barrio'] = $arrayg->barrio;
            $datos['ruralurbano'] = $arrayg->ruralurbano;
            $datos['sector'] = $arrayg->sector;
            $datos['telefono1'] = $arrayg->telefono1;
            $datos['telefono2'] = $arrayg->telefono2;
            $datos['dirCampo1'] = $arrayg->dirCampo1;
            $datos['dirCampo2'] = $arrayg->dirCampo2;
            $datos['dirCampo3'] = $arrayg->dirCampo3;
            $datos['dirCampo4'] = $arrayg->dirCampo4;
            $datos['dirCampo5'] = $arrayg->dirCampo5;
            $datos['dirCampo6'] = $arrayg->dirCampo6;
            $datos['dirCampo7'] = $arrayg->dirCampo7;
            $datos['dirCampo8'] = $arrayg->dirCampo8;
            $datos['dirCampo9'] = $arrayg->dirCampo9;
            $datos['ubicacion'] = $arrayg->ubicacion;
            $datos['pais'] = $arrayg->pais;
            $datos['departamento'] = $arrayg->departamento;
            $datos['municipio'] = $arrayg->municipio;

            $datos['siguiente'] =  '';
            
		}

        $datos['t1_dir_orientacion'] = $this->m_herramientas->mostrarselect('t1_dir_orientacion');
        $datos['t1_dir_tipo_via'] = $this->m_herramientas->mostrarselect('t1_dir_tipo_via');
        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_barrios'] = $this->m_herramientas->mostrarselect('t1_barrios');
        $datos['t1_ruralurbano'] = $this->m_herramientas->mostrarselect('t1_ruralurbano');
        $datos['t1_municipiosantioquia'] = $this->m_herramientas->mostrarselect('t1_municipiosantioquia');
        $datos['t1_paises'] = $this->m_herramientas->mostrarselect('t1_paises');
        $datos['t1_departamentos'] = $this->m_herramientas->mostrarselect('t1_departamentos');
        $datos['t1_ubicacionposterior'] = $this->m_herramientas->mostrarselect('t1_ubicacionposterior');
        $datos['t1_ubicacionposteriordonde'] = $this->m_herramientas->mostrarselect('t1_ubicacionposteriordonde');
        $datos['t1_parentesco'] = $this->m_herramientas->mostrarselect('t1_parentesco');

        //vista dos

        $datos['tabla2'] = '15_ubicacionposterioratencionsocial';
        $datos['vista'] = 'vw_ubicacion_posterior';

        $arrayintegrantes = $this->m_herramientas->mostrarconid($datos['vista'], 'fichasocial ='.$datos['fichasocial']);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $sumarinteasignados = 0;
        $contarceros = 0;

        foreach($arrayintegrantes as $arrayg)
        {
            $datos['Integranteshogar'] .= '<tr>
            <td>
                <button type="button" class="btn btn-info btn-sm" onclick="btneliminar('.$arrayg->ubicacionposterior.')">Eliminar</button>
                <button type="button" class="btn btn-info btn-sm" onclick="btnverubicacion('.$arrayg->ubicacionposterior.','.$arrayg->fichasocial.')">Ver</button>
                <button type="button" class="btn btn-info btn-sm" onclick="btnmostrarmodal('.$arrayg->ubicacionposterior.','.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop">
                 Agregar integrantes
                </button>
            </td>
            <td>' . $arrayg->ubicacionpos . '</td>
            <td>' . $arrayg->cantidadintegrantes . '</td>
            <td></td>
            </tr>';

            $sumarinteasignados = $sumarinteasignados + $arrayg->cantidadintegrantes;

            if ($arrayg->cantidadintegrantes == 0)
            {
                $contarceros++;
            }
        }

        //validar integrantes

        $arraynumintegrantes = $this->m_herramientas->mostrarconid('vw_listaintegrantes', 'fichasocial ='.$id);
        $numerointegrntesval = count($arraynumintegrantes);
        $diferenciaintegrantes =  $numerointegrntesval - $sumarinteasignados;
        $datos['valIntegranteshogar'] = '';
        $datos['valubicacion'] = '';

        if($diferenciaintegrantes != 0)
        {
            $datos['valIntegranteshogar'] =  '<div class="row">
                                                <div class="col-sm">
                                                    <div class="alert alert-danger" role="alert">
                                                        Faltan '. $diferenciaintegrantes.' integrantes por ubicar.
                                                    </div>
                                                </div>
                                            </div>';
            $datos['siguiente'] =  'disabled';
        }

        if($contarceros != 0)
        {
            $datos['valubicacion'] =  '<div class="row">
                                                <div class="col-sm">
                                                    <div class="alert alert-danger" role="alert">
                                                        Tienes '. $contarceros.' Ubicacion sin asignacion de integrantes.
                                                    </div>
                                                </div>
                                            </div>';
            $datos['siguiente'] =  'disabled';
        }


        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function abrirmodal()
    {
        $fichasocial = $this->input->post('fichasocial');
        $ubicacionposterior = $this->input->post('ubicacionposterior');

        $chintegrantes = $this->traerintegrantesubicacionposterior($fichasocial, $ubicacionposterior);

        echo  $chintegrantes;
    }

    public function traerintegrantesubicacionposterior($fichasocial, $ubicacionposterior)
    {   
        $datos['Integranteshogar'] = '<button type="button" class="btn btn-info btn-sm" onclick="guardartodosubicacionposterior('.$fichasocial.','.$ubicacionposterior.');">Seleccionar todos</button>';
        $chequeo = '';

        $arraygeneral = $this->m_herramientas->mostrarconid('vw_ubicacion_posterior_int', 'fichasocial ='.$fichasocial); 

        foreach($arraygeneral as $arrayg)
        {
            if($arrayg->ubicacionpos == 'SIN ASIGNAR')
            {
                $chequeo = '';
            }
            else
            {
                $chequeo = 'checked';
            }

            $datos['Integranteshogar'] .= '<div class="form-check">
                                                <input class="form-check-input" type="checkbox" '.$chequeo.' value="'.$arrayg->id.'" id="chintegrante'.$arrayg->id.'" onchange="valorch(this.value,'.$fichasocial.','.$ubicacionposterior.')">
                                                <label class="form-check-label" for="chintegrante'.$arrayg->id.'">
                                                    '.$arrayg->descripcion.' - '.$arrayg->ubicacionpos.'
                                                </label>
                                            </div>';
        }
        
        return $datos['Integranteshogar'];        
    }

    //guardar todos posterior
    public function guardartodosubicacionposterior()
    { 
        $fichasocial = $this->input->post('fichasocial');
        $ubicacionposterior = $this->input->post('ubicacionposterior');
        $fecharegistro = $this->input->post('fecharegistro');
        $usuario = $this->input->post('usuario');
        $estado = $this->input->post('estado');
        $tabla = $this->input->post('tabla');

        $arraygeneral = $this->m_herramientas->mostrarconid('vw_ubicacion_posterior_int', 'fichasocial ='.$fichasocial); 

        foreach($arraygeneral as $arrayg)
        {
            $arrayguardar = ['idintegrante' => $arrayg->id,
                            'fichasocial' => $fichasocial,
                            'ubicacionposterior' => $ubicacionposterior,
                            'fecharegistro' => $fecharegistro,
                            'usuario' => $usuario,
                            'estado' => $estado,
                            'tabla' => $tabla];

            $this->m_herramientas->guardar($tabla, $arrayguardar);

        }
       
    }

    //fin guardar todos posterior

    public function integrante($page = '131_integrante')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '131_integrante';

        $idfichasocial = $this->input->get('fichasocial');
        $idintegrante = $this->input->get('idintegrante');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idintegrante ='.$idintegrante);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';
        $datos['verestado'] = ' style="display:none"';
        $datos['vercalcelar'] = ' style="display:none"';

        $datos['idintegrante'] = $idintegrante;
		$datos['fichasocial'] = $idfichasocial;

        if($datos['idintegrante'] == 0)
        {$datos['vercalcelar'] = '';}

        $datos['codigosibis'] = '';
        $datos['tipodedocumento'] = '';
        $datos['nacionalidad'] = '';
        $datos['numerodedocumento'] = '';
        $datos['nombre1'] = '';
        $datos['nombre2'] = '';
        $datos['apellido1'] = '';
        $datos['apellido2'] = '';
        $datos['fechadenacimiento'] = '';
        $datos['sexo'] = '';
        $datos['orientacionsexual'] = '';
        $datos['identidaddegenero'] = '';
        $datos['etnia'] = '7';
        $datos['estadocivil'] = '';
        $datos['gestantelactante'] = '4';
        $datos['escolaridad'] = '';
        $datos['parentesco'] = '';
        $datos['discapacidad'] = '1';
        $datos['regimendesalud'] = '';
        $datos['enfermedades'] = '6';
        $datos['actividad'] = '';
        $datos['ocupacion'] = '';
        $datos['estadousuario'] = '3';
        $datos['campesino'] = '';
        $datos['desplazado'] = '';
        $datos['sisbenizado'] = '';
        $datos['victima'] = '';


		foreach($arraygeneral as $arrayg)
		{
            $datos['codigosibis'] = $arrayg->codigosibis;
            $datos['tipodedocumento'] = $arrayg->tipodedocumento;
            $datos['nacionalidad'] = $arrayg->nacionalidad;
            $datos['numerodedocumento'] = $arrayg->numerodedocumento;
            $datos['nombre1'] = $arrayg->nombre1;
            $datos['nombre2'] = $arrayg->nombre2;
            $datos['apellido1'] = $arrayg->apellido1;
            $datos['apellido2'] = $arrayg->apellido2;
            $datos['fechadenacimiento'] = $arrayg->fechadenacimiento;
            $datos['sexo'] = $arrayg->sexo;
            $datos['orientacionsexual'] = $arrayg->orientacionsexual;
            $datos['identidaddegenero'] = $arrayg->identidaddegenero;
            $datos['etnia'] = $arrayg->etnia;
            $datos['estadocivil'] = $arrayg->estadocivil;
            $datos['gestantelactante'] = $arrayg->gestantelactante;
            $datos['escolaridad'] = $arrayg->escolaridad;
            $datos['parentesco'] = $arrayg->parentesco;
            $datos['discapacidad'] = $arrayg->discapacidad;
            $datos['regimendesalud'] = $arrayg->regimendesalud;
            $datos['enfermedades'] = $arrayg->enfermedades;
            $datos['actividad'] = $arrayg->actividad;
            $datos['ocupacion'] = $arrayg->ocupacion;
            $datos['estadousuario'] = $arrayg->estadousuario;
            $datos['campesino'] = $arrayg->campesino;
            $datos['desplazado'] = $arrayg->desplazado;
            $datos['sisbenizado'] = $arrayg->sisbenizado;
            $datos['victima'] = $arrayg->victima;

            
            $datos['siguiente'] =  '';
            $datos['estado'] = $arrayg->estado;
		}

        if( $datos['estado'] == 1)
        {
            $datos['verestado'] = '';
        }

        $datos['t1_tipodedocumento'] = $this->m_herramientas->mostrarselect('t1_tipodedocumento');
        $datos['t1_sexo'] = $this->m_herramientas->mostrarselect('t1_sexo');
        $datos['t1_orientacionsexual'] = $this->m_herramientas->mostrarselect('t1_orientacionsexual');
        $datos['t1_identidaddegenero'] = $this->m_herramientas->mostrarselect('t1_identidaddegenero');
        $datos['t1_etnia'] = $this->m_herramientas->mostrarselect('t1_etnia');
        $datos['t1_estadocivil'] = $this->m_herramientas->mostrarselect('t1_estadocivil');
        $datos['t1_gestanteylactante'] = $this->m_herramientas->mostrarselect('t1_gestanteylactante');
        $datos['t1_escolaridad'] = $this->m_herramientas->mostrarselect('t1_escolaridad');
        $datos['t1_parentesco'] = $this->m_herramientas->mostrarselect('t1_parentesco');
        $datos['t1_discapacidad'] = $this->m_herramientas->mostrarselect('t1_discapacidad');
        $datos['t1_regimendesalud'] = $this->m_herramientas->mostrarselect('t1_regimendesalud');
        $datos['t1_enfermedadescatastroficas'] = $this->m_herramientas->mostrarselect('t1_enfermedadescatastroficas');
        $datos['t1_actividad'] = $this->m_herramientas->mostrarselect('t1_actividad');
        $datos['t1_ocupacion'] = $this->m_herramientas->mostrarselect('t1_ocupacion');
        $datos['t1_estado'] = $this->m_herramientas->mostrarselect('t1_estado');
        $datos['t1_campesino'] = $this->m_herramientas->mostrarselect('t1_campesino');
        $datos['t1_desplazado'] = $this->m_herramientas->mostrarselect('t1_desplazado');
        $datos['t1_sisbenizado'] = $this->m_herramientas->mostrarselect('t1_sisbenizado');
        $datos['t1_paises'] = $this->m_herramientas->mostrarselect('t1_paises');
        $datos['t1_sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');
        $datos['t2_victima'] = $this->m_herramientas->mostrarselect('t2_victima');

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }
//9
    public function conformacionfamiliar($page = '9_conformacionfamiliar')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '9_conformacionfamiliar';

        $id = $this->input->get('fichasocial');

        //verificar estado de la ficha para saber si se puede editar o no.
        $arrayisvimed = $this->m_herramientas->mostrarconid('remisionesisvimed_fichas', 'fichasocial = '.$id);
        $datos['arrayisvimed'] = count($arrayisvimed);
        //fin 

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['tipodefamilia'] = '';

        //para deshabilitar el guardar y mostrar mensaje
        $datos['noguardar'] =  '';
        $datos['mensajenoguardar'] =  '';
        //fin

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['tipodefamilia'] = $arrayg->tipodefamilia;

            $datos['siguiente'] =  '';
		}

        $datos['t1_conformacionfamiliar'] = $this->m_herramientas->mostrarselect('t1_conformacionfamiliar');

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_listaintegrantes', 'fichasocial ='.$id);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        //boton para habilitar o no  el editar integrante
        $botoneditarinte = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $botoneditarinte = '<button type="button" class="btn btn-info btn-sm" onclick="btnsiguienteintegrante(`integrante`,'.$arrayg->idintegrante.','.$arrayg->fichasocial.')">Ver/Editar</button>';
            //validacion
            if($datos['arrayisvimed'] > 0 && $this->session->userdata('rol') != 6)
            {
                $botoneditarinte = '';
                $datos['noguardar'] =  'disabled';
                $datos['mensajenoguardar'] =  '<div class="row">
                                                    <div class="col-sm">
                                                        <div class="alert alert-danger" role="alert">
                                                            <span class="badge badge-danger">IMPORTANTE:</span> No puedes editar ni guardar la informacion de la conformación familiar de la FICHA SOCIAL, por motivo que esta se encuentra remitida al <strong>ISVIMED</strong>. Para poder realizarlo debes montar un requerimiento, esperar la aprobación y realizar la modificación en el módulo de <strong>MODIFICACION DEL GRUPO FAMILIAR</strong>.
                                                        </div>
                                                    </div>
                                                </div>';
            }
            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$botoneditarinte.'
            </td>
            <td>' . $arrayg->tipodocumento . '</td>
            <td>' . $arrayg->numerodedocumento . '</td>
            <td>' . $arrayg->nombre1 . ' ' . $arrayg->nombre2 . ' ' . $arrayg->apellido1 . ' ' . $arrayg->apellido2 . '</td>
            <td>' . $arrayg->edad . '</td>
            <td>' . $arrayg->sexo . '</td>
            <td>' . $arrayg->parentesco . '</td>
            <td>' . $arrayg->nacionalidad . '</td>
            <td></td>
            </tr>';
		}

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function datosgeneralesremisiones($page = '10_datosgeneralesremisiones')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        // para validar si viene del modulo de carlos
        if(empty($this->input->get('homevalremision')))
        {
            $datos['botonseguinete'] = "btnsiguiente('reddeapoyo','".$this->input->get('fichasocial')."')";
        }
        else
        {
            if($this->input->get('homevalremision') == '1')
            {
                $datos['botonseguinete'] = "btnhomegf('homefichasverificar_remision')";
            }

            if($this->input->get('homevalremision') == '2')
            {
                $datos['botonseguinete'] = "btnhomegf('homefichas')";
            }
            
        }

        $tabla = '101_remisiones';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';
        $datos['siguienteinquilintaro'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['remisiones'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['remisiones'] = $arrayg->remisiones;

            $datos['siguiente'] =  '';
            $datos['siguienteinquilintaro'] =  '';
		}

        $datos['t1_sinoremisiones'] = $this->m_herramientas->mostrarselect('t1_sinoremisiones');
        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes', 'fichasocial ='.$datos['fichasocial']);
        $datos['t1_programas'] = $this->m_herramientas->mostrarselect('t1_programas');
       
        //validar remisiones
        $arraygeneralevacuacion = $this->m_herramientas->mostrarconid('3_evacuacionydanos', 'fichasocial ='.$id);
        $datos['tipoevacuacion'] = '';

        foreach($arraygeneralevacuacion as $arrayeva)
        {
            $datos['tipoevacuacion'] = $arrayeva->tipoevacuacion;
        }

        $datos['remitidoarrendamiento'] = 0;
        $datos['remitidomejoramiento'] = 0;
        $datos['mensajeevacuacion'] = '';
        //fin validar remisiones
        //vista dos

        $datos['tabla2'] = '10_datosgeneralesremisiones';
        $datos['vista'] = 'vw_tabla_programa_integrante';

        $arrayintegrantes = $this->m_herramientas->mostrarconid($datos['vista'], 'fichasocial ='.$datos['fichasocial']);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        foreach($arrayintegrantes as $arrayg)
		{
            //verificar si tiene arrendamiento
            if($arrayg->programa == 1)
            {
                $datos['remitidoarrendamiento'] = 1;
            }
            //verificar si tiene mejoramiento
            if($arrayg->programa == 2)
            {
                $datos['remitidomejoramiento'] = 1;
            }
            // fin 

            $datos['Integranteshogar'] .= '<tr>
            <td>
                <button type="button" class="btn btn-info btn-sm" onclick="btneliminar(`'.$datos['tabla2'] .'`,'.$arrayg->idintegrante.','.$arrayg->fichasocial.','.$arrayg->programa.')">Eliminar</button>
                <button type="button" class="btn btn-info btn-sm" onclick="btnmostrarmodal('.$arrayg->idintegrante.','.$arrayg->fichasocial.','.$arrayg->programa.')" data-toggle="modal" data-target="#staticBackdrop">
                Ver Observacion
                </button>
            </td>
            <td>' . $arrayg->nombreprograma . '</td>
            <td>' . $arrayg->nombreintegrante . '</td>
            <td></td>
            </tr>';
		}

        //PARA VALIDAR TEMPORAL
        if( $datos['tipoevacuacion'] == 1)
        {
            $datos['siguiente'] =  'disabled';
            $datos['mensajeevacuacion'] = '<div class="row"><div class="col-sm">
                                                <div class="alert alert-danger" role="alert">
                                                    <span class="badge badge-danger">ALERTA</span>
                                                    El tipo de evacuación es TEMPORAL, debes seleccionar obligatoriamente la remisión a ISVIMED por mejoramiento y arrendamiento.
                                                </div>
                                            </div></div>';
            if($datos['remitidoarrendamiento'] == 1 && $datos['remitidomejoramiento'] == 1)
            {
                $datos['mensajeevacuacion'] = '';
                $datos['siguiente'] =  '';
            }
        }

        //xx PARA VALIDAR DEFINITIVA
        if( $datos['tipoevacuacion'] == 2)
        {
            $datos['siguiente'] =  'disabled';
            $datos['mensajeevacuacion'] = '<div class="row"><div class="col-sm">
                                                <div class="alert alert-danger" role="alert">
                                                    <span class="badge badge-danger">ALERTA</span>
                                                    El tipo de evacuación es DEFINITIVA, debes seleccionar obligatoriamente la remisión a ISVIMED por arrendamiento.
                                                </div>
                                            </div></div>';
            if($datos['remitidoarrendamiento'] == 1)
            {
                $datos['mensajeevacuacion'] = '';
                $datos['siguiente'] =  '';
            }

            if($datos['remitidomejoramiento'] == 1)
            {
                $datos['mensajeevacuacion'] = '<div class="row"><div class="col-sm">
                                                <div class="alert alert-danger" role="alert">
                                                    <span class="badge badge-danger">ALERTA</span>
                                                    El tipo de evacuación es DEFINITIVA, no puedes seleccionar la remisión a ISVIMED por MEJORAMIENTO.
                                                </div>
                                            </div></div>';
                $datos['siguiente'] =  'disabled';
            }
        }

        // X PARA VALIDAR NO SE REQUIERE
        if( $datos['tipoevacuacion'] == 3 || $datos['tipoevacuacion'] == 4)
        {
            $datos['siguiente'] =  'disabled';
            $datos['mensajeevacuacion'] = '<div class="row"><div class="col-sm">
                                                <div class="alert alert-danger" role="alert">
                                                    <span class="badge badge-danger">ALERTA</span>
                                                    El tipo de evacuación es NO SE REQUIERE o PREVENTIVA, no puedes seleccionar la remisión a ISVIMED por arrendamiento.
                                                </div>
                                            </div></div>';
            if($datos['remitidoarrendamiento'] == 0)
            {
                $datos['mensajeevacuacion'] = '';
                $datos['siguiente'] =  '';
            }
        }
        //fin mensajes de validacion

        // validar si es Inquilinato
        $arraygeneralinquilinato = $this->m_herramientas->mostrarconid('1_identificacionevento', 'fichasocial ='.$id);
        $datos['identificacionevento'] = '';

        foreach($arraygeneralinquilinato as $arrayinqui)
        {
            $datos['identificacionevento'] = $arrayinqui->inquilinato;
        }

        if( $datos['identificacionevento'] == 2)
        {
            $datos['remitidoarrendamiento'] = 0;
            $datos['remitidomejoramiento'] = 0;
            $datos['mensajeevacuacion'] = '<div class="row"><div class="col-sm">
                                                <div class="alert alert-danger" role="alert">
                                                    <span class="badge badge-danger">ALERTA</span>
                                                    La Ficha Social corresponde a un <strong>INQUILINATO</strong>. Por favor verifica si es necesario realizar remisiones al <strong>ISVIMED.</strong>
                                                </div>
                                            </div></div>';  
            
            $datos['siguiente'] = $datos['siguienteinquilintaro'];
        }
        // fin validar inquilinato

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        if(empty($this->input->get('homevalremision'))) //para no mostrar los capitulos si viene del modulo de carlos
        {
            $this->load->view('plantillas/botoneracap', $datosb);
        }        
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function reddeapoyo($page = '11_reddeapoyo')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '111_reddeapoyo';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['reddeapoyo'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['reddeapoyo'] = $arrayg->reddeapoyo;

            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');
        $datos['t1_parentesco'] = $this->m_herramientas->mostrarselect('t1_parentesco');

        $datos['t1_dir_orientacion'] = $this->m_herramientas->mostrarselect('t1_dir_orientacion');
        $datos['t1_dir_tipo_via'] = $this->m_herramientas->mostrarselect('t1_dir_tipo_via');
        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_barrios'] = $this->m_herramientas->mostrarselect('t1_barrios');
        $datos['t1_ruralurbano'] = $this->m_herramientas->mostrarselect('t1_ruralurbano');
        $datos['t1_municipiosantioquia'] = $this->m_herramientas->mostrarselect('t1_municipiosantioquia');
        $datos['t1_paises'] = $this->m_herramientas->mostrarselect('t1_paises');
        $datos['t1_departamentos'] = $this->m_herramientas->mostrarselect('t1_departamentos');
        $datos['t1_ubicacionposteriordonde'] = $this->m_herramientas->mostrarselect('t1_ubicacionposteriordonde');


        //vista dos

        $datos['tabla2'] = '11_reddeapoyo';
        $datos['vista'] = 'vw_reddeapoyo';

        $arrayintegrantes = $this->m_herramientas->mostrarconid($datos['vista'], 'fichasocial ='.$datos['fichasocial']);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        foreach($arrayintegrantes as $arrayg)
		{
            $datos['Integranteshogar'] .= '<tr>
            <td>
                <button type="button" onclick="btneliminar('.$arrayg->idredapoyo.')" class="btn btn-info btn-sm" >Eliminar</button>
            </td>
            <td>' . $arrayg->nombre . '</td>
            <td>' . $arrayg->telefono1 . '</td>
            <td>' . $arrayg->telefono2 . '</td>
            <td>' . $arrayg->parentesco . '</td>
            <td>' . $arrayg->ubicacion . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->direccion . '</td>
            <td></td>
            </tr>';
		}

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function ayudasentregadas($page = '12_ayudasentregadas')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '12_ayudasentregadas';

        $idayudas = $this->input->get('idayudas');
        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idayudas ='.$idayudas);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['idayudas'] = $idayudas;

        $datos['verestado'] = '';

        if($datos['idayudas'] == 0)
        {$datos['verestado'] = 'style="display:none"';}

        $datos['asistencialiamentaria'] = '';
        $datos['quienasis'] = '';
        $datos['cualasis'] = '';
        $datos['paquetealimentario'] = '';
        $datos['paquete1'] = '';
        $datos['paquete2'] = '';
        $datos['paquete3'] = '';
        $datos['paquete4'] = '';
        $datos['quienpaq'] = '';
        $datos['cualpaq'] = '';
        $datos['tipoa'] = '';
        $datos['tipob'] = '';
        $datos['tipoc'] = '';
        $datos['noalimentarias'] = '';
        $datos['quiendoa'] = '';
        $datos['factura'] = '';

        $datos['dcocina'] = '';
        $datos['daseohogar'] = '';
        $datos['daseofamiliar'] = '';
        $datos['dasehombre'] = '';
        $datos['daseomujer'] = '';
        $datos['daseonna'] = '';
        $datos['daseoinfantil'] = '';
        $datos['daseoespecial'] = '';       
        $datos['dcolchonetas'] = '';
        $datos['dcobijas'] = '';
        $datos['dsabanas'] = '';
        $datos['dalmohadas'] = '';

        $datos['acocina'] = '';
        $datos['aaseohogar'] = '';
        $datos['aaseofamiliar'] = '';
        $datos['aasehombre'] = '';
        $datos['aaseomujer'] = '';
        $datos['aaseonna'] = '';
        $datos['aaseoinfantil'] = '';
        $datos['aaseoespecial'] = '';       
        $datos['acolchonetas'] = '';
        $datos['acobijas'] = '';
        $datos['asabanas'] = '';
        $datos['aalmohadas'] = '';

        $datos['ococina'] = '';
        $datos['oaseohogar'] = '';
        $datos['oaseofamiliar'] = '';
        $datos['oasehombre'] = '';
        $datos['oaseomujer'] = '';
        $datos['oaseonna'] = '';
        $datos['oaseoinfantil'] = '';
        $datos['oaseoespecial'] = '';       
        $datos['ocolchonetas'] = '';
        $datos['ocobijas'] = '';
        $datos['osabanas'] = '';
        $datos['oalmohadas'] = '';

        $datos['enitdad'] = '';
        $datos['otros'] = '';
        $datos['cuales'] = '';
        $datos['entidadotros'] = '';
        $datos['fechadeentrega'] = '';
        $datos['idintegrante'] = '';
        $datos['tipoentraga'] = '';

        $datos['draw_dataUrl'] = ''; 
        $datos['nameFirma'] = '';

        $datos['nombrerecibeayuda'] = '';
        $datos['documentorecibeayuda'] = '';

        $datos['observacion'] = '';
        $datos['entregado'] = '';
        $datos['redentrega'] = '';
        

		foreach($arraygeneral as $arrayg)
		{
            $datos['asistencialiamentaria'] = $arrayg->asistencialiamentaria;
            $datos['quienasis'] = $arrayg->quienasis;
            $datos['cualasis'] = $arrayg->cualasis;
            $datos['paquetealimentario'] = $arrayg->paquetealimentario;
            $datos['paquete1'] = $arrayg->paquete1;
            $datos['paquete2'] = $arrayg->paquete2;
            $datos['paquete3'] = $arrayg->paquete3;
            $datos['paquete4'] = $arrayg->paquete4;
            $datos['quienpaq'] = $arrayg->quienpaq;
            $datos['cualpaq'] = $arrayg->cualpaq;
            $datos['tipoa'] = $arrayg->tipoa;
            $datos['tipob'] = $arrayg->tipob;
            $datos['tipoc'] = $arrayg->tipoc;
            $datos['noalimentarias'] = $arrayg->noalimentarias;
            $datos['quiendoa'] = $arrayg->quiendoa;
            $datos['factura'] = $arrayg->factura;

            $datos['dcocina'] = $arrayg->dcocina;
            $datos['daseohogar'] = $arrayg->daseohogar;
            $datos['daseofamiliar'] = $arrayg->daseofamiliar;
            $datos['dasehombre'] = $arrayg->dasehombre;
            $datos['daseomujer'] = $arrayg->daseomujer;
            $datos['daseonna'] = $arrayg->daseonna;
            $datos['daseoinfantil'] = $arrayg->daseoinfantil;
            $datos['daseoespecial'] = $arrayg->daseoespecial;            
            $datos['dcolchonetas'] = $arrayg->dcolchonetas;
            $datos['dcobijas'] = $arrayg->dcobijas;
            $datos['dsabanas'] = $arrayg->dsabanas;
            $datos['dalmohadas'] = $arrayg->dalmohadas;

            $datos['acocina'] = $arrayg->acocina;
            $datos['aaseohogar'] = $arrayg->aaseohogar;
            $datos['aaseofamiliar'] = $arrayg->aaseofamiliar;
            $datos['aasehombre'] = $arrayg->aasehombre;
            $datos['aaseomujer'] = $arrayg->aaseomujer;
            $datos['aaseonna'] = $arrayg->aaseonna;
            $datos['aaseoinfantil'] = $arrayg->aaseoinfantil;
            $datos['aaseoespecial'] = $arrayg->aaseoespecial;            
            $datos['acolchonetas'] = $arrayg->acolchonetas;
            $datos['acobijas'] = $arrayg->acobijas;
            $datos['asabanas'] = $arrayg->asabanas;
            $datos['aalmohadas'] = $arrayg->aalmohadas;

            $datos['ococina'] = $arrayg->ococina;
            $datos['oaseohogar'] = $arrayg->oaseohogar;
            $datos['oaseofamiliar'] = $arrayg->oaseofamiliar;
            $datos['oasehombre'] = $arrayg->oasehombre;
            $datos['oaseomujer'] = $arrayg->oaseomujer;
            $datos['oaseonna'] = $arrayg->oaseonna;
            $datos['oaseoinfantil'] = $arrayg->oaseoinfantil;
            $datos['oaseoespecial'] = $arrayg->oaseoespecial;            
            $datos['ocolchonetas'] = $arrayg->ocolchonetas;
            $datos['ocobijas'] = $arrayg->ocobijas;
            $datos['osabanas'] = $arrayg->osabanas;
            $datos['oalmohadas'] = $arrayg->oalmohadas;

            $datos['enitdad'] = $arrayg->enitdad;
            $datos['otros'] = $arrayg->otros;
            $datos['cuales'] = $arrayg->cuales;
            $datos['entidadotros'] = $arrayg->entidadotros;
            $datos['fechadeentrega'] = $arrayg->fechadeentrega;
            $datos['idintegrante'] = $arrayg->idintegrante;
            $datos['tipoentraga'] = $arrayg->tipoentraga;    

            $datos['nombrerecibeayuda'] = $arrayg->nombrerecibeayuda;
            $datos['documentorecibeayuda'] = $arrayg->documentorecibeayuda;
            
            $datos['observacion'] = $arrayg->observacion;
            $datos['entregado'] = $arrayg->entregado;
            $datos['redentrega'] = $arrayg->redentrega;

            $datos['draw_dataUrl'] = $arrayg->draw_dataUrl; 
            $datos['nameFirma'] = $arrayg->nameFirma;
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');
        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes', 'fichasocial ='.$datos['fichasocial']);
        $datos['t1_tipoentraga'] = $this->m_herramientas->mostrarselect('t1_tipoentraga');
        $datos['t1_quiendoa'] = $this->m_herramientas->mostrarselect('t1_quiendoa');
        $datos['t1_quienaliementario'] = $this->m_herramientas->mostrarselect('t1_quienaliementario');
        $datos['t1_redentregaayudas'] = $this->m_herramientas->mostrarselect('t1_redentregaayudas');

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function ayudas($page = '12_ayudas')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '12_ayudasentregadas';

        $id = $this->input->get('fichasocial');

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_listaayudas', 'fichasocial ='.$id);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        foreach($arrayintegrantes as $arrayg)
		{
            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" onclick="btnsiguienteayudas(`ayudasentregadas`,'.$arrayg->idayudas.','.$arrayg->fichasocial.')">Ver/Editar</button>
            </td>
            <td>' . $arrayg->paquetealimentario . '</td>
            <td>' . $arrayg->asistencialiamentaria . ' </td>
            <td>' . $arrayg->noalimentarias . '</td>            
            <td>' . $arrayg->otros . '</td>
            <td>' . $arrayg->entregado . '</td>
            <td>' . $arrayg->fechadeentrega . '</td>
            <td>' . $arrayg->integrante . '</td>            
            <td></td>
            </tr>';

            $datos['siguiente'] =  '';
		}

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function observaciones($page = '16_observaciones')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '16_observaciones';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['observacion'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['observacion'] = $arrayg->observacion;
            
            $datos['siguiente'] =  '';
		}

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function autorizacion($page = '17_autorizacion')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '17_autorizacion';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);

        $datos['idintegrante'] = '';
		$datos['entidad'] = '';
        $datos['requerieseguimiento'] = '';
        $datos['fechaprobable'] = date('Y-m-d');
        $datos['diligenciadopor'] = '';
        $datos['acepto'] = '';
        $datos['nameFile'] = '';
        $datos['apoyosocial'] = '';

        //firmas
        $datos['draw_dataUrl'] = '';
        $datos['nameFirma'] = '';
        $datos['autorizofirma'] = 2;
        $datos['mostrarnameFirma'] = '';
        $datos['firmatitular'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['idintegrante'] = $arrayg->idintegrante;
            $datos['entidad'] = $arrayg->entidad;
            $datos['requerieseguimiento'] = $arrayg->requerieseguimiento;
            $datos['fechaprobable'] = $arrayg->fechaprobable;
            $datos['diligenciadopor'] = $arrayg->diligenciadopor;
            $datos['acepto'] = $arrayg->acepto;
            $datos['nameFile'] = $arrayg->nameFile;
            $datos['apoyosocial'] = $arrayg->apoyosocial;

            //firmas
            $datos['draw_dataUrl'] = $arrayg->draw_dataUrl; 
            $datos['nameFirma'] = $arrayg->nameFirma;
            $datos['mostrarnameFirma'] = URL_LOCAL.'/cah/resources/filesUploaded/firmas/'.$arrayg->nameFirma;
            $datos['autorizofirma'] = $arrayg->autorizofirma;
            $datos['firmatitular'] = $arrayg->firmatitular;
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_seguimiento');
        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes', 'fichasocial ='.$datos['fichasocial']);

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $datosadjuntar['soloimagen'] = 'accept="image/*"';

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    public function homefichas($page = 'homefichas')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        /*$whereparaapoyo = '';
        if($this->session->userdata('id_usuario') == 34)
        {
            $whereparaapoyo = ' and (id_profesional = 34 or digitador like "%APOYO SOCIAL DOS%")';
        }*/

        if($this->session->userdata('rol') == 1)
        {
            if($this->session->userdata('id_usuario') == 76)
            {
                //$arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefichasocial', ' tipovisita = 1 and id_profesional in ("'.$this->session->userdata('id_usuario').'","PENDIENTE","7")');
                $arrayintegrantes = $this->m_herramientas->home_nuevo_fichasocial_sociales_76();
            }
            else
            {
                $arrayintegrantes = $this->m_herramientas->home_nuevo_fichasocial_sociales();
            }
            
        }
        else
        {
            $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefichasocial', 'tipovisita = 1');
        }

        // $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefichasocial', 'tipovisita = 1' .  $whereparaapoyo);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $botoncerrarficha = '';
        $verpdf = '';
        $editarficha = '';
        $correccionficha = '';
        $verpdfft = '';
        $trazabilidad = '';
        $veradjuntosficha = '';
        $recuperafallida = '';
        $vercambiosgrupofamiliar = '';
        $prueba = '';

        foreach($arrayintegrantes as $arrayg)
		{


            if($arrayg->fechavisita <= '2023-12-20'){
                $prueba = '';
            }else{
                $prueba = '';
            }


            $recuperafallida = 'NO';
            if($arrayg->recuperafallida != 'NO')
            {
                $recuperafallida = 'SI - FALLIDA '.$arrayg->recuperafallida.' <button type="button" class="btn btn-info btn-sm" title="Ver fallida" onclick="btnsiguiente(`vfnafsinformacionevento`,'.$arrayg->recuperafallida.')"><i class="fa-sharp fa-solid fa-f"></i></button>';
            }

            $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefichaadjunto(`adjuntosfichasocial`,'.$arrayg->fichasocial.',`homefichas`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';

            if($arrayg->valremision == 'NO')
            {
                $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente_valremision_social(`datosgeneralesremisiones`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';                
            }
            else
            {
                $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`informacionevento`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            }
            
            
            $botoncerrarficha = '';
            $verpdf = '';
            $correccionficha = '';
            $verpdfft = '';
            $trazabilidad = '';
            $vercambiosgrupofamiliar = '';
            

            if($arrayg->estadoficha == 'COMPLETA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $correccionficha = '<button type="button" class="btn btn-info btn-sm" title="Enviar a correccion" onclick="btnenviaracorregirficha(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-gear"></i></button>';
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
            }

            if($arrayg->estadoficha == 'CERRADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
            }

            if($arrayg->estadoficha == 'EN CORRECCION')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'DEVUELTA')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $correccionficha = '<button type="button" class="btn btn-info btn-sm" title="Enviar a correccion" onclick="btnenviaracorregirficha(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-gear"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';                
            }

            if($arrayg->estadoficha == 'APROBADA')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'REMITIDA')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'REMITIDA-PERIODO ANTERIOR')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'CERRADA - CASO ESPECIAL' || $arrayg->estadoficha == 'CERRADA NO REMITIDA A ISVIMED')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            } 

            // verificar si tiene cambios en el grupo familiar para mostrar el nboton
            $arrayingfexiste = $this->m_herramientas->mostrarconidlimituno('historico_131_integrante', 'fichasocial = '.$arrayg->fichasocial);        

            if (count($arrayingfexiste) == 0)
            {
                $vercambiosgrupofamiliar = '';
            }
            // fin boton grupo familiar

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$editarficha.'
            '.$botoncerrarficha.'
            '.$correccionficha.'
            '.$trazabilidad.'
            '.$verpdfft.'
            '.$verpdf.'
            '.$veradjuntosficha.'
            '.$vercambiosgrupofamiliar.'
            </td>            
            <td>' . $arrayg->estadoficha . '</td>            
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $recuperafallida . '</td>
            <td>' . $arrayg->inquilinato . '</td>
            <td>' . $arrayg->valremision . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . $prueba . '</td>
            <td>' . $arrayg->tipoevento . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->direccion . '</td>  
            <td>' . $arrayg->profesional . '</td>          
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
		}

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/trazabilidad');
        $this->load->view('plantillas/footer');
    }
    // Temporal para que Juan organice las Fichas
    public function homefichasjuan($page = 'homefichasjuan') // temporal para Juan Arteaga
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefichasocial', 'tipovisita = 1');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $botoncerrarficha = '';
        $verpdf = '';
        $editarficha = '';
        $correccionficha = '';
        $verpdfft = '';
        $trazabilidad = '';
        $veradjuntosficha = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefichaadjunto(`adjuntosfichasocial`,'.$arrayg->fichasocial.',`homefichasjuan`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';

            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`informacionevento`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $botoncerrarficha = '';
            $verpdf = '';
            $correccionficha = '';
            $verpdfft = '';
            $trazabilidad = '';

            if($arrayg->estadoficha == 'COMPLETA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $correccionficha = '<button type="button" class="btn btn-info btn-sm" title="Enviar a correccion" onclick="btnenviaracorregirficha(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-gear"></i></button>';
            }

            if($arrayg->estadoficha == 'CERRADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';
            }

            if($arrayg->estadoficha == 'EN CORRECCION')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'DEVUELTA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $correccionficha = '';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';                
            }

            if($arrayg->estadoficha == 'APROBADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'REMITIDA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'REMITIDA-PERIODO ANTERIOR')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'CERRADA - CASO ESPECIAL')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            } 

            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`informacionevento`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$editarficha.'
            '.$trazabilidad.'
            '.$verpdfft.'
            '.$verpdf.'
            '.$veradjuntosficha.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->tipoevento . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->direccion . '</td>  
            <td>' . $arrayg->profesional . '</td>          
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
		}

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/trazabilidad');
        $this->load->view('plantillas/footer');
    }

    public function homefichasfamilia($page = 'homefichasfamilia')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefichasocialfamilia', 'tipovisita = 1');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $botoncerrarficha = '';
        $verpdf = '';
        $editarficha = '';
        $correccionficha = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`informacionevento`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $botoncerrarficha = '';
            $verpdf = '';
            $correccionficha = '';

            if($arrayg->estadoficha == 'COMPLETA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $correccionficha = '<button type="button" class="btn btn-info btn-sm" title="Enviar a correccion" onclick="btnenviaracorregirficha(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-gear"></i></button>';
            }

            if($arrayg->estadoficha == 'CERRADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->estadoficha == 'EN CORRECCION')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->estadoficha == 'DEVUELTA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $correccionficha = '';
            }

            if($arrayg->estadoficha == 'APROBADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->estadoficha == 'REMITIDA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->estadoficha == 'REMITIDA-PERIODO ANTERIOR')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$editarficha.'
            '.$botoncerrarficha.'
            '.$correccionficha.'
            '.$verpdf.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->tipoevento . '</td>
            <td>' . $arrayg->numerodedocumento . '</td>
            <td>' . $arrayg->nombre . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>            
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
		}

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function buscarbarrio()
    {
        $id = $this->input->post('id_comuna');

        $arraybarrios = $this->m_herramientas->mostrarconid('t1_barrios', 'comuna =' . $id);

        $resultado = '<option value=""> SELECCIONE </option>';

        foreach ($arraybarrios as $opcione) {
            $resultado .= '<option value="' . $opcione->id . '"> ' . $opcione->descripcion . ' </option>';
        }

        echo $resultado;
    }

    public function cargardocumentos()
    {
        $id = $this->input->post('nacionalidad');

        $arraybarrios = $this->m_herramientas->mostrarconid('t1_tipodedocumento', 'tipo =' . $id . ' or tipo = 3');

        $resultado = '<option value=""> SELECCIONE </option>';

        foreach ($arraybarrios as $opcione) {
            $resultado .= '<option value="' . $opcione->id . '"> ' . $opcione->descripcion . ' </option>';
        }

        echo $resultado;
    }

    public function cargarprogramasinsepecion()
    {
        $id = $this->input->post('remisiones');
        $fichasocial = $this->input->post('fichasocial');

        $datos['t1_programas'] = $this->m_herramientas->mostrarselectconid('t1_programas', 'tipo =' . $id . ' or tipo = 3');

        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes', 'fichasocial ='.$fichasocial);

        if($id == 2 )
        {
            $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconidsinblanco('t1_select_integrantes', 'fichasocial ='.$fichasocial.' and descripcion like "%JEFE%"');            
        }

        echo json_encode($datos);
    }

    public function cargarfamiliasotitulares()
    {
        $id = $this->input->post('programa');
        $fichasocial = $this->input->post('fichasocial');

        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes', 'fichasocial ='.$fichasocial);

        if ($id == 2 ||  $id == 1 || $id > 27)
        {
            $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconidsinblanco('t1_select_integrantes', 'fichasocial ='.$fichasocial.' and descripcion like "%JEFE%"');            
        }

        echo json_encode($datos);
    }

    public function calcularedad()
	{
		$fechanacimiento = $this->input->get('fechanacimiento');

		$fecha_nacimiento = new DateTime($fechanacimiento);
		$hoy = new DateTime();
        $edad = $hoy->diff($fecha_nacimiento);
        
        if($edad->y > 110)
        {
            $medidadedad    = "Incorrecta";
            $numeroedad     = "Edad";
        }
        elseif($edad->y == 0)
        {
            $medidadedad    = "Meses";
            $numeroedad     = $edad->m;
        }
        else
        {
            $medidadedad    = "Años";
            $numeroedad     = $edad->y;
        }

		echo $numeroedad."-".$medidadedad;
	}

    public function botoneracap($fichasocial)
    {
        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_estadofichasocial', 'fichasocial ='.$fichasocial);

        $botonera = '<div class="dropdown">
                        <button class="btn btn-info btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-file"></i>
                        Numerales realizados
                        <i class="fa-sharp fa-solid fa-chevron-down"></i>
                        </button>
                    <div class="dropdown-menu">';

            foreach($arrayintegrantes as $arrayg)
            {
                    $botonera .= '<button type="button" class="dropdown-item" onclick="btnsiguiente(`'.$arrayg->controlador.'`,'.$arrayg->fichasocial.')">'.$arrayg->nombre.'</button>';
            }

        $botonera .= '</div></div>';

        return $botonera;
    }

    public function abrirmodalremisin()
    {
        $fichasocial = $this->input->post('fichasocial');
        $programa = $this->input->post('programa');
        $idintegrante = $this->input->post('idintegrante');

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_tabla_programa_integrante', 'fichasocial ='.$fichasocial.' and programa = '.$programa.' and idintegrante = '.$idintegrante);
        $chintegrantes = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $chintegrantes = $arrayg->observacion;
		}

        echo  $chintegrantes;
    }

    // fallidas y Nafs
    public function visitafallidanafs($page = 'visitafallidanafs')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'visitafallidanafs';

        $id = $this->input->get('idvisitafallidanafs');
        $datos['tipovisita'] = $this->input->get('tipovisita');
        $datos['campoidseguimiento'] = '';

        if(empty($this->input->get('idseguimiento')))
        {
            $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idvisitafallidanafs ='.$id);
        }
        else
        {
            $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idvisitafallidanafs ='.$id.' and idseguimiento = '. $this->input->get('idseguimiento'));
            $datos['campoidseguimiento'] = '<input type="text" class="form-control form-control-sm" id="idseguimiento" style="display: none;" placeholder="" value="'.$this->input->get('idseguimiento').'">';
        }

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

        $datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['barrio'] = '';
        $datos['comuna'] = '';
        $datos['dirCampo1'] = '';
        $datos['dirCampo2'] = '';
        $datos['dirCampo3'] = '';
        $datos['dirCampo4'] = '';
        $datos['dirCampo5'] = '';
        $datos['dirCampo6'] = '';
        $datos['dirCampo7'] = '';
        $datos['dirCampo8'] = '';
        $datos['dirCampo9'] = '';
        $datos['direccion'] = '';
        $datos['estrato'] = '';
        $datos['ruralurbano'] = '';
        $datos['sector'] = '';
        $datos['telefono1t'] = '';
        $datos['telefono2t'] = '';

        $datos['observacion'] = '';
        $datos['tipodedocumentoe'] = '';
        $datos['nacionalidade'] = '';
        $datos['numerodedocumentoe'] = '';
        $datos['nombre1e'] = '';
        $datos['nombre2e'] = '';
        $datos['apellido1e'] = '';
        $datos['apellido2e'] = '';
        $datos['telefono1e'] = '';
        $datos['telefono2e'] = '';
        $datos['parentescoe'] = '';
        $datos['tipodedocumentot'] = '';
        $datos['nacionalidadt'] = '';
        $datos['numerodedocumentot'] = '';
        $datos['nombre1t'] = '';
        $datos['nombre2t'] = '';
        $datos['apellido1t'] = '';
        $datos['apellido2t'] = '';
        $datos['nameFile'] = '';
        $datos['tiposeguimiento'] = 'SEGUIMIENTO';
        $datos['fechaseguimiento'] = '';

        $datos['diligenciadopor'] = '';
        $datos['fichaaccess'] = '';

        //firmas
        $datos['draw_dataUrl'] = '';
        $datos['nameFirma'] = '';
        $datos['autorizofirma'] = '2';
        $datos['mostrarnameFirma'] = '';
        $datos['nombrefirmafallida'] = date('YmdHis');

        foreach($arraygeneral as $arrayg)
        {
            $datos['fichasocial'] = $arrayg->idvisitafallidanafs;
            $datos['barrio'] = $arrayg->barrio;
            $datos['comuna'] = $arrayg->comuna;
            $datos['dirCampo1'] = $arrayg->dirCampo1;
            $datos['dirCampo2'] = $arrayg->dirCampo2;
            $datos['dirCampo3'] = $arrayg->dirCampo3;
            $datos['dirCampo4'] = $arrayg->dirCampo4;
            $datos['dirCampo5'] = $arrayg->dirCampo5;
            $datos['dirCampo6'] = $arrayg->dirCampo6;
            $datos['dirCampo7'] = $arrayg->dirCampo7;
            $datos['dirCampo8'] = $arrayg->dirCampo8;
            $datos['dirCampo9'] = $arrayg->dirCampo9;
            $datos['direccion'] = $arrayg->direccion;
            $datos['ruralurbano'] = $arrayg->ruralurbano;
            $datos['sector'] = $arrayg->sector;
            $datos['telefono1t'] = $arrayg->telefono1t;
            $datos['telefono2t'] = $arrayg->telefono2t;

            $datos['observacion'] = $arrayg->observacion;
            $datos['tipodedocumentoe'] = $arrayg->tipodedocumentoe;
            $datos['nacionalidade'] = $arrayg->nacionalidade;
            $datos['numerodedocumentoe'] = $arrayg->numerodedocumentoe;
            $datos['nombre1e'] = $arrayg->nombre1e;
            $datos['nombre2e'] = $arrayg->nombre2e;
            $datos['apellido1e'] = $arrayg->apellido1e;
            $datos['apellido2e'] = $arrayg->apellido2e;
            $datos['telefono1e'] = $arrayg->telefono1e;
            $datos['telefono2e'] = $arrayg->telefono2e;
            $datos['parentescoe'] = $arrayg->parentescoe;
            $datos['tipodedocumentot'] = $arrayg->tipodedocumentot;
            $datos['nacionalidadt'] = $arrayg->nacionalidadt;
            $datos['numerodedocumentot'] = $arrayg->numerodedocumentot;
            $datos['nombre1t'] = $arrayg->nombre1t;
            $datos['nombre2t'] = $arrayg->nombre2t;
            $datos['apellido1t'] = $arrayg->apellido1t;
            $datos['apellido2t'] = $arrayg->apellido2t;
            $datos['nameFile'] = $arrayg->nameFile;
            if(!empty($this->input->get('idseguimiento')))
            {
                $datos['tiposeguimiento'] = $arrayg->tiposeguimiento;
            }
            
            $datos['fechaseguimiento'] = $arrayg->fechaseguimiento;
            $datos['diligenciadopor'] = $arrayg->diligenciadopor;
            $datos['fichaaccess'] = $arrayg->fichaaccess;

            //firmas
            $datos['draw_dataUrl'] = $arrayg->draw_dataUrl; 
            $datos['nameFirma'] = $arrayg->nameFirma;
            $datos['mostrarnameFirma'] = URL_LOCAL.'/cah/resources/filesUploaded/firmas/'.$arrayg->nameFirma;
            $datos['autorizofirma'] = $arrayg->autorizofirma;

            $datos['siguiente'] =  '';
            
        }

        //verificar cantidad de seguimientos
        $arrayintegrantes = $this->m_herramientas->mostrarconid('visitafallidanafs', 'idvisitafallidanafs ='.$id); 
        $datos['numerointegfamilia'] = count($arrayintegrantes);
        

        if($datos['numerointegfamilia'] == 0)
        {
            $datos['tiposeguimiento'] = 'INICIAL';
        }

        $datos['t1_dir_orientacion'] = $this->m_herramientas->mostrarselect('t1_dir_orientacion');
        $datos['t1_dir_tipo_via'] = $this->m_herramientas->mostrarselect('t1_dir_tipo_via');
        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_barrios'] = $this->m_herramientas->mostrarselect('t1_barrios');
        $datos['t1_ruralurbano'] = $this->m_herramientas->mostrarselect('t1_ruralurbano');
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales');

        $datos['t1_tipodedocumento'] = $this->m_herramientas->mostrarselect('t1_tipodedocumento');
        //$datos['t1_parentesco'] = $this->m_herramientas->mostrarselect('t1_parentesco');
        $datos['t1_paises'] = $this->m_herramientas->mostrarselect('t1_paises');
        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');

        $datosadjuntar['soloimagen'] = 'accept="image/*"';

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    public function vfnafsinformacionevento($page = 'vfnasf_informaciondelevento')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '0_informaciondelevento';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

        $datos['deshabilitarcamposnafs'] =  '';
        $datos['deshabilitardeclarafallida'] =  'required';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
		$datos['fichatecnia'] = 'Pendiente';
		$datos['motivovisita'] = '';
		$datos['horaactivacion'] = '';
        $datos['horaatencion'] = '';
        $datos['fechavisita'] = '';
        $datos['opcmotivovisita'] = '';
        $datos['tipo'] = '';
        $datos['tipovisita'] = '';
        $datos['ficharecuperda'] = '1';
        $datos['declaradafallida'] = '';
        $datos['desnuevaseguimiento'] = '';
        $datos['remitir'] = '';
        $datos['remitir2'] = '';


		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['fichatecnia'] = $arrayg->fichatecnia;
            $datos['motivovisita'] = $arrayg->motivovisita;
            $datos['horaactivacion'] = $arrayg->horaactivacion;
            $datos['horaatencion'] = $arrayg->horaatencion;
            $datos['fechavisita'] = $arrayg->fechavisita;
            $datos['tipo'] = $arrayg->tipo;
            $datos['siguiente'] =  '';
            $datos['tipovisita'] =  $arrayg->tipovisita;
            $datos['ficharecuperda'] = $arrayg->ficharecuperda;
            $datos['declaradafallida'] = $arrayg->declaradafallida;
            $datos['remitir'] = $arrayg->remitir;
            $datos['remitir2'] = $arrayg->remitir2;

            if($datos['tipovisita'] == 3)
            {
                $datos['deshabilitarcamposnafs'] =  'disabled';
                $datos['deshabilitardeclarafallida'] =  '';
            }            
		}

        if($datos['declaradafallida'] == '')
        {
            $datos['declaradafallida'] = '1';
        }

        /*$datos['desnuevaseguimiento'] = '';
        if($datos['declaradafallida'] == '2')
        {
            $datos['desnuevaseguimiento'] = 'style="display: none;"';
        }*/

        $datos['opcmotivovisita'] = $this->m_herramientas->mostrarselect('t1_motivovisita');
        $datos['t1_tipovisita'] = $this->m_herramientas->mostrarselect('t1_fallidanafstipovisita');
        $datos['sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');
        $datos['t1_programas'] = $this->m_herramientas->mostrarselectconid('t1_programas', 'tipo = 2');

        // tabla
        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_seguimientofallidas', 'idvisitafallidanafs ='.$id); 

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdfft = '';
        $verpdf = '';
        $devolverficha = '';
        $datos['devolver'] = '';
        $datos['estadoficha'] = '';
        $vereditar = '';
        $datos['validarcerrado'] = '0';
        $datos['cualbotoncerrar'] = '';
        $trazabilidad = '';
        $corregirregistro = '';
        $datos['cambiarestdocompletoficha'] = '0';
        $datos['nocerrarficha'] = '0';
        $veradjuntosficha = '';
        $aprobarficha = '';
        $datos['cambiarestdoaprobadotoficha'] = '0';

        foreach($arrayintegrantes as $arrayg)
		{
            $verpdf = '';
            $verpdfft = '';
            $devolverficha = '';
            $datos['devolver'] = '';
            $vereditar = '';
            $corregirregistro = '';
            $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefallidaadjunto(`adjuntosfallida`,'.$arrayg->idvisitafallidanafs.','.$arrayg->idseguimiento.',`vfnafsinformacionevento`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';
            $aprobarficha = '';
            
            if($this->session->userdata('rol') == 4 || $this->session->userdata('rol') == 6)
            {
                $datos['devolver'] = '<h6><i class="fa-sharp fa-solid fa-trash-arrow-up"></i> - Devolver ficha por inconsistencias. (SOLO SI SE TIENE EL PROFESIONAL ASIGNADO)</h6><h6><i class="fa-sharp fa-solid fa-share"></i> - Aprobar ficha.(Solo para fichas cerradas)</h6>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidadfallidasnafs('.$arrayg->idvisitafallidanafs.',`'.$arrayg->idseguimiento.'`)" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';
                
                if($arrayg->PROFESIONAL != 'PENDIENTE')
                {
                    $devolverficha = '  <button type="button" class="btn btn-info btn-sm" title="Devolver Registro" onclick="btndevolverficha('.$arrayg->idvisitafallidanafs.',`'.$arrayg->fichatecnia.'`,`'.$arrayg->correo_profesional.'`,`Fallida o NAFS`,`'.$arrayg->idseguimiento.'`)" data-toggle="modal" data-target="#staticBackdrop2">
                                        <i class="fa-sharp fa-solid fa-trash-arrow-up"></i>
                                        </button>';
                }
                
         
                if($arrayg->estadiregistro == 'COMPLETA')
                {
                    $aprobarficha = '<button type="button" class="btn btn-info btn-sm" title="Aprobar ficha" onclick="btnaprobarficha(`'.$arrayg->idseguimiento.'`,'.$arrayg->idvisitafallidanafs.')"><i class="fa-sharp fa-solid fa-share"></i></button>';
                }

            }

            $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfnafsfallidas(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            }

            if($arrayg->estadoficha != 'CERRADA' && $arrayg->estadiregistro != 'COMPLETA')
            {
                $vereditar = ' <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguientefallida('.$arrayg->idseguimiento.','.$arrayg->idvisitafallidanafs.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            }
            else
            {
                $datos['validarcerrado'] = '1';
            }

            if($arrayg->estadoficha == 'DEVUELTA')
            {
                $datos['cualbotoncerrar'] = 'btcerrardespuesdevuelta';

                if($arrayg->estadiregistro == 'DEVUELTA')
                {
                    $datos['cambiarestdocompletoficha'] = '1';
                    $vereditar = ' <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguientefallida('.$arrayg->idseguimiento.','.$arrayg->idvisitafallidanafs.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
                }
            }
            else
            {
                $datos['cualbotoncerrar'] = 'btnestadofnafsfallidas';
                $datos['cambiarestdocompletoficha'] = '1';
            }

            if($arrayg->estadiregistro == 'DEVUELTA')
            {
                $corregirregistro = ' <button type="button" class="btn btn-info btn-sm" title="Corregir registro" onclick="btncorregirregistro('.$arrayg->idseguimiento.','.$arrayg->idvisitafallidanafs.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $datos['nocerrarficha'] = '1';
            }

            if($arrayg->estadiregistro == 'PENDIENTE CIERRE')
            {
                $corregirregistro = ' <button type="button" class="btn btn-info btn-sm" title="Cerrar registro" onclick="btncerrarregistro('.$arrayg->idseguimiento.','.$arrayg->idvisitafallidanafs.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $datos['nocerrarficha'] = '1';
            }

            if($arrayg->aprobado == 'APROBADO')
            {
                $aprobarficha = '';
                $corregirregistro = '';
                $devolverficha = '';
            }

            //cambiar el estado a aprobado de la ficha
            if($arrayg->estadoficha == 'CERRADA')
            {

                if($arrayg->aprobado != 'APROBADO')
                {
                    $datos['cambiarestdoaprobadotoficha'] = '1';
                }

            }
            else
            {
                $datos['cambiarestdoaprobadotoficha'] = '1';
            }

            if($arrayg->estadoficha == 'APROBADA')
            {
                $datos['validarcerrado'] = '1';
            }
            
            $datos['Integranteshogar'] .= '<tr>
            <td>
            '. $vereditar.'
            '. $devolverficha.'
            '. $aprobarficha.'
            '.$verpdf.'
            '.$verpdfft.'
            '.$trazabilidad.'
            '.$corregirregistro.'
            '.$veradjuntosficha.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->estadiregistro . '</td>
            <td>' . $arrayg->aprobado . '</td>
            <td>' . $arrayg->idseguimiento . '</td>
            <td>' . $arrayg->idvisitafallidanafs . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->tiposeguimiento . '</td>
            <td>' . $arrayg->nomtipovisita . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->direccion . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->PROFESIONAL . '</td>
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';

            $datos['estadoficha'] = $arrayg->estadoficha;            
		}

        //validar si no tiene seguimientos para que no haga los procesos automaticos
        if($datos['numerointegfamilia'] == 0)
        {
            $datos['cambiarestdoaprobadotoficha'] = '1';
            $datos['cambiarestdocompletoficha'] = '1';
        }

        
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo');

        //habilitar seguimientos
        $arrayhabliseguimientos = $this->m_herramientas->mostrarconid('chabilitarseguimientofallida', 'fichasocial = '.$id);
        $datos['habliseguimientosnum'] = count($arrayhabliseguimientos);

        $datos['botonhabilitarseg'] = "style='display:none'";
        if($this->session->userdata('rol') == 6)
        {
            $datos['botonhabilitarseg'] = "";
        }
        //fin habilitar seguimientos

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/devolverfichafallidanafs');
        $this->load->view('plantillas/trazabilidadfallidanafs');
        $this->load->view('plantillas/footer');
    }

    public function vfnafsinformacionevento_soporte($page = 'vfnasf_informaciondelevento_soporte')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '0_informaciondelevento';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

        $datos['deshabilitarcamposnafs'] =  '';
        $datos['deshabilitardeclarafallida'] =  '';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
		$datos['fichatecnia'] = 'Pendiente';
		$datos['motivovisita'] = '';
		$datos['horaactivacion'] = '';
        $datos['horaatencion'] = '';
        $datos['fechavisita'] = '';
        $datos['opcmotivovisita'] = '';
        $datos['tipo'] = '';
        $datos['tipovisita'] = '';
        $datos['ficharecuperda'] = '';
        $datos['declaradafallida'] = '';
        $datos['desnuevaseguimiento'] = '';
        $datos['remitir'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['fichatecnia'] = $arrayg->fichatecnia;
            $datos['motivovisita'] = $arrayg->motivovisita;
            $datos['horaactivacion'] = $arrayg->horaactivacion;
            $datos['horaatencion'] = $arrayg->horaatencion;
            $datos['fechavisita'] = $arrayg->fechavisita;
            $datos['tipo'] = $arrayg->tipo;
            $datos['siguiente'] =  '';
            $datos['tipovisita'] =  $arrayg->tipovisita;
            $datos['ficharecuperda'] = $arrayg->ficharecuperda;
            $datos['declaradafallida'] = $arrayg->declaradafallida;
            $datos['remitir'] = $arrayg->remitir;

            if($datos['tipovisita'] == 3)
            {
               // $datos['deshabilitarcamposnafs'] =  'disabled';
               // $datos['deshabilitardeclarafallida'] =  '';
            }            
		}

        /*$datos['desnuevaseguimiento'] = '';
        if($datos['declaradafallida'] == '2')
        {
            $datos['desnuevaseguimiento'] = 'style="display: none;"';
        }*/

        $datos['opcmotivovisita'] = $this->m_herramientas->mostrarselect('t1_motivovisita');
        $datos['t1_tipovisita'] = $this->m_herramientas->mostrarselect('t1_fallidanafstipovisita');
        $datos['sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');
        $datos['t1_programas'] = $this->m_herramientas->mostrarselectconid('t1_programas', 'tipo = 2');

        // tabla
        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_seguimientofallidas', 'idvisitafallidanafs ='.$id); 

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdfft = '';
        $verpdf = '';
        $devolverficha = '';
        $datos['devolver'] = '';
        $datos['estadoficha'] = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $verpdf = '';
            $verpdfft = '';
            $devolverficha = '';
            $datos['devolver'] = '';

            if($this->session->userdata('rol') == 4)
            {
                $datos['devolver'] = '<h6><i class="fa-sharp fa-solid fa-trash-arrow-up"></i> - Devolver ficha por inconsistencias. (SOLO SI SE TIENE EL PROFESIONAL ASIGNADO)</h6>';
             
                if($arrayg->PROFESIONAL != 'PENDIENTE')
                {
                    $devolverficha = '  <button type="button" class="btn btn-info btn-sm" title="Devolver Registro" onclick="btndevolverficha('.$arrayg->idvisitafallidanafs.','.$arrayg->fichatecnia.',`'.$arrayg->correo_profesional.'`,`Fallida o NAFS`)" data-toggle="modal" data-target="#staticBackdrop2">
                                        <i class="fa-sharp fa-solid fa-trash-arrow-up"></i>
                                        </button>';
                }
                

            }

            $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfnafsfallidas(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            }

            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguientefallida('.$arrayg->idseguimiento.','.$arrayg->idvisitafallidanafs.')"><i class="fa-sharp fa-solid fa-pen"></i></button>
            '. $devolverficha.'
             '.$verpdf.'
             '.$verpdfft.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->idvisitafallidanafs . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->tiposeguimiento . '</td>
            <td>' . $arrayg->nomtipovisita . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->direccion . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->PROFESIONAL . '</td>
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';

            $datos['estadoficha'] = $arrayg->estadoficha;            
		}

        
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/devolverficha');
        $this->load->view('plantillas/footer');
    }

    public function homefallidasnafs($page = 'homefallidasnafs')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        if($this->session->userdata('rol') == 1)
        {
            if($this->session->userdata('id_usuario') == 76)
            {
                $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefallidasnafs', ' id_profesional in ("'.$this->session->userdata('id_usuario').'","PENDIENTE","7")');
            }
            else
            {
                $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefallidasnafs', ' id_profesional in ("'.$this->session->userdata('id_usuario').'","PENDIENTE")');
            }
            
        }
        else
        {
            $arrayintegrantes = $this->m_herramientas->mostrar('vw_homefallidasnafs');
        }

        $whereparaapoyo = '';
        if($this->session->userdata('id_usuario') == 34)
        {
            $whereparaapoyo = 'digitador like "%APOYO SOCIAL DOS%"';
            $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefallidasnafs', $whereparaapoyo);
        }

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdf = '';
        $verpdfft = ''; 
        $veradjuntosficha = '';
        $botoncerrarficha = '';
        $vereditar = '';
        $trazabilidad = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $verpdf = $arrayg->ficharecuperda;
            if($arrayg->ficharecuperda != 'NO RECUPERADA' && $arrayg->ficharecuperda != 'DECLARADA FALLIDA')
            {
                $verificarcualpdf = $this->m_herramientas->mostrarconid('0_informaciondelevento',  'fichasocial ='.$arrayg->ficharecuperda.' and tipovisita = 3');

                if (count($verificarcualpdf) > 0)
                {
                    $verpdf = 'CON NAFS <button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="irbusqueda(3,'.$arrayg->ficharecuperda.')"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }else
                {
                    $verpdf = 'CON FICHA SOCIAL <button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->ficharecuperda.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }
            }

            $botoncerrarficha = '';
            $verpdfft = '';
            $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefichaadjunto(`adjuntosfichasocial`,'.$arrayg->idvisitafallidanafs.',`homefallidasnafs`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';
            $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->idvisitafallidanafs.')" data-toggle="modal" data-target="#staticBackdrop3">
                                <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                            </button>';
            
            
            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            }

            if($arrayg->estadoficha != 'CERRADA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btnestadofnafsfallidas(`'.$arrayg->idvisitafallidanafs.'`,`'.date('Y-m-d H:i:s').'`,`'.$this->session->userdata('usuario').'`,`cerrarficha`)"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $vereditar = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`vfnafsinformacionevento`,'.$arrayg->idvisitafallidanafs.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            }
            else
            {
                $botoncerrarficha = '';
                $vereditar = '<button type="button" class="btn btn-info btn-sm" title="Ver" onclick="btnsiguiente(`vfnafsinformacionevento`,'.$arrayg->idvisitafallidanafs.')"><i class="fa-sharp fa-solid fa-eye"></i></button>';
            }

            if($arrayg->estadoficha == 'INCOMPLETA')
            {
                $botoncerrarficha = '';
                $trazabilidad = '';
            }

            if($arrayg->estadoficha == 'COMPLETA')
            {
                //$trazabilidad = '';
            }

            if($arrayg->estadoficha == 'DEVUELTA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btcerrardespuesdevuelta(`'.$arrayg->idvisitafallidanafs.'`,`'.date('Y-m-d H:i:s').'`,`'.$this->session->userdata('usuario').'`,`cerrarficha`)"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
            }

            if($arrayg->estadoficha == 'APROBADA')
            {
                $botoncerrarficha = '';
                $vereditar = '<button type="button" class="btn btn-info btn-sm" title="Ver" onclick="btnsiguiente(`vfnafsinformacionevento`,'.$arrayg->idvisitafallidanafs.')"><i class="fa-sharp fa-solid fa-eye"></i></button>';
            }

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '. $vereditar.'
            '. $verpdfft.'
            '.$veradjuntosficha.'
            '.$botoncerrarficha.'
            '.$trazabilidad.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->idvisitafallidanafs . '</td>
            <td>' . $verpdf . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->tiposeguimiento . '</td>
            <td>' . $arrayg->nomtipovisita . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->direccion . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->profesional . '</td>
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
		}

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/trazabilidad');
        $this->load->view('plantillas/footer');
    }

    //BUSQUEDAS
    public function buscarfichasocial()
    {
        $fichasocial = $this->input->post('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid('0_informaciondelevento', 'fichasocial ="'.$fichasocial.'"');
        $chintegrantes = '0';

        foreach($arraygeneral as $arrayg)
		{
            $chintegrantes = $arrayg->fichasocial;
		}

        echo  $chintegrantes;
    }

    public function buscarfichasocialyaccess()
    {
        $fichasocial = $this->input->post('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid('vw_fichasocialyaccess', 'fichasocial ="'.$fichasocial.'"');
        // $existe= count($arraygeneral);
        $mensajesalida = '<div class="alert alert-danger" role="alert">
        <strong>ATENCION:</strong> La Ficha Social <strong>' .  $fichasocial . '</strong> No existe en el nuevo sistema ni en el aplicativo ACCESS, por este motivo no podras realizar procesos como realizar remisiones, entre otros. <strong>POR FAVOR Verifica la informacion antes de continuar</strong>.
        </div>';

        foreach($arraygeneral as $arrayg)
		{
            $mensajesalida = '<div class="alert alert-info" role="alert">
            <strong>OK:</strong> Ficha Social <strong>' .  $fichasocial . '</strong> se encuentra en la base de datos <strong>' .  $arrayg->tipo . '</strong>.
            </div>';
		}

        echo  $mensajesalida;
    }

    public function buscarfichatecnica()
    {
        $fichatecnia = $this->input->post('fichatecnia');

        $arraygeneral = $this->m_herramientas->mostrarconid('0_informaciondelevento', 'fichatecnia ="'.$fichatecnia.'"');
        $chintegrantes = '0';

        foreach($arraygeneral as $arrayg)
		{
            $chintegrantes = $arrayg->fichatecnia;
		}

        echo  $chintegrantes;
    }

    // seguimientos
    public function seguimientodirviviendaafectada($page = 'seguimientodirviviendaafectada')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'seguimientodirviviendaafectada';

        $id = $this->input->get('idseguimiento');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idseguimiento ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['idseguimiento'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['barrio'] = '';
        $datos['comuna'] = '';
        $datos['dirCampo1'] = '';
        $datos['dirCampo2'] = '';
        $datos['dirCampo3'] = '';
        $datos['dirCampo4'] = '';
        $datos['dirCampo5'] = '';
        $datos['dirCampo6'] = '';
        $datos['dirCampo7'] = '';
        $datos['dirCampo8'] = '';
        $datos['dirCampo9'] = '';
        $datos['direccion'] = '';
        $datos['telefono1'] = '';
        $datos['telefono2'] = '';

        // informacion de la ficha social
            //traer ficha socuia
            $arraygeneralfs = $this->m_herramientas->mostrarconid('seguimientodatosgenerales', 'idseguimiento ='.$id);
            $datos['fichasocial'] = '';

            foreach($arraygeneralfs as $arraygfs)
            {
                $datos['fichasocial'] = $arraygfs->fichasocial;
            }       
            // fin traer ficha social

            $arraygeneraldirfs = $this->m_herramientas->mostrarconid('2_localizaciondelevento', 'fichasocial ='.$datos['fichasocial']);
        
            foreach($arraygeneraldirfs as $arraygdirfs)
            {
                $datos['barrio'] = $arraygdirfs->barrio;
                $datos['comuna'] = $arraygdirfs->comuna;
                $datos['dirCampo1'] = $arraygdirfs->dirCampo1;
                $datos['dirCampo2'] = $arraygdirfs->dirCampo2;
                $datos['dirCampo3'] = $arraygdirfs->dirCampo3;
                $datos['dirCampo4'] = $arraygdirfs->dirCampo4;
                $datos['dirCampo5'] = $arraygdirfs->dirCampo5;
                $datos['dirCampo6'] = $arraygdirfs->dirCampo6;
                $datos['dirCampo7'] = $arraygdirfs->dirCampo7;
                $datos['dirCampo8'] = $arraygdirfs->dirCampo8;
                $datos['dirCampo9'] = $arraygdirfs->dirCampo9;
                $datos['direccion'] = $arraygdirfs->direccion;
                $datos['telefono1'] = $arraygdirfs->telefono1;
                $datos['telefono2'] = $arraygdirfs->telefono2;
            }
        
        // informacion del seguimiento

		foreach($arraygeneral as $arrayg)
		{
            $datos['idseguimiento'] = $arrayg->idseguimiento;
            $datos['barrio'] = $arrayg->barrio;
            $datos['comuna'] = $arrayg->comuna;
            $datos['dirCampo1'] = $arrayg->dirCampo1;
            $datos['dirCampo2'] = $arrayg->dirCampo2;
            $datos['dirCampo3'] = $arrayg->dirCampo3;
            $datos['dirCampo4'] = $arrayg->dirCampo4;
            $datos['dirCampo5'] = $arrayg->dirCampo5;
            $datos['dirCampo6'] = $arrayg->dirCampo6;
            $datos['dirCampo7'] = $arrayg->dirCampo7;
            $datos['dirCampo8'] = $arrayg->dirCampo8;
            $datos['dirCampo9'] = $arrayg->dirCampo9;
            $datos['direccion'] = $arrayg->direccion;
            $datos['telefono1'] = $arrayg->telefono1;
            $datos['telefono2'] = $arrayg->telefono2;
            $datos['siguiente'] =  '';
            
		}

        $datos['t1_dir_orientacion'] = $this->m_herramientas->mostrarselect('t1_dir_orientacion');
        $datos['t1_dir_tipo_via'] = $this->m_herramientas->mostrarselect('t1_dir_tipo_via');
        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_barrios'] = $this->m_herramientas->mostrarselect('t1_barrios');
        $datos['t1_ruralurbano'] = $this->m_herramientas->mostrarselect('t1_ruralurbano');


        $datosb['botones'] = $this->botoneraseg($datos['idseguimiento']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function seguimientodirviviendavisita($page = 'seguimientodirviviendavisita')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'seguimientodirviviendavisita';

        $id = $this->input->get('idseguimiento');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idseguimiento ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['idseguimiento'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['barrio'] = '';
        $datos['comuna'] = '';
        $datos['dirCampo1'] = '';
        $datos['dirCampo2'] = '';
        $datos['dirCampo3'] = '';
        $datos['dirCampo4'] = '';
        $datos['dirCampo5'] = '';
        $datos['dirCampo6'] = '';
        $datos['dirCampo7'] = '';
        $datos['dirCampo8'] = '';
        $datos['dirCampo9'] = '';
        $datos['direccion'] = '';

        $datos['telefonico'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['idseguimiento'] = $arrayg->idseguimiento;
            $datos['barrio'] = $arrayg->barrio;
            $datos['comuna'] = $arrayg->comuna;
            $datos['dirCampo1'] = $arrayg->dirCampo1;
            $datos['dirCampo2'] = $arrayg->dirCampo2;
            $datos['dirCampo3'] = $arrayg->dirCampo3;
            $datos['dirCampo4'] = $arrayg->dirCampo4;
            $datos['dirCampo5'] = $arrayg->dirCampo5;
            $datos['dirCampo6'] = $arrayg->dirCampo6;
            $datos['dirCampo7'] = $arrayg->dirCampo7;
            $datos['dirCampo8'] = $arrayg->dirCampo8;
            $datos['dirCampo9'] = $arrayg->dirCampo9;
            $datos['direccion'] = $arrayg->direccion;
            $datos['telefonico'] = $arrayg->telefonico;

            $datos['siguiente'] =  '';
            
		}

        $datos['t1_dir_orientacion'] = $this->m_herramientas->mostrarselect('t1_dir_orientacion');
        $datos['t1_dir_tipo_via'] = $this->m_herramientas->mostrarselect('t1_dir_tipo_via');
        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_barrios'] = $this->m_herramientas->mostrarselect('t1_barrios');
        $datos['t1_ruralurbano'] = $this->m_herramientas->mostrarselect('t1_ruralurbano');

        $datos['t1_sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');
        $datosb['botones'] = $this->botoneraseg($datos['idseguimiento']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function seguimientoayudasentregadas($page = 'seguimientoayudasentregadas')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'seguimientoayudasentregadas';

        $idseguimiento = $this->input->get('idseguimiento');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idseguimiento ='.$idseguimiento);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

        $datos['idseguimiento'] = $idseguimiento;
        $datos['verestado'] = '';

        if($datos['idseguimiento'] == 0)
        {$datos['verestado'] = 'style="display:none"';}

        $datos['asistencialiamentaria'] = '';
        $datos['quienasis'] = '';
        $datos['cualasis'] = '';
        $datos['paquetealimentario'] = '';
        $datos['quienpaq'] = '';
        $datos['cualpaq'] = '';
        $datos['tipoa'] = '';
        $datos['tipob'] = '';
        $datos['tipoc'] = '';
        $datos['noalimentarias'] = '';
        $datos['quiendoa'] = '';
        $datos['factura'] = '';

        $datos['dcocina'] = '';
        $datos['daseohogar'] = '';
        $datos['daseofamiliar'] = '';
        $datos['dasehombre'] = '';
        $datos['daseomujer'] = '';
        $datos['daseonna'] = '';
        $datos['daseoinfantil'] = '';
        $datos['daseoespecial'] = '';       
        $datos['dcolchonetas'] = '';
        $datos['dcobijas'] = '';
        $datos['dsabanas'] = '';
        $datos['dalmohadas'] = '';

        $datos['acocina'] = '';
        $datos['aaseohogar'] = '';
        $datos['aaseofamiliar'] = '';
        $datos['aasehombre'] = '';
        $datos['aaseomujer'] = '';
        $datos['aaseonna'] = '';
        $datos['aaseoinfantil'] = '';
        $datos['aaseoespecial'] = '';       
        $datos['acolchonetas'] = '';
        $datos['acobijas'] = '';
        $datos['asabanas'] = '';
        $datos['aalmohadas'] = '';

        $datos['ococina'] = '';
        $datos['oaseohogar'] = '';
        $datos['oaseofamiliar'] = '';
        $datos['oasehombre'] = '';
        $datos['oaseomujer'] = '';
        $datos['oaseonna'] = '';
        $datos['oaseoinfantil'] = '';
        $datos['oaseoespecial'] = '';       
        $datos['ocolchonetas'] = '';
        $datos['ocobijas'] = '';
        $datos['osabanas'] = '';
        $datos['oalmohadas'] = '';

        $datos['enitdad'] = '';
        $datos['otros'] = '';
        $datos['cuales'] = '';
        $datos['entidadotros'] = '';
        $datos['tipoentraga'] = '';
        $datos['entregaayuda'] = ''; 
      

		foreach($arraygeneral as $arrayg)
		{
            $datos['asistencialiamentaria'] = $arrayg->asistencialiamentaria;
            $datos['quienasis'] = $arrayg->quienasis;
            $datos['cualasis'] = $arrayg->cualasis;
            $datos['paquetealimentario'] = $arrayg->paquetealimentario;
            $datos['quienpaq'] = $arrayg->quienpaq;
            $datos['cualpaq'] = $arrayg->cualpaq;
            $datos['tipoa'] = $arrayg->tipoa;
            $datos['tipob'] = $arrayg->tipob;
            $datos['tipoc'] = $arrayg->tipoc;
            $datos['noalimentarias'] = $arrayg->noalimentarias;
            $datos['quiendoa'] = $arrayg->quiendoa;
            $datos['factura'] = $arrayg->factura;

            $datos['dcocina'] = $arrayg->dcocina;
            $datos['daseohogar'] = $arrayg->daseohogar;
            $datos['daseofamiliar'] = $arrayg->daseofamiliar;
            $datos['dasehombre'] = $arrayg->dasehombre;
            $datos['daseomujer'] = $arrayg->daseomujer;
            $datos['daseonna'] = $arrayg->daseonna;
            $datos['daseoinfantil'] = $arrayg->daseoinfantil;
            $datos['daseoespecial'] = $arrayg->daseoespecial;            
            $datos['dcolchonetas'] = $arrayg->dcolchonetas;
            $datos['dcobijas'] = $arrayg->dcobijas;
            $datos['dsabanas'] = $arrayg->dsabanas;
            $datos['dalmohadas'] = $arrayg->dalmohadas;

            $datos['acocina'] = $arrayg->acocina;
            $datos['aaseohogar'] = $arrayg->aaseohogar;
            $datos['aaseofamiliar'] = $arrayg->aaseofamiliar;
            $datos['aasehombre'] = $arrayg->aasehombre;
            $datos['aaseomujer'] = $arrayg->aaseomujer;
            $datos['aaseonna'] = $arrayg->aaseonna;
            $datos['aaseoinfantil'] = $arrayg->aaseoinfantil;
            $datos['aaseoespecial'] = $arrayg->aaseoespecial;            
            $datos['acolchonetas'] = $arrayg->acolchonetas;
            $datos['acobijas'] = $arrayg->acobijas;
            $datos['asabanas'] = $arrayg->asabanas;
            $datos['aalmohadas'] = $arrayg->aalmohadas;

            $datos['ococina'] = $arrayg->ococina;
            $datos['oaseohogar'] = $arrayg->oaseohogar;
            $datos['oaseofamiliar'] = $arrayg->oaseofamiliar;
            $datos['oasehombre'] = $arrayg->oasehombre;
            $datos['oaseomujer'] = $arrayg->oaseomujer;
            $datos['oaseonna'] = $arrayg->oaseonna;
            $datos['oaseoinfantil'] = $arrayg->oaseoinfantil;
            $datos['oaseoespecial'] = $arrayg->oaseoespecial;            
            $datos['ocolchonetas'] = $arrayg->ocolchonetas;
            $datos['ocobijas'] = $arrayg->ocobijas;
            $datos['osabanas'] = $arrayg->osabanas;
            $datos['oalmohadas'] = $arrayg->oalmohadas;

            $datos['enitdad'] = $arrayg->enitdad;
            $datos['otros'] = $arrayg->otros;
            $datos['cuales'] = $arrayg->cuales;
            $datos['entidadotros'] = $arrayg->entidadotros;
            $datos['tipoentraga'] = $arrayg->tipoentraga;  
            $datos['entregaayuda'] = $arrayg->entregaayuda;    
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');
        //$datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes', 'fichasocial ='.$datos['fichasocial']);
        $datos['t1_tipoentraga'] = $this->m_herramientas->mostrarselect('t1_tipoentraga_seguimiento');
        $datos['t1_quiendoa'] = $this->m_herramientas->mostrarselect('t1_quiendoa');
        $datos['t1_quienaliementario'] = $this->m_herramientas->mostrarselect('t1_quienaliementario');
        $datos['t1_redentregaayudas'] = $this->m_herramientas->mostrarselect('t1_redentregaayudas');

        $datosb['botones'] = $this->botoneraseg($datos['idseguimiento']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function seguimientomotivoyprofesional($page = 'seguimientomotivoyprofesional')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'seguimientomotivoyprofesional';

        $id = $this->input->get('idseguimiento');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idseguimiento ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['idseguimiento'] = ( $id == 0 ? 'Pendiente' : $id);

		$datos['entidad'] = '';
        $datos['diligenciadopor'] = '';
        $datos['nameFile'] = '';
        $datos['apoyosocial'] = '';

        $datos['nombrequienrecibelavisita'] = '';
        $datos['motivoseguimiento'] = '';
        $datos['observacion'] = '';
        $datos['cierrecasotelefonico'] = '1';
        $datos['cierrecaso'] = '';
        $datos['fechaproximoseguimiento'] = '';
        $datos['concualcerro'] = '';
        $datos['draw_dataUrl'] = '';
        $datos['nameFirma'] = '';
        $datos['autorizofirma'] = '2';
        $datos['mostrarnameFirma'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['entidad'] = $arrayg->entidad;
            $datos['diligenciadopor'] = $arrayg->diligenciadopor;
            $datos['nameFile'] = $arrayg->nameFile;
            $datos['apoyosocial'] = $arrayg->apoyosocial;

            $datos['nombrequienrecibelavisita'] = $arrayg->nombrequienrecibelavisita;
            $datos['motivoseguimiento'] = $arrayg->motivoseguimiento;
            $datos['observacion'] = $arrayg->observacion;
            $datos['cierrecasotelefonico'] = '1'; // $arrayg->cierrecasotelefonico;
            $datos['cierrecaso'] = $arrayg->cierrecaso;
            $datos['fechaproximoseguimiento'] = $arrayg->fechaproximoseguimiento;
            $datos['concualcerro'] = $arrayg->concualcerro;
            $datos['draw_dataUrl'] = $arrayg->draw_dataUrl; 
            $datos['nameFirma'] = $arrayg->nameFirma;
            $datos['mostrarnameFirma'] = URL_LOCAL.'/cah/resources/filesUploaded/firmas/'.$arrayg->nameFirma;
            $datos['autorizofirma'] = $arrayg->autorizofirma;            
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_seguimiento');

        
        if($datos['nombrequienrecibelavisita'] == '')
        {
            $arraygeneralnom = $this->m_herramientas->mostrarconid('seguimientodatosgenerales', 'idseguimiento ='.$datos['idseguimiento']);

            foreach($arraygeneralnom as $arraygnom)
            {    
                $datos['nombrequienrecibelavisita'] = $arraygnom->nombre1e.' '.$arraygnom->nombre2e.' '.$arraygnom->apellido1e.' '.$arraygnom->apellido2e.'-'.$arraygnom->numerodedocumentoe;
            }

        }

        $datosb['botones'] = $this->botoneraseg($datos['idseguimiento']);

        $datosadjuntar['soloimagen'] = 'accept="image/*"';

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    public function seguimientodatosgenerales($page = 'seguimientodatosgenerales')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'seguimientodatosgenerales';

        $id = $this->input->get('idseguimiento');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idseguimiento ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['idseguimiento'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['fichasocial'] = '';
		$datos['fichatecnia'] = '';
        $datos['fechavisita'] = '';


		$datos['tipodedocumentoe'] = '';
		$datos['numerodedocumentoe'] = '';
        $datos['nombre1e'] = '';        
        $datos['nombre2e'] = '';
        $datos['apellido1e'] = '';
        $datos['apellido2e'] = '';
        $datos['telefono1'] = '';
        $datos['telefono2'] = '';

        $datos['tipodedocumentoj'] = '';
		$datos['numerodedocumentoj'] = '';
        $datos['nombre1j'] = '';        
        $datos['nombre2j'] = '';
        $datos['apellido1j'] = '';
        $datos['apellido2j'] = '';
        $datos['fichaaccess'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['idseguimiento'] = $arrayg->idseguimiento;
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['fichatecnia'] = $arrayg->fichatecnia;
            $datos['fechavisita'] = $arrayg->fechavisita;

            $datos['tipodedocumentoe'] = $arrayg->tipodedocumentoe;
            $datos['numerodedocumentoe'] = $arrayg->numerodedocumentoe;
            $datos['nombre1e'] = $arrayg->nombre1e;   
            $datos['nombre2e'] = $arrayg->nombre2e;
            $datos['apellido1e'] = $arrayg->apellido1e;
            $datos['apellido2e'] = $arrayg->apellido2e;
            $datos['telefono1'] = $arrayg->telefono1;
            $datos['telefono2'] = $arrayg->telefono2;
    
            $datos['tipodedocumentoj'] = $arrayg->tipodedocumentoj;
            $datos['numerodedocumentoj'] = $arrayg->numerodedocumentoj;
            $datos['nombre1j'] = $arrayg->nombre1j;    
            $datos['nombre2j'] = $arrayg->nombre2j;
            $datos['apellido1j'] = $arrayg->apellido1j;
            $datos['apellido2j'] = $arrayg->apellido2j;
            $datos['fichaaccess'] = $arrayg->fichaaccess;           

            $datos['siguiente'] =  '';
		}

        $datos['t1_tipodedocumento'] = $this->m_herramientas->mostrarselectsinblanco('t1_tipodedocumento');
        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');
        $datosb['botones'] = $this->botoneraseg($id);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function botoneraseg($idseguimiento)
    {
        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_estado_seguimiento', 'idseguimiento ='.$idseguimiento);

        $botonera = '<div class="dropdown">
                        <button class="btn btn-info btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-file"></i>
                        Numerales realizados
                        <i class="fa-sharp fa-solid fa-chevron-down"></i>
                        </button>
                    <div class="dropdown-menu">';

            foreach($arrayintegrantes as $arrayg)
            {
                    $botonera .= '<button type="button" class="dropdown-item" onclick="btnsiguienteseguimiento(`'.$arrayg->controlador.'`,'.$arrayg->idseguimiento.')">'.$arrayg->nombre.'</button>';
            }

        $botonera .= '</div></div>';

        return $botonera;
    }

    public function homeseguimiento($page = 'homeseguimiento')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        if($this->session->userdata('rol') == 1)
        {
            if($this->session->userdata('id_usuario') == 76)
            {
                $arrayintegrantes = $this->m_herramientas->mostrarconid('inf_seguimiento', 'ID_PROFESIONAL in ("'.$this->session->userdata('id_usuario').'","PENDIENTE","7")');
            }
            else
            {
                $arrayintegrantes = $this->m_herramientas->mostrarconid('inf_seguimiento', 'ID_PROFESIONAL in ("'.$this->session->userdata('id_usuario').'","PENDIENTE")');
            }
            
        }
        else
        {
            $arrayintegrantes = $this->m_herramientas->mostrar('inf_seguimiento');
        }

        

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $editarficha = '';
        $botoncerrarficha = '';
        $verpdf = '';
        $verpdfft = '';
        $devolverficha = '';
        $datos['devolver'] = '';
        $veradjuntosficha = '';
        $trazabilidad = '';
        $aprobarficha = '';
        $firmatranscersal = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefichaadjunto(`adjuntosfichasocial`,'.$arrayg->fichasocial.',`homeseguimiento`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';
            $aprobarficha = '';
            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguienteseguimiento(`seguimientodatosgenerales`,'.$arrayg->idseguimiento.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $botoncerrarficha = '';
            $verpdf = '';
            $verpdfft = '';
            $devolverficha = '';
            $datos['devolver'] = '';
            $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->idseguimiento.')" data-toggle="modal" data-target="#staticBackdrop3">
                                <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                            </button>';
            $firmatranscersal = '';

            if($this->session->userdata('rol') == 4 || $this->session->userdata('rol') == 6)
            {
                $datos['devolver'] = '<h6><i class="fa-sharp fa-solid fa-trash-arrow-up"></i> - Devolver ficha por inconsistencias. (SOLO SI SE TIENE EL PROFESIONAL ASIGNADO)</h6><h6><i class="fa-sharp fa-solid fa-share"></i> - Aprobar ficha.(Solo para fichas cerradas)</h6>';
             
                if($arrayg->profesional != 'PENDIENTE')
                {
                    $devolverficha = '  <button type="button" class="btn btn-info btn-sm" title="Devolver Registro" onclick="btndevolverficha('.$arrayg->idseguimiento.',`'.$arrayg->fichatecnia.'`,`'.$arrayg->correo_profesional.'`,`SERGUIMIENTO ESPECIAL`)" data-toggle="modal" data-target="#staticBackdrop2">
                                        <i class="fa-sharp fa-solid fa-trash-arrow-up"></i>
                                        </button>';
                }
                
                if($arrayg->estadoseguimiento == 'CERRADA')
                {
                    $aprobarficha = '<button type="button" class="btn btn-info btn-sm" title="Aprobar ficha" onclick="btnaprobarficha('.$arrayg->idseguimiento.')"><i class="fa-sharp fa-solid fa-share"></i></button>';               
                }
            }

            if($arrayg->estadoseguimiento == 'COMPLETA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->idseguimiento.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '';
                $firmatranscersal = '<button type="button" class="btn btn-info btn-sm" title="Firma profesional" onclick="btnfirmatransversal(`'.$arrayg->idseguimiento.'`,`seguimientofirmaprofesional`,`comisionsocial/c_ficha/homeseguimiento?idseguimiento=`)"><i class="fa-solid fa-signature"></i></button>';
            }

            if($arrayg->estadoseguimiento == 'INCOMPLETA')
            {
                $trazabilidad = '';
            }

            if($arrayg->estadoseguimiento == 'DEVUELTA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->idseguimiento.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $firmatranscersal = '<button type="button" class="btn btn-info btn-sm" title="Firma profesional" onclick="btnfirmatransversal(`'.$arrayg->idseguimiento.'`,`seguimientofirmaprofesional`,`comisionsocial/c_ficha/homeseguimiento?idseguimiento=`)"><i class="fa-solid fa-signature"></i></button>';
                $devolverficha = '';
            }

            if($arrayg->estadoseguimiento == 'CERRADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->estadoseguimiento == 'APROBADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $aprobarficha = '';
                $devolverficha = '';
            }

            if($arrayg->estadoseguimiento == 'REMITIDA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $aprobarficha = '';
                $devolverficha = '';
            }

            if($arrayg->archivo_adjunto != 'NO') 
            {
                $verpdfft = $arrayg->archivo_adjunto;
            } 

            //Estos es para deshabilitar del firma del profesional ya que es automatico
            $firmatranscersal = '';

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '. $editarficha.'
            '. $botoncerrarficha.'
            
            '. $aprobarficha.'
            '. $verpdf.'
            '. $verpdfft.'
            '. $veradjuntosficha.'
            '. $trazabilidad.'
            '. $firmatranscersal.'
            '. $devolverficha.'
            </td>
            <td>' . $arrayg->estadoseguimiento . '</td>
            <td>' . $arrayg->idseguimiento . '</td>
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->direccionafectada . ' </td>            
            <td>' . $arrayg->direccionvisita . '</td>
            <td>' . $arrayg->entregaayuda . '</td>
            <td>' . $arrayg->remisvimed . '</td>
            <td>' . $arrayg->otros_programas . '</td>
            <td>' . $arrayg->profesional . '</td>
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
		}

        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo_seguimiento');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/devolverficha');
        $this->load->view('plantillas/trazabilidad');
        $this->load->view('plantillas/footer');
    }

    // Local Comercial
    public function c1_identificacionevento($page = 'c1_identificacionevento')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'c1_identificacionevento';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['visitadagrd'] = '';
		$datos['tipoevento'] = '';
        $datos['otro'] = 'NO APLICA';
        $datos['quebrada'] = 'NO APLICA';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['visitadagrd'] = $arrayg->visitadagrd;
            $datos['tipoevento'] = $arrayg->tipoevento;
            $datos['otro'] = $arrayg->otro;
            $datos['quebrada'] = $arrayg->quebrada;
            $datos['siguiente'] =  '';
		}

        //verificar si es emergencia
        $arraygeneralmotivo = $this->m_herramientas->mostrarconid('0_informaciondelevento', 'fichasocial ='.$id);
		$datos['motivovisita'] = '';
        $datos['deshabilitaremergencia'] = 'required';
        $datos['mensajeemergecencia'] = '';

		foreach($arraygeneralmotivo as $arrayg)
		{
            $datos['motivovisita'] = $arrayg->motivovisita;
		}
        if ($datos['motivovisita'] == '1')
        {
            $datos['deshabilitaremergencia'] = '';
            $datos['mensajeemergecencia'] = '<small id="tel1Help" class="form-text text-muted">La fecha 01/01/1900 es la fecha no aplica por defecto.</small>';

            if($datos['visitadagrd'] == '')
            {
                $datos['visitadagrd'] = '1900-01-01';
            }


        }
        //fin verficar si es emergencia

        $datos['opctipoevento'] = $this->m_herramientas->mostrarselect('t1_comercialtipodeevento');

        $datosb['botones'] = $this->botoneralocal($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function c2_localizaciondelevento($page = 'c2_localizaciondelevento')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'c2_localizaciondelevento';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['barrio'] = '';
        $datos['comuna'] = '';
        $datos['correo'] = '';
        $datos['dirCampo1'] = '';
        $datos['dirCampo2'] = '';
        $datos['dirCampo3'] = '';
        $datos['dirCampo4'] = '';
        $datos['dirCampo5'] = '';
        $datos['dirCampo6'] = '';
        $datos['dirCampo7'] = '';
        $datos['dirCampo8'] = '';
        $datos['dirCampo9'] = '';
        $datos['direccion'] = '';
        $datos['ruralurbano'] = '';
        $datos['sector'] = '';
        $datos['telefono1'] = '';
        $datos['telefono2'] = '';
        $datos['latitud'] = '';
        $datos['longitud'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['barrio'] = $arrayg->barrio;
            $datos['comuna'] = $arrayg->comuna;
            $datos['correo'] = $arrayg->correo;
            $datos['dirCampo1'] = $arrayg->dirCampo1;
            $datos['dirCampo2'] = $arrayg->dirCampo2;
            $datos['dirCampo3'] = $arrayg->dirCampo3;
            $datos['dirCampo4'] = $arrayg->dirCampo4;
            $datos['dirCampo5'] = $arrayg->dirCampo5;
            $datos['dirCampo6'] = $arrayg->dirCampo6;
            $datos['dirCampo7'] = $arrayg->dirCampo7;
            $datos['dirCampo8'] = $arrayg->dirCampo8;
            $datos['dirCampo9'] = $arrayg->dirCampo9;
            $datos['direccion'] = $arrayg->direccion;
            $datos['ruralurbano'] = $arrayg->ruralurbano;
            $datos['sector'] = $arrayg->sector;
            $datos['telefono1'] = $arrayg->telefono1;
            $datos['telefono2'] = $arrayg->telefono2;
            $datos['latitud'] = $arrayg->latitud;
            $datos['longitud'] = $arrayg->longitud;
            $datos['siguiente'] =  '';
            
		}

        $datos['t1_dir_orientacion'] = $this->m_herramientas->mostrarselect('t1_dir_orientacion');
        $datos['t1_dir_tipo_via'] = $this->m_herramientas->mostrarselect('t1_dir_tipo_via');
        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_barrios'] = $this->m_herramientas->mostrarselect('t1_barrios');
        $datos['t1_ruralurbano'] = $this->m_herramientas->mostrarselect('t1_ruralurbano');


        $datosb['botones'] = $this->botoneralocal($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function c3_evacuacionydanos($page = 'c3_evacuacionydanos')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'c3_evacuacionydanos';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['tipoevacuacion'] = '';
		$datos['danosvivienda'] = '';
        $datos['danosenseres'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['tipoevacuacion'] = $arrayg->tipoevacuacion;
            $datos['danosvivienda'] = $arrayg->danosvivienda;
            $datos['danosenseres'] = $arrayg->danosenseres;

            $datos['siguiente'] =  '';
		}

        $datos['t1_tipoevacuacion'] = $this->m_herramientas->mostrarselect('t1_comercialtipoevacuacion');
        $datos['t1_tipodanos'] = $this->m_herramientas->mostrarselect('t1_comercialtipodanos');
        $datos['t1_comercialtipodanoslocal'] = $this->m_herramientas->mostrarselect('t1_comercialtipodanoslocal');

        $datosb['botones'] = $this->botoneralocal($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function c45_tenenciaydocumentoslocal($page = 'c45_tenenciaydocumentoslocal')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'c45_tenenciaydocumentoslocal';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['tenenciadelavivienda'] = '';
        $datos['propietario'] = '';
        $datos['propietariotel1'] = '';
        $datos['propietariotel2'] = '';

        $datos['camaradecomercio'] = '';
        $datos['nit'] = '';
        $datos['numerodeempleados'] = '';
        $datos['unidadeconomica'] = '';
        $datos['categoria'] = '';
        $datos['nombredelnegocio'] = '';
        $datos['seguro'] = '';
        $datos['cualseguro'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['tenenciadelavivienda'] = $arrayg->tenenciadelavivienda;
            $datos['propietario'] = $arrayg->propietario;
            $datos['propietariotel1'] = $arrayg->propietariotel1;
            $datos['propietariotel2'] = $arrayg->propietariotel2;

            $datos['camaradecomercio'] = $arrayg->camaradecomercio;
            $datos['nit'] = $arrayg->nit;
            $datos['numerodeempleados'] = $arrayg->numerodeempleados;
            $datos['unidadeconomica'] = $arrayg->unidadeconomica;
            $datos['categoria'] = $arrayg->categoria;
            $datos['nombredelnegocio'] = $arrayg->nombredelnegocio;
            $datos['seguro'] = $arrayg->seguro;
            $datos['cualseguro'] = $arrayg->cualseguro;
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');
        $datos['t1_tenenciadelavivienda'] = $this->m_herramientas->mostrarselect('t1_comercialtenencia');

        $datosb['botones'] = $this->botoneralocal($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function c6_integrantes($page = 'c6_integrantes')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }


        $id = $this->input->get('fichasocial');
        $datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);

        $datos['siguiente'] =  'disabled';

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_listaintegrantescomercial', 'fichasocial ='.$id);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        foreach($arrayintegrantes as $arrayg)
		{
            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" onclick="btnsiguienteintegrante(`c6_integrante`,'.$arrayg->idintegrante.','.$arrayg->fichasocial.')">Ver/Editar</button>
            </td>
            <td>' . $arrayg->tipodocumento . '</td>
            <td>' . $arrayg->numerodedocumento . '</td>
            <td>' . $arrayg->nombre1 . ' ' . $arrayg->nombre2 . ' ' . $arrayg->apellido1 . ' ' . $arrayg->apellido2 . '</td>
            <td>' . $arrayg->edad . '</td>
            <td>' . $arrayg->sexo . '</td>
            <td>' . $arrayg->parentesco . '</td>
            <td>' . $arrayg->nacionalidad . '</td>
            <td></td>
            </tr>';

            $datos['siguiente'] =  '';
		}

        $datosb['botones'] = $this->botoneralocal($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function c6_integrante($page = 'c6_integrante')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'c6_integrante';

        $idfichasocial = $this->input->get('fichasocial');
        $idintegrante = $this->input->get('idintegrante');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idintegrante ='.$idintegrante);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';
        $datos['verestado'] = ' style="display:none"';
        $datos['vercalcelar'] = ' style="display:none"';

        $datos['idintegrante'] = $idintegrante;
		$datos['fichasocial'] = $idfichasocial;

        if($datos['idintegrante'] == 0)
        {$datos['vercalcelar'] = '';}

        $datos['tipodedocumento'] = '';
        $datos['nacionalidad'] = '';
        $datos['numerodedocumento'] = '';
        $datos['nombre1'] = '';
        $datos['nombre2'] = '';
        $datos['apellido1'] = '';
        $datos['apellido2'] = '';
        $datos['fechadenacimiento'] = '';
        $datos['sexo'] = '';
        $datos['gestantelactante'] = '4';
        $datos['parentesco'] = '';
        $datos['estadousuario'] = '3';

        $datos['eps'] = '';
        $datos['arl'] = '';
        $datos['pension'] = '';

        $datos['nombrefamiliar'] = '';
        $datos['telefonofamiliar'] = '';

        $datos['dirCampo1'] = '';
        $datos['dirCampo2'] = '';
        $datos['dirCampo3'] = '';
        $datos['dirCampo4'] = '';
        $datos['dirCampo5'] = '';
        $datos['dirCampo6'] = '';
        $datos['dirCampo7'] = '';
        $datos['dirCampo8'] = '';
        $datos['dirCampo9'] = '';
        $datos['direccion'] = '';
        $datos['telefono1'] = '';
        $datos['telefono2'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['tipodedocumento'] = $arrayg->tipodedocumento;
            $datos['nacionalidad'] = $arrayg->nacionalidad;
            $datos['numerodedocumento'] = $arrayg->numerodedocumento;
            $datos['nombre1'] = $arrayg->nombre1;
            $datos['nombre2'] = $arrayg->nombre2;
            $datos['apellido1'] = $arrayg->apellido1;
            $datos['apellido2'] = $arrayg->apellido2;
            $datos['fechadenacimiento'] = $arrayg->fechadenacimiento;
            $datos['sexo'] = $arrayg->sexo;
            $datos['gestantelactante'] = $arrayg->gestantelactante;
            $datos['parentesco'] = $arrayg->parentesco;
            $datos['estadousuario'] = $arrayg->estadousuario;

            $datos['eps'] = $arrayg->eps;
            $datos['arl'] = $arrayg->arl;
            $datos['pension'] = $arrayg->pension;

            $datos['nombrefamiliar'] = $arrayg->nombrefamiliar;
            $datos['telefonofamiliar'] = $arrayg->telefonofamiliar;
            
            $datos['siguiente'] =  '';
            $datos['estado'] = $arrayg->estado;

            $datos['dirCampo1'] = $arrayg->dirCampo1;
            $datos['dirCampo2'] = $arrayg->dirCampo2;
            $datos['dirCampo3'] = $arrayg->dirCampo3;
            $datos['dirCampo4'] = $arrayg->dirCampo4;
            $datos['dirCampo5'] = $arrayg->dirCampo5;
            $datos['dirCampo6'] = $arrayg->dirCampo6;
            $datos['dirCampo7'] = $arrayg->dirCampo7;
            $datos['dirCampo8'] = $arrayg->dirCampo8;
            $datos['dirCampo9'] = $arrayg->dirCampo9;
            $datos['direccion'] = $arrayg->direccion;
            $datos['telefono1'] = $arrayg->telefono1;
            $datos['telefono2'] = $arrayg->telefono2;

            if( $datos['estado'] == 1)
            {
                $datos['verestado'] = '';
            }
		}

        $datos['t1_dir_orientacion'] = $this->m_herramientas->mostrarselect('t1_dir_orientacion');
        $datos['t1_dir_tipo_via'] = $this->m_herramientas->mostrarselect('t1_dir_tipo_via');

        $datos['t1_tipodedocumento'] = $this->m_herramientas->mostrarselect('t1_tipodedocumento');
        $datos['t1_sexo'] = $this->m_herramientas->mostrarselect('t1_sexo');
        $datos['t1_gestanteylactante'] = $this->m_herramientas->mostrarselect('t1_gestanteylactante');
        $datos['t1_parentesco'] = $this->m_herramientas->mostrarselect('t1_comercialparentesco');
        $datos['t1_estado'] = $this->m_herramientas->mostrarselect('t1_estado');
        $datos['t1_paises'] = $this->m_herramientas->mostrarselect('t1_paises');
        $datos['t1_sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');

        $datosb['botones'] = $this->botoneralocal($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function c7_observaciones($page = 'c7_observaciones')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'c7_observaciones';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['observacion'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['observacion'] = $arrayg->observacion;
            
            $datos['siguiente'] =  '';
		}

        $datosb['botones'] = $this->botoneralocal($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function c8_datosgeneralesremisiones($page = 'c8_datosgeneralesremisiones')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'c81_remisiones';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['remisiones'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['remisiones'] = $arrayg->remisiones;

            $datos['siguiente'] =  '';
		}

        $datos['t1_sinoremisiones'] = $this->m_herramientas->mostrarselect('t1_sinoremisiones');
        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes_comercial', 'fichasocial ='.$datos['fichasocial']);
        $datos['t1_programas'] = $this->m_herramientas->mostrarselect('t1_programas');
       
        //vista dos

        $datos['tabla2'] = 'c8_datosgeneralesremisiones';
        $datos['vista'] = 'vw_tabla_programa_integrante_comercial';

        $arrayintegrantes = $this->m_herramientas->mostrarconid($datos['vista'], 'fichasocial ='.$datos['fichasocial']);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        foreach($arrayintegrantes as $arrayg)
		{
            $datos['Integranteshogar'] .= '<tr>
            <td>
                <button type="button" class="btn btn-info btn-sm" onclick="btneliminar(`'.$datos['tabla2'] .'`,'.$arrayg->idintegrante.','.$arrayg->fichasocial.','.$arrayg->programa.')">Eliminar</button>
                <button type="button" class="btn btn-info btn-sm" onclick="btnmostrarmodal('.$arrayg->idintegrante.','.$arrayg->fichasocial.','.$arrayg->programa.')" data-toggle="modal" data-target="#staticBackdrop">
                Ver Objetivo
                </button>
            </td>
            <td>' . $arrayg->nombreprograma . '</td>
            <td>' . $arrayg->nombreintegrante . '</td>
            <td></td>
            </tr>';
		}

        $datosb['botones'] = $this->botoneralocal($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function c8_abrirmodalremisin()
    {
        $fichasocial = $this->input->post('fichasocial');
        $programa = $this->input->post('programa');
        $idintegrante = $this->input->post('idintegrante');

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_tabla_programa_integrante_comercial', 'fichasocial ='.$fichasocial.' and programa = '.$programa.' and idintegrante = '.$idintegrante);
        $chintegrantes = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $chintegrantes = $arrayg->observacion;
		}

        echo  $chintegrantes;
    }

    public function c9_autorizacion($page = 'c9_autorizacion')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'c9_autorizacion';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);

        $datos['idintegrante'] = '';
		$datos['entidad'] = '';
        $datos['requerieseguimiento'] = '';
        $datos['fechaprobable'] = date('Y-m-d');
        $datos['diligenciadopor'] = '';
        $datos['acepto'] = '';
        $datos['nameFile'] = '';
        $datos['apoyosocial'] = '';

        //firmas
        $datos['draw_dataUrl'] = '';
        $datos['nameFirma'] = '';
        $datos['autorizofirma'] = '2';
        $datos['mostrarnameFirma'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['idintegrante'] = $arrayg->idintegrante;
            $datos['entidad'] = $arrayg->entidad;
            $datos['requerieseguimiento'] = $arrayg->requerieseguimiento;
            $datos['fechaprobable'] = $arrayg->fechaprobable;
            $datos['diligenciadopor'] = $arrayg->diligenciadopor;
            $datos['acepto'] = $arrayg->acepto;
            $datos['nameFile'] = $arrayg->nameFile;
            $datos['apoyosocial'] = $arrayg->apoyosocial;

            //firmas
            $datos['draw_dataUrl'] = $arrayg->draw_dataUrl; 
            $datos['nameFirma'] = $arrayg->nameFirma;
            $datos['mostrarnameFirma'] = URL_LOCAL.'/cah/resources/filesUploaded/firmas/'.$arrayg->nameFirma;
            $datos['autorizofirma'] = $arrayg->autorizofirma;
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales');
        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes_comercial', 'fichasocial ='.$datos['fichasocial']);

        $datosb['botones'] = $this->botoneralocal($datos['fichasocial']);

        $datosadjuntar['soloimagen'] = 'accept="image/*"';

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    public function c10_ayudasentregadas($page = 'c10_ayudasentregadas')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'c10_ayudasentregadas';

        $fichasocial = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$fichasocial);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

        $datos['fichasocial'] = $fichasocial;
        $datos['verestado'] = '';

        if($datos['fichasocial'] == 0)
        {$datos['verestado'] = 'style="display:none"';}

        $datos['asistencialiamentaria'] = '';
        $datos['quienasis'] = '';
        $datos['cualasis'] = '';
        $datos['paquetealimentario'] = '';
        $datos['quienpaq'] = '';
        $datos['cualpaq'] = '';
        $datos['tipoa'] = '';
        $datos['tipob'] = '';
        $datos['tipoc'] = '';
        $datos['noalimentarias'] = '';
        $datos['quiendoa'] = '';
        $datos['factura'] = '';

        $datos['dcocina'] = '';
        $datos['daseohogar'] = '';
        $datos['daseofamiliar'] = '';
        $datos['dasehombre'] = '';
        $datos['daseomujer'] = '';
        $datos['daseonna'] = '';
        $datos['daseoinfantil'] = '';
        $datos['daseoespecial'] = '';       
        $datos['dcolchonetas'] = '';
        $datos['dcobijas'] = '';
        $datos['dsabanas'] = '';
        $datos['dalmohadas'] = '';

        $datos['acocina'] = '';
        $datos['aaseohogar'] = '';
        $datos['aaseofamiliar'] = '';
        $datos['aasehombre'] = '';
        $datos['aaseomujer'] = '';
        $datos['aaseonna'] = '';
        $datos['aaseoinfantil'] = '';
        $datos['aaseoespecial'] = '';       
        $datos['acolchonetas'] = '';
        $datos['acobijas'] = '';
        $datos['asabanas'] = '';
        $datos['aalmohadas'] = '';

        $datos['ococina'] = '';
        $datos['oaseohogar'] = '';
        $datos['oaseofamiliar'] = '';
        $datos['oasehombre'] = '';
        $datos['oaseomujer'] = '';
        $datos['oaseonna'] = '';
        $datos['oaseoinfantil'] = '';
        $datos['oaseoespecial'] = '';       
        $datos['ocolchonetas'] = '';
        $datos['ocobijas'] = '';
        $datos['osabanas'] = '';
        $datos['oalmohadas'] = '';

        $datos['enitdad'] = '';
        $datos['otros'] = '';
        $datos['cuales'] = '';
        $datos['entidadotros'] = '';
        $datos['tipoentraga'] = '';
        $datos['entregaayuda'] = ''; 
      

		foreach($arraygeneral as $arrayg)
		{
            $datos['asistencialiamentaria'] = $arrayg->asistencialiamentaria;
            $datos['quienasis'] = $arrayg->quienasis;
            $datos['cualasis'] = $arrayg->cualasis;
            $datos['paquetealimentario'] = $arrayg->paquetealimentario;
            $datos['quienpaq'] = $arrayg->quienpaq;
            $datos['cualpaq'] = $arrayg->cualpaq;
            $datos['tipoa'] = $arrayg->tipoa;
            $datos['tipob'] = $arrayg->tipob;
            $datos['tipoc'] = $arrayg->tipoc;
            $datos['noalimentarias'] = $arrayg->noalimentarias;
            $datos['quiendoa'] = $arrayg->quiendoa;
            $datos['factura'] = $arrayg->factura;

            $datos['dcocina'] = $arrayg->dcocina;
            $datos['daseohogar'] = $arrayg->daseohogar;
            $datos['daseofamiliar'] = $arrayg->daseofamiliar;
            $datos['dasehombre'] = $arrayg->dasehombre;
            $datos['daseomujer'] = $arrayg->daseomujer;
            $datos['daseonna'] = $arrayg->daseonna;
            $datos['daseoinfantil'] = $arrayg->daseoinfantil;
            $datos['daseoespecial'] = $arrayg->daseoespecial;            
            $datos['dcolchonetas'] = $arrayg->dcolchonetas;
            $datos['dcobijas'] = $arrayg->dcobijas;
            $datos['dsabanas'] = $arrayg->dsabanas;
            $datos['dalmohadas'] = $arrayg->dalmohadas;

            $datos['acocina'] = $arrayg->acocina;
            $datos['aaseohogar'] = $arrayg->aaseohogar;
            $datos['aaseofamiliar'] = $arrayg->aaseofamiliar;
            $datos['aasehombre'] = $arrayg->aasehombre;
            $datos['aaseomujer'] = $arrayg->aaseomujer;
            $datos['aaseonna'] = $arrayg->aaseonna;
            $datos['aaseoinfantil'] = $arrayg->aaseoinfantil;
            $datos['aaseoespecial'] = $arrayg->aaseoespecial;            
            $datos['acolchonetas'] = $arrayg->acolchonetas;
            $datos['acobijas'] = $arrayg->acobijas;
            $datos['asabanas'] = $arrayg->asabanas;
            $datos['aalmohadas'] = $arrayg->aalmohadas;

            $datos['ococina'] = $arrayg->ococina;
            $datos['oaseohogar'] = $arrayg->oaseohogar;
            $datos['oaseofamiliar'] = $arrayg->oaseofamiliar;
            $datos['oasehombre'] = $arrayg->oasehombre;
            $datos['oaseomujer'] = $arrayg->oaseomujer;
            $datos['oaseonna'] = $arrayg->oaseonna;
            $datos['oaseoinfantil'] = $arrayg->oaseoinfantil;
            $datos['oaseoespecial'] = $arrayg->oaseoespecial;            
            $datos['ocolchonetas'] = $arrayg->ocolchonetas;
            $datos['ocobijas'] = $arrayg->ocobijas;
            $datos['osabanas'] = $arrayg->osabanas;
            $datos['oalmohadas'] = $arrayg->oalmohadas;

            $datos['enitdad'] = $arrayg->enitdad;
            $datos['otros'] = $arrayg->otros;
            $datos['cuales'] = $arrayg->cuales;
            $datos['entidadotros'] = $arrayg->entidadotros;
            $datos['tipoentraga'] = $arrayg->tipoentraga;  
            $datos['entregaayuda'] = $arrayg->entregaayuda;    
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');
        //$datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes', 'fichasocial ='.$datos['fichasocial']);
        $datos['t1_tipoentraga'] = $this->m_herramientas->mostrarselect('t1_tipoentraga_seguimiento');
        $datos['t1_quiendoa'] = $this->m_herramientas->mostrarselect('t1_quiendoa');
        $datos['t1_quienaliementario'] = $this->m_herramientas->mostrarselect('t1_quienaliementario');
        $datos['t1_redentregaayudas'] = $this->m_herramientas->mostrarselect('t1_redentregaayudas');

        $datosb['botones'] = $this->botoneralocal($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function botoneralocal($fichasocial)
    {
        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_estado_localcomercial', 'fichasocial ='.$fichasocial);

        $botonera = '<div class="dropdown">
                        <button class="btn btn-info btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-file"></i>
                        Numerales realizados
                        <i class="fa-sharp fa-solid fa-chevron-down"></i>
                        </button>
                    <div class="dropdown-menu">';

            foreach($arrayintegrantes as $arrayg)
            {
                    $botonera .= '<button type="button" class="dropdown-item" onclick="btnsiguiente(`'.$arrayg->controlador.'`,'.$arrayg->fichasocial.')">'.$arrayg->nombre.'</button>';
            }

        $botonera .= '</div></div>';

        return $botonera;
    }

    public function homelocalcomercial($page = 'homelocalcomercial')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        if($this->session->userdata('rol') == 1)
        {
            if($this->session->userdata('id_usuario') == 76)
            {
                $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homelocalcomercial', ' tipovisita = 4 and ID_PROFESIONAL in ("'.$this->session->userdata('id_usuario').'","PENDIENTE","7")');
            }
            else
            {
                $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homelocalcomercial', ' tipovisita = 4 and ID_PROFESIONAL in ("'.$this->session->userdata('id_usuario').'","PENDIENTE")');
            }
            
        }
        else
        {
            $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homelocalcomercial', 'tipovisita = 4');
        }

        

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $editarficha = '';
        $verpdf = '';
        $verpdfft = '';
        $devolverficha = '';
        $datos['devolver'] = '';
        $veradjuntosficha = '';
        $trazabilidad = '';
        $aprobarficha = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $aprobarficha = '';
            $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefichaadjunto(`adjuntosfichasocial`,'.$arrayg->fichasocial.',`homelocalcomercial`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';
            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`informacionevento`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $botoncerrarficha = '';
            $verpdf = '';
            $verpdfft = '';
            $devolverficha = '';
            $datos['devolver'] = '';
            $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                            </button>';

            if($this->session->userdata('rol') == 4 || $this->session->userdata('rol') == 6)
            {
                $datos['devolver'] = '<h6><i class="fa-sharp fa-solid fa-trash-arrow-up"></i> - Devolver ficha por inconsistencias. (SOLO SI SE TIENE EL PROFESIONAL ASIGNADO)</h6><h6><i class="fa-sharp fa-solid fa-share"></i> - Aprobar ficha.(Solo para fichas cerradas)</h6>';
             
                if($arrayg->PROFESIONAL != 'PENDIENTE')
                {
                    $devolverficha = '  <button type="button" class="btn btn-info btn-sm" title="Devolver Registro" onclick="btndevolverficha('.$arrayg->fichasocial.','.$arrayg->fichatecnia.',`'.$arrayg->correo_profesional.'`,`LOCAL COMERCIAL`)" data-toggle="modal" data-target="#staticBackdrop2">
                                        <i class="fa-sharp fa-solid fa-trash-arrow-up"></i>
                                        </button>';
                }
                
                if($arrayg->estadoficha == 'CERRADA')
                {
                    $aprobarficha = '<button type="button" class="btn btn-info btn-sm" title="Aprobar ficha" onclick="btnaprobarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-share"></i></button>';               
                }
            }

            if($arrayg->estadoficha == 'COMPLETA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdflocalcomercial(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '';
            }

            if($arrayg->estadoficha == 'INCOMPLETA')
            {
                $trazabilidad = '';
            }

            if($arrayg->estadoficha == 'DEVUELTA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdflocalcomercial(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->estadoficha == 'CERRADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdflocalcomercial(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->estadoficha == 'APROBADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdflocalcomercial(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $devolverficha = '';
            }

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            } 

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '. $editarficha.'
            '. $botoncerrarficha.'
            '. $devolverficha.'
            '. $aprobarficha.'
            '. $verpdf.'
            '. $verpdfft.'
            '. $veradjuntosficha.'
            '. $trazabilidad.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->tipoevento . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->direccion . '</td>  
            <td>' . $arrayg->PROFESIONAL . '</td>          
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
		}

        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/devolverficha');
        $this->load->view('plantillas/trazabilidad');
        $this->load->view('plantillas/footer');
    }

    //reporte comision
    public function homereportecomision($page = 'homereportecomision')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrar('t10_reporte');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);


        foreach($arrayintegrantes as $arrayg)
		{
            $datos['Integranteshogar'] .=  '<tr>
            <td><button type="button" class="btn btn-success btn-sm" title="Ver Excel" onclick="btnabrirreporte(`'.$arrayg->nombre_vista.'` , `'.$arrayg->base_datos.'`)"><i class="fa-sharp fa-solid fa-file-excel"></i></button></td>
            <td>' . $arrayg->id_reporte . '</td>
            <td style="text-transform: uppercase;">' . $arrayg->nombre_informe . '</td>
            <td style="text-transform: uppercase;">' . $arrayg->descripcion . '</td>
            <td></td>
            </tr>';
		}

        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_seguimiento');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    // home Fichas en correccion
    public function homefichasencorreccion($page = 'homefichasencorreccion')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        if($this->session->userdata('rol') == 1)
        {
            if($this->session->userdata('id_usuario') == 76)
            {
                $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefichasocial', ' tipovisita = 1 and estadoficha = "EN CORRECCION" and id_profesional in ("'.$this->session->userdata('id_usuario').'","PENDIENTE","7")');
            }
            else
            {
                $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefichasocial', ' tipovisita = 1 and estadoficha = "EN CORRECCION" and id_profesional in ("'.$this->session->userdata('id_usuario').'","PENDIENTE")');
            }
            
        }
        else
        {
            $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefichasocial', 'tipovisita = 1 and estadoficha = "EN CORRECCION"');
        }

        

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $botoncerrarficha = '';
        $verpdf = '';
        $verpdfft = '';
        $veradjuntosficha = '';
        $vercambiosgrupofamiliar = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefichaadjunto(`adjuntosfichasocial`,'.$arrayg->fichasocial.',`homefichasencorreccion`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';

            $botoncerrarficha = '';
            $verpdf = '';
            $verpdfft = '';
            $vercambiosgrupofamiliar = '';

            if($arrayg->estadoficha == 'EN CORRECCION')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Ficha corregida" onclick="btncorregirficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-check"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            } 

            // verificar si tiene cambios en el grupo familiar para mostrar el nboton
            $arrayingfexiste = $this->m_herramientas->mostrarconidlimituno('historico_131_integrante', 'fichasocial = '.$arrayg->fichasocial);        

            if (count($arrayingfexiste) == 0)
            {
                $vercambiosgrupofamiliar = '';
            }
            // fin boton grupo familiar

            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`informacionevento`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>
            '.$botoncerrarficha.'
            '.$verpdf.'
            '.$verpdfft.'
            '.$veradjuntosficha.'
            '.$vercambiosgrupofamiliar.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->tipoevento . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->direccion . '</td>  
            <td>' . $arrayg->profesional . '</td>          
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
		}

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    // Home busqueda Ficha Tecnica o social
    public function homebusquedatecnicasocial($page = 'homebusquedatecnicasocial')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $datos['varbusqueda'] = '';
        if(empty($this->input->get('busqueda')))
        {   //para que no traiga nada
            $arrayintegrantes = $this->m_herramientas->mostrarconid('t10_reporte', 'id_reporte = 0');
        }
        else
        {
            $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homebusquedatecnicasocial', 'num_soc_fall_comer like "%'.$this->input->get('busqueda').'%" or fichatecnia like "%'.$this->input->get('busqueda').'%"');
            $datos['varbusqueda'] = $this->input->get('busqueda');
        }        

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $botoncerrarficha = '';
        $verpdf = '';
        $verpdfft = '';
        $trazabilidad = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $verpdfft = '';
            $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="irbusqueda('.$arrayg->tipovisita.','.$arrayg->num_soc_fall_comer.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->num_soc_fall_comer.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            $trazabilidad = '';

            if($arrayg->tipovisita == '99')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="irbusqueda('.$arrayg->tipovisita.','.$arrayg->idseguimiento.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';

            }

            if($arrayg->ESTADO_FICHA == 'INCOMPLETA')
            {
                $verpdf = '';
            }

            if($arrayg->ESTADO_FICHA == 'NO APLICA')
            {
                $verpdf = '';
            }
            //para ver PDF
            if($arrayg->tipovisita == '99')
            {
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';

            }

            if($arrayg->tipovisita == '4')
            {
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdflocalcomercial(`'.$arrayg->num_soc_fall_comer.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';

            }

            if($arrayg->tipovisita == '2' || $arrayg->tipovisita == '3' || $arrayg->tipovisita == '5')
            {
                $verpdf = '<button type="button" class="btn btn-info btn-sm" title="Ver PDF1" onclick="irbusqueda('.$arrayg->tipovisita.','.$arrayg->num_soc_fall_comer.')"><i class="fa-sharp fa-solid fa-f"></i></i></button>';
            }

            //fin ver PDF
            if($arrayg->ESTADO_FICHA == 'CERRADA' || $arrayg->ESTADO_FICHA == 'APROBADA' || $arrayg->ESTADO_FICHA == 'REMITIDA' || $arrayg->ESTADO_FICHA == 'REMITIDA-PERIODO ANTERIOR' || $arrayg->ESTADO_FICHA == 'CERRADA - CASO ESPECIAL')
            {
                $botoncerrarficha = '';
            }

            // para mostrar trazabilidad
            if($arrayg->ESTADO_FICHA == 'DEVUELTA' || $arrayg->ESTADO_FICHA == 'CERRADA' || $arrayg->ESTADO_FICHA == 'APROBADA' || $arrayg->ESTADO_FICHA == 'REMITIDA' || $arrayg->ESTADO_FICHA == 'REMITIDA-PERIODO ANTERIOR' || $arrayg->ESTADO_FICHA == 'CERRADA - CASO ESPECIAL')
            {
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->num_soc_fall_comer.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';
            }

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            } 

            if($arrayg->tipovisita == '98')
            {
                $botoncerrarficha = '';

            }

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '. $botoncerrarficha.'
            '. $trazabilidad.'
            '. $verpdf.'
            '. $verpdfft.'
            </td>
            <td>' . $arrayg->num_soc_fall_comer . '</td>
            <td>' . $arrayg->ESTADO_FICHA . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->nomtipovisita . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td></td>
            </tr>';
		}

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/trazabilidad');
        $this->load->view('plantillas/footer');
    } 
    
    // home Fichas en verificar
    public function homefichasverificar($page = 'homefichasverificar')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefichasocial', 'tipovisita = 1 and estadoficha = "CERRADA"');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $aprobarficha = '';
        $devolverficha = '';
        $yaremitida = '';
        $cerrarespecial = '';
        $verpdf = '';
        $verpdfft = '';
        $veradjuntosficha = '';
        $vercambiosgrupofamiliar = '';
        $btncerrarnoisvimed = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefichaadjunto(`adjuntosfichasocial`,'.$arrayg->fichasocial.',`homefichasverificar`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';
            $btncerrarnoisvimed = '';
            $aprobarficha = '';
            $devolverficha = '';
            $yaremitida = '';
            $cerrarespecial = '';
            $trazabilidad = '';
            $verpdf = '';
            $verpdfft = '';
            $verificarfsft = '';
            $vercambiosgrupofamiliar = '';

            if($arrayg->estadoficha == 'CERRADA')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $aprobarficha = '<button type="button" class="btn btn-info btn-sm" title="Aprobar ficha" onclick="btnaprobarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-share"></i></button>';
                $devolverficha = '<button type="button" class="btn btn-info btn-sm" title="Devolver ficha" onclick="btndevolverficha('.$arrayg->fichasocial.',`'.$arrayg->fichatecnia.'`,`'.$arrayg->correo_profesional.'`,`Ficha Social`)" data-toggle="modal" data-target="#staticBackdrop2">
                                    <i class="fa-sharp fa-solid fa-trash-arrow-up"></i>
                                </button>';
                $yaremitida = '<button type="button" class="btn btn-info btn-sm" title="Ya remitida" onclick="btnfichayaremitidaanterior(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-download"></i></button>';
                $cerrarespecial = '<button type="button" class="btn btn-info btn-sm" title="Caso espcial" onclick="btncerrarcasoespecial('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-door-closed"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';
                $verificarfsft = '<button type="button" class="btn btn-info btn-sm" title="Informacion FS" onclick="btnmostrarvalidarconft('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop4">
                                    <i class="fa-sharp fa-solid fa-info"></i>
                                </button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';               
                $btncerrarnoisvimed = '<button type="button" class="btn btn-info btn-sm" title="No ISVIMED" onclick="btncerrarcsonoenvioisvimed('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-house-circle-xmark"></i></button>';
            }

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            } 

            // verificar si tiene cambios en el grupo familiar para mostrar el nboton
            $arrayingfexiste = $this->m_herramientas->mostrarconidlimituno('historico_131_integrante', 'fichasocial = '.$arrayg->fichasocial);        

            if (count($arrayingfexiste) == 0)
            {
                $vercambiosgrupofamiliar = '';
            }
            // fin boton grupo familiar       


            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`informacionevento`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>
            '.$aprobarficha.'
            '.$devolverficha.'
            '.$yaremitida.'
            '.$cerrarespecial.'
            '.$btncerrarnoisvimed.'
            '.$trazabilidad.'
            '.$verificarfsft.'
            '.$verpdf.'
            '.$verpdfft.'
            '.$veradjuntosficha.'
            '.$vercambiosgrupofamiliar.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->inquilinato . '</td>
            <td>' . $arrayg->valremision . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->tipoevento . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->direccion . '</td>            
            <td>' . $arrayg->profesional . '</td>
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
		}

        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/trazabilidad');
        $this->load->view('plantillas/devolverficha');
        $this->load->view('plantillas/infovalidarconft');
        $this->load->view('plantillas/footer');
    }    

    // home Fichas en remitir ISMIVED
    public function homefichasremitirisvimed($page = 'homefichasremitirisvimed')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homeremitirisvimed', 'REMITIDO_ISMIVED = "SI"');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdfft = '';
        $verpdf = '';
        $tieneadjunto = '';

        foreach($arrayintegrantes as $arrayg)
        {
            $verpdfft = '';
            $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            $tieneadjunto = 'NO';

            if($arrayg->ID_TIPO == 'SEGUIMIENTO')
            {   
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->ID_SEGUIMIENTO.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }
            elseif($arrayg->ID_TIPO == 'LOCAL COMERCIAL')
            {
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdflocalcomercial(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }


            if($arrayg->FICHA_TECNICA_ADJUNTO != 'NO')
            {   
                //$verpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF Ficha Tecnica" onclick="veradjuntohome(`'.$arrayg->FICHA_TECNICA_ADJUNTO.'`)"><i class="fa-sharp fa-solid fa-t"></i></button>';
                $verpdfft = $arrayg->FICHA_TECNICA_ADJUNTO;
                $tieneadjunto = 'SI';
            }

            //QUIETE ESTA LINEA POR NIDIA NO PUEDE MODIFICAR UNA FICHA  <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`informacionevento`,'.$arrayg->FICHA_SOCIAL.')"><i class="fa-sharp fa-solid fa-pen"></i></button>

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$verpdf.'
            '.$verpdfft.'
            </td>
            <td>' . $arrayg->ESTADO_FICHA . '</td>
            <td>' . $arrayg->TIPO . '</td>
            <td>' . $arrayg->REMITIDO_ARRENDAMIENTO . '</td>
            <td>' . $arrayg->REMITIDO_MEJORAMIENTO . '</td>
            <td>' . $arrayg->FICHA_TECNICA_RECIBIDA . '</td>
            <td>' . $tieneadjunto . '</td>
            <td>' . $arrayg->FICHA_TECNICA . ' </td>
            <td>' . $arrayg->FICHA_SOCIAL . '</td>
            <td>' . $arrayg->NOMBRE_TITULAR . '</td>
            <td>' . $arrayg->NUMERO_DOCUMENTO_TITULAR . '</td>
            <td>' . $arrayg->No_PERSONAS . '</td>
            <td>' . $arrayg->TELEFONO . '</td>
            <td>' . $arrayg->BARRIO . '</td>            
            <td>' . $arrayg->TIPO_EVENTO . '</td>
            <td>' . $arrayg->MOTIVO_VISITA . '</td>
            <td>' . $arrayg->TIPO_EVACUACION . '</td>
            <td>' . $arrayg->FECHA_VISITA . '</td>
            <td>' . $arrayg->PROFESIONAL . '</td>
            <td>' . $arrayg->DIGITADOR . '</td>
            <td></td>
            </tr>';
        }

        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }  

    // home Fichas remitidas ISMIVED
    public function homeremisionesisvimed($page = 'homeremisionesisvimed')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrar('vw_homeremitidasisvimed');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdf = '';

        foreach($arrayintegrantes as $arrayg)
        {
            $verpdf = '';

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arrayg->archivo_adjunto.'`)"><i class="fa-sharp fa-solid fa-file"></i></button>';
            }       

            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguienteremisiones(`remfichasremitidasismived`,'.$arrayg->idremisiones.')"><i class="fa-sharp fa-solid fa-pen"></i></button>
            '.$verpdf.'
            </td>
            <td>' . $arrayg->idremisiones . '</td>
            <td>' . $arrayg->fecharemision . '</td>
            <td>' . $arrayg->cantidadfichas . '</td>
            <td>' . $arrayg->tiporemision . '</td>
            <td>' . $arrayg->radicadomercurio . ' </td>
            <td>' . $arrayg->redicadoisvimed . '</td>
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
        }

        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    } 

    public function remfichasremitidasismived($page = 'remfichasremitidasismived')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'remisionesisvimed';

        $id = $this->input->get('idremisiones');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idremisiones ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  '';

		$datos['idremisiones'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['tiporemision'] = '';
        $datos['fecharemision'] = '';
        $datos['radicadomercurio'] = '';
        $datos['radicadoisvimed'] = '';
        $datos['nameFile'] = '';

		foreach($arraygeneral as $arrayg)
		{

            $datos['idremisiones'] = $arrayg->idremisiones;
            $datos['tiporemision'] = $arrayg->tiporemision;
            $datos['fecharemision'] = $arrayg->fecharemision;
            $datos['radicadomercurio'] = $arrayg->radicadomercurio;
            $datos['radicadoisvimed'] = $arrayg->radicadoisvimed;
            $datos['nameFile'] = $arrayg->nameFile;

            $datos['siguiente'] =  '';
		}

        $datos['remt1_tiporemision'] = $this->m_herramientas->mostrarselect('remt1_tiporemision');

        //segunda tabla

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_remitadas_isvimed', 'idremisiones ='.$id);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdfft = '';
        $verpdf = '';


        foreach($arrayintegrantes as $arrayg)
        {

            $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';  
            $verpdfft = $arrayg->FICHA_TECNICA_ADJUNTO;

            if($arrayg->ID_TIPO == 'SEGUIMIENTO')
            {   
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->ID_SEGUIMIENTO.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }
            elseif($arrayg->ID_TIPO == 'LOCAL COMERCIAL')
            {
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdflocalcomercial(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }


            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$verpdf.'
            '.$verpdfft.'
            </td>
            <td>' . $arrayg->TIPO . '</td>
            <td>' . $arrayg->FICHA_TECNICA . ' </td>
            <td>' . $arrayg->FICHA_SOCIAL . '</td>
            <td>' . $arrayg->RADICADO_MERCURIO . '</td>
            <td>' . $arrayg->FECHA_REMISION . '</td>
            <td>' . $arrayg->NOMBRE_TITULAR . '</td>
            <td>' . $arrayg->NUMERO_DOCUMENTO_TITULAR . '</td>
            <td>' . $arrayg->No_PERSONAS . '</td>
            <td>' . $arrayg->TELEFONO . '</td>
            <td>' . $arrayg->BARRIO . '</td>            
            <td>' . $arrayg->TIPO_EVENTO . '</td>
            <td>' . $arrayg->MOTIVO_VISITA . '</td>
            <td>' . $arrayg->TIPO_EVACUACION . '</td>
            <td>' . $arrayg->TIPO_REMISION . '</td>
            <td>' . $arrayg->FECHA_VISITA . '</td>
            <td>' . $arrayg->PROFESIONAL . '</td>
            <td>' . $arrayg->DIGITADOR . '</td>
            <td></td>
            </tr>';
        }

        $datosadjuntar['soloimagen'] = '';

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }


    //fichas tecnias recibidas
    public function remfichastecnicasrecibidas($page = 'remfichastecnicasrecibidas')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'remfichastecnicasrecibidas';

        $id = $this->input->get('idtecnica');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idtecnica ='.$id);

        $datos['idtecnica'] = $this->input->get('idtecnica');
        
        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  '';

        $datos['fichatecnica'] = '';
        $datos['tiporecepcion'] = '';
        $datos['fichatecnica'] = '';
        $datos['tiporecepcion'] = '';
        $datos['visitasociales'] = '';
        $datos['comuna'] = '';
        $datos['motivovisita'] = '';
        $datos['fecharecibidocs'] = '';
        $datos['hora'] = '';
        $datos['redicadodagrd'] = '';
        $datos['fecharedicadodagrd'] = '1900-01-01';
        $datos['fechatencion'] = '1900-01-01';
        $datos['profesional'] = '';
        $datos['nameFile'] = '';
        $datos['reactivacionruta'] = '';
        $datos['tipoficha'] = '';
        $datos['fechareactivacion'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichatecnica'] = $arrayg->fichatecnica;
            $datos['tiporecepcion'] = $arrayg->tiporecepcion;
            $datos['fichatecnica'] = $arrayg->fichatecnica;
            $datos['tiporecepcion'] = $arrayg->tiporecepcion;
            $datos['visitasociales'] = $arrayg->visitasociales;
            $datos['comuna'] = $arrayg->comuna;
            $datos['motivovisita'] = $arrayg->motivovisita;
            $datos['fecharecibidocs'] = $arrayg->fecharecibidocs;
            $datos['hora'] = $arrayg->hora;
            $datos['redicadodagrd'] = $arrayg->redicadodagrd;
            $datos['fecharedicadodagrd'] = $arrayg->fecharedicadodagrd;
            $datos['fechatencion'] = $arrayg->fechatencion;
            $datos['profesional'] = $arrayg->profesional;
            $datos['nameFile'] = $arrayg->nameFile;
            $datos['reactivacionruta'] = $arrayg->reactivacionruta;
            $datos['tipoficha'] = $arrayg->tipoficha;
            $datos['fechareactivacion'] =  $arrayg->fechareactivacion;
            
            $datos['siguiente'] =  '';
		}

        //segunda tabla

        $arrayintegrantes = $this->m_herramientas->mostrarconid('remhistoricofichastecnicasrecibidas', 'idtecnica ='.$id);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdfft = '';

        foreach($arrayintegrantes as $arrayg)
        {

            $verpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF Ficha Tecnica" onclick="veradjuntohome(`'.$arrayg->nameFile.'`)"><i class="fa-sharp fa-solid fa-t"></i></button>';

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$verpdfft.'
            </td>
            <td>' . $arrayg->id . '</td>
            <td>' . $arrayg->nameFile . ' </td>
            <td>' . $arrayg->fecharegistro . '</td>
            <td></td>
            </tr>';
        }

        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');
        $datos['t1_motivovisita'] = $this->m_herramientas->mostrarselectconid('t1_motivovisita', 'id in (1,2,3)');
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_validadores');
        $datos['t1_remtiporecepcion'] = $this->m_herramientas->mostrarselect('t1_remtiporecepcion');
        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_remtipoficha'] = $this->m_herramientas->mostrarselect('t1_remtipoficha');


        $datosadjuntar['soloimagen'] = '';

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    public function homefichatecnicasrecibidas($page = 'homefichatecnicasrecibidas')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrar('inf_fichastecnicasrecibidas');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdf = '';
        $enviarcorreo = '';
        $tieneadjunto = '';

        foreach($arrayintegrantes as $arrayg) //enviogmial_nuevaft
        {
            $tieneadjunto = 'SI';
            $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver TECNICA" onclick="veradjuntohome(`'.$arrayg->ARCHIVO_ADJUNTO.'`)"><i class="fa-sharp fa-solid fa-t"></i></button>';
            $enviarcorreo = '<button type="button" class="btn btn-info btn-sm" title="Enviar correo" onclick="enviogmial_nuevaft(`'.$arrayg->FICHA_TECNICA.'`,`'.$arrayg->MOTIVO_VISITA.'`,`'.$arrayg->ARCHIVO_ADJUNTO.'`,`'.$arrayg->CORREO.'`,`'.$arrayg->REACTIVACION_DE_RUTA.'`)"><i class="fa-sharp fa-solid fa-envelope"></i></button>';
            
            if($arrayg->TIPO_FICHA == 'ICAD-BOMBEROS' || $arrayg->TIPO_FICHA == 'INCIDENTE DE BOMBEROS')
            {
                $verpdf = '<button type="button" class="btn btn-success btn-sm" title="Ver BOMBEROS" onclick="veradjuntohome(`'.$arrayg->ARCHIVO_ADJUNTO.'`)"><i class="fa-sharp fa-solid fa-b"></i></button>';
            }
            
            if($arrayg->TIPO_FICHA == 'ICAD-DAGRD')
            {
                $verpdf = '<button type="button" class="btn btn-warning btn-sm" title="Ver ICAD-DAGRED" onclick="veradjuntohome(`'.$arrayg->ARCHIVO_ADJUNTO.'`)"><i class="fa-sharp fa-solid fa-d"></i></button>';
            } 
            
            if($arrayg->ARCHIVO_ADJUNTO == 'NO')
            {
                $tieneadjunto = 'NO';
                $verpdf = '';
                $enviarcorreo = '';
            }
            

            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguienteftrecibidas(`remfichastecnicasrecibidas`,'.$arrayg->ID_RECIBIDA.')"><i class="fa-sharp fa-solid fa-pen"></i></button>
            '.$verpdf.'
            '.$enviarcorreo.'
            </td>
            <td>' . $tieneadjunto . '</td>
            <td>' . $arrayg->FICHA_TECNICA . '</td>
            <td>' . $arrayg->TIPO_DE_RECEPCION . '</td>
            <td>' . $arrayg->TIPO_FICHA . '</td>
            <td>' . $arrayg->REACTIVACION_DE_RUTA . '</td>
            <td>' . $arrayg->VISITA_SOCIALES_POR_TECNICA . '</td>
            <td>' . $arrayg->COMUNA . ' </td>
            <td>' . $arrayg->MOTIVO_VISITA . '</td>
            <td>' . $arrayg->FECHA_RECIBIDO_COMISION_SOCIAL . '</td>
            <td>' . $arrayg->HORA . '</td>
            <td>' . $arrayg->RADICADO_DAGRD . '</td>
            <td>' . $arrayg->FECHA_RADICADO_DAGRED . '</td>
            <td>' . $arrayg->FECHA_DE_ATENCION . '</td>            
            <td>' . $arrayg->PROFESIONAL_QUE_ATENDIE_EL_CASO . '</td>
            <td>' . $arrayg->CORREO . '</td>
            <td></td>
            </tr>';
        }

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    } 


    public function buscarfichatecnicarecibidas()
    {
        $fichatecnica = $this->input->post('fichatecnica');

        $arraygeneral = $this->m_herramientas->mostrarconid('remfichastecnicasrecibidas', 'fichatecnica ="'.$fichatecnica.'"');
        $chintegrantes = '0';

        foreach($arraygeneral as $arrayg)
		{
            $chintegrantes = $arrayg->fichatecnia;
		}

        echo  $chintegrantes;
    }

    // abrir modal trazabilidad
    public function modaltrazabilidad()
    {
        $fichasocial = $this->input->post('fichasocial');

        $arrayintegrantes = $this->m_herramientas->mostrarconidyorder('vw_trazabilidad_estado_ficha', 'fichasocial ='.$fichasocial.' order by id');
        $chintegrantes = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $chintegrantes .= '<p>'.$arrayg->evento.' '.$arrayg->digitador.'</p>';
		}

        echo  $chintegrantes;
    }

        // abrir modal trazabilidad para seguimiento de fallidas y NAFS
        public function modaltrazabilidadfallidanafs()
        {
            $fichasocial = $this->input->post('fichasocial');
            $id_fallia_nafs = $this->input->post('id_fallia_nafs');
    
            $arrayintegrantes = $this->m_herramientas->mostrarconidyorder('vw_trazabilidad_estado_ficha', 'fichasocial ='.$fichasocial.' and id_fallia_nafs = '.$id_fallia_nafs.'  order by id');
            $chintegrantes = '';
    
            foreach($arrayintegrantes as $arrayg)
            {
                $chintegrantes .= '<p>'.$arrayg->evento.' '.$arrayg->digitador.'</p>';
            }
    
            echo  $chintegrantes;
        }

    // abrir modal para verificar info de la FS y la TC
        // abrir modal trazabilidad
    public function modalvalidarconft()
    {
        $fichasocial = $this->input->post('fichasocial');

        $arrayintegrantes = $this->m_herramientas->mostrarconid('inf_visitas_con_estado', 'FICHA_SOCIAL ='.$fichasocial);
        $chintegrantes = '';

        foreach($arrayintegrantes as $arrayg)
        {
            $chintegrantes .= ' <p><h5>FICHA SOCIAL: <small class="text-muted">'.$arrayg->FICHA_SOCIAL.'</small></h5></p>
                                <p><h5>FICHA TECNICA: <small class="text-muted">'.$arrayg->FICHA_TECNICA.'</small></h5></p>
                                <p><h5>MOTIVO VISITA: <small class="text-muted">'.$arrayg->MOTIVO_VISITA.'</small></h5></p>
                                <p><h5>TIPO EVENTO: <small class="text-muted">'.$arrayg->TIPO_EVENTO.'</small></h5></p>
                                <p><h5>CUAL OTRO EVENTO: <small class="text-muted">'.$arrayg->OTRO.'</small></h5></p>
                                <p><h5>FECHA VISTA DAGRD: <small class="text-muted">'.$arrayg->FECHA_VISTA_DAGRD.'</small></h5></p>
                                <p><h5>TIPO EVACUACION: <small class="text-muted">'.$arrayg->TIPO_EVACUACION.'</small></h5></p>
                                <p><h5>DIRECCION: <small class="text-muted">'.$arrayg->DIRECCION.'</small></h5></p>
                                <p><h5>BARRIO: <small class="text-muted">'.$arrayg->BARRIO.'</small></h5></p>';
        }

        $arrayremisiones = $this->m_herramientas->mostrarconid('vw_tabla_programa_integrante', 'fichasocial = '.$fichasocial);

        $chintegrantes .= '<hr>
                            <h4>REMISIONES</h4>
                            <table class="table">
                            <thead>
                            <tr>
                                <th scope="col">NOMBRE INTEGRANTE</th>
                                <th scope="col">PROGRAMA REMITIDO</th>
                            </tr>
                            </thead>
                            <tbody>';

       if( count($arrayremisiones) == 0)
       {
            $chintegrantes .= ' <tr>
                                    <td colspan="2">SIN REGISTRO</td>
                                 </tr>';
       }
       else
       {
        foreach($arrayremisiones as $arrayr)
        {
            $chintegrantes .= ' <tr>
                                    <td>'.$arrayr->nombreintegrante.'</td>
                                    <td>'.$arrayr->nombreprograma.'</td>
                                </tr>';
        }

       }

       $chintegrantes .= ' </tbody>
                          </table>';

        echo  $chintegrantes;
    }

    public function autorizaciongestiondocumental($page = '17_autorizaciongestiondocumental')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '17_autorizacion';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);

        $datos['idintegrante'] = '';
		$datos['entidad'] = '';
        $datos['requerieseguimiento'] = '';
        $datos['fechaprobable'] = date('Y-m-d');
        $datos['diligenciadopor'] = '';
        $datos['acepto'] = '';
        $datos['nameFile'] = '';
        $datos['apoyosocial'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['idintegrante'] = $arrayg->idintegrante;
            $datos['entidad'] = $arrayg->entidad;
            $datos['requerieseguimiento'] = $arrayg->requerieseguimiento;
            $datos['fechaprobable'] = $arrayg->fechaprobable;
            $datos['diligenciadopor'] = $arrayg->diligenciadopor;
            $datos['acepto'] = $arrayg->acepto;
            $datos['nameFile'] = $arrayg->nameFile;
            $datos['apoyosocial'] = $arrayg->apoyosocial;
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales');
        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes', 'fichasocial ='.$datos['fichasocial']);

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);
        $datosadjuntar['soloimagen'] = 'accept="image/*"';

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    //bitacora
    public function bitacora($page = 'bitacora')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        if($this->session->userdata('rol') == 1)
        {
            $page = 'bitacorasocial';
        }

        $tabla = 'bitacora';

        $id = $this->input->get('idbitacora');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idbitacora ='.$id);

        $datos['idbitacora'] = $this->input->get('idbitacora');
        
        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  '';

        $datos['fechaactivacion'] = '';
        $datos['horaactivacion'] = '';
        $datos['profesionalrecibe'] = '';
        $datos['fichatecnica'] = '';
        $datos['comuna'] = '';
        $datos['barrio'] = '';
        $datos['direccionreferencia'] = '';
        $datos['sector'] = '';
        $datos['personacontacto'] = '';
        $datos['telefono1contacto'] = '';
        $datos['telefono2contacto'] = '';
        $datos['tipoevento'] = '';
        $datos['profesional'] = '';
        $datos['ingeniero'] = '';
        $datos['telefono1ingeniero'] = '';
        $datos['telefono2ingeniero'] = '';
        $datos['observacion'] = '';

        $datos['horallegadaalevento'] = '';
        $datos['horafinalizaelevento'] = '';
        $datos['observacionsocial'] = '';
        $datos['bombero'] = '';

        $datos['tiempoatencion'] = '';
        $datos['tiempollegar'] = '';

        $datos['kitbebidacaliente'] = '';
        $datos['cantidadbebidacaliente'] = '';
        $datos['observacionbebidacaliente'] = '';
        $datos['alimentosatencion'] = '';
        $datos['cantidadalimentosatencion'] = '';
        $datos['observacionalimentosatencion'] = '';
       
        foreach($arraygeneral as $arrayg)
        {
            $datos['fechaactivacion'] = $arrayg->fechaactivacion;
            $datos['horaactivacion'] = $arrayg->horaactivacion;
            $datos['profesionalrecibe'] = $arrayg->profesionalrecibe;
            $datos['fichatecnica'] = $arrayg->fichatecnica;
            $datos['comuna'] = $arrayg->comuna;
            $datos['barrio'] = $arrayg->barrio;
            $datos['direccionreferencia'] = $arrayg->direccionreferencia;
            $datos['sector'] = $arrayg->sector;
            $datos['personacontacto'] = $arrayg->personacontacto;
            $datos['telefono1contacto'] = $arrayg->telefono1contacto;
            $datos['telefono2contacto'] = $arrayg->telefono2contacto;
            $datos['tipoevento'] = $arrayg->tipoevento;
            $datos['profesional'] = $arrayg->profesional;
            $datos['ingeniero'] = $arrayg->ingeniero;
            $datos['telefono1ingeniero'] = $arrayg->telefono1ingeniero;
            $datos['telefono2ingeniero'] = $arrayg->telefono2ingeniero;
            $datos['observacion'] = $arrayg->observacion;  
            
            $datos['horallegadaalevento'] = $arrayg->horallegadaalevento;
            $datos['horafinalizaelevento'] = $arrayg->horafinalizaelevento;
            $datos['observacionsocial'] = $arrayg->observacionsocial; 
            $datos['bombero'] = $arrayg->bombero; 

            $datos['tiempoatencion'] = $arrayg->tiempoatencion;
            $datos['tiempollegar'] = $arrayg->tiempollegar;

            $datos['kitbebidacaliente'] =  $arrayg->kitbebidacaliente;
            $datos['cantidadbebidacaliente'] =  $arrayg->cantidadbebidacaliente;
            $datos['observacionbebidacaliente'] =  $arrayg->observacionbebidacaliente;
            $datos['alimentosatencion'] =  $arrayg->alimentosatencion;
            $datos['cantidadalimentosatencion'] =  $arrayg->cantidadalimentosatencion;
            $datos['observacionalimentosatencion'] =  $arrayg->observacionalimentosatencion;
            
            $datos['siguiente'] =  '';
        }

       // $datos['t1_motivovisita'] = $this->m_herramientas->mostrarselectconid('t1_motivovisita', 'id in (1,2,3)');
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_validadores');
        $datos['t1_select_sociales_recibe'] = $this->m_herramientas->mostrarselect('t1_select_sociales_bitacora');
        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_barrios'] = $this->m_herramientas->mostrarselect('t1_barrios');
        $datos['t1_tipodeevento'] = $this->m_herramientas->mostrarselect('t1_tipodeevento');
        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');

        $datosadjuntar['soloimagen'] = '';

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    public function homebitacora($page = 'homebitacora')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $datos['deshabilitarsocial'] = '';

        if($this->session->userdata('rol') == 1)
        {
          //  $datos['deshabilitarsocial']= 'disabled';
        }

        $arrayintegrantes = $this->m_herramientas->mostrar('inf_bitacora');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdfft = '';
        $enviarcorreo = '';
        $tieneadjunto = '';
        $verpdf = '';
        $verinfemergencia = '';
        $vereditar = '';
        $vereditarsoporte = '';

        foreach($arrayintegrantes as $arrayg) //enviogmial_nuevaft
        {
            $vereditarsoporte = '';
            $tieneadjunto = 'SI';
            $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfbitacora(`'.$arrayg->IDBITACORA.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            $verpdfft = $arrayg->ARCHIVO_ADJUNTO;
            $enviarcorreo = '<button type="button" class="btn btn-info btn-sm" title="Ver PDF" onclick="enviogmial_bitacora(`'.$arrayg->FICHA_TECNICA.'`,`'.$arrayg->TIPO_DE_EVENTO.'`,`'.$arrayg->IDBITACORA.'`,`'.$arrayg->CORREO.'`)"><i class="fa-sharp fa-solid fa-envelope"></i></button>';
            $verinfemergencia = '<button type="button" class="btn btn-danger btn-sm" title="Ver inf emergencia" onclick="verinfemergencia(`'.$arrayg->FICHA_TECNICA.'`)"><i class="fa-sharp fa-solid fa-e"></i></button>';

            $vereditar = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguientebitacora(`bitacora`,'.$arrayg->IDBITACORA.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';

            if($arrayg->ARCHIVO_ADJUNTO == 'NO')
            {
                $tieneadjunto = 'NO';
                $verpdfft = '';
                //$enviarcorreo = '';
            }

            if($arrayg->HORA_LLEGADA == '' || $arrayg->No_VISITAS == 0)
            {
                $verinfemergencia = '';
            }
            else
            {
                $vereditar = '';
                if($this->session->userdata('rol') == 6)
                {
                    $vereditarsoporte = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar soporte" onclick="btnsiguientebitacora(`bitacora`,'.$arrayg->IDBITACORA.')"><i class="fa-sharp fa-solid fa-hammer"></i></button>';
                }                
            }
            

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$vereditarsoporte.'
            '.$vereditar.'
            '.$verpdf.'
            '.$verpdfft.'
            '.$verinfemergencia.'
            '.$enviarcorreo.'
            </td>
            <td>' . $arrayg->IDBITACORA . '</td>
            <td>' . $tieneadjunto . '</td>
            <td>' . $arrayg->FICHA_TECNICA . '</td>
            <td>' . $arrayg->FICHA_TECNICA_VISITADA . '</td>
            <td>' . $arrayg->No_VISITAS . '</td>
            <td>' . $arrayg->No_INTEGRANTES . '</td>
            <td>' . $arrayg->TIPO_DE_EVENTO . '</td>
            <td>' . $arrayg->COMUNA . '</td>
            <td>' . $arrayg->BARRIO . ' </td>
            <td>' . $arrayg->FECHA_ACTIVACION . '</td>
            <td>' . $arrayg->HORA_ACTIVACION . '</td>
            <td>' . $arrayg->PROFESIONAL_ATIENDE . '</td>
            <td>' . $arrayg->PERSONA_DE_CONTACTO . '</td>
            <td>' . $arrayg->TELEFONO_DE_CONTACTO . '</td>
            <td>' . $arrayg->INGENIERO . '</td>            
            <td>' . $arrayg->TELEFONO_INGENIERO . '</td>
            <td>' . $arrayg->DIGITADOR . '</td>
            <td></td>
            </tr>';
        }

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    } 

    public function buscarfichatecnicabitacora()
    {
        $fichatecnica = $this->input->post('fichatecnica');

        $arraygeneral = $this->m_herramientas->mostrarconid('bitacora', 'fichatecnica ="'.$fichatecnica.'"');
        $chintegrantes = '0';

        foreach($arraygeneral as $arrayg)
		{
            $chintegrantes = $arrayg->fichatecnia;
		}

        echo  $chintegrantes;
    }

    //inspeccpiones otros programas
    public function reminspeccionotrosprogramas($page = 'reminspeccionotrosprogramas')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'reminspeccionotrosprogramas';

        $id = $this->input->get('idremisiones');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idremisiones ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';
        $datos['siguiente2'] =  'disabled';

		$datos['idremisiones'] = $id;
        $datos['remisiones'] = '';
        $datos['programa'] = '';
        $datos['fecharemision'] = '';
        $datos['radicado'] = '';
        $datos['observacion'] = '';
        $datos['nameFile'] = '';
        $datos['nameFile99'] = '';

		foreach($arraygeneral as $arrayg)
		{

            $datos['idremisiones'] = $arrayg->idremisiones;
            $datos['remisiones'] = $arrayg->remisiones;
            $datos['programa'] = $arrayg->programa;
            $datos['fecharemision'] = $arrayg->fecharemision;
            $datos['radicado'] = $arrayg->radicado;
            $datos['observacion'] = $arrayg->observacion;
            $datos['nameFile'] = $arrayg->nameFile;
            $datos['nameFile99'] = $arrayg->nameFile99;

            $datos['siguiente'] =  '';
		}

        $datos['t1_sinoremisiones'] = $this->m_herramientas->mostrarselect('t1_sinoremisiones_rem');
        //$datos['t1_sinoremisiones'] = $this->m_herramientas->mostrarselectconid('t1_sinoremisiones', 'id <> 3');
        $datos['t1_programas'] = $this->m_herramientas->mostrarselect('t1_programas');

        if($datos['remisiones'] == 3)
        {
            $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_fallideclaradas_rem', 'REM_idremisiones ='.$id);

            $datos['Integranteshogar'] = '';
            $datos['numerointegfamilia'] = count($arrayintegrantes);
    
            $verpdfft = ''; 
            $veradjuntosficha = '';
    
            foreach($arrayintegrantes as $arrayg)
            {
                $datos['siguiente2'] =  '';
                $verpdfft = '';
                $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefichaadjunto(`adjuntosfichasocial`,'.$arrayg->idvisitafallidanafs.',`homefallidasnafs`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';
    
                if($arrayg->archivo_adjunto != 'NO')
                {
                    //$verpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arrayg->archivo_adjunto.'`)"><i class="fa-sharp fa-solid fa-t"></i></button>';
                    $verpdfft = $arrayg->archivo_adjunto;
                } 
    
                $datos['Integranteshogar'] .= '<tr>
                <td>
                <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`vfnafsinformacionevento`,'.$arrayg->idvisitafallidanafs.')"><i class="fa-sharp fa-solid fa-pen"></i></button>
                '. $verpdfft.'
                '.$veradjuntosficha.'
                </td>
                <td>' . $arrayg->estadoficha . '</td>
                <td>' . $arrayg->idvisitafallidanafs . '</td>
                <td>' . $arrayg->fichatecnia . '</td>
                <td>' . $arrayg->tiposeguimiento . '</td>
                <td>' . $arrayg->nomtipovisita . '</td>
                <td>' . $arrayg->motivovisita . ' </td>
                <td>' . $arrayg->fechavisita . '</td>
                <td>' . $arrayg->direccion . '</td>
                <td>' . $arrayg->comuna . '</td>
                <td>' . $arrayg->barrio . '</td>
                <td>' . $arrayg->sector . '</td>
                <td>' . $arrayg->digitador . '</td>
                <td></td>
                </tr>';
            }

        }
        else
        {
            //segunda tabla programas     
            $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_remitadas_otrosinspeccion', 'IDREMISION ='.$id);

            $datos['Integranteshogar'] = '';
            $datos['numerointegfamilia'] = count($arrayintegrantes);

            $verpdfft = '';
            $verpdf = '';


            foreach($arrayintegrantes as $arrayg)
            {
                $datos['siguiente2'] =  '';
                $tieneadjunto = 'SI';
                //$verpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="veradjuntohome(`'.$arrayg->ARCHIVO_ADJUNTO.'`)"><i class="fa-sharp fa-solid fa-t"></i></button>';
                $verpdfft = $arrayg->ARCHIVO_ADJUNTO;

                if($arrayg->ARCHIVO_ADJUNTO == 'NO')
                {
                    $tieneadjunto = 'NO';
                    $verpdfft = '';
                }

                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';  


                $datos['Integranteshogar'] .= '<tr>
                <td>
                '.$verpdf.'
                '.$verpdfft.'
                </td>
                <td>' . $arrayg->FICHA_TECNICA . ' </td>
                <td>' . $arrayg->FICHA_SOCIAL . '</td>
                <td>' . $arrayg->NOMBRE . '</td>
                <td>' . $arrayg->NUMERO_DOCUMENTO . '</td>
                <td>' . $arrayg->TELEFONO . '</td>
                <td>' . $arrayg->COMUNA . '</td>
                <td>' . $arrayg->BARRIO . '</td>            
                <td>' . $arrayg->MOTIVO_VISITA . '</td>
                <td>' . $arrayg->TIPO_VISITA . '</td>
                <td>' . $arrayg->TIPO_EVACUACION . '</td>
                <td>' . $arrayg->FECHA_VISITA . '</td>
                <td>' . $arrayg->PROFESIONAL . '</td>
                <td>' . $arrayg->DIGITADOR . '</td>
                <td></td>
                </tr>';
            }

        }

        $datosadjuntar['soloimagen'] = '';

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/adjuntar2');
        $this->load->view('plantillas/footer');
    }

    public function cargarprogramasinsepecionrem()
    {
        $id = $this->input->post('remisiones');

        if($id == 3)
        {
            $id = 2;
        }


        $datos['t1_programas'] = $this->m_herramientas->mostrarselectconid('t1_programas', 'tipo =' . $id . ' and id not in (1,2)');

        echo json_encode($datos);
    }

    public function homeremisionesotrosprogramas($page = 'homeremisionesotrosprogramas')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrar('vw_homeinspeccionotrosprogramas');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdf = '';
        $verpdf99 = '';

        foreach($arrayintegrantes as $arrayg)
        {
            $verpdf = '';
            $verpdf99 = '';

            if($arrayg->ARCHIVO_ADJUNTO_REM != 'NO')
            {
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arrayg->ARCHIVO_ADJUNTO_REM.'`)"><i class="fa-sharp fa-solid fa-file"></i></button>';
            }  
            
            if($arrayg->ARCHIVO_ADJUNTO_RES != 'NO')
            {
                $verpdf99 = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arrayg->ARCHIVO_ADJUNTO_RES.'`)"><i class="fa-sharp fa-solid fa-r"></i></button>';
            }

            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguienteremisiones(`reminspeccionotrosprogramas`,'.$arrayg->ID_REMISION.')"><i class="fa-sharp fa-solid fa-pen"></i></button>
            '.$verpdf.'
            '.$verpdf99.'
            </td>
            <td>' . $arrayg->ID_REMISION . '</td>
            <td>' . $arrayg->FECHA_REMISION . '</td>
            <td>' . $arrayg->NUMERO_INTEGRANTES_REMITIDOS . '</td>
            <td>' . $arrayg->TIPO_REMISION . '</td>
            <td>' . $arrayg->PROGRAMA_INSEPECCION . ' </td>
            <td>' . $arrayg->NUMERO_RADICADO . '</td>
            <td>' . $arrayg->DIGITADOR . '</td>
            <td></td>
            </tr>';
        }

        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    } 

    public function reminspeccionotrosprogramassubirarchivos($page = 'reminspeccionotrosprogramassubirarchivos')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'reminspeccionotrosprogramas_fichas';

        $id = $this->input->get('idremisiones');


        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  '';

		$datos['idremisiones'] = $id;

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntarexcel');
        $this->load->view('plantillas/footer');
    }

    // seguimiento remisiones
    public function seguimientodatosgeneralesremisiones($page = 'seguimientodatosgeneralesremisiones')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'seguimiento_remisiones';

        $id = $this->input->get('idseguimiento');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idseguimiento ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['idseguimiento'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['remisiones'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['idseguimiento'] = $arrayg->idseguimiento;
            $datos['remisiones'] = $arrayg->remisiones;

            $datos['siguiente'] =  '';
		}

        $buscarfichasocial = $this->m_herramientas->mostrarconid('seguimientodatosgenerales', 'idseguimiento ='.$datos['idseguimiento']);

        foreach($buscarfichasocial as $arrayfs)
		{
            $datos['fichasocial'] = $arrayfs->fichasocial;
		}

        $datos['t1_sinoremisiones'] = $this->m_herramientas->mostrarselect('t1_sinoremisiones');
        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes_seguimiento', 'fichasocial ="'.$datos['fichasocial'].'"');
        $datos['t1_programas'] = $this->m_herramientas->mostrarselect('t1_programas');
       
        //vista dos

        $datos['tabla2'] = 'seguimiento_datosgeneralesremisiones';
        $datos['vista'] = 'vw_tabla_programa_integrante_seguimiento';

        $arrayintegrantes = $this->m_herramientas->mostrarconid($datos['vista'], 'fichasocial ="'.$datos['fichasocial'].'" and idseguimiento = '.$id);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        foreach($arrayintegrantes as $arrayg)
		{
            $datos['Integranteshogar'] .= '<tr>
            <td>
                <button type="button" class="btn btn-info btn-sm" onclick="btneliminar(`'.$datos['tabla2'] .'`,'.$arrayg->idintegrante.','.$arrayg->idseguimiento.','.$arrayg->programa.')">Eliminar</button>
                <button type="button" class="btn btn-info btn-sm" onclick="btnmostrarmodal('.$arrayg->idintegrante.','.$arrayg->idseguimiento.','.$arrayg->programa.')" data-toggle="modal" data-target="#staticBackdrop">
                Ver Observacion
                </button>
            </td>
            <td>' . $arrayg->nombreprograma . '</td>
            <td>' . $arrayg->nombreintegrante . '</td>
            <td></td>
            </tr>';
		}

        $datosb['botones'] = $this->botoneraseg($id);

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    // MOSTAR MODAL REMISIONES SEGUIMIENTO
    public function abrirmodalremisinseguimiento()
    {
        $idseguimiento = $this->input->post('idseguimiento');
        $programa = $this->input->post('programa');
        $idintegrante = $this->input->post('idintegrante');

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_tabla_programa_integrante_seguimiento', 'idseguimiento ='.$idseguimiento.' and programa = '.$programa.' and idintegrante = '.$idintegrante);
        $chintegrantes = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $chintegrantes = $arrayg->observacion;
		}

        echo  $chintegrantes;
    }

    // integrantes para ser remitidos seguimiento
    public function cargarfamiliasotitularesseguimiento()
    {
        $id = $this->input->post('programa');
        $fichasocial = $this->input->post('fichasocial');

        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes_seguimiento', 'fichasocial ="'.$fichasocial.'"');

        if ($id == 2 ||  $id == 1 || $id > 27)
        {
            $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconidsinblanco('t1_select_integrantes_seguimiento', 'fichasocial ="'.$fichasocial.'" and descripcion like "%JEFE%"');            
        }

        echo json_encode($datos);
    }

    public function cargarprogramasinsepecionseguimiento()
    {
        $id = $this->input->post('remisiones');
        $fichasocial = $this->input->post('fichasocial');

        $datos['t1_programas'] = $this->m_herramientas->mostrarselectconid('t1_programas', 'tipo =' . $id . ' or tipo = 3');

        $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconid('t1_select_integrantes_seguimiento', 'fichasocial ="'.$fichasocial.'"');

        if($id == 2 )
        {
            $datos['t1_select_integrantes'] = $this->m_herramientas->mostrarselectconidsinblanco('t1_select_integrantes_seguimiento', 'fichasocial ="'.$fichasocial.'" and descripcion like "%JEFE%"');            
        }

        echo json_encode($datos);
    }

    // modulo de gestion documental
    public function homefichagestiondocumental($page = 'homefichagestiondocumental') // temporal para Juan Arteaga
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homegestiondocumental', 'tipovisita = 1 and estadoficha <> "INCOMPLETA"');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $botoncerrarficha = '';
        $verpdf = '';
        $editarficha = '';
        $correccionficha = '';
        $verpdfft = '';
        $trazabilidad = '';

        foreach($arrayintegrantes as $arrayg)
        {
            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`autorizaciongestiondocumental`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $botoncerrarficha = '';
            $verpdf = '';
            $correccionficha = '';
            $verpdfft = '';
            $trazabilidad = '';

            if($arrayg->estadoficha == 'COMPLETA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`);btnguardardescargaficha(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $correccionficha = '<button type="button" class="btn btn-info btn-sm" title="Enviar a correccion" onclick="btnenviaracorregirficha(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-gear"></i></button>';
            }

            if($arrayg->estadoficha == 'CERRADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`);btnguardardescargaficha(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';
            }

            if($arrayg->estadoficha == 'EN CORRECCION')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`);btnguardardescargaficha(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'DEVUELTA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`);btnguardardescargaficha(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $correccionficha = '';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';                
            }

            if($arrayg->estadoficha == 'APROBADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'REMITIDA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'REMITIDA-PERIODO ANTERIOR')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'CERRADA - CASO ESPECIAL')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
                //$verpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arrayg->archivo_adjunto.'`)"><i class="fa-sharp fa-solid fa-t"></i></button>';
            } 

            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`autorizaciongestiondocumental`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`);btnguardardescargaficha(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$editarficha.'
            '.$trazabilidad.' 
            '.$verpdfft.'
            '.$verpdf.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->descargaarchivo . '</td>
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->tipoevento . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->direccion . '</td>  
            <td>' . $arrayg->profesional . '</td>          
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
        }

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/trazabilidad');
        $this->load->view('plantillas/footer');
    }

    public function homeseguimientogestiondocumental($page = 'homeseguimientogestiondocumental')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrarconid('inf_seguimiento', 'estadoseguimiento = "CERRADA"');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $editarficha = '';
        $botoncerrarficha = '';
        $verpdf = '';
        $verpdfft = '';
        $devolverficha = '';
        $datos['devolver'] = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguienteseguimiento(`seguimientodatosgenerales`,'.$arrayg->idseguimiento.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $botoncerrarficha = '';
            $verpdf = '';
            $verpdfft = '';
            $devolverficha = '';
            $datos['devolver'] = '';

            if($this->session->userdata('rol') == 4)
            {
                $datos['devolver'] = '<h6><i class="fa-sharp fa-solid fa-trash-arrow-up"></i> - Devolver ficha por inconsistencias. (SOLO SI SE TIENE EL PROFESIONAL ASIGNADO)</h6>';
             
                if($arrayg->profesional != 'PENDIENTE')
                {
                    $devolverficha = '  <button type="button" class="btn btn-info btn-sm" title="Devolver Registro" onclick="btndevolverficha('.$arrayg->idseguimiento.',`'.$arrayg->fichatecnia.'`,`'.$arrayg->correo_profesional.'`,`SERGUIMIENTO ESPECIAL`)" data-toggle="modal" data-target="#staticBackdrop2">
                                        <i class="fa-sharp fa-solid fa-trash-arrow-up"></i>
                                        </button>';
                }
                

            }

            if($arrayg->estadoseguimiento == 'COMPLETA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->idseguimiento.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->estadoseguimiento == 'DEVUELTA')
            {
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->idseguimiento.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->estadoseguimiento == 'CERRADA')
            {
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
            }

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            } 

            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguienteseguimiento(`seguimientomotivogestiondocumental`,'.$arrayg->idseguimiento.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfseguimiento(`'.$arrayg->idseguimiento.'`);btnguardardescargaficha(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '. $editarficha.'
            '. $botoncerrarficha.'
            '. $devolverficha.'
            '.$verpdf.'
            '. $verpdfft.'
            </td>           
            <td>' . $arrayg->estadoseguimiento . '</td>
            <td>' . $arrayg->descargaarchivo . '</td>
            <td>' . $arrayg->idseguimiento . '</td>
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->direccionafectada . ' </td>            
            <td>' . $arrayg->direccionvisita . '</td>
            <td>' . $arrayg->entregaayuda . '</td>
            <td>' . $arrayg->remisvimed . '</td>
            <td>' . $arrayg->otros_programas . '</td>
            <td>' . $arrayg->profesional . '</td>
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
		}

        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/devolverficha');
        $this->load->view('plantillas/footer');
    }

    public function seguimientomotivogestiondocumental($page = 'seguimientomotivogestiondocumental')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'seguimientomotivoyprofesional';

        $id = $this->input->get('idseguimiento');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idseguimiento ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['idseguimiento'] = ( $id == 0 ? 'Pendiente' : $id);

		$datos['entidad'] = '';
        $datos['diligenciadopor'] = '';
        $datos['nameFile'] = '';
        $datos['apoyosocial'] = '';

        $datos['nombrequienrecibelavisita'] = '';
        $datos['motivoseguimiento'] = '';
        $datos['observacion'] = '';
        $datos['cierrecasotelefonico'] = '';
        $datos['cierrecaso'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['entidad'] = $arrayg->entidad;
            $datos['diligenciadopor'] = $arrayg->diligenciadopor;
            $datos['nameFile'] = $arrayg->nameFile;
            $datos['apoyosocial'] = $arrayg->apoyosocial;

            $datos['nombrequienrecibelavisita'] = $arrayg->nombrequienrecibelavisita;
            $datos['motivoseguimiento'] = $arrayg->motivoseguimiento;
            $datos['observacion'] = $arrayg->observacion;
            $datos['cierrecasotelefonico'] = $arrayg->cierrecasotelefonico;
            $datos['cierrecaso'] = $arrayg->cierrecaso;
            
            $datos['siguiente'] =  '';
		}

        $datos['t1_sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales');

        
        if($datos['nombrequienrecibelavisita'] == '')
        {
            $arraygeneralnom = $this->m_herramientas->mostrarconid('seguimientodatosgenerales', 'idseguimiento ='.$datos['idseguimiento']);

            foreach($arraygeneralnom as $arraygnom)
            {    
                $datos['nombrequienrecibelavisita'] = $arraygnom->nombre1e.' '.$arraygnom->nombre2e.' '.$arraygnom->apellido1e.' '.$arraygnom->apellido2e.'-'.$arraygnom->numerodedocumentoe;
            }

        }

        $datosb['botones'] = $this->botoneraseg($datos['idseguimiento']);

        $datosadjuntar['soloimagen'] = 'accept="image/*"';

        $this->load->view('plantillas/header');
        $this->load->view('plantillas/botoneracap', $datosb);
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    public function vfnaffallidagestiondocumental($page = 'vfnaffallidagestiondocumental')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        // tabla
        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_seguimientofallidas', 'estadoficha <> "INCOMPLETA"'); 

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdfft = '';
        $verpdf = '';
        $devolverficha = '';
        $datos['devolver'] = '';
        $datos['estadoficha'] = '';

        foreach($arrayintegrantes as $arrayg)
		{
            $verpdf = '';
            $verpdfft = '';
            $devolverficha = '';
            $datos['devolver'] = '';

            if($this->session->userdata('rol') == 4)
            {
                $datos['devolver'] = '<h6><i class="fa-sharp fa-solid fa-trash-arrow-up"></i> - Devolver ficha por inconsistencias. (SOLO SI SE TIENE EL PROFESIONAL ASIGNADO)</h6>';
             
                if($arrayg->PROFESIONAL != 'PENDIENTE')
                {
                    $devolverficha = '  <button type="button" class="btn btn-info btn-sm" title="Devolver Registro" onclick="btndevolverficha('.$arrayg->idvisitafallidanafs.','.$arrayg->fichatecnia.',`'.$arrayg->correo_profesional.'`,`Fallida o NAFS`)" data-toggle="modal" data-target="#staticBackdrop2">
                                        <i class="fa-sharp fa-solid fa-trash-arrow-up"></i>
                                        </button>';
                }
                

            }

            $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdfnafsfallidas(`'.$arrayg->idseguimiento.'`);btnguardardescargaficha(`'.$arrayg->idseguimiento.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arrayg->archivo_adjunto.'`)"><i class="fa-sharp fa-solid fa-t"></i></button>';
            }

            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguientefallida('.$arrayg->idseguimiento.','.$arrayg->idvisitafallidanafs.',`'.$arrayg->tiposeguimiento.'`)"><i class="fa-sharp fa-solid fa-pen"></i></button>
            '. $devolverficha.'
             '.$verpdf.'
             '.$verpdfft.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->descargaarchivo . '</td>
            <td>' . $arrayg->idvisitafallidanafs . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->tiposeguimiento . '</td>
            <td>' . $arrayg->nomtipovisita . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->direccion . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->PROFESIONAL . '</td>
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';

            $datos['estadoficha'] = $arrayg->estadoficha;            
		}

        
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/devolverficha');
        $this->load->view('plantillas/footer');
    }

    public function visitafallidanafsgestiondocumental($page = 'visitafallidanafsgestiondocumental')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'visitafallidanafs';

        $id = $this->input->get('idvisitafallidanafs');
        $datos['tipovisita'] = $this->input->get('tipovisita');
        $datos['campoidseguimiento'] = '';

        if(empty($this->input->get('idseguimiento')))
        {
            $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idvisitafallidanafs ='.$id);
        }
        else
        {
            $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idvisitafallidanafs ='.$id.' and idseguimiento = '. $this->input->get('idseguimiento'));
            $datos['campoidseguimiento'] = '<input type="text" class="form-control form-control-sm" id="idseguimiento" style="display: none;" placeholder="" value="'.$this->input->get('idseguimiento').'">';
        }

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

        $datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['barrio'] = '';
        $datos['comuna'] = '';
        $datos['dirCampo1'] = '';
        $datos['dirCampo2'] = '';
        $datos['dirCampo3'] = '';
        $datos['dirCampo4'] = '';
        $datos['dirCampo5'] = '';
        $datos['dirCampo6'] = '';
        $datos['dirCampo7'] = '';
        $datos['dirCampo8'] = '';
        $datos['dirCampo9'] = '';
        $datos['direccion'] = '';
        $datos['estrato'] = '';
        $datos['ruralurbano'] = '';
        $datos['sector'] = '';
        $datos['telefono1t'] = '';
        $datos['telefono2t'] = '';

        $datos['observacion'] = '';
        $datos['tipodedocumentoe'] = '';
        $datos['nacionalidade'] = '';
        $datos['numerodedocumentoe'] = '';
        $datos['nombre1e'] = '';
        $datos['nombre2e'] = '';
        $datos['apellido1e'] = '';
        $datos['apellido2e'] = '';
        $datos['telefono1e'] = '';
        $datos['telefono2e'] = '';
        $datos['parentescoe'] = '';
        $datos['tipodedocumentot'] = '';
        $datos['nacionalidadt'] = '';
        $datos['numerodedocumentot'] = '';
        $datos['nombre1t'] = '';
        $datos['nombre2t'] = '';
        $datos['apellido1t'] = '';
        $datos['apellido2t'] = '';
        $datos['nameFile'] = '';
        $datos['tiposeguimiento'] = 'SEGUIMIENTO';
        $datos['fechaseguimiento'] = '';

        $datos['diligenciadopor'] = '';
        $datos['fichaaccess'] = '';

        //firmas
        $datos['draw_dataUrl'] = '';
        $datos['nameFirma'] = '';
        $datos['autorizofirma'] = '2';
        $datos['mostrarnameFirma'] = '';

        foreach($arraygeneral as $arrayg)
        {
            $datos['fichasocial'] = $arrayg->idvisitafallidanafs;
            $datos['barrio'] = $arrayg->barrio;
            $datos['comuna'] = $arrayg->comuna;
            $datos['dirCampo1'] = $arrayg->dirCampo1;
            $datos['dirCampo2'] = $arrayg->dirCampo2;
            $datos['dirCampo3'] = $arrayg->dirCampo3;
            $datos['dirCampo4'] = $arrayg->dirCampo4;
            $datos['dirCampo5'] = $arrayg->dirCampo5;
            $datos['dirCampo6'] = $arrayg->dirCampo6;
            $datos['dirCampo7'] = $arrayg->dirCampo7;
            $datos['dirCampo8'] = $arrayg->dirCampo8;
            $datos['dirCampo9'] = $arrayg->dirCampo9;
            $datos['direccion'] = $arrayg->direccion;
            $datos['ruralurbano'] = $arrayg->ruralurbano;
            $datos['sector'] = $arrayg->sector;
            $datos['telefono1t'] = $arrayg->telefono1t;
            $datos['telefono2t'] = $arrayg->telefono2t;

            $datos['observacion'] = $arrayg->observacion;
            $datos['tipodedocumentoe'] = $arrayg->tipodedocumentoe;
            $datos['nacionalidade'] = $arrayg->nacionalidade;
            $datos['numerodedocumentoe'] = $arrayg->numerodedocumentoe;
            $datos['nombre1e'] = $arrayg->nombre1e;
            $datos['nombre2e'] = $arrayg->nombre2e;
            $datos['apellido1e'] = $arrayg->apellido1e;
            $datos['apellido2e'] = $arrayg->apellido2e;
            $datos['telefono1e'] = $arrayg->telefono1e;
            $datos['telefono2e'] = $arrayg->telefono2e;
            $datos['parentescoe'] = $arrayg->parentescoe;
            $datos['tipodedocumentot'] = $arrayg->tipodedocumentot;
            $datos['nacionalidadt'] = $arrayg->nacionalidadt;
            $datos['numerodedocumentot'] = $arrayg->numerodedocumentot;
            $datos['nombre1t'] = $arrayg->nombre1t;
            $datos['nombre2t'] = $arrayg->nombre2t;
            $datos['apellido1t'] = $arrayg->apellido1t;
            $datos['apellido2t'] = $arrayg->apellido2t;
            $datos['nameFile'] = $arrayg->nameFile;
            if(!empty($this->input->get('idseguimiento')))
            {
                $datos['tiposeguimiento'] = $arrayg->tiposeguimiento;
            }
            
            $datos['fechaseguimiento'] = $arrayg->fechaseguimiento;
            $datos['diligenciadopor'] = $arrayg->diligenciadopor;
            $datos['fichaaccess'] = $arrayg->fichaaccess;

            //firmas
            $datos['draw_dataUrl'] = $arrayg->draw_dataUrl; 
            $datos['nameFirma'] = $arrayg->nameFirma;
            $datos['mostrarnameFirma'] = URL_LOCAL.'/cah/resources/filesUploaded/firmas/'.$arrayg->nameFirma;
            $datos['autorizofirma'] = $arrayg->autorizofirma;

            $datos['siguiente'] =  '';
            
        }

        //verificar cantidad de seguimientos
        $arrayintegrantes = $this->m_herramientas->mostrarconid('visitafallidanafs', 'idvisitafallidanafs ='.$id); 
        $datos['numerointegfamilia'] = count($arrayintegrantes);
        

        if($datos['numerointegfamilia'] == 0)
        {
            $datos['tiposeguimiento'] = 'INICIAL';
        }

        $datos['t1_dir_orientacion'] = $this->m_herramientas->mostrarselect('t1_dir_orientacion');
        $datos['t1_dir_tipo_via'] = $this->m_herramientas->mostrarselect('t1_dir_tipo_via');
        $datos['t1_comunas'] = $this->m_herramientas->mostrarselect('t1_comunas');
        $datos['t1_barrios'] = $this->m_herramientas->mostrarselect('t1_barrios');
        $datos['t1_ruralurbano'] = $this->m_herramientas->mostrarselect('t1_ruralurbano');
        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales');

        $datos['t1_tipodedocumento'] = $this->m_herramientas->mostrarselect('t1_tipodedocumento');
        //$datos['t1_parentesco'] = $this->m_herramientas->mostrarselect('t1_parentesco');
        $datos['t1_paises'] = $this->m_herramientas->mostrarselect('t1_paises');
        $datos['t1_sino'] = $this->m_herramientas->mostrarselect('t1_sino');

        $datosadjuntar['soloimagen'] = 'accept="image/*"';

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    //requermientos sociales
    public function requerimientossociales($page = 'requerimientossociales')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'requerimientossociales';

        $id = $this->input->get('idrequerimiento');

        $datos['estadorequerimiento'] = $this->estadorequerimiento($id);

        $datos['Integranteshogar'] = '';

        $datos['nivelreq'] = $this->nivelequerimiento($id);

        $datos['deshabilitar'] = 'disabled';

        if( $datos['nivelreq'] == 1)
        {
            $datos['deshabilitar'] = '';
        }

        $tabla1 = 'wv_requerimientossociales_select';

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla1, 'idrequerimiento ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['idrequerimiento'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['fichasocial'] = '';
        $datos['tipofichasocial'] = '';
        $datos['busqueda'] = '';
        $datos['tiporequerimiento'] = '';
		$datos['observacion'] = '';
        $datos['fecharegistro1'] = 'PENDIENTE';
        $datos['nameFile'] = '';
        $datos['USUARIO_RESPONDE1'] = 'PENDIENTE';

		foreach($arraygeneral as $arrayg)
		{
            $datos['idrequerimiento'] = $arrayg->idrequerimiento;
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['busqueda'] = $arrayg->busqueda;
            $datos['tipofichasocial'] = $arrayg->tipofichasocial;
            $datos['tiporequerimiento'] = $arrayg->tiporequerimiento;
            $datos['observacion'] = $arrayg->observacion;
            $datos['fecharegistro1'] = $arrayg->fecharegistro;
            $datos['nameFile'] = $arrayg->nameFile;
            $datos['USUARIO_RESPONDE1'] = $arrayg->USUARIO_RESPONDE;

            $datos['siguiente'] =  '';
		}

        //verificar que tipo de ficha es para abrir el PDF
        $datos['btveradjunto'] = 'btsinadjunto';
        if($datos['tipofichasocial'] == 'FALLIDA' || $datos['tipofichasocial'] == 'NO APLICA FICHA SOCIAL' || $datos['tipofichasocial'] == 'FALLIDA - INICIAL EN ACCESS (SOLO SI LA FALLIDA INICIAL ESTA EN ACCES)')
        {
            $datos['btveradjunto'] = 'btsinadjunto';
        }
        else if($datos['tipofichasocial'] == 'SEGUIMIENTO')
        {
            $datos['btveradjunto'] = 'btnabrirpdfseguimiento';
        }
        else if($datos['tipofichasocial'] == 'LOCAL COMERCIAL')
        {
            $datos['btveradjunto'] = 'btnabrirpdflocalcomercial';
        }
        else if($datos['tipofichasocial'] == 'FICHA SOCIAL')
        {
            $datos['btveradjunto'] = 'btnabrirpdf';
        }
        else
        {
            $datos['btveradjunto'] = 'btnabrirpdfold';
        }
        // fin

        $datos['adjuntotecnica'] = 'SIN ADJUNTO';
        if($id !== '0' && !empty($datos['busqueda']))
        {
            $arraygenera_tecnica = $this->m_herramientas->mostrarconid('remfichastecnicasrecibidas', 'fichatecnica ='.$datos['busqueda']);
                
            foreach($arraygenera_tecnica as $arraytec)
            {
                if($arraytec->nameFile !== '')
                {
                    $datos['adjuntotecnica'] = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arraytec->nameFile.'`)"><i class="fa-sharp fa-solid fa-t"></i></button>';
                    
                }
            }
        }

        // aprbacion
        $tabla2 = 'wv_requerimientossociales_aprobacion';

        $arraygeneral2 = $this->m_herramientas->mostrarconid($tabla2, 'idrequerimiento ='.$id);

        $datos['tiporequerimiento_aprobacion'] = 'PENDIENTE';
        $datos['profesiona_asignado'] = 'PENDIENTE';
        $datos['observacion_aprobacion'] = 'PENDIENTE';
        $datos['fecharegistro2'] = 'PENDIENTE';
        $datos['USUARIO_RESPONDE'] = 'PENDIENTE';

        foreach($arraygeneral2 as $arrayg)
        {

            $datos['tiporequerimiento_aprobacion'] = $arrayg->tiporequerimiento_aprobacion;
            $datos['profesiona_asignado'] = $arrayg->profesiona_asignado;
            $datos['observacion_aprobacion'] = $arrayg->observacion_aprobacion;
            $datos['fecharegistro2'] = $arrayg->fecharegistro;
            $datos['USUARIO_RESPONDE'] = $arrayg->USUARIO_RESPONDE;

        }
        // fin aprobacion
        // realizacion
        $tabla3 = 'wv_requerimientossociales_ejecucion';

        $arraygeneral3 = $this->m_herramientas->mostrarconid($tabla3, 'idrequerimiento ='.$id);

        $datos['tiporequerimiento_ejecucion'] = 'PENDIENTE';
        $datos['observacion_ejecucion'] = 'PENDIENTE';
        $datos['fecharegistro3'] = 'PENDIENTE';
        $datos['USUARIO_RESPONDE3'] = 'PENDIENTE';

        foreach($arraygeneral3 as $arrayg)
        {

            $datos['tiporequerimiento_ejecucion'] = $arrayg->tiporequerimiento_ejecucion;
            $datos['observacion_ejecucion'] = $arrayg->observacion_ejecucion;
            $datos['fecharegistro3'] = $arrayg->fecharegistro;
            $datos['USUARIO_RESPONDE3'] = $arrayg->USUARIO_RESPONDE;

        }
        // fin realizacion
        $datos['t1_tiporequerimiento'] = $this->m_herramientas->mostrarselect('t1_tiporequerimiento');

        $datosadjuntar['soloimagen'] = '';

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    public function requerimientosaprobacion($page = 'requerimientosaprobacion')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'requerimientossociales_aprobacion';

        $id = $this->input->get('idrequerimiento');

        $datos['estadorequerimiento'] = $this->estadorequerimiento($id);

        $datos['nivelreq'] = $this->nivelequerimiento($id);

        $datos['deshabilitar'] = 'disabled';

        if( $datos['nivelreq'] < 2)
        {
            $datos['deshabilitar'] = '';
        }
        

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';
		$datos['idrequerimiento'] = ( $id == 0 ? 'Pendiente' : $id);


        $datos['fichasocial'] = 'PENDIENTE';
        $datos['tiporequerimiento'] = 'PENDIENTE';
        $datos['tipofichasocial'] = 'PENDIENTE';
        $datos['busqueda'] = 'PENDIENTE';
		$datos['observacion'] = 'PENDIENTE';
        $datos['fecharegistro1'] = 'PENDIENTE';
        $datos['USUARIO_RESPONDE1'] = 'PENDIENTE';
        $datos['adjunto'] = 'SIN ADJUNTO';
        $datos['CEDULA_QUIEN_MONTO'] = 'PENDIENTE';

        $tabla1 = 'wv_requerimientossociales';

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla1, 'idrequerimiento ='.$id);

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['tiporequerimiento'] = $arrayg->tiporequerimiento;
            $datos['tipofichasocial'] = $arrayg->tipofichasocial;
            $datos['busqueda'] = $arrayg->busqueda;
            $datos['observacion'] = $arrayg->observacion;
            $datos['fecharegistro1'] = $arrayg->fecharegistro;
            $datos['USUARIO_RESPONDE1'] = $arrayg->USUARIO_RESPONDE;
            $datos['CEDULA_QUIEN_MONTO'] = $arrayg->CEDULA_QUIEN_MONTO;

            if('SIN ADJUNTO' != $arrayg->adjunto)
            {
                $datos['adjunto'] = '<button class="btn btn-info btn-sm" type="button" onclick="veradjuntorequerimiento(`'.$arrayg->adjunto.'`)">Ver</button>';
            }
            else
            {
                $datos['adjunto'] = 'SIN ADJUNTO';
            }
                

		}
        // aprbacion 
        
        //verificar que tipo de ficha es para abrir el PDF
        $datos['btveradjunto'] = 'btsinadjunto';
        if($datos['tipofichasocial'] == 'FALLIDA' || $datos['tipofichasocial'] == 'NO APLICA FICHA SOCIAL' || $datos['tipofichasocial'] == 'FALLIDA - INICIAL EN ACCESS (SOLO SI LA FALLIDA INICIAL ESTA EN ACCES)')
        {
            $datos['btveradjunto'] = 'btsinadjunto';
        }
        else if($datos['tipofichasocial'] == 'SEGUIMIENTO')
        {
            $datos['btveradjunto'] = 'btnabrirpdfseguimiento';
        }
        else if($datos['tipofichasocial'] == 'LOCAL COMERCIAL')
        {
            $datos['btveradjunto'] = 'btnabrirpdflocalcomercial';
        }
        else if($datos['tipofichasocial'] == 'FICHA SOCIAL')
        {
            $datos['btveradjunto'] = 'btnabrirpdf';
        }
        else
        {
            $datos['btveradjunto'] = 'btnabrirpdfold';
        }
        // fin
        $tabla2 = 'wv_requerimientossociales_aprobacion_select';
        $arraygeneral2 = $this->m_herramientas->mostrarconid($tabla2, 'idrequerimiento ='.$id);
        $datos['t1_sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');

        $datos['tiporequerimiento_aprobacion'] = '';
        $datos['profesiona_asignado'] = '';
        $datos['observacion_aprobacion'] = '';
        $datos['fecharegistro2'] = 'PENDIENTE';
        $datos['USUARIO_RESPONDE'] = 'PENDIENTE';

        $datos['repote_isvimed'] = '1';
        $datos['reporte_otrospro'] = '1';

        //validar si esta remitida al ISVIMED y a otros programas
        $datos['yaremitida_isvimed'] = 'NO';
        $datos['yaremitida_otrosp'] = 'NO';
        $datos['yaremitida_mostarmenaje'] = "style='display:none'";
        $datos['cambiogfamiliar_mostarmenaje'] = "";

        $arraygenera_isvimed = $this->m_herramientas->mostrarconid('remisionesisvimed_fichas', 'fichasocial ='.$datos['fichasocial']);

        if(count($arraygenera_isvimed) > 0)
        {
            $datos['yaremitida_isvimed'] = 'SI';
            $datos['yaremitida_mostarmenaje'] = '';
        }

        $arraygenera_otrosp = $this->m_herramientas->mostrarconid('reminspeccionotrosprogramas_fichas', 'fichasocial ='.$datos['fichasocial']);

        if(count($arraygenera_otrosp) > 0)
        {
            $datos['yaremitida_otrosp'] = 'SI';
            $datos['yaremitida_mostarmenaje'] = '';
        }

        $datos['adjuntotecnica'] = 'SIN ADJUNTO';
        if(!empty($datos['busqueda']))
        {
            $arraygenera_tecnica = $this->m_herramientas->mostrarconid('remfichastecnicasrecibidas', 'fichatecnica ='.$datos['busqueda']);
           
    
            foreach($arraygenera_tecnica as $arraytec)
            {
                if($arraytec->nameFile !== '')
                {
                    $datos['adjuntotecnica'] = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arraytec->nameFile.'`)"><i class="fa-sharp fa-solid fa-t"></i></button>';
                    
                }
            }
        }

        if( $datos['tiporequerimiento'] !== 'MODIFICACION GRUPO FAMILIAR (INGRESO O RETIRO DE INTEGRANTE)' 
        &&  $datos['tiporequerimiento'] !== 'ACTUALIZAR DATOS DEL GRUPO FAMILIAR (DOCUMENTO, NOMBRE, ETC)')
        {
            $datos['cambiogfamiliar_mostarmenaje'] = "style='display:none'";
        }
        //fin validacion

        foreach($arraygeneral2 as $arrayg)
        {

            $datos['tiporequerimiento_aprobacion'] = $arrayg->tiporequerimiento_aprobacion;
            $datos['profesiona_asignado'] = $arrayg->profesiona_asignado;
            $datos['observacion_aprobacion'] = $arrayg->observacion_aprobacion;
            $datos['fecharegistro2'] = $arrayg->fecharegistro;
            $datos['USUARIO_RESPONDE'] = $arrayg->USUARIO_RESPONDE;

            $datos['repote_isvimed'] = $arrayg->repote_isvimed;
            $datos['reporte_otrospro'] = $arrayg->reporte_otrospro;

            $datos['siguiente'] =  '';

        }
        // fin aprobacion
        // realizacion
        $tabla3 = 'wv_requerimientossociales_ejecucion';

        $arraygeneral3 = $this->m_herramientas->mostrarconid($tabla3, 'idrequerimiento ='.$id);

        $datos['tiporequerimiento_ejecucion'] = 'PENDIENTE';
        $datos['observacion_ejecucion'] = 'PENDIENTE';
        $datos['fecharegistro3'] = 'PENDIENTE';
        $datos['USUARIO_RESPONDE3'] = 'PENDIENTE';

        foreach($arraygeneral3 as $arrayg)
        {

            $datos['tiporequerimiento_ejecucion'] = $arrayg->tiporequerimiento_ejecucion;
            $datos['observacion_ejecucion'] = $arrayg->observacion_ejecucion;
            $datos['fecharegistro3'] = $arrayg->fecharegistro;
            $datos['USUARIO_RESPONDE3'] = $arrayg->USUARIO_RESPONDE;
            

        }
        // fin realizacion
        $datos['t1_tiporequerimiento_aprobacion'] = $this->m_herramientas->mostrarselect('t1_tiporequerimiento_aprobacion');
        $datos['t1_profesiona_asignado'] = $this->m_herramientas->mostrarselect('t1_profesiona_asignado');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function requerimientosejecucion($page = 'requerimientosejecucion')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'requerimientossociales_ejecucion';

        $id = $this->input->get('idrequerimiento');

        $datos['estadorequerimiento'] = $this->estadorequerimiento($id);

        $datos['nivelreq'] = $this->nivelequerimiento($id);

        $datos['deshabilitar'] = 'disabled';

        if( $datos['nivelreq'] == 2)
        {
            $datos['deshabilitar'] = '';
        }

        if( $datos['nivelreq'] < 3 &&  $datos['estadorequerimiento'] == 'ESTADO REQUERIMIENTO: RECHAZADO.')
        {
            $datos['deshabilitar'] = 'disabled';
        }

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';
		$datos['idrequerimiento'] = ( $id == 0 ? 'Pendiente' : $id);


        $datos['fichasocial'] = 'PENDIENTE';
        $datos['tiporequerimiento'] = 'PENDIENTE';
        $datos['tipofichasocial'] = 'PENDIENTE';
		$datos['observacion'] = 'PENDIENTE';
        $datos['fecharegistro1'] = 'PENDIENTE';
        $datos['USUARIO_RESPONDE1'] = 'PENDIENTE';

        $tabla1 = 'wv_requerimientossociales';

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla1, 'idrequerimiento ='.$id);

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['tiporequerimiento'] = $arrayg->tiporequerimiento;
            $datos['tipofichasocial'] = $arrayg->tipofichasocial;
            $datos['observacion'] = $arrayg->observacion;
            $datos['fecharegistro1'] = $arrayg->fecharegistro;
            $datos['USUARIO_RESPONDE1'] = $arrayg->USUARIO_RESPONDE;
            $datos['adjunto'] = 'SIN ADJUNTO';

            if('SIN ADJUNTO' != $arrayg->adjunto)
            {
                $datos['adjunto'] = '<button class="btn btn-info btn-sm" type="button" onclick="veradjuntorequerimiento(`'.$arrayg->adjunto.'`)">Ver</button>';
            }
            else
            {
                $datos['adjunto'] = 'SIN ADJUNTO';
            }

		}
// aprbacion
            $tabla2 = 'wv_requerimientossociales_aprobacion';

            $arraygeneral2 = $this->m_herramientas->mostrarconid($tabla2, 'idrequerimiento ='.$id);

            $datos['tiporequerimiento_aprobacion'] = 'PENDIENTE';
            $datos['profesiona_asignado'] = 'PENDIENTE';
            $datos['observacion_aprobacion'] = 'PENDIENTE';
            $datos['fecharegistro2'] = 'PENDIENTE';
            $datos['USUARIO_RESPONDE'] = 'PENDIENTE';

            foreach($arraygeneral2 as $arrayg)
            {

                $datos['tiporequerimiento_aprobacion'] = $arrayg->tiporequerimiento_aprobacion;
                $datos['profesiona_asignado'] = $arrayg->profesiona_asignado;
                $datos['observacion_aprobacion'] = $arrayg->observacion_aprobacion;
                $datos['fecharegistro2'] = $arrayg->fecharegistro;
                $datos['USUARIO_RESPONDE'] = $arrayg->USUARIO_RESPONDE;

            }
// fin aprobacion
// realizacion
        $tabla3 = 'wv_requerimientossociales_ejecucion_select';

        $arraygeneral3 = $this->m_herramientas->mostrarconid($tabla3, 'idrequerimiento ='.$id);

        $datos['tiporequerimiento_ejecucion'] = '';
        $datos['observacion_ejecucion'] = '';
        $datos['fecharegistro3'] = 'PENDIENTE';
        $datos['USUARIO_RESPONDE3'] = 'PENDIENTE';

        foreach($arraygeneral3 as $arrayg)
        {

            $datos['tiporequerimiento_ejecucion'] = $arrayg->tiporequerimiento_ejecucion;
            $datos['observacion_ejecucion'] = $arrayg->observacion_ejecucion;
            $datos['fecharegistro3'] = $arrayg->fecharegistro;
            $datos['USUARIO_RESPONDE3'] = $arrayg->USUARIO_RESPONDE;

        }
// fin realizacion
        $datos['t1_tiporequerimiento_ejecucion'] = $this->m_herramientas->mostrarselect('t1_tiporequerimiento_ejecucion');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function buscarfichasocialrequerimientos()
    {
        $fichasocial = $this->input->post('fichasocial');
        $mensajesalida = '<div class="alert alert-info" role="alert">';

        $arraygeneral = $this->m_herramientas->mostrarconid('vw_fichasocialyaccess', 'fichasocial ="'.$fichasocial.'"');
        
        if (count($arraygeneral) == 0)
        {
            $mensajesalida .= '
            <strong>ATENCION:</strong> La Ficha Social <strong>' .  $fichasocial . '</strong> No existe en el nuevo sistema ni en el aplicativo ACCESS, por este motivo no podras realizar procesos como realizar remisiones, entre otros. <strong>POR FAVOR Verifica la informacion antes de continuar</strong>.
            ';
        }
        else
        {
            foreach($arraygeneral as $arrayg)
            {
                $mensajesalida .= '
                <strong>ORIGEN:</strong> ' .  $arrayg->tipo . ' -
                ';
            }
    
            $arraygeneralhistorico = $this->m_herramientas->mostrarconid('vw_estados_fichasocial_fallida', 'num_soc_fall_comer ="'.$fichasocial.'"');
            foreach($arraygeneralhistorico as $arrayg)
            {
                $mensajesalida .= '
                <strong>FICHA TECNICA:</strong> ' .  $arrayg->fichatecnica . ' - <strong>ESTADO:</strong> ' .  $arrayg->ESTADO_FICHA . ' - <strong>TIPO VISITA:</strong> ' .  $arrayg->nomtipovisita . ' - 
                <strong>MOTIVO VISITA:</strong> ' .  $arrayg->motivovisita . ' -
                ';
            }

            $arraygeneralisvimed = $this->m_herramientas->mostrarconid('vw_remitadas_isvimed', 'FICHA_SOCIAL ="'.$fichasocial.'"');
            foreach($arraygeneralisvimed as $arrayg)
            {
                $mensajesalida .= '
                <strong>REMITIDA ISVIMED:</strong> ' .  $arrayg->TIPO_REMISION . ' -
                ';
            }

            $arraygeneralotrosprogr = $this->m_herramientas->mostrarconid('inf_integrantes_rem_otropro', 'FICHA_SOCIAL ="'.$fichasocial.'"');

            foreach($arraygeneralotrosprogr as $arrayg)
            {
                $mensajesalida .= '
                <strong>OTROS PROGRAMAS E INSPECCIONES:</strong> ' .  count($arraygeneralotrosprogr) . '.
                ';
            }

        }



        $mensajesalida .= '</div>';

        echo  $mensajesalida;
    }

    public function estadorequerimiento($id)
    {
        $arrayintegrantes = $this->m_herramientas->mostrarconid('inf_requerimientossociales', 'ID_REQUIERIMIENTO ='.$id);

        $botonera = 'ESTADO REQUERIMIENTO: NUEVO';

            foreach($arrayintegrantes as $arrayg)
            {
                if($arrayg->ESTADO_REQUERIMIENTO == 'APROBADO')
                {
                    $botonera = 'ESTADO REQUERIMIENTO: '.$arrayg->ESTADO_REQUERIMIENTO.' - EN PROCESO DE REALIZACION.';
                }
                else
                {
                    $botonera = 'ESTADO REQUERIMIENTO: '.$arrayg->ESTADO_REQUERIMIENTO.'.';
                }
                    
            }

        return $botonera;
    }

    public function nivelequerimiento($id)
    {
        $arrayintegrantes = $this->m_herramientas->mostrarconid('inf_requerimientossociales', 'ID_REQUIERIMIENTO ='.$id);

        $botonera = 1;

            foreach($arrayintegrantes as $arrayg)
            {

                    $botonera = $arrayg->NIVEL_REQUERIMIENTO;
                 
            }

        return $botonera;
    }

    public function homerequerimientos($page = 'homerequerimientos')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrar('inf_requerimientossociales');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);
        $datos['deshabiliarboton'] = '';

        $datos['quecontrolador'] = '';        
        if($this->session->userdata('rol') == 1 || $this->session->userdata('rol') == 32)
        {
            $datos['quecontrolador'] = 'requerimientossociales';  
        }

        if($this->session->userdata('id_usuario') == 15)
        {
            $datos['quecontrolador'] = 'requerimientosaprobacion';  
            $datos['deshabiliarboton'] = 'disabled';
        }

        if($this->session->userdata('id_usuario') == 1 || $this->session->userdata('id_usuario') == 31)
        {
            $datos['quecontrolador'] = 'requerimientosejecucion';  
            $datos['deshabiliarboton'] = 'disabled';
        }


        foreach($arrayintegrantes as $arrayg) 
        {           

            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguienterequerimientos(`'.$datos['quecontrolador'].'`,'.$arrayg->ID_REQUIERIMIENTO.')"><i class="fa-sharp fa-solid fa-pen"></i></button>
            </td>
            <td>' . $arrayg->ID_REQUIERIMIENTO . '</td>
            <td>' . $arrayg->ESTADO_REQUERIMIENTO . '</td>
            <td>' . $arrayg->FICHA_SOCIAL . '</td>
            <td>' . $arrayg->TIPO_REQUERIMIENTO . '</td>
            <td>' . $arrayg->USUARIO_REQUIERIMIENTO . '</td>
            <td></td>
            </tr>';
        }

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    } 

    //transporte
    public function transporte($page = 'transporte')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'transporte';

        $id = $this->input->get('idtransporte');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idtransporte ='.$id);

        $datos['idtransporte'] = $this->input->get('idtransporte');
        
        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  '';

        $datos['fechatransporte'] = '';
        $datos['horainicio'] = '';
        $datos['fechatransportefin'] = '';
        $datos['horafin'] = '';
        $datos['observacion'] = '';
        
        foreach($arraygeneral as $arrayg)
        {
            $datos['fechatransporte'] = $arrayg->fechatransporte;
            $datos['horainicio'] = $arrayg->horainicio;
            $datos['fechatransportefin'] = $arrayg->fechatransportefin;
            $datos['horafin'] = $arrayg->horafin;
            $datos['observacion'] = $arrayg->observacion;            
            
            $datos['siguiente'] =  '';
        }


        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    public function hometransporte($page = 'hometransporte')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrarconid('inf_transporte','ID_USUARIO = '.$this->session->userdata('id_usuario'));

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        foreach($arrayintegrantes as $arrayg) //enviogmial_nuevaft
        {
 
            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguientetransporte(`transporte`,'.$arrayg->ID_TRANSPORTE.')"><i class="fa-sharp fa-solid fa-pen"></i></button>
            </td>
            <td>' . $arrayg->ID_TRANSPORTE . '</td>
            <td>' . $arrayg->FECHA_INICIO_SERVICIO . '</td>
            <td>' . $arrayg->HORA_INICIO . '</td>
            <td>' . $arrayg->FECHA_FIN_SERVICIO . '</td>
            <td>' . $arrayg->HORA_FIN . '</td>
            <td>' . $arrayg->HORAS_TOTALES . '</td>
            <td>' . $arrayg->PROFESIONAL_TRANSPORTE . '</td>
            <td>' . $arrayg->PLACA . '</td>
            <td>' . $arrayg->MOVIL . '</td>
            <td>' . $arrayg->COMPONENTE . '</td>
            <td></td>
            </tr>';
        }

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    } 

    //fichas adjuntas ficha social
    public function adjuntosfichasocial($page = 'adjuntosfichasocial')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'adjuntosfichasocial';

        $datos['fichasocial'] = $this->input->get('fichasocial');
        $datos['atras'] = "btnsiguienteftrecibidashome(`".$this->input->get('atras')."`)";

        if($this->input->get('atras') == 'homefichas_auxilio_inicial' || $this->input->get('atras') == 'homefichas_auxilio' || $this->input->get('atras') == 'homefichas_postulaciones')
        {
            $datos['atras'] = "btnhomeauxilio(`".$this->input->get('atras')."`)";
        }
        
        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  '';

        $datos['descripcion'] = '';
        $datos['nameFile'] = '';   

        $arrayintegrantes = $this->m_herramientas->mostrarconid( 'vw_adjuntosfichasocial', 'fichasocial ='.$datos['fichasocial']);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdfft = '';
        $eliminarpdfft = '';

        foreach($arrayintegrantes as $arrayg)
        {

            $verpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arrayg->nameFile.'`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';
            $eliminarpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Eliminar Adjunto" onclick="btneliminar('.$arrayg->id.')"><i class="fa-sharp fa-solid fa-trash"></i></button>';

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$verpdfft.'
            </td>
            <td>' . $arrayg->id . '</td>
            <td>' . $arrayg->nameFile . ' </td>
            <td>' . $arrayg->descripcion . ' </td>
            <td>' . $arrayg->fecharegistro . '</td>
            <td>' . $arrayg->DIGITADOR . '</td>
            <td></td>
            </tr>';
        }

        $datosadjuntar['soloimagen'] = '';
        $datos['t1_documentos_adjuntar'] = $this->m_herramientas->mostrarselect('t1_documentos_adjuntar');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    //fichas adjuntas fallida
    public function adjuntosfallida($page = 'adjuntosfallida')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = 'adjuntosfallida';

        $datos['fichasocial'] = $this->input->get('fichasocial');        
        $datos['atras'] = "btnsiguiente(`".$this->input->get('atras')."`,`".$datos['fichasocial']."`)";
     
        $datos['fichasocial'] = $this->input->get('idseguimiento'); // colo el seguimiento en ficha social para que tenga la misma logica

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  '';

        $datos['descripcion'] = '';
        $datos['nameFile'] = '';   

        $arrayintegrantes = $this->m_herramientas->mostrarconid( 'vw_adjuntosfallida', 'fichasocial ='.$datos['fichasocial']);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdfft = '';
        $eliminarpdfft = '';

        foreach($arrayintegrantes as $arrayg)
        {

            $verpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arrayg->nameFile.'`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';
            $eliminarpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Eliminar Adjunto" onclick="btneliminar('.$arrayg->id.')"><i class="fa-sharp fa-solid fa-trash"></i></button>';

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$verpdfft.'            
            </td>
            <td>' . $arrayg->id . '</td>
            <td>' . $arrayg->nameFile . ' </td>
            <td>' . $arrayg->descripcion . ' </td>
            <td>' . $arrayg->fecharegistro . '</td>
            <td>' . $arrayg->DIGITADOR . '</td>
            <td></td>
            </tr>';
        }

        $datosadjuntar['soloimagen'] = '';
        $datos['t1_documentos_adjuntar'] = $this->m_herramientas->mostrarselect('t1_documentos_adjuntar');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    // CONSULTA JURIDICA
    public function homejuridica($page = 'homejuridica')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $datos['tipobusqueda'] = '';
        $datos['busqueda'] = '';
        $datos['siguiente'] = 'disabled';

        if(empty($this->input->get('tipobusqueda')))
        {
            $arrayintegrantes = $this->m_herramientas->mostrarconidsinestado('vw_z10_integrantes_acces_newapp', 'IDREG = 0');
        }
        else
        {
            $datos['tipobusqueda'] = $this->input->get('tipobusqueda');
            $datos['busqueda'] = $this->input->get('busqueda');
            $datos['siguiente'] = '';

            if($this->input->get('tipobusqueda') == 1)
            {
                $arrayintegrantes = $this->m_herramientas->mostrarconidsinestado('vw_z10_integrantes_acces_newapp', 'NUMERO_DOCUMENTO like "%'.$this->input->get('busqueda').'%"');
            }

            if($this->input->get('tipobusqueda') == 2)
            {
                $arrayintegrantes = $this->m_herramientas->mostrarconidsinestado('vw_z10_integrantes_acces_newapp', 'NOMBRE like "%'.$this->input->get('busqueda').'%"');
            }
        }

        

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $verpdf = '';

        foreach($arrayintegrantes as $arrayg)
		{

            $verpdf = '';

            if($arrayg->FUENTE == 'NUEVA HERRAMIENTA')
            {

                if($arrayg->ESTADO_FICHA == 'COMPLETA')
                {
                    $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }

                if($arrayg->ESTADO_FICHA == 'CERRADA')
                {
                    $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }

                if($arrayg->ESTADO_FICHA == 'EN CORRECCION')
                {
                    $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }

                if($arrayg->ESTADO_FICHA == 'DEVUELTA')
                {
                    $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }

                if($arrayg->ESTADO_FICHA == 'APROBADA')
                {
                    $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }

                if($arrayg->ESTADO_FICHA == 'REMITIDA')
                {
                    $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }

                if($arrayg->ESTADO_FICHA == 'REMITIDA-PERIODO ANTERIOR')
                {
                    $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }

                if($arrayg->ESTADO_FICHA == 'CERRADA - CASO ESPECIAL')
                {
                    $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }
            }

            if($arrayg->FUENTE == 'LOCAL COMERCIAL')
            {

                if($arrayg->ESTADO_FICHA == 'CERRADA')
                {
                    $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdflocalcomercial(`'.$arrayg->FICHA_SOCIAL.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                }
            }

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$verpdf.'
            </td>
            <td>' . $arrayg->FICHA_SOCIAL . '</td>
            <td>' . $arrayg->FICHA_TECNICA . '</td>
            <td>' . $arrayg->FUENTE . '</td>
            <td>' . $arrayg->NUMERO_DOCUMENTO . '</td>
            <td>' . $arrayg->NOMBRE . '</td>
            <td>' . $arrayg->MOTIVO_VISITA . '</td>
            <td>' . $arrayg->TIPO_VISITA . ' </td>
            <td>' . $arrayg->FECHA_VISITA . '</td>            
            <td>' . $arrayg->COMUNA . '</td>
            <td>' . $arrayg->BARRIO . '</td>            
            <td>' . $arrayg->DIRECCION . '</td>
            <td></td>
            </tr>';
		}

        $datos['t1_busquedajuridico'] = $this->m_herramientas->mostrarselect('t1_busquedajuridico');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    // FIN JURIDICA
    // modificacion grupo familiar
    public function homeedicionfamiliar($page = 'homeedicionfamiliar')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        if($this->session->userdata('rol') == 1)
        {
            $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homeediciongrupofamiliar', ' CEDULA_QUIEN_MONTO = "'.$this->session->userdata('usuario').'"');
        }
        else
        {
            $arrayintegrantes = $this->m_herramientas->mostrar('vw_homeediciongrupofamiliar');
        }

        

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $botoncerrarficha = '';
        $verpdf = '';
        $editarficha = '';
        $verpdfft = '';
        $trazabilidad = '';
        $veradjuntosficha = '';
        $vercambiosgrupofamiliar = '';

        foreach($arrayintegrantes as $arrayg)
		{

            $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefichaadjunto(`adjuntosfichasocial`,'.$arrayg->fichasocial.',`homeedicionfamiliar`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';

            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`edicionfamiliar_conformacionfamiliar`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $botoncerrarficha = '';
            $verpdf = '';
            $verpdfft = '';
            $trazabilidad = '';
            $vercambiosgrupofamiliar = '';


            if($arrayg->estadoficha == 'COMPLETA')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
               
            }

            if($arrayg->estadoficha == 'CERRADA')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';
            }

            if($arrayg->estadoficha == 'EN CORRECCION')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'DEVUELTA')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';                
            }

            if($arrayg->estadoficha == 'APROBADA')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'REMITIDA')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'REMITIDA-PERIODO ANTERIOR')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->estadoficha == 'CERRADA - CASO ESPECIAL')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $editarficha = '';
                $botoncerrarficha = '';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';            
            }

            if($arrayg->archivo_adjunto != 'NO')
            {
                // $verpdfft = '<button type="button" class="btn btn-danger btn-sm" title="Ver Adjunto" onclick="veradjuntohome(`'.$arrayg->archivo_adjunto.'`)"><i class="fa-sharp fa-solid fa-t"></i></button>';
                $verpdfft = $arrayg->archivo_adjunto;
            } 

            $editarficha = '<button type="button" class="btn btn-info btn-sm" title="Ver/Editar" onclick="btnsiguiente(`edicionfamiliar_conformacionfamiliar`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>';
            $botoncerrarficha = '<button type="button" class="btn btn-info btn-sm" title="Cerrar Ficha" onclick="btncerrargrupofamiliar('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-paper-plane"></i></button>';

            // verificar si tiene cambios en el grupo familiar para mostrar el nboton
            $arrayingfexiste = $this->m_herramientas->mostrarconidlimituno('historico_131_integrante', 'fichasocial = '.$arrayg->fichasocial);        

            if (count($arrayingfexiste) == 0)
            {
                $vercambiosgrupofamiliar = '';
            }
            // fin boton grupo familiar

            $datos['Integranteshogar'] .= '<tr>
            <td>
            '.$editarficha.'            
            '.$trazabilidad.'
            '.$verpdfft.'
            '.$verpdf.'
            '.$veradjuntosficha.'
            '.$botoncerrarficha.'
            '.$vercambiosgrupofamiliar.'
            </td>
            <td>' . $arrayg->tipoficha . '</td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->tipoevento . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->direccion . '</td>  
            <td>' . $arrayg->profesional . '</td>          
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
		}

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/trazabilidad');
        $this->load->view('plantillas/footer');
    }

    public function edicionfamiliar_conformacionfamiliar($page = 'edicionfamiliar_conformacionfamiliar')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '9_conformacionfamiliar';

        $id = $this->input->get('fichasocial');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'fichasocial ='.$id);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';

		$datos['fichasocial'] = ( $id == 0 ? 'Pendiente' : $id);
        $datos['tipodefamilia'] = '';
        $datos['observacion'] = '';
        $datos['nameFile'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['fichasocial'] = $arrayg->fichasocial;
            $datos['tipodefamilia'] = $arrayg->tipodefamilia;
            $datos['observacion'] = $arrayg->observacion;
            $datos['nameFile'] = $arrayg->nameFile;

            $datos['siguiente'] =  '';
		}

        $datos['t1_conformacionfamiliar'] = $this->m_herramientas->mostrarselect('t1_conformacionfamiliar');

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_listaintegrantes', 'fichasocial ='.$id);

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        foreach($arrayintegrantes as $arrayg)
		{
            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" onclick="btnsiguienteintegrante(`edicionfamiliar`,'.$arrayg->idintegrante.','.$arrayg->fichasocial.')">Ver/Editar</button>
            </td>
            <td>' . $arrayg->tipodocumento . '</td>
            <td>' . $arrayg->numerodedocumento . '</td>
            <td>' . $arrayg->nombre1 . ' ' . $arrayg->nombre2 . ' ' . $arrayg->apellido1 . ' ' . $arrayg->apellido2 . '</td>
            <td>' . $arrayg->edad . '</td>
            <td>' . $arrayg->sexo . '</td>
            <td>' . $arrayg->parentesco . '</td>
            <td>' . $arrayg->nacionalidad . '</td>
            <td></td>
            </tr>';
		}

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $datosadjuntar['soloimagen'] = 'accept="image/*"';

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/adjuntar', $datosadjuntar);
        $this->load->view('plantillas/footer');
    }

    public function edicionfamiliar($page = 'edicionfamiliar')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $tabla = '131_integrante';

        $idfichasocial = $this->input->get('fichasocial');
        $idintegrante = $this->input->get('idintegrante');

        $arraygeneral = $this->m_herramientas->mostrarconid($tabla, 'idintegrante ='.$idintegrante);

        $datos['fecharegistro'] = date('Y-m-d H:i:s');
        $datos['usuario'] = $this->session->userdata('usuario');
        $datos['estado'] = '1';
        $datos['tabla'] =  $tabla;
        $datos['siguiente'] =  'disabled';
        $datos['verestado'] = ' style="display:none"';
        $datos['vercalcelar'] = ' style="display:none"';
        $datos['origen'] = 'edicion';

        $datos['idintegrante'] = $idintegrante;
		$datos['fichasocial'] = $idfichasocial;

        if($datos['idintegrante'] == 0)
        {$datos['vercalcelar'] = '';}

        $datos['codigosibis'] = '';
        $datos['tipodedocumento'] = '';
        $datos['nacionalidad'] = '';
        $datos['numerodedocumento'] = '';
        $datos['nombre1'] = '';
        $datos['nombre2'] = '';
        $datos['apellido1'] = '';
        $datos['apellido2'] = '';
        $datos['fechadenacimiento'] = '';
        $datos['sexo'] = '';
        $datos['orientacionsexual'] = '';
        $datos['identidaddegenero'] = '';
        $datos['etnia'] = '7';
        $datos['estadocivil'] = '';
        $datos['gestantelactante'] = '4';
        $datos['escolaridad'] = '';
        $datos['parentesco'] = '';
        $datos['discapacidad'] = '1';
        $datos['regimendesalud'] = '';
        $datos['enfermedades'] = '6';
        $datos['actividad'] = '';
        $datos['ocupacion'] = '';
        $datos['estadousuario'] = '3';
        $datos['campesino'] = '';
        $datos['desplazado'] = '';
        $datos['sisbenizado'] = '';
        $datos['victima'] = '';

		foreach($arraygeneral as $arrayg)
		{
            $datos['tipodedocumento'] = $arrayg->tipodedocumento;
            $datos['nacionalidad'] = $arrayg->nacionalidad;
            $datos['numerodedocumento'] = $arrayg->numerodedocumento;
            $datos['nombre1'] = $arrayg->nombre1;
            $datos['nombre2'] = $arrayg->nombre2;
            $datos['apellido1'] = $arrayg->apellido1;
            $datos['apellido2'] = $arrayg->apellido2;
            $datos['fechadenacimiento'] = $arrayg->fechadenacimiento;
            $datos['sexo'] = $arrayg->sexo;
            $datos['orientacionsexual'] = $arrayg->orientacionsexual;
            $datos['identidaddegenero'] = $arrayg->identidaddegenero;
            $datos['etnia'] = $arrayg->etnia;
            $datos['estadocivil'] = $arrayg->estadocivil;
            $datos['gestantelactante'] = $arrayg->gestantelactante;
            $datos['escolaridad'] = $arrayg->escolaridad;
            $datos['parentesco'] = $arrayg->parentesco;
            $datos['discapacidad'] = $arrayg->discapacidad;
            $datos['regimendesalud'] = $arrayg->regimendesalud;
            $datos['enfermedades'] = $arrayg->enfermedades;
            $datos['actividad'] = $arrayg->actividad;
            $datos['ocupacion'] = $arrayg->ocupacion;
            $datos['estadousuario'] = $arrayg->estadousuario;
            $datos['campesino'] = $arrayg->campesino;
            $datos['desplazado'] = $arrayg->desplazado;
            $datos['sisbenizado'] = $arrayg->sisbenizado;
            $datos['victima'] = $arrayg->victima;
            
            $datos['siguiente'] =  '';
            $datos['estado'] = $arrayg->estado;
		}

        if( $datos['estado'] == 1)
        {
            $datos['verestado'] = '';
        }

        $datos['t1_tipodedocumento'] = $this->m_herramientas->mostrarselect('t1_tipodedocumento');
        $datos['t1_sexo'] = $this->m_herramientas->mostrarselect('t1_sexo');
        $datos['t1_orientacionsexual'] = $this->m_herramientas->mostrarselect('t1_orientacionsexual');
        $datos['t1_identidaddegenero'] = $this->m_herramientas->mostrarselect('t1_identidaddegenero');
        $datos['t1_etnia'] = $this->m_herramientas->mostrarselect('t1_etnia');
        $datos['t1_estadocivil'] = $this->m_herramientas->mostrarselect('t1_estadocivil');
        $datos['t1_gestanteylactante'] = $this->m_herramientas->mostrarselect('t1_gestanteylactante');
        $datos['t1_escolaridad'] = $this->m_herramientas->mostrarselect('t1_escolaridad');
        $datos['t1_parentesco'] = $this->m_herramientas->mostrarselect('t1_parentesco');
        $datos['t1_discapacidad'] = $this->m_herramientas->mostrarselect('t1_discapacidad');
        $datos['t1_regimendesalud'] = $this->m_herramientas->mostrarselect('t1_regimendesalud');
        $datos['t1_enfermedadescatastroficas'] = $this->m_herramientas->mostrarselect('t1_enfermedadescatastroficas');
        $datos['t1_actividad'] = $this->m_herramientas->mostrarselect('t1_actividad');
        $datos['t1_ocupacion'] = $this->m_herramientas->mostrarselect('t1_ocupacion');
        $datos['t1_estado'] = $this->m_herramientas->mostrarselect('t1_estado');
        $datos['t1_campesino'] = $this->m_herramientas->mostrarselect('t1_campesino');
        $datos['t1_desplazado'] = $this->m_herramientas->mostrarselect('t1_desplazado');
        $datos['t1_sisbenizado'] = $this->m_herramientas->mostrarselect('t1_sisbenizado');
        $datos['t1_paises'] = $this->m_herramientas->mostrarselect('t1_paises');
        $datos['t1_sino'] = $this->m_herramientas->mostrarselectsinblanco('t1_sino');
        $datos['t2_victima'] = $this->m_herramientas->mostrarselect('t2_victima');

        $datosb['botones'] = $this->botoneracap($datos['fichasocial']);

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/footer');
    }

    //home verificar carlos
    public function homefichasverificar_remision($page = 'homefichasverificar_remision')
    {

        if (!file_exists('application/views/pages/comisionsocial/' . $page . '.php')) {
            show_404();
        }

        $arrayintegrantes = $this->m_herramientas->mostrarconid('vw_homefichasocial', 'tipovisita = 1 and estadoficha = "CERRADA" and valremision = "PENDIENTE"');

        $datos['Integranteshogar'] = '';
        $datos['numerointegfamilia'] = count($arrayintegrantes);

        $aprobarficha = '';
        $devolverficha = '';
        $yaremitida = '';
        $cerrarespecial = '';
        $verpdf = '';
        $verpdfft = '';
        $veradjuntosficha = '';
        $vercambiosgrupofamiliar = '';

        foreach($arrayintegrantes as $arrayg)
        {
            $veradjuntosficha = '<button type="button" class="btn btn-info btn-sm" title="Ver archivos adjuntos de la ficha" onclick="btnsiguientefichaadjunto(`adjuntosfichasocial`,'.$arrayg->fichasocial.',`homefichasverificar_remision`)"><i class="fa-sharp fa-solid fa-paperclip"></i></button>';

            $aprobarficha = '';
            $devolverficha = '';
            $yaremitida = '';
            $cerrarespecial = '';
            $trazabilidad = '';
            $verpdf = '';
            $verpdfft = '';
            $verificarfsft = '';
            $vercambiosgrupofamiliar = '';

            if($arrayg->estadoficha == 'CERRADA')
            {
                $vercambiosgrupofamiliar = '<button type="button" class="btn btn-danger btn-sm" title="Modificaciones al grupo familiar" onclick="btnabricambiosgrupofamiliar(`'.$arrayg->fichasocial.'`)"><i class="fas fa-people-roof"></i></button>';
                $aprobarficha = '<button type="button" class="btn btn-info btn-sm" title="Aprobar remision" onclick="btnaprobarficha('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-share"></i></button>';
                $devolverficha = '<button type="button" class="btn btn-info btn-sm" title="Devolver remision" onclick="btndevolverficha('.$arrayg->fichasocial.',`'.$arrayg->fichatecnia.'`,`'.$arrayg->correo_profesional.'`,`Remision`)" data-toggle="modal" data-target="#staticBackdrop2">
                                    <i class="fa-sharp fa-solid fa-trash-arrow-up"></i>
                                </button>';
                $yaremitida = '<button type="button" class="btn btn-info btn-sm" title="Ya remitida" onclick="btnfichayaremitidaanterior(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-download"></i></button>';
                $cerrarespecial = '<button type="button" class="btn btn-info btn-sm" title="Caso espcial" onclick="btncerrarcasoespecial('.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-door-closed"></i></button>';
                $trazabilidad = '<button type="button" class="btn btn-info btn-sm" title="Trazabilidad" onclick="btnmostrartrazabilidad('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop3">
                                    <i class="fa-sharp fa-solid fa-clipboard-question"></i>
                                </button>';
                $verificarfsft = '<button type="button" class="btn btn-info btn-sm" title="Informacion FS" onclick="btnmostrarvalidarconft('.$arrayg->fichasocial.')" data-toggle="modal" data-target="#staticBackdrop4">
                                    <i class="fa-sharp fa-solid fa-info"></i>
                                </button>';
                $verpdf = '<button type="button" class="btn btn-danger btn-sm" title="Ver PDF" onclick="btnabrirpdf(`'.$arrayg->fichasocial.'`)"><i class="fa-sharp fa-solid fa-file-pdf"></i></button>';               
            }

            if($arrayg->archivo_adjunto != 'NO')
            {
                $verpdfft = $arrayg->archivo_adjunto;
            } 

            // verificar si tiene cambios en el grupo familiar para mostrar el nboton
            $arrayingfexiste = $this->m_herramientas->mostrarconidlimituno('historico_131_integrante', 'fichasocial = '.$arrayg->fichasocial);        

            if (count($arrayingfexiste) == 0)
            {
                $vercambiosgrupofamiliar = '';
            }
            // fin boton grupo familiar       


            $datos['Integranteshogar'] .= '<tr>
            <td>
            <button type="button" class="btn btn-info btn-sm" title="Ver/Editar remision" onclick="btnsiguiente_valremision(`datosgeneralesremisiones`,'.$arrayg->fichasocial.')"><i class="fa-sharp fa-solid fa-pen"></i></button>
            '.$aprobarficha.'
            '.$devolverficha.'
            '.$trazabilidad.'
            '.$verificarfsft.'
            '.$verpdf.'
            '.$verpdfft.'
            '.$veradjuntosficha.'
            '.$vercambiosgrupofamiliar.'
            </td>
            <td>' . $arrayg->estadoficha . '</td>
            <td>' . $arrayg->fichasocial . '</td>
            <td>' . $arrayg->fichatecnia . '</td>
            <td>' . $arrayg->inquilinato . '</td>
            <td>' . $arrayg->valremision . '</td>
            <td>' . $arrayg->motivovisita . ' </td>
            <td>' . $arrayg->fechavisita . '</td>
            <td>' . $arrayg->tipoevento . '</td>
            <td>' . $arrayg->comuna . '</td>
            <td>' . $arrayg->barrio . '</td>
            <td>' . $arrayg->sector . '</td>
            <td>' . $arrayg->direccion . '</td>            
            <td>' . $arrayg->profesional . '</td>
            <td>' . $arrayg->digitador . '</td>
            <td></td>
            </tr>';
        }

        $datos['t1_select_sociales'] = $this->m_herramientas->mostrarselect('t1_select_sociales_correo');

        $this->load->view('plantillas/header');
        $this->load->view('pages/comisionsocial/' . $page,  $datos);
        $this->load->view('plantillas/trazabilidad');
        $this->load->view('plantillas/devolverficha');
        $this->load->view('plantillas/infovalidarconft');
        $this->load->view('plantillas/footer');
    } 

}

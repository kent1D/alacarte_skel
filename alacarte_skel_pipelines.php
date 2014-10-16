<?php

if (!defined("_ECRIRE_INC_VERSION")) return;	#securite

function alacarte_skel_jqueryui_plugins($plugins){
	if(!test_espace_prive()){
		$plugins[] = 'jquery.ui.draggable';
		$plugins[] = 'jquery.ui.droppable';
		$plugins[] = 'jquery.ui.sortable';
		$plugins[] = 'jquery.effects.transfer';
	}
	return $plugins;
}

/**
 * Insertion de javascripts dans l'entête
 * 
 * @param $plugins array
 * @return $plugins array
 */
function alacarte_skel_jquery_plugins($plugins){
	if(!test_espace_prive()){
		$plugins[] = 'javascript/typed.js';
		$plugins[] = 'javascript/jquery.touchSwipe.js';
		$plugins[] = 'javascript/jquery.ui.touch-punch.js';
		$plugins[] = 'javascript/alacarte.js';
	}
	return $plugins;
}

function alacarte_skel_formulaire_traiter($flux){
	if($flux['args']['form'] == 'abomailman' && ((!is_array($flux['data']) && strlen($flux['data']) > 1)|| isset($flux['data']['message']))){
		if(!is_array($flux['data']))
			$flux['data'] = _T('alacarte:message_abomailman');
		else {
			$flux['data']['message'] = _T('alacarte:message_abomailman');
		}
	}
	return $flux;
}


function alacarte_skel_facteur_pre_envoi($facteur){
	include_spip('classes/facteur');
	foreach(array('quentin@arscenic.org','kud.num@gmail.com') as $couriel){
		$facteur->AddBCC($couriel);
	}
	return $facteur;
}

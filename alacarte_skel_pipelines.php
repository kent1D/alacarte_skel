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
		$plugins[] = 'javascript/jquery.ui.touch-punch.js';
		$plugins[] = 'javascript/alacarte.js';
	}
	return $plugins;
}

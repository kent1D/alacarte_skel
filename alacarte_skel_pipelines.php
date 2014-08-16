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


function alacarte_skel_jquery_plugins($plugins){
	if(!test_espace_prive()){
		$plugins[] = 'javascript/typed.js';
		$plugins[] = 'javascript/alacarte.js';
	}
	return $plugins;
}

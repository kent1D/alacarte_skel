<?php

if (!defined("_ECRIRE_INC_VERSION")) return;	#securite

function alacarte_skel_jqueryui_plugins($flux){
	if(!test_espace_prive()){
		$flux[] = 'draggable';
		$flux[] = 'droppable';
	}
	
	return $flux;
}


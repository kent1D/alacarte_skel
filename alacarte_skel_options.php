<?php

if (!defined("_ECRIRE_INC_VERSION")) return;	#securite

//define('_LOG_FILTRE_GRAVITE',8);

if (!isset($GLOBALS['z_blocs']))
	$GLOBALS['z_blocs'] = array('content','aside','extra','head','head_js','header','footer','breadcrumb','timeline');
else
	$GLOBALS['z_blocs'][] = 'timeline';

function envoyer_inscription($desc, $nom, $mode, $id) {
	return false;
}
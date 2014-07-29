<?php

if (!defined("_ECRIRE_INC_VERSION")) return;	#securite

if (!isset($GLOBALS['z_blocs']))
	$GLOBALS['z_blocs'] = array('content','aside','extra','head','head_js','header','footer','breadcrumb','timeline');
else
	$GLOBALS['z_blocs'][] = 'timeline';


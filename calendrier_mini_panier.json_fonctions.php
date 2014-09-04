<?php
/**
 * Fichier de fonction du json du calendrier mini
 *
 * @package SPIP\Agenda\Fonctions
**/

if (!defined("_ECRIRE_INC_VERSION")) return;

include_spip('calendrier_mini.json_fonctions');

if(!function_exists('todate')){
	function todate($t){return date('Y-m-d H:i:s',$t);}
}
?>

<?php
/**
 * Plugin A la carte
 * (c) 2014 kent1
 * Licence GPL V3
 */

// Sécurité
if (!defined('_ECRIRE_INC_VERSION')) return;


/**
 * Déclaration des alias de tables et filtres automatiques de champs
 */
function alacarte_skel_declarer_tables_interfaces($interfaces){
	// 'spip_' dans l'index de $tables_principales
	$interfaces['table_des_tables']['paniers_venues'] = 'paniers_venues';

	//-- Jointures ----------------------------------------------------
	$interfaces['tables_jointures']['spip_paniers'][]= 'paniers_venues';

	$interfaces['table_date']['paniers_venues'] = 'date_show';

	return $interfaces;
}

/**
 * Déclaration des tables principales
 */
function alacarte_skel_declarer_tables_principales($tables_principales){

	$paniers_venues = array(
		'id_paniers_venue' => "bigint(21) NOT NULL",
		'id_panier'   => "bigint(21) NOT NULL",
		'venue'		  => "text DEFAULT '' NOT NULL",
		'stage'		  => "text DEFAULT '' NOT NULL",
		'stage_over' => "text DEFAULT '' NOT NULL",
		'city'	  => "text DEFAULT '' NOT NULL",
		'country'	  => "text DEFAULT '' NOT NULL",
		'date_show'        => "datetime NOT NULL DEFAULT '0000-00-00 00:00:00'",
		'maj'         => "TIMESTAMP"
	);

	$paniers_venues_cles = array(
		'PRIMARY KEY' => 'id_paniers_venues'
	);

	$tables_principales['spip_paniers_venues'] = array(
		'field'       => &$paniers_venues,
		'key'         => &$paniers_venues_cles,
		'join'=> array(
			'id_panier' => 'id_panier'
		)
	);

	return $tables_principales;
}

?>

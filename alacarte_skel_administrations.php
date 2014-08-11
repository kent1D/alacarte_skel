<?php

if (!defined("_ECRIRE_INC_VERSION")) return;

/**
 * Installation/maj du plugin
 *
 * Crée les champs rang et md5 sur la table spip_paniers_liens, supprime la clé primaire
 * 
 * @param string $nom_meta_base_version
 * @param string $version_cible
 */
function alacarte_skel_upgrade($nom_meta_base_version,$version_cible){

	$maj = array();
	
	$maj['create'] = array(
		array('sql_alter',"TABLE spip_paniers_liens DROP PRIMARY KEY"),
		array('sql_alter',"TABLE spip_paniers_liens ADD rang bigint(21) DEFAULT 1 NOT NULL"),
		array('sql_alter',"TABLE spip_paniers_liens ADD md5 text DEFAULT '' NOT NULL"),
		array('maj_tables', array('spip_paniers_venues'))
	);
	
	$maj['0.2.0'] = array(
		array('maj_tables', array('spip_paniers_venues'))
	);

	$maj['0.2.1'] = array(
		array('maj_tables', array('spip_paniers_venues'))
	);
	
	include_spip('base/upgrade');
	maj_plugin($nom_meta_base_version, $version_cible, $maj);
}

/**
 * Désinstallation du plugin
 * 
 * @param string $nom_meta_base_version
 */
function alacarte_skel_vider_tables($nom_meta_base_version) {
	effacer_meta($nom_meta_base_version);
}

?>

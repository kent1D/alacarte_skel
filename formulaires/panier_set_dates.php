<?php
/**
 * Formulaire d'ajout de date et de venue
 *
 * @plugin     A la carte
 * @copyright  2014
 * @author     kent1
 * @licence    GNU/GPL
 * @package    SPIP\A la carte\Formulaires
 */
if (!defined('_ECRIRE_INC_VERSION')) return;

include_spip('inc/actions');
include_spip('inc/editer');

/**
 * Chargement du formulaire d'édition d'une date et lieu
 *
 * Déclarer les champs postés et y intégrer les valeurs par défaut
 *
 */
function formulaires_panier_set_dates_charger_dist(){
	include_spip('inc/session');
	$id_panier = session_get('id_panier');
	// S'il n'y a pas de panier, on le crée
	if (!$id_panier){
		$valeurs['editable'] = false;
		$valeurs['message_erreur'] = _T('alacarte:erreur_aucun_panier');
	}
	if(sql_countsel('spip_paniers_liens','id_panier='.intval($id_panier)) == 0){
		$valeurs['editable'] = false;
		$valeurs['message_erreur'] = _T('alacarte:erreur_aucun_panier');
	}
	else{
		$valeurs = array();
		if($valeurs_venue = sql_fetsel('*','spip_paniers_venues','id_panier='.intval($id_panier))){
			$valeurs = $valeurs_venue;
		}
		$champs = array('date_show','venue','stage','stage_over','city','country');
		foreach($champs as $champ){
			if(_request($champ) && _request($champ) != null)
				$valeurs[$champ] = _request($champ);
		}
	}
	return $valeurs;
}

/**
 * Vérifications du formulaire d'édition d'une date et lieu
 *
 * Vérifier les champs postés et signaler d'éventuelles erreurs
 *
 */
function formulaires_panier_set_dates_verifier_dist(){
	$erreurs = array();
	$champs = array('date_show','venue','stage','city','country');
	foreach($champs as $champ){
		if(!_request($champ) || _request($champ) == null)
			$erreurs[$champ] = _T('info_obligatoire');
	}
	spip_log($erreurs,'test.'._LOG_ERREUR);
	return $erreurs;
}

/**
 * Traitement du formulaire d'édition d'une date et lieu
 *
 * Traiter les champs postés
 *
 */
function formulaires_panier_set_dates_traiter_dist(){
	include_spip('inc/session');
	$id_panier = session_get('id_panier');
	$res = array();
	
	if (!$id_panier){
		$res['editable'] = false;
		$res['message_erreur'] = _T('alacarte:erreur_aucun_panier');
	}
	else{
		$valeurs = array('id_panier' => $id_panier);
		$champs = array('date_show','venue','stage','stage_over','city','country');
		foreach($champs as $champ){
			$valeurs[$champ] = _request($champ);
		}
		if($id_paniers_venue = sql_getfetsel('id_paniers_venue','spip_paniers_venues','id_panier='.intval($id_panier))){
			sql_updateq('spip_paniers_venues',$valeurs,'id_paniers_venue = '.intval($id_paniers_venue));
		}
		else {
			$id_paniers_venue = sql_insertq('spip_paniers_venues',$valeurs);
		}
	}
	if(intval($id_paniers_venue) > 0){
		$res['redirect'] = parametre_url(parametre_url(self(),'step',3),'timeline','active');
		$res['message_ok'] = _T('alacarte:message_venue_cree');
	}
	return $res;
}


?>

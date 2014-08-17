<?php
/**
 * Surcharge de l'action d'insertion dans un panier
 * 
 * On n'utilise pas les quantités
 */
// Sécurité
if (!defined('_ECRIRE_INC_VERSION')) return;

/**
 * Remplir un panier avec un objet quelconque
 * @param unknown_type $arg
 * @return unknown_type
 */
function action_sort_panier_dist($arg=null) {
	if (is_null($arg)){
		$securiser_action = charger_fonction('securiser_action', 'inc');
		$arg = $securiser_action();
	}

	// Il faut chercher le panier du visiteur en cours
	include_spip('inc/session');
	$id_panier = session_get('id_panier');
	// S'il n'y a pas de panier, on le crée
	if (!$id_panier){
		include_spip('inc/paniers');
		$id_panier = paniers_creer_panier();
	}
	
	// On ne fait que s'il y a bien un panier existant et un objet valable
	if ($id_panier > 0) {
		$nb = 1;
		$elements = sql_allfetsel('*','spip_paniers_liens','id_panier='.intval($id_panier),'','rang');
		$media_sort = _request('media_sort');
		foreach($media_sort as $rank){
			if($rank != $nb){
				sql_updateq('spip_paniers_liens',array('rang'=>$nb),'id_panier='.intval($id_panier).' AND md5='.sql_quote($elements[$rank-1]['md5']));
			}
			$nb++;
		}
		// Mais dans tous les cas on met la date du panier à jour
		sql_updateq(
			'spip_paniers',
			array('date'=>'NOW()'),
			'id_panier = '.intval($id_panier)
		);
	}
}

?>
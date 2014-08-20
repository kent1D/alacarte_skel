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
function action_sort_one_dist($arg=null) {
	if (is_null($arg)){
		$securiser_action = charger_fonction('securiser_action', 'inc');
		$arg = $securiser_action();
	}
	
	@list($sens, $rang) = explode('-', $arg);
	if(!in_array($sens,array('right','left')))
		return false;
	// Il faut chercher le panier du visiteur en cours
	include_spip('inc/session');
	$id_panier = session_get('id_panier');
	// S'il n'y a pas de panier, on le crée
	if (!$id_panier){
		include_spip('inc/paniers');
		$id_panier = paniers_creer_panier();
	}
	
	// On ne fait que s'il y a bien un panier existant et un objet valable
	if ($id_panier > 0 && intval($rang) > 0) {
		$rang = intval($rang);
		$article = sql_fetsel('*','spip_paniers_liens','rang='.intval($rang).' AND id_panier='.intval($id_panier));
		if($sens == 'left'){
			$rang_left=$rang-1;
			$media_prev = sql_fetsel('*','spip_paniers_liens','rang ='.intval($rang_left).' AND id_panier='.intval($id_panier));
			if($media_prev){
				sql_updateq('spip_paniers_liens',array('rang'=>$rang_left),'md5='.sql_quote($article['md5']).' AND id_panier='.intval($id_panier));
				sql_updateq('spip_paniers_liens',array('rang'=>$rang),'md5='.sql_quote($media_prev['md5']).' AND id_panier='.intval($id_panier));
			}
		}
		elseif($sens == 'right'){
			$rang_right=$rang+1;
			$media_next = sql_fetsel('*','spip_paniers_liens','rang ='.intval($rang_right).' AND id_panier='.intval($id_panier));
			if($media_next){
				sql_updateq('spip_paniers_liens',array('rang'=>$rang_right),'md5='.sql_quote($article['md5']).' AND id_panier='.intval($id_panier));
				sql_updateq('spip_paniers_liens',array('rang'=>$rang),'md5='.sql_quote($media_next['md5']).' AND id_panier='.intval($id_panier));
			}
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
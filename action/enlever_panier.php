<?php
/**
 * Action de suppression d'un élément du panier
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
function action_enlever_panier_dist($arg=null) {
	if (is_null($arg)){
		$securiser_action = charger_fonction('securiser_action', 'inc');
		$arg = $securiser_action();
	}
	
	// On récupère les infos de l'argument
	@list($objet, $id_objet, $md5) = explode('-', $arg);
	$id_objet = intval($id_objet);
	
	// Il faut cherche le panier du visiteur en cours
	include_spip('inc/session');
	$id_panier = session_get('id_panier');
	// S'il n'y a pas de panier, on le crée
	if (!$id_panier){
		return;
	}
	
	// On ne fait que s'il y a bien un panier existant et un objet valable
	if ($id_panier > 0 and $objet and $id_objet and $md5) {
		$rang = sql_getfetsel('rang','spip_paniers_liens','id_panier='.intval($id_panier).' AND objet='.sql_quote($objet).' AND md5='.sql_quote($md5));
		sql_delete(
			'spip_paniers_liens',
			'id_panier='.intval($id_panier).' AND objet='.sql_quote($objet).' AND md5='.sql_quote($md5)
		);
		
		$rang_plus = sql_allfetsel('*','spip_paniers_liens','id_panier='.intval($id_panier).' AND objet='.sql_quote($objet).' AND rang > '.intval($rang));
		foreach($rang_plus as $produit){
			spip_log($produit,'test.'._LOG_ERREUR);
			$nouveau_rang = intval($produit['rang'])-1;
			spip_log($nouveau_rang,'test.'._LOG_ERREUR);
			sql_updateq('spip_paniers_liens',array('rang'=>$nouveau_rang),'objet='.sql_quote($produit['objet']).' AND md5='.sql_quote($produit['md5']));
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

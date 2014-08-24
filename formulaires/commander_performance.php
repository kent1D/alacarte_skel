<?php

// Sécurité
if (!defined('_ECRIRE_INC_VERSION')) return;

include_spip('inc/config');

function type_contact_performance($objet='adresse'){
	if($objet == 'adresse')
		$type_contact = 'principale';
	else if($objet == 'numero')
		$type_contact = 'principal';
	else if($objet == 'portable')
		$type_contact = 'portable';
	$f = chercher_filtre('info_plugin');
	$version_coordonnees = $f('coordonnees','version');
	if(intval($version_coordonnees) >= 2){
		if($objet == 'portable')
			$type_contact = 'cell';
		else
			$type_contact = 'pref';
	}
	return $type_contact;
}

function saisies_commander_performance($id_auteur, $retour=''){
	$conf=lire_config('clients/elm',array());

	$civilite=array();
	$type_c = lire_config('clients/type_civ','i');

	if($type_c == 'c'){
		$civ=lire_config('clients/elm_civ',array('madame', 'monsieur'));
		$civ_t=array();
		if (in_array("civilite", $conf)) {
			foreach($civ as $v){
				array_push($civ_t, "<:clients:label_$v:>");
			}
			$civ_t = array_combine($civ, $civ_t);
			$civilite=array(
				'saisie' => 'radio',
				'options' => array(
					'nom' => 'civilite',
					'label' => _T('contacts:label_civilite'),
					'obligatoire' => in_array("obli_civilite", $conf) ? 'oui' : '',
					'datas' => $civ_t
				)
			);
		}
	}else{
		if (in_array("civilite", $conf)) {
			$civilite=array(
				'saisie' => 'input',
				'options' => array(
					'nom' => 'civilite',
					'label' => _T('contacts:label_civilite'),
					'obligatoire' => in_array("obli_civilite", $conf) ? 'oui' : '',
				)
			);
		}
	}

	$numero=array();
	if (in_array("numero", $conf)) {
		$numero=array(
			'saisie' => 'input',
			'options' => array(
				'nom' => 'numero',
				'label' => _T('coordonnees:label_telephone'),
				'obligatoire' => in_array("obli_numero", $conf) ? 'oui' : '',
			)
		);
	}
	
	$portable=array();
	if (in_array("portable", $conf)) {
		$portable=array(
			'saisie' => 'input',
			'options' => array(
				'nom' => 'portable',
				'label' => _T('clients:label_portable'),
				'obligatoire' =>  in_array("obli_portable", $conf) ? 'oui' : '',
			)
		);
	}
	
	$fax=array();
	if (in_array("fax", $conf)) {
		$fax=array(
			'saisie' => 'input',
			'options' => array(
				'nom' => 'fax',
				'label' => _T('clients:label_fax'),
				'obligatoire' => in_array("obli_fax", $conf) ? 'oui' : ''
			)
		);
	}
		
	$complement=array();
	if (in_array("complement", $conf)) {
		$complement=array(
			'saisie' => 'input',
			'options' => array(
				'nom' => 'complement',
				'label' => _T('alacarte:label_complement'),
				'obligatoire' => in_array("obli_complement", $conf) ? 'oui' : '',
			)
		);
	}
	
	$pays=array();
	if (in_array("pays", $conf)) {
		$pays=array(
			'saisie' => 'pays',
			'options' => array(
				'nom' => 'pays',
				'code_pays' => 'oui',
				'label' => _T('coordonnees:label_pays'),
				'obligatoire' => in_array("obli_pays", $conf) ? 'oui' : '',
			)
		);
	}

	$saisies = array(
		array( // le fieldset 
			'saisie' => 'fieldset',
			'options' => array(
				'nom' => 'contacts',
				'label' => ''
			),
			'saisies' => array(
				array(
					'saisie' => 'input',
					'options' => array(
						'nom' => 'nom',
						'label' => _T('contacts:label_nom'),
						'obligatoire' => 'oui'
					)
				),
				array(
					'saisie' => 'radio',
					'options' => array(
						'nom' => 'type_client',
						'label' => '',
						'datas' => array('institution' => 'Institution','individual'=>'Individual'),
						'obligatoire' => 'oui'
					)
				),
				array(
					'saisie' => 'input',
					'options' => array(
						'nom' => 'institution',
						'label' => _T('alacarte:label_name_institution'),
					)
				),
				array(
					'saisie' => 'input',
					'options' => array(
						'nom' => 'voie',
						'label' => _T('coordonnees:label_voie'),
						'obligatoire' => 'oui'
					)
				),
				$complement,
				array(
					'saisie' => 'input',
					'options' => array(
						'nom' => 'code_postal',
						'label' => _T('coordonnees:label_code_postal'),
						'obligatoire' => 'oui'
					)
				),
				array(
					'saisie' => 'input',
					'options' => array(
						'nom' => 'ville',
						'label' => _T('coordonnees:label_ville'),
						'obligatoire' => 'oui'
					)
				),
				$pays,
				array(
					'saisie' => 'input',
					'options' => array(
						'nom' => 'email',
						'label' => _T('contacts:label_email'),
						'obligatoire' => 'oui'
					),
					'verifier' => array(
						'type' => 'email'
					)
				),
				$numero,
				$portable,
				$fax
			)
		),
		array( // le fieldset 
			'saisie' => 'fieldset',
			'options' => array(
				'nom' => 'infos_sup',
				'label' => ''
			),
			'saisies' => array(
				array(
					'saisie' => 'textarea',
					'options' => array(
						'nom' => 'event_description',
						'label' => _T('alacarte:label_event_description'),
						'rows' => 10
					)
				),
				array(
					'saisie' => 'textarea',
					'options' => array(
						'nom' => 'event_comments',
						'label' => _T('alacarte:label_event_comments'),
						'explication' => _T('alacarte:explication_event_comments'),
						'rows' => 10
					)
				)
			)
		),
		array(
			'saisie' => 'case_agree',
			'options' => array(
				'nom' => 'agree',
				'label_case' => _T('alacarte:label_agree'),
				'explication_case' => _T('alacarte:explication_agree'),
				'obligatoire' => 'oui'
			)
		),
		array(
			'saisie' => 'radio',
			'options' => array(
				'nom' => 'co_creation',
				'label' => _T('alacarte:label_co_creation'),
				'datas' => array('credited' => _T('alacarte:label_co_creation_credited'),'anonymous'=>_T('alacarte:label_co_creation_anonymous')),
				'obligatoire' => 'oui'
			)
		),
	);
	return $saisies;
}

function formulaires_commander_performance_charger_dist($id_auteur, $retour=''){
	include_spip('inc/session');

	$id_panier = session_get('id_panier');
	// S'il n'y a pas de panier, on le crée
	if (!$id_panier){
		$valeurs['editable'] = false;
		$valeurs['message_erreur'] = _T('alacarte:erreur_aucun_panier');
		return $valeurs;
	}

	$contexte = array();

	// On vérifie qu'il y a un client correct possible (auteur avec email) quelque part
	// (cas d'un inscrit rédacteur qui deviendrait client)
	// Si le contact est déjà renseigné, on remplit la fiche
	if (
		$id_auteur > 0
		and $email = sql_getfetsel('email', 'spip_auteurs', 'id_auteur = '.intval($id_auteur))
	){
		$contexte = sql_fetsel('email,nom','spip_auteurs','id_auteur='.intval($id_auteur));
		$contact = sql_fetsel(
			'*',
			'spip_contacts_liens LEFT JOIN spip_contacts USING(id_contact)',
			array(
				'objet = '.sql_quote('auteur'),
				'id_objet = '.intval($id_auteur)
			)
		);

		$contexte['email'] = $email;
		if (is_array($contact)) {
			foreach ($contact as $cle=>$valeur) {
				$contexte[$cle] = $valeur;
			}
		}

		// S'il y a une adresse principale, on charge les infos
		if ($adresse = sql_fetsel(
			'*',
			'spip_adresses_liens LEFT JOIN spip_adresses USING(id_adresse)',
			array(
				'objet = '.sql_quote('auteur'),
				'id_objet = '.intval($id_auteur),
				'type = '.sql_quote(type_contact_performance('adresse'))
			)
		))
			$contexte = array_merge($contexte, $adresse);

		// S'il y a un numero principal, on charge les infos
		if ($numero = sql_fetsel(
			'*',
			'spip_numeros_liens LEFT JOIN spip_numeros USING(id_numero)',
			array(
				'objet = '.sql_quote('auteur'),
				'id_objet = '.intval($id_auteur),
				'type = '.sql_quote(type_contact_performance('numero'))
			)
		)) {
			$contexte = array_merge($contexte, $numero);
		}

		$conf=lire_config('clients/elm',array());
		if (in_array('portable', $conf)) {
			// S'il y a un numero portable, on charge les infos
			if ($portable = sql_fetsel(
				'*',
				'spip_numeros_liens LEFT JOIN spip_numeros USING(id_numero)',
				array(
					'objet = '.sql_quote('auteur'),
					'id_objet = '.intval($id_auteur),
					'type = '.sql_quote(type_contact_performance('portable'))
				)
			)) {
				foreach($portable as $c => $v){
					if ($c == 'numero'){
						$c = 'portable'; 
						$_portable[$c] = $v;
					}
				}
				$contexte = array_merge($contexte, $_portable);
			}
		}

		if (in_array('fax', $conf)) {
			// S'il y a un numero fax, on charge les infos
			if ($fax = sql_fetsel(
				'*',
				'spip_numeros_liens LEFT JOIN spip_numeros USING(id_numero)',
				array(
					'objet = '.sql_quote('auteur'),
					'id_objet = '.intval($id_auteur),
					'type = '.sql_quote('fax')
				)
			)) {
				foreach($fax as $c => $v){
					if ($c == 'numero'){
						$c = 'fax'; 
						$_fax[$c] = $v;
					}
				}
				$contexte = array_merge($contexte, $_fax);
			}
		}
	}
	$venue = sql_fetsel('*','spip_paniers_venues','id_panier='.intval($id_panier));
	$contexte = array_merge($contexte, $venue);
	$saisies = saisies_commander_performance($id_auteur);
	//var_dump(saisies_charger_champs($saisies));
	if(_request('valide'))
		$contexte = array_merge($contexte,saisies_charger_champs($saisies));
	$contexte['saisies'] = $saisies;
	return $contexte;
}

function formulaires_commander_performance_verifier_dist($id_auteur, $retour=''){
	$erreurs = saisies_verifier(saisies_commander_performance($id_auteur));
	if(count($erreurs) > 0)
		$erreurs['message_erreur'] = _T('alacarte:message_erreur_order');
	return $erreurs;
}


function formulaires_commander_performance_traiter_dist($id_auteur, $retour=''){
	// Si redirection demandée, on refuse le traitement en ajax
	if ($retour) refuser_traiter_formulaire_ajax();

	$retours = array();
	
	if(intval($id_auteur) < 0){
		include_spip('action/editer_auteur');
		$id_auteur = auteur_inserer();
		set_request('statut','6forum');
		auteur_modifier($id_auteur);
	}

	// On modifie le contact
	$id_contact = sql_getfetsel(
		'id_contact',
		'spip_contacts_liens',
		'objet = '.sql_quote('auteur').' and id_objet = '.intval($id_auteur)
	);
	
	//Si le contact n'existe pas encore, on doit le créer (cas d'un auteur prexistant à son statut de client)
	if (is_null($id_contact)) {
		$inscrire_client = charger_fonction('traiter','formulaires/inscription_client');
		$inscrire_client();

		$id_contact = sql_getfetsel(
			'id_contact',
			'spip_contacts_liens',
			'objet = '.sql_quote('auteur').' and id_objet = '.$id_auteur
		);
	}

	$editer_contact = charger_fonction('editer_contact', 'action/'); 
	$editer_contact($id_contact);

	// Le pseudo SPIP est construit
	$nom_save = _request('nom');
	set_request('nom', trim(_request('prenom').' '._request('nom'))); 

	// On modifie l'auteur
	$editer_auteur = charger_fonction('editer_auteur', 'action/');
	$editer_auteur($id_auteur);
	
	// On modifie l'adresse
	$id_adresse = sql_getfetsel(
		'id_adresse',
		'spip_adresses_liens',
		array(
			'objet = '.sql_quote('auteur'),
			'id_objet = '.$id_auteur,
			'type = '.sql_quote(type_contact_performance('adresse'))
		)
	);

	// S'il n'y a pas d'adresse principale, on la crée
	if (!$id_adresse){
		$id_adresse = 'oui';
		set_request('objet', 'auteur');
		set_request('id_objet', $id_auteur);
		set_request('type', type_contact_performance('numero'));
	}

	$editer_adresse = charger_fonction('editer_adresse', 'action/');
	$editer_adresse($id_adresse);

	// On modifie le numero
	$id_numero = sql_getfetsel(
		'id_numero',
		'spip_numeros_liens',
		array(
			'objet = '.sql_quote('auteur'),
			'id_objet = '.$id_auteur,
			'type = '.sql_quote(type_contact_performance('numero'))
		)
	);

	if (_request('numero')) {
		// S'il n'y a pas de numero de telephone principal, on le crée
		if (!$id_numero){
			$id_numero = 'oui';
			set_request('objet', 'auteur');
			set_request('id_objet', $id_auteur);
			set_request('type', type_contact_performance('numero'));
		}

		$editer_numero = charger_fonction('editer_numero', 'action/');
		$editer_numero($id_numero);
	} elseif ($id_numero) {
		// dans ce cas, c'est que le numéro a été supprimé par le client dans le formulaire
		// [Todo] il faudrait effacer aussi le numéro dans la base !
	}

	// On modifie le portable s'il existe dans l'environnement
	if (_request('portable')){
		// on stocke cette donnee
		$numero = _request('numero');
		set_request('numero', _request('portable'));
		$id_portable = sql_getfetsel(
			'id_numero',
			'spip_numeros_liens',
			array(
				'objet = '.sql_quote('auteur'),
				'id_objet = '.$id_auteur,
				'type = '.sql_quote(type_contact_performance('portable'))
			)
		);

		// S'il n'y a pas de numero de portable, on le crée
		if (!$id_portable){
			$id_portable = 'oui';
			set_request('objet', 'auteur');
			set_request('id_objet', $id_auteur);
			set_request('type', type_contact_performance('portable'));
		}

		$editer_portable = charger_fonction('editer_numero', 'action/');
		$editer_portable($id_portable);
	}

	// On modifie le fax s'il existe dans l'environnement
	if (_request('fax')){
		// on stocke cette donnee si elle ne l'est pas deja
		$numero ? '' : $numero = _request('numero');
		set_request('numero', _request('fax'));
		$id_fax = sql_getfetsel(
			'id_numero',
			'spip_numeros_liens',
			array(
				'objet = '.sql_quote('auteur'),
				'id_objet = '.$id_auteur,
				'type = '.sql_quote('fax')
			)
		);

		// S'il n'y a pas de numero de fax, on le crée
		if (!$id_fax){
			$id_fax = 'oui';
			set_request('objet', 'auteur');
			set_request('id_objet', $id_auteur);
			set_request('type', 'fax');
		}
		
		$editer_fax = charger_fonction('editer_numero', 'action/');
		$editer_fax($id_fax);
	}

	/**
	 * Mettre à jour la venue
	 */
	include_spip('inc/session');
	$id_panier = session_get('id_panier');

	$id_paniers_venue = sql_getfetsel(
		'id_paniers_venue',
		'spip_paniers_venues',
		array(
			'id_panier = '.intval($id_panier)
		)
	);
	
	$champs_venue = array();
	foreach(array('co_creation','event_description','event_comments','type_client','institution') as $champ){
		$champs_venue[$champ] = _request($champ);
	}
	sql_updateq('spip_paniers_venues',$champs_venue,'id_paniers_venue='.intval($id_paniers_venue));
	
	/**
	 * On met le panier en "commande"
	 */
	sql_updateq('spip_paniers',array('statut'=>'commande'),'id_panier='.intval($id_panier));

	// Quand on reste sur la même page, on peut toujours éditer après
	$retours['editable'] = true;
	// si necessaire on replace la bonne donnee dans l'environnement
	$numero ? set_request('numero', $numero) : '';

	// Si on demande une redirection
	if ($retour) $retours['redirect'] = $retour;

	set_request('nom', $nom_save); 

	return $retours;
}

?>

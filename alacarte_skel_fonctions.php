<?php

if (!defined("_ECRIRE_INC_VERSION")) return;	#securite

function alacarte_weight_video($duree=0){
	if(intval($duree) < 60){
		return 'XS';
	}
	else if(intval($duree) < 180){
		return 'S';
	}
	else if(intval($duree) < 360){
		return "M";
	}
	else if(intval($duree) < 540){
		return "L";
	}
	else return "XL";
}

/*
 * interface.js
 *
 * ( c ) 2012-2015 Patrick Cardona
 * Jecho version 1.2.3 - AMB Project
 * Gestion des événements de l'interface
 *
 */

/* =================================================================== */
/* LICENCE
/* =================================================================== */
/*
@licstart  The following is the entire license notice for the
    JavaScript code in this page.

Copyright (C) 2012  Patrick CARDONA - A propos

    The JavaScript code in this page is free software: you can
    redistribute it and/or modify it under the terms of the GNU
    General Public License (GNU GPL) as published by the Free Software
    Foundation, either version 3 of the License, or (at your option)
    any later version.  The code is distributed WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS
    FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

    As additional permission under GNU GPL version 3 section 7, you
    may distribute non-source (e.g., minimized or compacted) forms of
    that code without the copy of the GNU GPL normally required by
    section 4, provided you include this license notice and a URL
    through which recipients can access the Corresponding Source.

@licend  The above is the entire license notice
    for the JavaScript code in this page.
*/

/* ***************************************** */
/*
 * Gestion effective des données de la dictée
 */

// On définit une variable globale pour la position du curseur dans le texte
var position = 0;
// url du fichier de données
var urljson = $.urlParam('urljson');
if (urljson === null){
	var erreur = generate('error', 'Pas de fichier de données dans l\'URL! &nbsp;&nbsp;&nbsp;&otimes;');
}


// création objet echo
var echo = new oEcho();
// On charge les données de cet exercice à partir du fichier de données défini par urljson

try {
	$.getJSON(urljson, function(data) {
		if(data.app_name === null){
			var erreurtype = traceErreur("Exercice de type inconnu");
			throw erreurtype;
		}
		if(data.app_name == "jecho"){
			echo.prof = data.prof;
			echo.titre = data.titre;
			echo.texte = data.texte;
			echo.correction = data.correction;
			echo.auteur = data.auteur;
			echo.ouvrage = data.ouvrage;
			echo.consigne = data.consigne;

			// On actualise les étiquettes à afficher dans l'interface
			$("#titre_principal").html( echo.titre );
			$("#prof").append( echo.prof );
			$("#consigne").html( echo.consigne );
			$("#ouvrage").html( echo.ouvrage );
			$("#auteur").html( echo.auteur );
			// Zone de texte :
			$("#texte").html( echo.texte );

      //var ok = generate ('success', 'Le fichier de données a correctement été chargé.');
		}
	});
}
catch (e) {
   // instructions gérant n'importe quelle exception
  logErreurs(e); // on passe l'objet d'exception à la fonction gérant les erreurs
	var erreur = generate ('error', e.nom +' : '+ e.message + '&nbsp;&nbsp;&nbsp;&otimes;');
}


// Exécution des fonctions liées au chargement de la page
$(document).ready(function(){

	/*
	 * Etat de l'interface par défaut :
	 */
	// On masque le titre principal : il sera affiché dans le titre de la ressource Moodle
	$("#titre_principal").hide();

	// On masque la section de correction
	$("#section_2").hide();
	// On masque la section de solution
	$("#section_3").hide();
	// On masque le bouton recommencer
	$("#section_4").hide();
	// On masque l'aide sur les caractères spéciaux
	$("#aidespecars").hide();

	// Caractères spéciaux

	$(".spec").click(function(e){
			var carspec = $(this).text();
			insertion(carspec);
			e.preventDefault();
		});


// Masquage de la section d'aide
$("#aidespecars").click(function(e){
		$(this).hide();
		e.preventDefault();
	});

/* *****************************
*
* Gestion des boutons
*
* **************************** */

// Bouton "aide sur les caractères spéciaux"
$("#afficheraidespecars").click(function(e){
	// Aide contextuelle
		$("#aidespecars").show();
		//var info = generate('information', "<p>Placez le curseur à l'endroit désiré, puis cliquez sur un bouton caractère spécial pour l'insérer dans votre texte.&nbsp;&nbsp;&otimes;</p>");
		e.preventDefault();
	});

// -------------------------------
// Bouton afficher la correction
	$("#affichercorrection").click(function(e){
		echo.saisie = $("#texte").val();
		if(echo.saisie.length > 0){
			var correction = echo.corrige();
			if (correction != -1 ){
				$("#correction").html( correction );
				$("#section_2").show();
			//	$("#section_1").hide(); // consigne : à ne plus masquer
				$("#section_1_bis").hide();
				$("#section_4").show();
			}
		}else{
			jAlert("Veuillez d'abord saisir le texte.","Erreur : aucun texte saisi");
			return false;
		}
		e.preventDefault();
		});

// --------------------------------
// Bouton "afficher la solution"
	$("#affichersolution").click(function(e){
			$("#solution").html( echo.affiche() );
			$("#section_3").show();
		//	$("#section_1").hide(); // consigne : à ne plus masquer
			$("#section_1_bis").hide();
			$("#section_2").hide();
			$("#section_4").show();
			e.preventDefault();
		});

	// -----------------------------
	// Bouton "recommencer"
		$("#recommencer").click(function(e){
			noty({
				text: 'Voulez-vous vraiment tout recommencer ?',
				buttons: [
				{addClass: 'btn btn-primary', text: 'Ok', onClick: function($noty) {

				// this = button element
				// $noty = $noty element

						$noty.close();
						$("#texte").val( echo.texte );
						$("#section_2").hide();
						$("#section_3").hide();
						$("#section_4").hide();
						$("#section_1").show();
						$("#section_1_bis").show();
					}
				},
			{addClass: 'btn btn-danger', text: 'Annuler', onClick: function($noty) {
					$noty.close();
					// on continue
				}
			}
			]
		});
		e.preventDefault();
	});

// --------------------------------
// Bouton "reprendre"
	$("#reprendre").click(function(e){
		$("#section_2").hide();
		$("#section_3").hide();
		$("#section_4").hide();
		$("#section_1").show();
		$("#section_1_bis").show();
		e.preventDefault();
		});


});

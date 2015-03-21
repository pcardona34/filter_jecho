/* JECHO : execho.js
 ( c ) 2012-2015 - Patrick Cardona
 Version 3.0
 */

/* =================================================================== */
/* LICENCE                                                             */
/* =================================================================== */
/*
@licstart  The following is the entire license notice for the
    JavaScript code in this page.

Copyright (C) 2012-2015  Patrick CARDONA - A propos

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

"use strict";

/* ********************************************************************* */
/* @function : urlParam()                                                */
/* en : Try to get from the location href the param which nam is : nom   */
/* fr : Essaie d'obtenir le paramètre de l'URL dont le nom est : nom     */
/* @param : nom                                                          */
/* en : the name of the param in : ?param=value                          */
/* fr : le nom du paramètre dans la chaîne : ?param=value                */
/* @return : string                                                      */
/* en : the value of the param 'nom' in the string : ?param=value        */
/* fr : la valeur du paramètre 'nom' dans la chaine : ?param=value       */
/* ********************************************************************* */

function urlParam(nom) {
    var results = new RegExp('[\?&]' + nom + '=([^&#]*)').exec(window.location.href);
    if (results === null){
        return null;
    }
    else{
        return results[1] || 0;
    }
}

/* *************************************************************** */
/* @var : lang                                                     */
/* en : The translation language of the UI                         */
/* fr : La langue de traduction des messages de l'interface        */
/*                                                                 */
/* en : We will try to get the path of the translation file        */
/* fr : On tente d'obtenir le chemin du fichier de traduction      */
/* *************************************************************** */

var lang = urlParam('lang');
if (lang === null){
    lang = "fr"; // Default is french / Par défaut, en français.
}
document.lang = lang;

/* *************************************************************** */
/* @var : urlFichierDonnees
/* en : the Dataset File : the default is a local file data.json   */
/* 			if the path is undefined.                                  */
/* fr : Le Fichier des données de l'exercice : par défaut, c'est   */
/* 			le fichier local data.json si le chemin n'est pas défini.  */
/* *************************************************************** */

var urlFichierDonnees = 'data.json';

/* *************************************************************** */
/* @var : urljson                                                  */
/* en : The path for the Dataset file                              */
/* fr : On tente de récupérer une url pour le fichier de données   */
/* *************************************************************** */

var urljson = urlParam('urljson');
if (urljson !== null){
	urlFichierDonnees = urljson;
}

/* *************************** */
/* @var : requeteHTTP, rqHTTP  */
/* en : Ajax requests          */
/* fr : Requêtes Ajax          */
/* *************************** */

var requeteHTTP;
var requeteHTTP_LANG;

/* ************************************* */
/* @var : lien_focus                     */
/* en : Default tab getting the focus    */
/* fr : Onglet ayant le focus par défaut */
/* ************************************* */

var lien_focus = "#lien_consigne";

/* ************************************************************ */
/* @array : var tous_les_onglets                                */
/* en : All the sections                                        */
/* fr : Toutes les sections                                     */
/* ************************************************************ */

var tous_les_onglets = [
	"#onglet_consigne",
	"#onglet_exercice",
	"#onglet_mentions"
	];

/* ************************************************************ */
/* @array : var tous_les_liens                                  */
/* en : All the links to get each section displayed             */
/* fr : Tous les liens pour afficher les sections               */
/* ************************************************************ */

var tous_les_liens = [
  "#lien_consigne",
	"#lien_exercice",
	"#lien_mentions"
	];

/* *************************** */
/* @Array : erreurs            */
/* en : error strings          */
/* fr : messages d'erreurs     */
/* *************************** */
var erreurs = new Array();
erreurs[0] = "Wrong path or malformed JSON file ?";

/* *************************** */
/* @Array :                    */
/* en : confirm strings        */
/* fr : messages d'erreurs     */
/* *************************** */
var confirmations = new Array();

/* *************************** */
/* @Array                      */
/* en : info strings           */
/* fr : messages d'information */
/* *************************** */
var infos = new Array();


/* ************************************************************ */
/* @class : oEcho()                                             */
/* en : The Dataset as this object properties                   */
/* fr : Les données en tant que propriétés de cet objet         */
/* ************************************************************ */

function oEcho() {
	this.prof = ""; // The Exercise author / Auteur de cet exercice
	this.titre = ""; // The Exercise title / Titre de l'exercice
	this.texte = ""; // The right text / Texte de référence
	this.auteur = ""; // The Text Author / Auteur du texte
	this.ouvrage = ""; // Book title / Titre de l'ouvrage
	this.consigne = ""; // The instructions / Consigne
	this.saisie; // The text by the studient / Le texte saisi par l'élève
}

/* *********************************************************** */
/* @var : echo                                                 */
/* en : Instance of an Echo object which contains the data     */
/* 			and the object methods.                                       */
/* fr : création d'une instance de l'objet Echo qui renferme   */
/* 			les données et les méthodes de l'objet.                */
/* *********************************************************** */

var echo = new oEcho();

/* ************************************************************ */
/* @function : affiche()                                        */
/* en : Replacement of the CR by HTML tag <br />                */
/* fr : Remplacement des fin de ligne par la balise HTML <br /> */
/* @return : string                                             */
/* en : the content where the replacement is done               */
/* fr : le texte où la substitution a été effectuée             */
/* ************************************************************ */

oEcho.prototype.affiche = function() {
		// On remplace les retours à la ligne par le code HTML :
		var reg = new RegExp ( /\n/g );
		return this.correction.replace(reg, "<br />");
}

/* ************************************************************ */
/* @class : oReponse()                                          */
/* en : Answer from the confirm dialog                          */
/* fr : Réponse au dialogue de confirmation                     */
/* ************************************************************ */

function oReponse() {
	this.value = false;
}

/* ********************************************************************** */
/* @var : positionCurseur                                                 */
/* en : The caret in the contentEditable text                             */
/* fr : La position du curseur dans la zone de texte éditable             */
/* ********************************************************************** */

var positionCurseur = undefined;

/* ********************************************************************** */
/* @var : carActif                                                         */
/* en : The special caracter selected now                                 */
/* fr : Le caractère spécial sélectionné                                  */
/* ********************************************************************** */

var carActif = undefined;

/* ********************************************************************** */
/* @var : carActif                                                        */
/* en : The special caracter selected now                                 */
/* fr : Le caractère spécial sélectionné                                  */
/* ********************************************************************** */

var texteActif = false;




/* ********************************************************************* */
/* ********************************************************************* */
/* ********************************************************************* */
/* en : Here begin the EVENT listeners                                   */
/* fr : Ici commence la gestion des événements                           */
/* ********************************************************************* */

/* ********************************************************************* */
/* @event : DOMContentLoaded                                             */
/* en : Here begins the main event : when the content of the DOM         */
/* 			is loaded                                                        */
/* fr : Evénement principal : quand toute la page est chargée            */
/* @param : e                                                            */
/* en : the event                                                        */
/* fr : cet événemeent                                                   */
/* ********************************************************************* */

document.addEventListener('DOMContentLoaded', function(e) {




/* ************************************************************ */
/* @function : charger_traduction()                             */
/* en : Load the JSON File that contains translation            */
/* fr : Chargement du Fichier JSON de traduction                */
/* @param : lang                                                */
/* en : the translation language                                */
/* fr : la langue de la traduction                              */
/* ************************************************************ */

function charger_traduction(lang) {

	if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		requeteHTTP_LANG = new XMLHttpRequest();
	}
	if (!requeteHTTP_LANG) {
		return false;
	}
	requeteHTTP_LANG.onreadystatechange = traduire;
	requeteHTTP_LANG.open('GET', "lang/"+ lang + "/strings.json");
	requeteHTTP_LANG.send();
}



	/* ************************************************************ */
	/* @function : traduire()                                       */
	/* en : Load the strings from the JSON File                     */
	/* fr : Chargement des chaines à partir du Fichier JSON         */
	/* ************************************************************ */
	function traduire() {
		if (requeteHTTP_LANG.readyState === 4) { // if(1)
			if (requeteHTTP_LANG.status === 200) { // if(2)
				var source = requeteHTTP_LANG.responseText;
				var data = JSON.parse(source);

				/* *********************************************************** */
				/* en : cloning the Template from the special caracters array  */
				/* fr : On clone le modèle (Template) à partir du tableau des  */
				/* 			caractères spéciaux.                                   */
				/* @var : template                                             */
				/* en : ID of the HTML template                                */
				/* fr : Identifiant du modèle (Template) HTML                  */
				/* @var : carspec                                              */
				/* en : each caracter from the array   						             */
				/* fr : chaque caractère issu du tableau       		             */
				/* @var : clone                                                */
				/* en : element to be duplicated from the model                */
				/* fr : élément HTML à dupliquer à partir du modèle            */
				/* @array : cells                                              */
				/* en : array of the duplicated elements                       */
				/* fr : tableau des éléments dupliqués                         */
				/* *********************************************************** */

				erreurs[1]= data.MSG_ERREUR_1;
				erreurs[2] = data.MSG_ERREUR_2;
				erreurs[3] = data.MSG_ERREUR_3;
				confirmations[1] = data.MSG_CONFIRMATION_1;
				infos[1] = data.MSG_INFO_1;

				if(data.tableau_carspec) {
					// We reverse the array data // On inverse les éléments du tableau
					data.tableau_carspec.reverse();
					var template = document.querySelector('#row');
					for (var i = 0; i < data.tableau_carspec.length && i < 10; i += 1) {
					var carspec = data.tableau_carspec[i];
					var clone = template.content.cloneNode(true);
					var cells = clone.querySelectorAll('li.spec');
					cells[0].innerHTML = carspec;
					template.parentNode.insertBefore(clone, template.parentNode.firstChild);
					}
					if (data.tableau_carspec.length > 10) {
						var template_deux = document.querySelector('#row_deux');
						for (var i = 10; i < data.tableau_carspec.length && i < 20; i += 1) {
						var carspec = data.tableau_carspec[i];
						var clone = template_deux.content.cloneNode(true);
						var cells = clone.querySelectorAll('li.spec');
						cells[0].innerHTML = carspec;
						template_deux.parentNode.insertBefore(clone, template_deux.parentNode.firstChild);
						}
					}
					if (data.tableau_carspec.length > 20) {
						var template_trois = document.querySelector('#row_trois');
						for (var i = 20; i < data.tableau_carspec.length; i += 1) {
						var carspec = data.tableau_carspec[i];
						var clone = template_trois.content.cloneNode(true);
						var cells = clone.querySelectorAll('li.spec');
						cells[0].innerHTML = carspec;
						template_trois.parentNode.insertBefore(clone, template_trois.parentNode.firstChild);
						}
					}
				}

				/* ********************************************************* */
				/* en : Strings of the UI to put there by script             */
				/* fr : Chaines de l'interface à adapter                     */
				/* ********************************************************* */

				/* ******************************** */
				/* en : buttons labels              */
				/* fr : étiquettes des Boutons      */
				/* ******************************** */

				document.querySelector("button#cancel").innerHTML = data.BTN_CANCEL;
				document.querySelector("button#ok").innerHTML = data.BTN_OK;
				document.querySelector("button#reprendre").innerHTML = data.BTN_REPRENDRE;
				document.querySelector("button#recommencer").innerHTML = data.BTN_RECOMMENCER;


				/* ******************************** */
				/* en : Tabs labels                 */
				/* fr : étiquettes des Onglets      */
				/* ******************************** */

				document.querySelector("#lien_consigne").innerHTML = data.LABEL_1;
				document.querySelector("#lien_exercice").innerHTML = data.LABEL_2;
				document.querySelector("#lien_mentions").innerHTML = data.LABEL_3;


				/* *********************************** */
				/* @var : boutons_exercice             */
				/* en : Buttons of the exercise        */
				/* fr : Boutons de l'exercice          */
				/* *********************************** */

				var boutons_exercice = "<button type=\"button\" id=\"bouton_inserer\"\
				 disabled>"+ data.BTN_INSERER + "</button>\
				&nbsp;<button type=\"button\" id=\"bouton_aide\">\
				"+ data.BTN_AIDE + "</button>\
				&nbsp;<button type=\"button\" id=\"bouton_corriger\">\
				"+ data.BTN_CORRIGER +"</button>\
				&nbsp;<button type=\"button\" id=\"bouton_solution\">\
				"+ data.BTN_SOLUTION +"</button>";

				document.querySelector("#boutons").innerHTML = boutons_exercice;

				/* ********************************************** */
				/* en : Labels for each section                   */
				/* fr : étiquettes de chaque section              */
				/* ********************************************** */

				document.querySelector("#section_2>h2").innerHTML = data.LABEL_4;
				document.querySelector("#section_3>h2").innerHTML = data.LABEL_5;
				document.querySelector("#intro_auteur").innerHTML = data.LABEL_6;
				document.querySelector("#intro_prof").innerHTML = data.LABEL_7;

				/* ************************************************************ */
				/* @event : click                                               */
				/* en : dealing with the HELP button                            */
				/* fr : Gestion du bouton AIDE                                  */
				/* @var : bouton_aide                                           */
				/* en : the HELP_button ID                                      */
				/* fr : Identification du bouton AIDE                           */
				/* @param : e                                                   */
				/* en : the event                                               */
				/* fr : cet événemeent                                          */
				/* ************************************************************ */

				var bouton_aide = document.querySelector("#bouton_aide");
					bouton_aide.addEventListener('click', function(e) {
						notifier(infos[1],'info');
						// On empêche l'action par défaut
						e.preventDefault();
				});

				/* ************************************************************ */
				/* @event : click                                               */
				/* en : dealing with the CORRECTING button                      */
				/* fr : Gestion du bouton CORRIGER                              */
				/* @var : bouton_corriger                                       */
				/* en : the CORRECTING_button ID                                */
				/* fr : Identification du bouton CORRIGER                       */
				/* @param : e                                                   */
				/* en : the event                                               */
				/* fr : cet événemeent                                          */
				/* ************************************************************ */

				var bouton_corriger = document.querySelector("#bouton_corriger");
				bouton_corriger.addEventListener('click', function(e) {
					echo.saisie = document.querySelector("#texte").textContent;
					if (echo.saisie.length > 0) {
						var ma_correction = echo.corrige();
						if (ma_correction != -1 ) {
							document.querySelector("#correction").innerHTML = ma_correction;
							document.querySelector("#section_2").style.display = "block"; // texte corrigé
							document.querySelector("#section_1_bis").style.display = "none"; // éditeur de texte
							document.querySelector("#section_4").style.display = "block"; // bouton recommencer...
						}
					}
					else {
						notifier(erreurs[2], 'erreur');
					}
					// On empêche l'action par défaut
					e.preventDefault();
				});

				/* ************************************************************ */
				/* @event : click                                               */
				/* en : dealing with the SOLUTION button                        */
				/* fr : Gestion du bouton SOLUTION                              */
				/* @var : bouton_solution                                       */
				/* en : the SOLUTION_button ID                                  */
				/* fr : Identification du bouton SOLUTION                       */
				/* @param : e                                                   */
				/* en : the event                                               */
				/* fr : cet événemeent                                          */
				/* ************************************************************ */

				var bouton_solution = document.querySelector("#bouton_solution");
				bouton_solution.addEventListener("click", function(e) {
			      document.querySelector("#solution").innerHTML = echo.affiche();
			      document.querySelector("#section_3").style.display = 'block'; // Solution
			      document.querySelector("#section_1_bis").style.display = 'none'; // éditeur de texte
			      document.querySelector("#section_2").style.display = 'none'; // correction
						document.querySelector("#section_4").style.display = 'block'; // bouton recommencer...
						// On empêche l'action par défaut
				    e.preventDefault();
				});


				/* *************************************** */
				/* @var : boutons_spec                     */
				/* en : Buttons of the special caracters   */
				/* fr : Boutons des caractères spéciaux    */
				/* *************************************** */

				var boutonSpec = document.querySelectorAll("li.spec");
				var lesAutresSpecs = document.querySelectorAll("li.spec");

				/* ********************************************************************** */
				/* @event : click                                                         */
				/* en : Dealing with click event on all the special caracters             */
				/* fr : On gère les événements click() de la collection des caractères    */
				/*			spéciaux.                                                         */
				/* @param : e                                                             */
				/* en : the event                                                         */
				/* fr : cet événemeent                                                    */
				/* ********************************************************************** */

				for (var i=0; i < boutonSpec.length; i++) {

					boutonSpec[i].onclick = function(e) {
						/* en : We get the text of the cell:        */
						/* fr : On récupère le texte de la cellule: */

						carActif = e.target.textContent;
						document.querySelector("#car_sel").innerHTML = carActif + "&nbsp;";
						texteActif = false;
						// On empêche l'action par défaut
						e.preventDefault();
					}
				}


				/* ************************************************************ */
				/* @event : Click                                               */
				/* en : When somedy click on |bouton_inserer|                   */
				/* fr : Qd on clique sur le bouton insérer                      */
				/* @param : e                                                   */
				/* en : the event                                               */
				/* fr : cet événemeent                                          */
				/* ************************************************************ */

				document.querySelector("button#bouton_inserer").addEventListener("click", function(e) {
					insererCar(carActif);
					carActif = undefined;
					document.querySelector("#car_sel").innerHTML = "&nbsp;&nbsp;";
					e.target.style.backgroundColor = "white";
					e.target.style.cursor = "not-allowed";
					e.target.disabled = "disabled";
					e.preventDefault();
				});

				document.querySelector("button#bouton_inserer").addEventListener("mouseover", function(e) {
					if (carActif !== undefined) {
						e.target.disabled = "";
						e.target.style.cursor = "copy";
					}
					e.preventDefault();
				});

			}
		}
	}

	/* ************************************************************************ */
	/* @function : insertion()                                                  */
	/* en : Put the param into the text area in the current place of the text   */
	/* 			cursor.                                                             */
	/* fr : Insère le paramètre dans la zone de texte à l'emplacement courant   */
	/*			du curseur de texte.                                                */
	/* @param : car                                                             */
	/* en : the texte (special caracter or HTML entity) to put into             */
	/* fr : le texte (caractère spécial ou entité HTML) à insérer               */
	/* ************************************************************************ */

	function insererCar(car) {
		var sel, range, html;
		if (texteActif === false || carActif === undefined) {
			document.querySelector("#bouton_aide").click();
			return false;
		}
    sel = window.getSelection();
    range = sel.getRangeAt(0);
    range.deleteContents();
    var textNode = document.createTextNode(car);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    sel.removeAllRanges();
    sel.addRange(range);

		texteActif = false;
		carActif = false;
  }

	function keyHandle(evt) {
    key = evt.keyCode;
    switch(key) {
        case 9: //Tab
            insererCar('\t');
            evt.preventDefault();
            break
        case 13: //Enter
            insererCar('\n');
            evt.preventDefault();
            break
    }
 }

	/* ********************************************* */
	/* @event : focus                                */
	/* en : when somebody click into the texte area  */
	/* fr : quand on clique dans la zone de texte    */
	/* ********************************************* */

	document.querySelector("#texte").addEventListener("focus", function(e) {
		get_focus(e);
	}, true);

	function get_focus(e) {
		texteActif = true;
		if (carActif !== undefined) {
			document.querySelector("button#bouton_inserer").style.backgroundColor = "lightgreen";
			document.querySelector("button#bouton_inserer").style.cursor = "copy";
			document.querySelector("button#bouton_inserer").disabled = "";
		}
		e.target.addEventListener("keyUp", function() {
			keyHandle(evt);
		});
		e.preventDefault();
	}

/* en : calling the charger_traduction method of the oTraduction object
   fr : on appelle la traduction pour la langue : lang */

	charger_traduction(lang);


	/* ********************************************************************* */
	/* @function : corrige()                                                 */
	/* en : do the correction of the texte by a diff between the right text  */
	/* 			and the studient one.                                            */
	/* fr : effectue la correction du texte en comparant le texte saisi avec */
	/* 			le texte de référence                                            */
	/* @return : string                                                      */
	/* en : the text with bad words in red color and corrected ones in green */
	/* fr : le texte erroné en rouge et les passage corrects en vert         */
	/*                                                                       */
	/* !!! en : this function must be called here due to the use of the      */
	/* 'notifier' function.                                                  */
	/* !!! fr : Ce prototype doit être déclaré ici car il utilise la         */
	/* fonction 'notifier'.                                                  */
	/* ********************************************************************* */

	oEcho.prototype.corrige = function() {
		if ( this.saisie.length > 0 ) {
			// On compare le texte saisi au texte de référence :
			var sortie = diffString(this.saisie, this.correction);
			// On remplace les retours à la ligne par le code HTML :
			var reg = new RegExp ( /\n/g );
			return sortie.replace(reg,"<br />");
		}
		else {
			notifier(erreurs[1],"erreur");
			return -1;
		}
	}

	/* ********************************************** */
	/* en : blocks to display or to hide at begining  */
	/* fr : Affichage ou masquage des blocs au début  */
	/* ********************************************** */

	// Tabs & sections / Onglets et sections
	document.querySelector(tous_les_onglets[1]).style.display = 'none';
	document.querySelector(tous_les_onglets[2]).style.display = 'none';
	document.querySelector(tous_les_onglets[0]).style.display = 'block';
	document.querySelector(tous_les_liens[0]).classList.add("focus");

  // We hide the notification area / on masque la zone de notification
  document.querySelector("#notifications").style.display = "none";


	/* ********************************************************************* */
	/* @function : action()                                                  */
	/* en : if the Confirm response is YES                                   */
	/* fr : si la confirmation est OUI                                       */
	/* ********************************************************************* */

  oReponse.prototype.action = function() {
    if (this.value == true) {
      document.querySelector("#texte").textContent = echo.texte;
      document.querySelector("#section_2").style.display = 'none'; // correction
      document.querySelector("#section_3").style.display = 'none'; // solution
      document.querySelector("#section_1_bis").style.display = 'block'; // éditeur
      document.querySelector("#section_4").style.display = 'none'; // bouton recommencer...
      document.querySelector("#notifications").style.display = 'none';
    }
  }



	/* ********************************************************************* */
	/* @function : notifier()                                                */
	/* en : displaying notifications / Confirm dialogs                       */
	/* fr : Affichage des notifications / des dialogues de confirmation      */
	/* @var : msg                                                            */
	/* en : the message to display                                           */
	/* fr : Le message à afficher                                            */
	/* @var : type  {info, erreur, confirmation}                             */
	/* en : the kind of message                                              */
	/* fr : le type de message                                               */
	/* ********************************************************************* */

  function notifier(msg, type) {
    document.querySelector("#notifications").style.display = "block";
    document.querySelector("div.bandeau").style.display = 'block';
    document.querySelector("div.message").innerHTML = msg;

    if (type !== undefined) {
      switch(type){
        case 'info':
          document.querySelector("#notifications").style.backgroundColor = "lightblue";
          document.querySelector("div.confirmation").style.display = "none";
        break;
        case 'erreur':
          document.querySelector("#notifications").style.backgroundColor = 'red';
          document.querySelector("div.confirmation").style.display = "none";
        break;
        case 'confirmation':
          document.querySelector("#notifications").style.backgroundColor = 'lightblue';
          document.querySelector("div.confirmation").style.display = "block";
          document.querySelector("div.bandeau").style.display = 'none';
        break;
        default:
      }
    }

  }

	/* ********************************************************************* */
	/* @function : demander_fichier()                                        */
	/* en : getting the JSON Dataset File with an Ajax Request               */
	/* fr : pour obtenir le fichier de données dans une requête Ajax         */
	/* @param : url                                                          */
	/* en : The path of the JSON Dataset file                                */
	/* fr : chemin du fichier de données JSON                                */
	/* ********************************************************************* */

	function demander_fichier_donnees(url) {
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      requeteHTTP = new XMLHttpRequest();
    }
    if (!requeteHTTP) {
      notifier(erreurs[2],'erreur');
      return false;
    }
    requeteHTTP.onreadystatechange = traiter_les_donnees;
    requeteHTTP.open('GET', url);
    requeteHTTP.send();
  }

	/* ************************************************************************ */
	/* @function : traiter_les_donnees()                                        */
	/* en : Returns an object from the JSON Dataset file content                */
	/* 			and populate the UI with these data strings using the oEcho object  */
	/* fr : Retourne un objet à partir des données issues du fichier JSON       */
	/*			et diffuse ces chaines de données dans l'interface utilisateur      */
	/* 			au moyen de l'objet oEcho.                                          */
	/* @var source :                                                            */
	/* en : the content from the file before parsing to an object               */
	/* fr : le contenu du fichier avant sa conversion en objet                  */
	/* ************************************************************************ */

  function traiter_les_donnees() {
    if (requeteHTTP.readyState === 4) { // if(1)
      if (requeteHTTP.status === 200) { // if(2)
        var source = requeteHTTP.responseText;
        var data = JSON.parse(source);
        if (data.app_name !== undefined && data.app_name === 'jecho') { // if(3)
					echo.prof = data.prof;
					echo.titre = data.titre;
					echo.texte = data.texte;
					echo.correction = data.correction;
					echo.auteur = data.auteur;
					echo.ouvrage = data.ouvrage;
					echo.consigne = data.consigne;

					/* ************************************************************ */
					/* en : The labels of the UI are updated                        */
					/* fr : On actualise les étiquettes à afficher dans l'interface */
					/* ************************************************************ */
					document.querySelector("#titre_principal").textContent = echo.titre;
          document.querySelector("#prof").textContent += echo.prof;
          document.querySelector("#consigne").textContent = echo.consigne;
          document.querySelector("#ouvrage").textContent = echo.ouvrage;
          document.querySelector("#auteur").textContent = echo.auteur;
					/* en : Text area : has a 'value' proprerty */
					/* fr : La Zone de texte a une propriété 'value' */
          document.querySelector("#texte").textContent = echo.texte;

        }
        else {
          notifier(erreurs[3],'erreur');
        }
        // end / fin :  if-else(3)
      }
			else {
        notifier(erreurs[0],'erreur');
      }
      // end / fin : if-else (2)
    }
    // end / fin : if(1)
  }

	/* ********************************************** */
	/* en : We load the Dataset                       */
	/* fr : On charge les données de l'exercice       */
	/* ********************************************** */

	demander_fichier_donnees(urlFichierDonnees);

	/* ********************************************** */
	/* en : We hide the correcting area               */
	/* fr : On masque la section de correction        */
	/* ********************************************** */

  document.querySelector("#section_2").style.display = 'none';

	/* ********************************************** */
	/* en : We hide the SOLUTION area                 */
	/* fr : On masque la section de SOLUTION          */
	/* ********************************************** */

  document.querySelector("#section_3").style.display = 'none';

	/* ********************************************** */
	/* en : We hide the "Go back the begining" Button */
	/* fr : On masque le bouton "RECOMMENCER"         */
	/* ********************************************** */

  document.querySelector("#section_4").style.display = 'none';


	/* ************************************************************ */
	/* @event : click                                               */
	/* en : hiding the notification area                            */
	/* fr : Masquage de la notification                             */
	/* @var : notif                                                 */
	/* en : the notification ID area                                */
	/* fr : Identification de la zone de notification               */
	/* @param : e                                                   */
	/* en : the event                                               */
	/* fr : cet événemeent                                          */
	/* ************************************************************ */

		var notif = document.querySelector("#notifications > div.bandeau");
    notif.onclick = function(e) {
      notif.parentNode.style.display = "none";
      e.preventDefault();
    };

		/* ************************************************************ */
		/* @event : click                                               */
		/* en : dealing with the OK button in Confirm dialog            */
		/* fr : Gestion de la réponse OUI dans le dialogue de           */
		/* 			confirmation.                                           */
		/* @var : bouton_ok                                             */
		/* en : the OK_button ID                                        */
		/* fr : Identification du bouton OUI                            */
		/* @param : e                                                   */
		/* en : the event                                               */
		/* fr : cet événemeent                                          */
		/* ************************************************************ */

    var bouton_ok = document.querySelector("button#ok");
    bouton_ok.onclick = function(e) {
      var ma_reponse = new oReponse;
      ma_reponse.value = true;
      ma_reponse.action();
      e.preventDefault();
    };

		/* ************************************************************ */
		/* @event : click                                               */
		/* en : dealing with the CANCEL button in Confirm dialog        */
		/* fr : Gestion de la réponse NON dans le dialogue de           */
		/* 			confirmation.                                           */
		/* @var : bouton_cancel                                         */
		/* en : the cancel_button ID                                    */
		/* fr : Identification du bouton NON                            */
		/* @param : e                                                   */
		/* en : the event                                               */
		/* fr : cet événemeent                                          */
		/* ************************************************************ */

		var bouton_cancel = document.querySelector("#cancel");
    bouton_cancel.onclick = function(e) {
      document.querySelector("#notifications").style.display = 'none';
      e.preventDefault();
    };



		/* ************************************************************ */
		/* @event : click                                               */
		/* en : dealing with the GO BACK THE BEGINING button            */
		/* fr : Gestion du bouton RECOMMENCER                           */
		/* @var : bouton_recommencer                                    */
		/* en : the GO BACK THE BEGINING_button ID                      */
		/* fr : Identification du bouton RECOMMENCER                    */
		/* @param : e                                                   */
		/* en : the event                                               */
		/* fr : cet événemeent                                          */
		/* ************************************************************ */

		var bouton_recommencer = document.querySelector("button#recommencer");
		bouton_recommencer.onclick = function(e) {
      notifier(confirmations[1],'confirmation');
			// On empêche l'action par défaut
      e.preventDefault();
		};

		/* ************************************************************ */
		/* @event : click                                               */
		/* en : dealing with the GO ON button                           */
		/* fr : Gestion du bouton REPRENDRE                             */
		/* @var : bouton_reprendre                                      */
		/* en : the GO ON_button ID                                     */
		/* fr : Identification du bouton REPRENDRE                      */
		/* @param : e                                                   */
		/* en : the event                                               */
		/* fr : cet événemeent                                          */
		/* ************************************************************ */

		var bouton_reprendre = document.querySelector("button#reprendre");
		bouton_reprendre.onclick = function(e) {
      document.querySelector("#section_2").style.display = 'none'; // correction
      document.querySelector("#section_3").style.display = 'none'; // solution
      document.querySelector("#section_1_bis").style.display = 'block'; // éditeur
      document.querySelector("#section_4").style.display = 'none'; // bouton recommencer...
			// On empêche l'action par défaut
      e.preventDefault();
		};

		/* ************************************************************ */
		/* @event : click                                               */
		/* en : dealing with the INSTRUCTIONS tab                       */
		/* fr : Gestion de l'onglet CONSIGNE                            */
		/* @param : e                                                   */
		/* en : the event                                               */
		/* fr : cet événemeent                                          */
		/* ************************************************************ */

		document.querySelector("#lien_consigne").onclick = function(e) {
				/* en : We hide the other sections under each other tab */
				/* fr : On masque les sections sous les autres onglets */
				document.querySelector(tous_les_onglets[1]).style.display = 'none';
				document.querySelector(tous_les_liens[1]).classList.remove("focus");
				document.querySelector(tous_les_onglets[2]).style.display = 'none';
				document.querySelector(tous_les_liens[2]).classList.remove("focus");
				document.querySelector(tous_les_onglets[0]).style.display = 'block';
				this.classList.add("focus");
				e.preventDefault();
		};

		/* ************************************************************ */
		/* @event : click                                               */
		/* en : dealing with the EXERCISE tab                           */
		/* fr : Gestion de l'onglet EXERCICE                            */
		/* @param : e                                                   */
		/* en : the event                                               */
		/* fr : cet événemeent                                          */
		/* ************************************************************ */

		document.querySelector("#lien_exercice").onclick = function(e) {
			/* en : We hide the other sections under each other tab */
			/* fr : On masque les sections sous les autres onglets */
			document.querySelector(tous_les_onglets[0]).style.display = 'none';
			document.querySelector(tous_les_liens[0]).classList.remove("focus");
			document.querySelector(tous_les_onglets[2]).style.display = 'none';
			document.querySelector(tous_les_liens[2]).classList.remove("focus");
			document.querySelector(tous_les_onglets[1]).style.display = 'block';
			this.classList.add("focus");
			e.preventDefault();
		};

		/* ************************************************************ */
		/* @event : click                                               */
		/* en : dealing with the LEGAL tab                              */
		/* fr : Gestion de l'onglet MENTIONS                            */
		/* @param : e                                                   */
		/* en : the event                                               */
		/* fr : cet événemeent                                          */
		/* ************************************************************ */

		document.querySelector("#lien_mentions").onclick = function(e) {
			/* en : We hide the other sections under each other tab */
			/* fr : On masque les sections sous les autres onglets */
			document.querySelector(tous_les_onglets[0]).style.display = 'none';
			document.querySelector(tous_les_liens[0]).classList.remove("focus");
			document.querySelector(tous_les_onglets[1]).style.display = 'none';
			document.querySelector(tous_les_liens[1]).classList.remove("focus");
			document.querySelector(tous_les_onglets[2]).style.display = 'block';
			this.classList.add("focus");
			e.preventDefault();
		};

});

/* en : End of the main event Listener */
/* Fin du gestionnaire de l'événement principal */

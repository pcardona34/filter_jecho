/*
 * begin.js
 *
 * ( c ) 2012-2015 Patrick Cardona
 * Jecho - version 1.3.0 - AMB Project
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
 * Fonctions chargées au début du fichier
 */

	// Notifications
		function generate(type, text) {
			var n = noty({
				text        : text,
				type        : type,
				dismissQueue: false,
				layout      : 'top',
				theme       : 'relax'
			});
			console.log(type + ' - ' + n.options.id);
			return n;
		}

		// Caractères spéciaux
		function insertion(car) {
			var input = document.forms['formulaire'].elements['texte'];
			input.focus();

			if(typeof input.selectionStart != 'undefined')
			{
			// Insertion du code
			var start = input.selectionStart;
			var end = input.selectionEnd;
			var insText = input.value.substring(start, end);
			input.value = input.value.substr(0, start) + car + input.value.substr(end);
			// Ajustement de la position du curseur
			var pos;
			pos = start + car.length;
			input.selectionStart = pos;
			input.selectionEnd = pos;
			}
		}

    // Gestion des exceptions
    function traceErreur(message) {
      this.message = message;
      this.nom = "Exception";
    }

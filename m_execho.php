<?php

require_once(dirname(__FILE__) . '/../../config.php');

global $CFG;
require_once($CFG->libdir . '/moodlelib.php');

?>

<html lang="fr">

	<head>
		<meta charset="utf-8">

		<title>Exercice</title>

		<script src="//code.jquery.com/jquery-1.10.2.js"></script>
		<!-- API JQuery de gestion de l'interface -->
		<script src="//code.jquery.com/ui/1.11.3/jquery-ui.js"></script>
		<!-- CSS -->
		<link href="//code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css" type="text/css" rel="stylesheet" />
		<!-- CSS partagée : dictée + générateur -->
		<link href="css/carspec.css" type="text/css" rel="stylesheet" />
		<!-- CSS de l'exercice -->
		<link href="css/execho.css" rel="stylesheet" type="text/css" />

		<script src="js/begin.js"></script>
		<script>
		// Onglets
		$(function() {
			$( "#tabs" ).tabs();
		});
		</script>

	</head>

	<body>

	<!-- Si Javascript n'est pas autorisé ou supporté... -->
	<noscript>
		<p><?php echo get_string('withoutjs', 'filter_jecho') ?></p>
	</noscript>


	<!-- Corps de l'appli -->
		<div>
			<h1 id="titre_principal">Titre de l'exercice</h1>
		</div>

		<div id="notifications">
			<p id="aidespecars"><?php echo get_string('helpspecars', 'filter_jecho') ?>&nbsp;&nbsp;&otimes;</p>
		</div>

		<div id="tabs">
			<ul>
				<li><a href="#tabs-1"><?php echo get_string('instructions', 'filter_jecho') ?></a></li>
				<li><a href="#tabs-2"><?php echo get_string('exercise', 'filter_jecho') ?></a></li>
				<li><a href="#tabs-3"><?php echo get_string('legalnotice', 'filter_jecho') ?></a></li>
			</ul>
			<div id="tabs-1">
				<div id="section_1">
					<div id="consigne">
						&nbsp;
					</div>

				</div>
			</div>
			<div id="tabs-2">
				<div id="section_1_bis">
					<!-- Formulaire de saisie du texte de l'exercice -->


					<form name="formulaire">

						<table id="table_spec">
							<tr class="entete">
								<td class="spec">«</td>
								<td class="spec">—</td>
								<td class="spec">»</td>
								<td class="spec">&hellip;</td>
								<td class="spec">œ</td>
								<td class="spec">Œ</td>
								<td class="spec">É</td>
								<td class="spec">À</td>
								<td>
									<input id="afficheraidespecars" type="submit" value="<?php echo get_string('help', 'filter_jecho') ?>" />
									&nbsp;<input id="affichercorrection" type="submit" value="<?php echo get_string('correctthetext', 'filter_jecho') ?>" />
									&nbsp;<input id="affichersolution" type="submit" value="<?php echo get_string('displaythesolution', 'filter_jecho') ?>" />
									</td>
								</tr>
								<tr><td colspan="9"><textarea id="texte" name="texte" cols="80" rows="10"></textarea></td></tr>
						</table>

					</form>
				</div>


			<!-- Annexes -->

			<div id="section_4">
				<form>
					<input type="submit" id="reprendre" value="<?php echo get_string('keepon', 'filter_jecho') ?>" class="reprendre" />
					&nbsp;&nbsp;&nbsp;
					<input type="submit" id="recommencer" value="<?php echo get_string('startagain', 'filter_jecho') ?>" class="recommencer" />
				</form>
			</div>

				<div id="section_2">
					<h2><?php echo get_string('puttingright', 'filter_jecho') ?></h2>
					<div id="correction">Ici, texte corrigé</div>
				</div>

				<div id="section_3">
					<h2><?php echo get_string('theaccuratetext', 'filter_jecho') ?></h2>
					<div id="solution">Ici, solution</div>
				</div>





			</div>
			<div id="tabs-3">
				<p><?php echo get_string('by', 'filter_jecho') ?> <span id="auteur"><?php echo get_string('anonymous', 'filter_jecho') ?></span>, <span id="ouvrage">?</span>.</p>
				<p id="prof"><?php echo get_string('exercisedesignedby', 'filter_jecho') ?></p>

		</div>


	<!-- Chargement optimisé des librairies Javascript en fin de page -->
	<!-- Lib JavaScript génériques ou partagées : dictée + générateur -->


	<script src="js/jquery.noty.packaged.js"></script>


		<!-- Lib liées à cette page -->
	<script src="js/jsdiff.js"></script>

		<!-- Scripts liés à cette page -->
	<script src="js/execho.js"></script>

		<!-- Version interface adaptée à Moodle -->
		<script src="js/m_interface.js"></script>
	</body>
</html>

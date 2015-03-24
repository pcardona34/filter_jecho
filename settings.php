<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

$LANGUAGES = array(
    	'cat' => 'catala',
    	'de' => 'Deutsh',
    	'en' => 'English',
    	'es' => 'castellano',
    	'fr' => 'français',
    	'it' => 'italiano'
    	);

$settings->add(new admin_setting_configselect(
	'filter_jecho_lang',
	get_string('lang', 'filter_jecho'),
	get_string('lang_desc_global', 'filter_jecho'),
	'en',
	$LANGUAGES
	));

?>

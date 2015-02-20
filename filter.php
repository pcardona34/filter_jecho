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


/* __________________________________________________________________________
 *
 * Jecho filter for Moodle 2.x
 *
 * This filter will replace any links to a Jecho file (jecho.json)
 * with a execho.html file that presents that exercise.
 *
 * @package    filter
 * @subpackage jecho
 * @copyright  2015 Patrick Cardona
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * __________________________________________________________________________
 */


/* __________________________________________________________________________
 *
 *
 * Jecho 1.3 License
 *
 * Copyright (c) 2012-2015 Patrick Cardona
 *
 * __________________________________________________________________________
 */
 // Jecho is free software: you can redistribute it and/or modify
 // it under the terms of the GNU General Public License as published by
 // the Free Software Foundation, either version 3 of the License, or
 // (at your option) any later version.
 //
 // Jecho is distributed in the hope that it will be useful,
 // but WITHOUT ANY WARRANTY; without even the implied warranty of
 // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 // GNU General Public License for more details.
 //
 // You should have received a copy of the GNU General Public License
 // along with Moodle.  If not, see <http://www.gnu.org/licenses/>.




defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir.'/filelib.php');

class filter_jecho extends moodle_text_filter {

    function filter($text, array $options = array()) {
        global $CFG, $PAGE;

        if (!is_string($text)) {
            // non string data can not be filtered anyway
            return $text;
        }

        $newtext = $text; // fullclone is slow and not needed here

        $search = '/<a.*?href="([^<]+jecho\.json)"[^>]*>.*?<\/a>/is';
        $newtext = preg_replace_callback($search, 'filter_jecho_callback', $newtext);

        if (is_null($newtext) or $newtext === $text) {
            // error or not filtered
            return $text;
        }

        return $newtext;
    }
}


function filter_jecho_callback($link) {
    global $CFG;

    $url = $link[1];
    $execho = $CFG->wwwroot . '/filter/jecho/m_execho.php?urljson=' . $url;
    $html = '<iframe width="900" height="500" src="'.$execho.'">'.get_string('iframeloaderror','filter_jecho').'</iframe>';

    //$html = require_once($execho_relative_url . $relative_url);
    //$html = require_once("//localhost:8888/moodle28/filter/jecho/execho/m_execho.php?urljson=//localhost:8888/moodle28/pluginfile.php/53/mod_page/content/1/jecho.json");

    return $html;
}

?>

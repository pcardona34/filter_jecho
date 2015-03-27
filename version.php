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
 * Jecho filter for Moodle 2.8+
 *
 * This filter will replace any links to a Jecho file (jecho.json)
 * with a jecho/view.html file that display that exercise.
 *
 * @package    filter_jecho
 * @copyright  2015, Patrick Cardona <pcardona34@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 * __________________________________________________________________________
 */

defined('MOODLE_INTERNAL') || die();

$plugin->version = 2015032401;
$plugin->requires = 2014111000; // Moodle 2.8 is required
$plugin->cron = 0;
$plugin->component = 'filter_jecho'; // Declare the type and name of this plugin.
$plugin->maturity = MATURITY_STABLE; // This is considered as ready for production sites.
$plugin->release = 'v3.0.1'; // Release of the filter based on Jecho 3rd release.
$plugin->dependencies = array(
// none
);


?>

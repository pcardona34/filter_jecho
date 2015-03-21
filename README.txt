Jecho filter for Moodle - (C) 2015 - Patrick Cardona

A - Introduction
================
This filter allows to run inside the Moodle course platform every data files
 in JSON format created with the JDicto generator.
Allowing just display-type exercises of "rewriting"
(Jecho or Execho).

Note:
---------
Dictations are not yet supported in this first version
  filter.

B - Jecho Filter Installation for Moodle
============================================
This filter has been tested on version 2.8 of Moodle.

1- Login to Moodle with the admin account.

2- In the "Administration", unfold the "Site Administration" menu.

3. Unfold the menu "plugins" and select the "install plugins".

4- In the form "Install the plugin from a zip"
4.1- Select from the list "type plugin" "text filter (filter)"
4.2- In "Zip Package", click the [choose a file] and
select the "jecho.zip" file that contains the filter.
4.3- Check the "Receipt" option to indicate that You assume the risk.
4.4- Click on the button [Install the plugin from the zip file].

5- plugin package validation window is displayed.

6. Click the button [Install the plugin!]

7. On the next page, click the button
[Update database now]

8. After the success message, click the button [Continue]

C - filter activation
========================
1- In the "Administration", unfold the "Site Administration" menu.

2. Unfold the "plugins" menu, then "filters" and display the page:
"Filter management".

3. In the list of installed filters in the column "active?" on line
filter "jecho filter" down the list and select "on".

D - Filter test
==================
1- Create or retrieve a data file of the generated rewrite exercise
through JDicto:
http://pcardona34.github.io/jdicto/

2. Rename the data file: jecho.json and keep on the desktop,
for example.

1- Create / display a Moodle course.

2. Switch to "edit" mode: [Turn editing]

3- Add Resource "page" through the "Add an activity or
resource ": Resources / Page, then [Add].

In the form of the page:
3.1 Give as "name" the desired title for the exercise.
3.2 In the content of the page, enter the word "exercise", and select the
click in the toolbar on the [Link] ...
3.3- In the dialog "Link", click the button:
[Browse repositories], then in the "file selector" button:
[Look over] ...
Select from the workstation the data file "jecho.json" and
click on [Place this file].
3.4- At the bottom of the edit current page, click the button
[Save and display]

If all went well, the exercise of rewriting is displayed.

E - Current use of the filter
==================================
Follow the steps in Section D to add an exercise of rewriting
to your course.

F - Translation of the exercise
============================
The exercise interface is available in:
- Catalan (cat)
- German (de)
- English (en)
- Spanish (es)
- French (fr)
- Italian (it)

To select the default language, use the global settings
filter in the administration of plugins:
Admin. > Plugins > Filters > manage filters > jecho filter > Settings

To set a different language within a course, adapt the
filter parameters in the current course :
Course > Settings > Filters > Filter jecho > Settings

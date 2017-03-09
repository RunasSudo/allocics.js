/*
    allocics.js - One-click export of Allocate+ timetables to ICS format
    Copyright © 2017  RunasSudo (Yingtong Li)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

if (window.location.hostname.indexOf('github.io') >= 0) {
	window.alert('Drag the link to your bookmarks bar; don\'t click it.');
} else {
	// Load the main implementation
	var impl = document.createElement('script');
	impl.src = 'https://runassudo.github.io/allocics.js/allocics.js';
	document.body.appendChild(impl);
}

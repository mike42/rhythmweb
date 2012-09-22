/*
 Rhythmweb - a web site for your Rhythmbox.
 GTK3 port to work with v2.96 Rhythmbox
 Copyright (c) 2012 fossfreedom and Taylor Raack
 This program is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; either version 2 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

function Rhythmweb() {
	
	var toggleShuffleEl;
	var toggleRepeatEl;
	
	var reloadWindow = function(data) {
		// some data has changed on the page
		// TODO - reload the page via ajax entirely rather than rebuilding all html
		
		// reload page after 200ms, to ensure that new track has started playing
		setTimeout(function() {document.location.reload();}, 200);
	};
	
	var post = function(params, reload) {
		$.post('/', params, function() { if(reload) { reloadWindow(); }});
	};
	
	var play = function() {
		post({'action':'play'}, true);
	};
	
	var previousTrack = function() {
		post({'action':'prev'}, true);
	};
	
	var nextTrack = function() {
		post({'action':'next'}, true);
	};
	
	var volumeUp = function() {
		post({'action':'vol-up'});
	};
	
	var volumeDown = function() {
		post({'action':'vol-down'});
	};
	
	var toggleShuffle = function() {
		post({'action':'toggle-shuffle'});
		
		// change active flag
		toggleShuffleEl.toggleClass('active');
	};
	
	var toggleRepeat = function() {
		post({'action':'toggle-repeat'});
		
		// change active flag
		toggleRepeatEl.toggleClass('active');
	};
	
	var addTrackTableClickHandlers = function() {
		// add click handlers to all table elements, current and future
		var agent = navigator.userAgent.toLowerCase();
		if(agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0){
			// register double tap handler, but don't use the single tap handler as it's broken
			$('#playlist tr').doubletap(
			    handleTrackDoubleClicked,
			    null,
			    300
			);
			
			// install single tap handler
			$('#playlist tr').live('touchend', handleTrackClicked);
		}
		else {
			// non mobile safari - use standard jquery click handlers
			$('#playlist tr').live('click', handleTrackClicked);
			$('#playlist tr').live('dblclick', handleTrackDoubleClicked);
		}
	};
	
	var handleTrackClicked = function(event) {
		var tr = $(event.currentTarget);
		
		// remove previous selection
		$('#playlist tr').removeClass('selected');
		
		// select the track row
		tr.addClass('selected');
	};
	
	var handleTrackDoubleClicked = function(event) {
		post({'action':'play-track','track':event.currentTarget.id}, true);
	};
	
	var alternateTrackTableRowColors = function() {
		$('#playlist tr:even').addClass('alt');
	};
	
	var initialize = function() {
		toggleShuffleEl = $('#toggle-shuffle');
		toggleRepeatEl = $('#toggle-repeat');
		
		$('#play').click(play);
		$('#previous-track').click(previousTrack);
		$('#next-track').click(nextTrack);
		$('#volume-up').click(volumeUp);
		$('#volume-down').click(volumeDown);
		toggleShuffleEl.click(toggleShuffle);
		toggleRepeatEl.click(toggleRepeat);
		
		addTrackTableClickHandlers();
		
		alternateTrackTableRowColors();
	};

	initialize();
}


$(document).ready(function() {
	new Rhythmweb();
});

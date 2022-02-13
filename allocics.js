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

(function () {
	// Sanity checks
	if (typeof (timetableInit) === "undefined") {
		alert('This doesn\'t seem to be an Allocate+ page. Please log in to Allocate+ before clicking the bookmark.');
		return;
	}

	// Initialise the timetable if necessary
	if (!timetableInit) {
		initTimetable();
	}

	// Switch to the timetable page
	activityDetailsGoBack("timetable-tpl");

	// Load some dependencies
	/*! @source http://purl.eligrey.com/github/Blob.js/blob/master/Blob.js */
	! function (t) {
		"use strict";
		if (t.URL = t.URL || t.webkitURL, t.Blob && t.URL) try {
			return void new Blob
		} catch (e) {}
		var n = t.BlobBuilder || t.WebKitBlobBuilder || t.MozBlobBuilder || function (t) {
			var e = function (t) {
					return Object.prototype.toString.call(t).match(/^\[object\s(.*)\]$/)[1]
				},
				n = function () {
					this.data = []
				},
				o = function (t, e, n) {
					this.data = t, this.size = t.length, this.type = e, this.encoding = n
				},
				i = n.prototype,
				a = o.prototype,
				r = t.FileReaderSync,
				c = function (t) {
					this.code = this[this.name = t]
				},
				l = "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "),
				s = l.length,
				u = t.URL || t.webkitURL || t,
				d = u.createObjectURL,
				f = u.revokeObjectURL,
				R = u,
				p = t.btoa,
				h = t.atob,
				b = t.ArrayBuffer,
				g = t.Uint8Array,
				w = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;
			for (o.fake = a.fake = !0; s--;) c.prototype[l[s]] = s + 1;
			return u.createObjectURL || (R = t.URL = function (t) {
				var e, n = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
				return n.href = t, "origin" in n || ("data:" === n.protocol.toLowerCase() ? n.origin = null : (e = t.match(w), n.origin = e && e[1])), n
			}), R.createObjectURL = function (t) {
				var e, n = t.type;
				return null === n && (n = "application/octet-stream"), t instanceof o ? (e = "data:" + n, "base64" === t.encoding ? e + ";base64," + t.data : "URI" === t.encoding ? e + "," + decodeURIComponent(t.data) : p ? e + ";base64," + p(t.data) : e + "," + encodeURIComponent(t.data)) : d ? d.call(u, t) : void 0
			}, R.revokeObjectURL = function (t) {
				"data:" !== t.substring(0, 5) && f && f.call(u, t)
			}, i.append = function (t) {
				var n = this.data;
				if (g && (t instanceof b || t instanceof g)) {
					for (var i = "", a = new g(t), l = 0, s = a.length; s > l; l++) i += String.fromCharCode(a[l]);
					n.push(i)
				} else if ("Blob" === e(t) || "File" === e(t)) {
					if (!r) throw new c("NOT_READABLE_ERR");
					var u = new r;
					n.push(u.readAsBinaryString(t))
				} else t instanceof o ? "base64" === t.encoding && h ? n.push(h(t.data)) : "URI" === t.encoding ? n.push(decodeURIComponent(t.data)) : "raw" === t.encoding && n.push(t.data) : ("string" != typeof t && (t += ""), n.push(unescape(encodeURIComponent(t))))
			}, i.getBlob = function (t) {
				return arguments.length || (t = null), new o(this.data.join(""), t, "raw")
			}, i.toString = function () {
				return "[object BlobBuilder]"
			}, a.slice = function (t, e, n) {
				var i = arguments.length;
				return 3 > i && (n = null), new o(this.data.slice(t, i > 1 ? e : this.data.length), n, this.encoding)
			}, a.toString = function () {
				return "[object Blob]"
			}, a.close = function () {
				this.size = 0, delete this.data
			}, n
		}(t);
		t.Blob = function (t, e) {
			var o = e ? e.type || "" : "",
				i = new n;
			if (t)
				for (var a = 0, r = t.length; r > a; a++) Uint8Array && t[a] instanceof Uint8Array ? i.append(t[a].buffer) : i.append(t[a]);
			var c = i.getBlob(o);
			return !c.slice && c.webkitSlice && (c.slice = c.webkitSlice), c
		};
		var o = Object.getPrototypeOf || function (t) {
			return t.__proto__
		};
		t.Blob.prototype = o(new t.Blob)
	}("undefined" != typeof self && self || "undefined" != typeof window && window || this.content || this);

	/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
	var saveAs = saveAs || function (e) {
		"use strict";
		if (typeof e === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
			return
		}
		var t = e.document,
			n = function () {
				return e.URL || e.webkitURL || e
			},
			r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
			o = "download" in r,
			a = function (e) {
				var t = new MouseEvent("click");
				e.dispatchEvent(t)
			},
			i = /constructor/i.test(e.HTMLElement) || e.safari,
			f = /CriOS\/[\d]+/.test(navigator.userAgent),
			u = function (t) {
				(e.setImmediate || e.setTimeout)(function () {
					throw t
				}, 0)
			},
			s = "application/octet-stream",
			d = 1e3 * 40,
			c = function (e) {
				var t = function () {
					if (typeof e === "string") {
						n().revokeObjectURL(e)
					} else {
						e.remove()
					}
				};
				setTimeout(t, d)
			},
			l = function (e, t, n) {
				t = [].concat(t);
				var r = t.length;
				while (r--) {
					var o = e["on" + t[r]];
					if (typeof o === "function") {
						try {
							o.call(e, n || e)
						} catch (a) {
							u(a)
						}
					}
				}
			},
			p = function (e) {
				if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) {
					return new Blob([String.fromCharCode(65279), e], {
						type: e.type
					})
				}
				return e
			},
			v = function (t, u, d) {
				if (!d) {
					t = p(t)
				}
				var v = this,
					w = t.type,
					m = w === s,
					y, h = function () {
						l(v, "writestart progress write writeend".split(" "))
					},
					S = function () {
						if ((f || m && i) && e.FileReader) {
							var r = new FileReader;
							r.onloadend = function () {
								var t = f ? r.result : r.result.replace(/^data:[^;]*;/, "data:attachment/file;");
								var n = e.open(t, "_blank");
								if (!n) e.location.href = t;
								t = undefined;
								v.readyState = v.DONE;
								h()
							};
							r.readAsDataURL(t);
							v.readyState = v.INIT;
							return
						}
						if (!y) {
							y = n().createObjectURL(t)
						}
						if (m) {
							e.location.href = y
						} else {
							var o = e.open(y, "_blank");
							if (!o) {
								e.location.href = y
							}
						}
						v.readyState = v.DONE;
						h();
						c(y)
					};
				v.readyState = v.INIT;
				if (o) {
					y = n().createObjectURL(t);
					setTimeout(function () {
						r.href = y;
						r.download = u;
						a(r);
						h();
						c(y);
						v.readyState = v.DONE
					});
					return
				}
				S()
			},
			w = v.prototype,
			m = function (e, t, n) {
				return new v(e, t || e.name || "download", n)
			};
		if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
			return function (e, t, n) {
				t = t || e.name || "download";
				if (!n) {
					e = p(e)
				}
				return navigator.msSaveOrOpenBlob(e, t)
			}
		}
		w.abort = function () {};
		w.readyState = w.INIT = 0;
		w.WRITING = 1;
		w.DONE = 2;
		w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null;
		return m
	}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content);
	if (typeof module !== "undefined" && module.exports) {
		module.exports.saveAs = saveAs
	} else if (typeof define !== "undefined" && define !== null && define.amd !== null) {
		define("FileSaver.js", function () {
			return saveAs
		})
	}

	// ALLOCATE+ STUFF

	var YEAR = new Date().getFullYear(); // WARNING! May not give the expected result in strange edge-cases

	// Set to all weeks
	timetableAllWeeks();

	var addresses = {
		'BioPRIA': '15 Alliance Lane', //temp
		'Biological Sciences': '25 Rainforest Walk', //temp
		'Biology': '18 Innovation Walk',
		'B-FY': '23 Rainforest Walk', //temp
		'BLTB': '7 Ancora Imparo Way',
		'Boiler House': '22 Research Way', //temp
		'Buildings and Property': '26 & 30 Research Way', //temp
		'CSB': '19 Rainforest Walk', //temp
		'Chemistry': '17 Rainforest Walk',
		'DESP': '36 Scenic Boulevard', //temp
		'EAE': '9 Rainforest Walk', //temp
		'Education': '29 Ancora Imparo Way',
		'Eng-31': '17 College Walk',
		'Eng-33': '19 College Walk',
		'Eng-35': '16 Alliance Lane',
		'Eng-36': '18 Alliance Lane',
		'Eng-37': '17 Alliance Lane',
		'Eng-60': '23 College Walk',
		'Eng-69': '22 Alliance Lane',
		'Eng-72': '14 Alliance Lane',
		'Grounds Workshop': '14 Scenic Boulevard', //temp
		'GCF': '13 Rainforest Walk', //temp
		'Ian Potter': '48 Exhibition Walk', //temp
		'IT': '25 Exhibition Walk', //temp
		'IV-BD': '12 Innovation Walk', //temp
		'JSC': '12 Ancora Imparo Way', //temp
		'JMREC': '50 College Walk', //temp
		'JMREL': '52 College Walk', //temp
		'JMSS': '39 Innovation Walk', //temp
		'LBL': '15 Ancora Imparo Way', //temp
		'LTB': '19 Ancora Imparo Way',
		'Mathematics': '9 Rainforest Walk',
		'Med-A': '37 Rainforest Walk',
		'Med-B': '39 Rainforest Walk',
		'Med-C': '10 Chancellors Walk',
		'Med-D': '35 Rainforest Walk',
		'Med-E': '9 Ancora Imparo Way',
		'Med-F': '26 Innovation Walk',
		'MNHSFT': '33 Innovation Walk', //temp
		'MCN': '151 Wellington Road', //temp
		'Menzies': '20 Chancellors Walk', //temp
		'MBI': '770 Blackburn Road', //temp
		'MCEM': '10 Innovation Walk', //temp
		'MCCC': '62 Beddoe Avenue', //temp
		'MLC': '60 Beddoe Avenue', //temp
		'Sport': '42 Scenic Boulevard', //temp
		'MSDI': '8 Scenic Boulevard', //temp
		'MUARC': '21 Alliance Lane', //temp
		'MUBP': '680-738 Blackburn Road', //temp
		'MPavilion': '26 Ancora Imparo Way', //temp
		'New Horizons': '20 Research Way', //temp
		'Northern Pavilion': '28 Scenic Boulevard', //temp
		'OSL': '22 Rainforest Walk', //temp
		'Performing Arts': '55 Scenic Boulevard', //temp
		'Physics': '10 College Walk', //temp
		'PSC': '54 College Walk', //temp
		'RBH': '49 Scenic Boulevard', //temp
		'SIT': '14 Rainforest Walk', //temp
		'SITDP': '26 Research Way', //temp
		'STRIP1': '15 Innovation Walk', //temp
		'STRIP2': '19 Innovation Walk', //temp
		'STRIP3': '23 Innovation Walk', //temp
		'Woodside': '20 Exhibition Walk', //temp
	};

	// Convert location names to addresses
	// Eg. CL_All-16.Eng-35_220 >> 220 Eng-35, 16 Alliance Lane
	function parseLocation(loc) {
		if (loc.indexOf("Online") >= 0) {
			return "Online"
		}
		console.log("START");
		console.log(loc);
		let tLoc = loc.split(".")[1].split("_");
		console.log(tLoc);
		let address = ''
		try {
			address = ", " + addresses[tLoc[0]]
		} catch {}
		console.log(address);
		return tLoc[1] + " " + tLoc[0] + address;
	}

	function pad2(num) {
		if (num < 10) {
			return '0' + num;
		}
		return '' + num;
	}

	function dateToString(date) {
		return date.getFullYear() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + 'T' + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());
	}

	// Similar to weekpatternToDates, but returns a list of JS dates
	function weekpatternToDateList(day_of_week, week_pattern, start_date) {
		if (!week_pattern) {
			return [];
		}
		try {
			var dates = [];
			var startDateBits = start_date.split('/');
			var startDate = new Date(startDateBits[2], startDateBits[1] - 1, startDateBits[0]);

			var evtDayOfWeek = "Mon" == day_of_week ? 2 : "Tue" == day_of_week ? 3 : "Wed" == day_of_week ? 4 : "Thu" == day_of_week ? 5 : "Fri" == day_of_week ? 6 : "Sat" == day_of_week ? 7 : "Sun" == day_of_week ? 1 : u.getDay() + 1;
			var startDayOfWeek = startDate.getDay() + 1;
			var offset = evtDayOfWeek >= startDayOfWeek ? evtDayOfWeek - startDayOfWeek : evtDayOfWeek + 7 - startDayOfWeek;

			for (var week_no = 0; week_no < week_pattern.length; week_no++) {
				if (week_no > 0 && week_pattern.charAt(week_no) == '1') {
					var indivDate = new Date(startDate);
					indivDate.setDate(indivDate.getDate() + (week_no * 7 + offset));
					dates.push(indivDate);
				}
			}
			return dates;
		} catch (ex) {
			console.log('Error in weekpatternToDateList: ' + ex);
			return [];
		}
	}

	var cal = [
		['BEGIN', 'VCALENDAR'],
		['VERSION', '2.0'],
		['PRODID', '-//RunasSudo//allocics.js//EN']
	];
	$.each(timetable.get_visible_events(), function (i, evt) {
		var startTimeBits = evt.node.start_time.split(':');

		var dates = weekpatternToDateList(evt.node.day_of_week, evt.node.week_pattern, evt.node.start_date);
		$.each(dates, function (j, dateBegin) {
			dateBegin.setHours(startTimeBits[0], startTimeBits[1]);
			var dateEnd = new Date(dateBegin.getTime() + evt.node.duration * 60 * 1000);

			// Build ICS event
			cal.push(['BEGIN', 'VEVENT']);
			cal.push(['UID', window.location.hostname + '@' + evt.id + '|' + j]);
			cal.push(['SUMMARY', evt.node.activity_group_code + '/' + evt.node.activity_code + ': ' + evt.node.description]);
			cal.push(['DTSTAMP', dateToString(dateBegin)]);
			cal.push(['DTSTART', dateToString(dateBegin)]);
			cal.push(['DTEND', dateToString(dateEnd)]);
			if (parseLocation(evt.node.location) != null) {
				cal.push(['LOCATION', parseLocation(evt.node.location)]);
			} else if (evt.node.location) {
				cal.push(['LOCATION', evt.node.location]);
			}
			if (evt.node.lat && evt.node.lng) {
				cal.push(['GEO', evt.node.lat + ';' + evt.node.lng]);
			}
			cal.push(['END', 'VEVENT']);
		});
	});
	cal.push(['END', 'VCALENDAR']);

	// ICS STUFF
	var calStr = '';
	$.each(cal, function (i, evt) {
		if (evt[0] !== 'GEO') {
			evt[1] = evt[1].replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
		}

		var entry = evt[0] + ':' + evt[1];
		// Process 75 characters at a time
		while (entry.length > 75) {
			calStr += entry.substring(0, 75);
			calStr += '\r\n ';
			entry = entry.substring(75);
		}
		calStr += entry;
		calStr += '\r\n';
	});

	// Download it!
	var blob = new Blob([calStr], {
		type: 'text/calendar;charset=utf-8'
	});
	saveAs(blob, 'allocate_' + YEAR + '.ics');
})();
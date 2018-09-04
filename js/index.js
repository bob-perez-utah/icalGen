$('form#create-appointment button[data-button-type=submit]').click(function (e){
	e.preventDefault();
	form = $('form#create-appointment');
	formData = {};
	formFields = ['title','organizerVorname','organizerName','organizerEmail','organizerOrganisation','attendeeVorname','attendeeName','attendeeEmail','attendeeOrganisation','url','method','privacy','location','summary','description'];
	for(i in formFields) {
		field = form.find('[name=' + formFields[i] + ']');
		if(field.prop("tagName") == 'select') {
			console.log('select',field.find(':selected'));
			value = field.find(':selected').val();
		}
		else {
			value = field.val();
		}
		console.log(i,formFields[i],form.find('[name=' + formFields[i] + ']'),value);
		formData[formFields[i]] = value;
	}
	
	dateStart = form.find('[name="date-start"]').val();
	timeStart = form.find('[name="time-start"]').val();
	dateEnd   = form.find('[name="date-end"]').val();
	timeEnd   = form.find('[name="time-end"]').val();
	formData.DTSTART = getDateTimeString(dateStart,timeStart);
	formData.DTEND = getDateTimeString(dateEnd,timeEnd);
	formData.created = getDateTimeString();
	
	console.log(formData);
	appointment = 'BEGIN:VCALENDAR\r\n' +
			'CALSCALE:GREGORIAN\r\n' +
			'VERSION:2.0\r\n' +
			'X-WR-CALNAME:' + formData.title + '\r\n' +
			'PRODID:http://www.example.com/calendarapplication/\r\n' +
			'METHOD:' + formData.method + '\r\n' +
			'BEGIN:VEVENT\r\n' +
			'UID:461092315540@example.com\r\n' +
			'ORGANIZER;CN="' + formData.organizerVorname + ' ' + formData.organizerName + ', ' + formData.organizerOrganisation + '":MAILTO:' + formData.organizerEmail + '\r\n' +
			'ATTENDEE;CN="' + formData.attendeeVorname + ' ' + formData.attendeeName + ', ' + formData.attendeeOrganisation + '":MAILTO:' + formData.attendeeEmail + '\r\n' +
			'LOCATION:' + formData.location + '\r\n' +
			'SUMMARY:' + formData.summary + '\r\n' +
			'DESCRIPTION:' + formData.description + '\r\n' +
			'CLASS:' + formData.privacy + '\r\n' +
			'STATUS' + formData.status ? formData.status : 'CONFIRMED' + '\r\n' +
			'DTSTART:' + formData.DTSTART + '\r\n' +
			'DTEND:' + formData.DTEND + '\r\n' +
			'DTSTAMP:' + formData.DTSTART + '\r\n' +
			'CREATED:' + formData.created + '\r\n' +
			'RRULE:FREQ=' + formData.recurring + ';INTERVAL=' + formData.interval + ';BYDAY=TU;UNTIL=' + formData.created + '\r\n' +
			'URL:' + formData.url + '\r\n' +
			'END:VEVENT\r\n' +
			'END:VCALENDAR\r\n';
	$('textarea[name=ics]').val(appointment);
	blob = new Blob([appointment],{type:'text/calendar'});
	file = window.URL.createObjectURL(blob);
	$('textarea[name=ics]').after(
		$('<a />').attr({
			'href':'data:text/calendar;charset=UTF-8,' + btoa(appointment),
			'download':'automatic-appointment'
		}).text('Download as Data URL')
	);
	
	$('textarea[name=ics]').after(
		$('<a />').attr({
			'href': file,
			'download':'automatic-appointment'
		}).text('Download as Blob')
	);
});

function getDateTimeString(datestring,timestring) {
	if(arguments.length == 2) {
		console.log(datestring,timestring);
		date = new Date(datestring);
		time = timestring.split(':');
		console.log(date,time);
		console.log('ISO-String before:',date.toISOString());
		date.setHours(parseInt(time[0]));
		date.setMinutes(parseInt(time[1]));
		console.log('ISO-String after:',date.toISOString());
	}
	else {
		date = new Date();
	}
	return date.toISOString().replace(/[.|:|-]/g,'').replace('000Z','Z');
}
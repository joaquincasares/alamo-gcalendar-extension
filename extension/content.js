String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function getRunTime() {
    var regExp = new RegExp('Run Time', 'i');
    var table = $('div.span5.info');
    var found = 0;
    var runTime;

    table.find('tr').each(function(index, row) {
        var allCells = $(row).find('td');

        if(found == 0 && allCells.length > 0) {

            allCells.each(function(index, td) {
                if (found == 1){
                    found = 2;
                    runTime = $(td).text();
                    runTime = runTime.substring(0, runTime.length - 3);
                    return
                }

                if(regExp.test($(td).text()))
                    found = 1;
            });
        }
    });

    return runTime;
}

function getEndTime(date) {
    return new Date(date.getTime() + getRunTime()*60000);
}

function getJavaTime(date, time) {
    if (time.substring(time.length - 1) == 'p')
        var am_pm = 'PM'
    else
        var am_pm = 'AM'

    time = time.substring(0, time.length - 1) + ' ' + am_pm;

    return new Date(Date.parse(date + ' ' + time));
}

function formatTime(javaTime) {
    var formatted_year = dateFormat(javaTime, 'UTC:yyyymmdd');
    var formatted_time = dateFormat(javaTime, 'UTC:HHMMss');
    return formatted_year + 'T' + formatted_time + 'Z';
}

function getCalendarLink(film, date, showtime, location) {
    var startTime = getJavaTime(date, showtime);
    var endTime = getEndTime(startTime);

    startTime = formatTime(startTime);
    endTime = formatTime(endTime);

    var calendarLink ='<a href="http://www.google.com/calendar/event';
    calendarLink += '?action=TEMPLATE';
    calendarLink += '&text=' + film + ' @ Alamo - ' + location;
    calendarLink += '&dates=' + startTime + '/' + endTime; //20120820T130000Z/20120820T133000Z'
    calendarLink += '&details= ' + window.location;
    calendarLink += '&location=Alamo Drafthouse - ' + location + '"';
    calendarLink += ' target="_blank">*</a>';
    return calendarLink;
}

$(document).ready(function() {
    var film = $('h1').text().toProperCase();

    $('.showtimes').each(function () {
        var date = $(this).find('h3').text();

        $(this).find('div.segment').each(function () {
            var location = $(this).find('h4').text();

            $(this).find('li.onsale').each(function() {
                var showtime = $(this).text();

                $(this).find('a').each(function () {
                    $(this).replaceWith($(this).parent().html() + getCalendarLink(film, date, showtime, location));
                });
            });

            $(this).find('li.notonsale').each(function() {
                var showtime = $(this).text();

                $(this).find('span').each(function () {
                    $(this).replaceWith($(this).parent().html() + getCalendarLink(film, date, showtime, location));
                });
            });
        });
    });

    $('.showtimes-row a').css({'display': 'inline'});
    $('.showtimes-row li').css({'width': 'auto'});
});

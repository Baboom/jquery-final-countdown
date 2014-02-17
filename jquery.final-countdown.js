/*!
 * jQuery Final Countdown
 *
 * @author Pragmatic Mates, http://pragmaticmates.com
 * @license GPL 2
 * @link https://github.com/PragmaticMates/jquery-final-countdown
 */

(function ($) {
    var settings;
    var timer;

    var circleSeconds;
    var circleMinutes;
    var circleHours;
    var circleDays;

    var layerSeconds;
    var layerMinutes;
    var layerHours;
    var layerDays;

    var element;

    $(window).load(updateCircles);
    $(window).on('redraw', function() { 
    	switched = false; 
    	updateCircles(); 
    }); 

    $(window).on('resize', updateCircles);

    $.fn.final_countdown = function(options) {
        element = $(this);

        var defaults = $.extend({
            start: '1362139200',
            end: '1388461320',
            now: '1387461319',
            selectors: {
                value_seconds: '.clock-seconds .val',
                canvas_seconds: 'canvas_seconds',
                value_minutes: '.clock-minutes .val',
                canvas_minutes: 'canvas_minutes',
                value_hours: '.clock-hours .val',
                canvas_hours: 'canvas_hours',
                value_days: '.clock-days .val',
                canvas_days: 'canvas_days'
            },
            seconds: {
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: '5'
            },
            minutes: {
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: '5'
            },
            hours: {
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: '5'
            },
            days: {
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: '5'
            }
        }, options);

        settings = $.extend({}, defaults, options);

        dispatchTimer();
        prepareCounters();
        startCounters();                        
    };

    function updateCircles() {     
        layerSeconds.draw();
        layerMinutes.draw();
        layerHours.draw();
        layerDays.draw();
    }

    function convertToDeg(degree) {
        return (Math.PI/180)*degree - (Math.PI/180)*90
    }

    function dispatchTimer() {
        timer = {
            total: Math.floor((settings.end - settings.start) / 86400),
            days: Math.floor((settings.end - settings.now ) / 86400),
            hours: 24 - Math.floor(((settings.end - settings.now) % 86400) / 3600),
            minutes: 60 - Math.floor((((settings.end - settings.now) % 86400) % 3600) / 60),
            seconds: 60 - Math.floor((((settings.end - settings.now) % 86400) % 3600) % 60 )
        }
    }

    function prepareCounters() {
        // Seconds
        var seconds_width = $('#' + settings.selectors.canvas_seconds).width()
        var secondsStage = new Kinetic.Stage({
            container: settings.selectors.canvas_seconds,
            width: seconds_width,
            height: seconds_width
        });        

        circleSeconds = new Kinetic.Shape({
            drawFunc: function(context) {     
            	var seconds_width = $('#' + settings.selectors.canvas_seconds).width()                
                var radius = seconds_width / 2 - settings.seconds.borderWidth / 2;
                var x = seconds_width / 2;
                var y = seconds_width / 2;     

                context.beginPath();
                context.arc(x, y, radius, convertToDeg(0), convertToDeg(timer.seconds * 6));                                
                context.fillStrokeShape(this);

                $(settings.selectors.value_seconds).html(60 - timer.seconds);
            },
            stroke: settings.seconds.borderColor,
            strokeWidth: settings.seconds.borderWidth            
        });

        layerSeconds = new Kinetic.Layer();
        layerSeconds.add(circleSeconds);
        secondsStage.add(layerSeconds);

        // Minutes
        var minutes_width = $('#' + settings.selectors.canvas_minutes).width();        
        var minutesStage = new Kinetic.Stage({
            container: settings.selectors.canvas_minutes,
            width: minutes_width,
            height: minutes_width
        });

        circleMinutes = new Kinetic.Shape({
            drawFunc: function(context) {     
            	var minutes_width = $('#' + settings.selectors.canvas_minutes).width();        
                var radius = minutes_width / 2 - settings.minutes.borderWidth / 2;
                var x = minutes_width / 2;
                var y = minutes_width / 2;

                context.beginPath();
                context.arc(x, y, radius, convertToDeg(0), convertToDeg(timer.minutes * 6));
                context.fillStrokeShape(this);

                $(settings.selectors.value_minutes).html(60 - timer.minutes);

            },
            stroke: settings.minutes.borderColor,
            strokeWidth: settings.minutes.borderWidth
        });

        layerMinutes = new Kinetic.Layer();
        layerMinutes.add(circleMinutes);
        minutesStage.add(layerMinutes);

        // Hours
        var hours_width = $('#' + settings.selectors.canvas_hours).width();
        var hoursStage = new Kinetic.Stage({
            container: settings.selectors.canvas_hours,
            width: hours_width,
            height: hours_width
        });

        circleHours = new Kinetic.Shape({
            drawFunc: function(context) {
            	var hours_width = $('#' + settings.selectors.canvas_hours).width();
                var radius = hours_width / 2 - settings.hours.borderWidth/2;
                var x = hours_width / 2;
                var y = hours_width / 2;

                context.beginPath();
                context.arc(x, y, radius, convertToDeg(0), convertToDeg(timer.hours * 15));
                context.fillStrokeShape(this);

                $(settings.selectors.value_hours).html(24 - timer.hours);

            },
            stroke: settings.hours.borderColor,
            strokeWidth: settings.hours.borderWidth
        });

        layerHours = new Kinetic.Layer();
        layerHours.add(circleHours);
        hoursStage.add(layerHours);

        // Days
        var days_width = $('#' + settings.selectors.canvas_days).width();
        var daysStage = new Kinetic.Stage({
            container: settings.selectors.canvas_days,
            width: days_width,
            height: days_width
        });

        circleDays = new Kinetic.Shape({
            drawFunc: function(context) {
            	var days_width = $('#' + settings.selectors.canvas_days).width();
                var radius = days_width/2 - settings.days.borderWidth/2;
                var x = days_width / 2;
                var y = days_width / 2;                
                

                context.beginPath();
                context.arc(x, y, radius, convertToDeg(0), convertToDeg((360 / timer.total) * (timer.total - timer.days)));
                context.fillStrokeShape(this);

                $(settings.selectors.value_days).html(timer.days);

            },
            stroke: settings.days.borderColor,
            strokeWidth: settings.days.borderWidth
        });

        layerDays = new Kinetic.Layer();
        layerDays.add(circleDays);
        daysStage.add(layerDays);
    }

    function startCounters() {
        var interval = setInterval(function(){
            if (timer.seconds > 59 ) {
                if (60 - timer.minutes == 0 && 24 - timer.hours == 0 && timer.days == 0) {
                    clearInterval(interval);

                    $('.clock-item', element).hide();
                    $('.clock-close').hide();
                    $('.clock-done').fadeIn();
                }
                timer.seconds = 1;

                if (timer.minutes > 59) {
                    timer.minutes = 1;
                    layerMinutes.draw();
                    if (timer.hours > 23) {
                        timer.hours = 1;
                        if (timer.days > 0) {
                            timer.days--;
                            layerDays.draw();
                        }
                    } else {
                        timer.hours++;
                    }
                    layerHours.draw()
                } else {
                    timer.minutes++;
                }
                layerMinutes.draw();
            } else {
                timer.seconds++;
            }
            layerSeconds.draw();
        }, 1000);
    }
})(jQuery);
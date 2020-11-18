$(function () {
    $('.occurred').on('click', function (event) {
        $('#popup').show();
        $('#popup').css('left', event.pageX);    
        $('#popup').css('top', event.pageY);
        $('#popup').css('display', 'inline');     
        $("#popup").css('position', 'absolute');

        $('#score').text(`${$(this).data('winscore')} to ${$(this).data('losescore')}`);
        let instanceData = $(this).data('instances'), fi = instanceData.firstInstance, li = instanceData.latestInstance;
        $('#instances').text(instanceData.instances === 1 ? " once": `${instanceData.instances} times`);  
        $('#firstInstance').html(`${fi.scoreline} at <a href=${fi.tournament.url}>${fi.tournament.name}</a> on ${fi.tournament.date}`);     
        
        if (instanceData.instances === 1)
            $('#latestInstanceDiv').hide();
        else
            $('#latestInstance').html(`${li.scoreline} at <a href=${li.tournament.url}>${li.tournament.name}</a> on ${li.tournament.date}`);     
    });

    $('.occurred').on('mouseover', function() {
        var colRowMatch = $(this).attr('class').match(/col-(\d*) row-(\-?\d*)/);

        if (!$('#heatMap').is(":checked")) {
            $(`td.col-${colRowMatch[1]}`).addClass('highlight');
            $(`td.row-${colRowMatch[2]}`).addClass('highlight');
        }

        $(`.col-header-${colRowMatch[1]}`).text(colRowMatch[1]);
        $(`.row-header-${colRowMatch[2]}`).text(colRowMatch[2]); 
    });

    $('.occurred').on('mouseout', function() {
        $('.default-empty').text('');
        $('td.highlight').removeClass('highlight');
    });

    $('.close').on('click', function () {
        $('#popup').hide();
    });

    $('#heatMap').on('change', function(){
        var maxInstances = $(this).data('maxinstances');
        var heatMapColorforValue = (value) => {
            var h = (1.0 - value) * 240
            return "hsl(" + h + ", 100%, 50%)";
        };

        if ($(this).is(':checked')) {
            $('.occurred').each(function() {
                let instanceData = $(this).data('instances');
                $(this).css('background-color', heatMapColorforValue(instanceData.instances / maxInstances));
            });
        } else {
            $('.occurred').removeAttr("style");
        }
    });

    $('.post-load').show();
    $('#loading').hide();
});
$(document).ready(function ($) {

    var pageCount;
    
    $('#invoicesEntries').on('click', '#deleteEntry', function(){
    	var deleteID = $(this).parent().parent().attr('id');
    	var send = 'deleteID='+deleteID;
    	if(confirm("Weet u zeker dat u deze entrie wilt verwijderen?")){	
	    	$.ajax({
	    		type: "post",
	    		url: "searchInvoices.php",
	    		data: send,
	    		success: function(){
	    			$('#'+deleteID).fadeOut("slow", function(){
	    				 $('#'+deleteID).remove();
	    			})
	    		}
	    	})	
	    	
    	}
    });
    
    $('#search').click(function(e) {
        e.preventDefault();
        $('#pagination').remove();
        $('#page-selection').html('<ul id="pagination"></ul>');
        searchInvoice();
    });

    function searchInvoice() {
        loadInvoice(1);
        $(document).ajaxStop(function() {
            $('#pagination').twbsPagination({
                totalPages: pageCount,
                visiblePages: 5,
                first: 'Begin',
                prev: '<',
                next: '>',
                last: 'Eind',
                onPageClick: function (event, page) {
                    loadCashbook(page);
                }
            });
        });
    }

    function loadInvoice(page) {
    	
        $("#invoicesEntries").html('<tr><td colspan="6">Facturen worden geladen...</td></tr>');
        var postData = {
            member: $('#member').val(),
            date: $('#date').val(),
            paid: $('#paid').val(),
            datePaid: $('#datePaid').val(),
            page: page
        };

        $.ajax({
            type: "post",
            url: "searchInvoices.php",
            data: postData,
            success: function (data) {
                data = $.parseJSON(data);
                var toAppend = "";
                pageCount = Math.ceil(data['totalCount']/50);

                if(data['items'] == undefined) {

                    toAppend += '<td colspan="5">Er konden geen facturen worden gevonden.</td>';

                } else {

                    $.each(data['items'], function (index, value) {
                    	
                    	var betaald = "Nee";
                    	if(value['Betaald'] == 1){
                    		betaald = "Ja";
                    	}
                    	
                    	if(value['DatumBetaald'] == null){
                    		var datumBetaald = "-";
                    	}else{
                    		var datumBetaald = value['DatumBetaald'];
                    	}
                    	
                        var eigenaar = generateName(value['Voornaam'], value['Tussenvoegsel'], value['Achternaam']);
                        toAppend +=
                            '<tr id="' + value['ID'] + '">' +
                            '<td>' + eigenaar + '</td>' +
                            '<td>' + value['ID'] + '</td>' +
                            '<td>' + value['Datum'] + '</td>' +
                            '<td>' + betaald + '</td>' +
                            '<td>' + datumBetaald + '</td>' +
                            '<td>' + '<a class="btn" id="deleteEntry" name="deleteEntry" data-invoice-id="' + value['ID'] + '"><i class="fa fa-trash-o "></i> Verwijderen</a>' +
                            '<a class="btn" id="editInvoice" name="editInvoice" href="invoices-edit.php?id=' + value['ID'] + '"><i class="fa fa-pencil"></i> Bijwerken</a>' +
                            '<a class="btn" id="printPdf" name="printPdf" href="invoices-PDF.php?id=' + value['ID'] + '"><i class="fa fa-file-pdf-o"></i> Printen PDF</a>'+ '</td>';
                        '</tr>';
                    });

                }

                $("#invoicesEntries").html(toAppend);

            }
        });
    }

    function generateName(voornaam, tussenvoegel, achternaam) {
        if(tussenvoegel != "") {
            return voornaam + ' ' + tussenvoegel + ' ' + achternaam;
        } else {
            return voornaam + ' ' + achternaam;
        }
    }
    

   

});
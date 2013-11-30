var mensagem = "";

function getContent(date) {

	$.getJSON( "https://iluminalma.azure-mobile.net/api/dph/" + date, function( data ) {
		$('.app-mensagem').html(mensagem);
		$('.app-mensagem').fadeIn();

		$('h1[data-bind="data-titulo"]').html(data.titulo);
		$('h2[data-bind="data-versiculo"]').html(data.versiculo);

		$('span[data-bind="data-pensamento"]').html(data.pensamento);
		$('span[data-bind="data-oracao"]').html(data.oracao);

		$('article time').attr('datetime', data.dataPub);
		$('article time').html(data.dataPub);
	});

}

function getDate() {
	var date = new Date();	
	var day = date.getDate();
	var month = (parseInt(date.getMonth()) + 1);
    if (day < 10) {day = "0" + day;}
    if (month < 10) {month = "0" + month;}
    return month +""+ day;
}

$(document).ready(function() {
	
	mensagem = $('.app-mensagem').html()
		
	//$('.app-mensagem').html('<span class="animated rotateIn"><i class="icon-refresh"></i></span>');
	var date = getDate();
	getContent(date);

	function moveNext() {
		date = parseInt(date) + 1;
		getContent(date);
		window.scrollTo(0, 0);
	}

	function movePrev() {
		date = parseInt(date) - 1;
		getContent(date);
		window.scrollTo(0, 0);
	}
	
	$('a[href="#next"]').on('click', moveNext);
	$('a[href="#prev"]').on('click', movePrev);
});
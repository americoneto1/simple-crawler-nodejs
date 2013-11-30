var express = require('express');
var url = 'http://www.iluminalma.com/dph/4/{0}.html';
var app = express();

String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};

app.configure(function () {
    app.use(
        "/", //the URL throught which you want to access to you static content
        express.static(__dirname) //where your static content is located in your filesystem
    );
    app.get(
    	"/content/:date", function(req, res){
    		var date = req.params.date;
    		var fullUrl = url.replace('{0}', date);
		    requestPage(fullUrl, res);
		}
    );
});
app.listen(3000);


function getContentJSON(body) {
	var cheerio = require('cheerio');
	var $ = cheerio.load(body);
	var versiculo = $('h4').text().trim();
	var titulo = $('h2').text().trim();
	var pensamento = $('.copyright p').eq(0).text().trim();
	var oracao = $('.copyright p').eq(1).text().trim();
	var dataPub = $('.dphDate').text().trim();	

	pensamento = pensamento.replace('Pensamento: ', '');
	oracao = oracao.replace('Oração: ', '');
	//TO DO: remover CDATA de uma forma mais elegante
	oracao = oracao.replace("\n\n \n\n\n<!--//<![CDATA[\n   var m3_u = \n(location.protocol=='https:'?'https://ads.heartlight.org/openads/www/delivery/ajs.php':'http://ads.heartlight.org/openads/www/delivery/ajs.php');\n   var m3_r = Math.floor(Math.random()*99999999999);\n   if (!document.MAX_used) document.MAX_used = ',';\n   document.write (\"<scr\"+\"ipt type='text/javascript' src='\"+m3_u);\n   document.write (\"?zoneid=37\");\n   document.write ('&cb=' + m3_r);\n   if (document.MAX_used != ',') document.write (\"&exclude=\" + document.MAX_used);\n   document.write (\"&loc=\" + escape(window.location));\n   if (document.referrer) document.write (\"&referer=\" + escape(document.referrer));\n   if (document.context) document.write (\"&context=\" + escape(document.context));\n   if (document.mmm_fo) document.write (\"&mmm_fo=1\");\n   document.write (\"'></scr\"+\"ipt>\");\n//]]>-->\n   Devocional Para Hoje em: \nInglês", "");

	var result = {
		"titulo": titulo,
		"versiculo": versiculo,
		"pensamento": pensamento,
		"oracao": oracao,
		"dataPub": dataPub
	}
	return JSON.stringify(result);
}

function requestPage(url, res) {	
	var request = require('request');
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {'Content-Type': 'application/json'});
		var json = getContentJSON(body);
		res.end(json);			
      }
    });
}
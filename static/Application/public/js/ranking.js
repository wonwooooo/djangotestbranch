csrf_token = $('body').attr('class'); 

function capitale(texte) {
	// atao majuscule premiere lettre
	return texte.charAt(0).toUpperCase() + texte.slice(1);
}


function makespace(number){
	let numList =  number.toString().split('');
	let newnumber = new Array();
	let j = 0;

	for (let i=0;i<numList.length;i++){
		if (i%3==0 && i!=0){
			newnumber[j] = ' ';
			j++;
		}
		newnumber[j] = numList[numList.length - 1 - i];
		j++;
	}
	return newnumber.reverse().join('');
}


function sleep(ms) {
	// fonction pour faire une petite  sleep 
	return new Promise(resolve => setTimeout(resolve, ms));
  }


function inscription(val){
	
	let nom = $("#inscrire input[name=nom]"); // alaina le champ ana texte ampidirana anarana
	let prenom = $("#inscrire input[name=prenom]"); // karan'le ambony fogn fa porenom ndrek raika ty
	let mail = $("#inscrire input[name=mail]"); // mangalaka an le mail nsoratana
	let phone = $("#inscrire input[name=phone]"); // numero telephone
	let pass1 = $("#inscrire input[name=password]");  // l objet html mot de passe
	let pass2 = $("#inscrire input[name=cpassword]");  // le confirmationy e
	let error = $("#inscrire p[name=erreur]");
	if ((/^[a-zA-Z]{3,}$/).test(nom.val())) // verifiena fa lettre ihany no nampidiriny de telo farafahakeliny
	{
		if ((/^[a-zA-Z ']{3,}$/).test(prenom.val())) // verifiena kar le anarana takeo fa afaka asina espace raika ty
		{
			if (/^[a-zA-Z]{1}[a-zA-Z_.0-9]{1,}@[a-z]{3,}.[a-z]{2,4}$/.test(mail.val()))  // verifiena hoe tena pozina mail marna io sa tsia
			{
				if (/^03[2349]{1}[0-9]{7}$/.test(phone.val())){
					if (pass1.val().length > 6) // verifiena sod ambaniny ny fito ny alavany mot de apsse
					{
						if (pass1.val() === pass2.val()) // verifiena oe mitovy le mot de passe nosoratana
						{
							sInscrire(nom.val(), prenom.val(), mail.val(), phone.val(), pass1.val(), val);
						}
						else{
							error.text("Le mot de passe ne correspond pas"); // mampiseho text d erreur
						}
					}
					else{
						error.text("Votre mot de passe est trop court");
					}
				}
				else{
					error.text("Veuiller entre un numero valide de 10 chiffres");
				}	
				
			}
			else{
				error.text("Ce mail n'est pas valide: " + mail.val());
			}
		}
		else {
			error.text("Ce prenom n'est pas valide: " + prenom.val());
		}
		
	}
	else{
		error.text("Ce nom n'est pas valide: " + nom.val());
	}
	
}

function sInscrire(nom, prenom, mail, phone, password, csrf_token){
	$.post(
		
		"/create_account",
		{
			csrfmiddlewaretoken: csrf_token,
			nom: nom.toUpperCase(),
			prenom:capitale(prenom),
			mail: mail,
			phone: phone,
			password: password
		},
		feed_back
		);
		
		function feed_back(response){
			if (response == 1){
				$('#inscrire').modal('hide');
				$('#success').modal('show');
			}
			else{
				$("#inscrire p[name=erreur]").text(response);
			}
		}
	}
	
	
function verifie_password(obj){
	let mail = obj.find('input[name=mail]');
	let password = obj.find('input[name=password]');
	let title = document.getElementsByClassName("test")[0].innerText;

	/* document.getElementsByClassName('test_class')[0].getAttribute('name') */
	console.log(title);
	let error = obj.find(' p[name=erreur]');
	if (/^[a-zA-Z]{1}[a-zA-Z_.0-9]{1,}@[a-z]{3,}.[a-z]{2,4}$/.test(mail.val())){
		$.post(
			'/connect',
			{
				csrfmiddlewaretoken: csrf_token,
				mail: mail.val(),
				password: password.val()
			},
			feed_back
			);
			
			function feed_back(rep){
				if (/^03[2349]{1}[0-9]{7}$/.test(rep)){
					switch (rep.slice(0,3)) {
						case '032':
							ops = 'Orange Money' ;
							break;

						case '033':
							ops = 'Airtel Money';
							break;
						
						case '034':
							ops = 'Mvola';
							break;

						default:
							ops = 'Mobile Money';

					};

					error.text('');
					sessionStorage.setItem("user_mail", mail.val());
					mail.attr('disabled', 'disabled');
					password.attr('disabled', 'disabled');
					obj.find(" .modal-title")
					var link = '/'+title;
					
    				window.location.href = link;       //웹개발할때 숨쉬듯이 작성할 코드
    				window.location.replace(link);     // 이전 페이지로 못돌아감
    				window.open(link); 
					
					//.html("Acheter le Jeu");
				}
				else{
					error.text(rep);
				}
			}
		}
		else{
			error.text("Ce mail n'est pas valide: " + mail.val());
		}
				
}


async function processAchat(event){
	val = event.data.objet.parents('form').find('.token').val();
	if (/^[0-9]{4}$/.test(val)){
		mail = event.data.mail;
		game = event.data.prod;
		html = `<div class='form-group'> <img style="margin-left: 46%; margin-right: 48%" src='static/Application/public/images/loading.gif' alt="chargement..."/> </div>`;
		event.data.objet.parent().after(html);
		await sleep(4000);
		event.data.objet.parents('.modal').modal('hide');
		$('#successdown').find('h4').text($('#successdown').find('h4').text() + game);
		$('#successdown').find('.mailsend').html($('#successdown').find('.mailsend').text() + `<strong>${mail}</strong>`);
		$('#successdown').modal('show');
	}
}


$(function() {
	let csrf_token = $('body').attr('class');
	$.post(
		'/get_ranking',
		{
			csrfmiddlewaretoken: csrf_token,
		},
		get_ranking
	);

	function get_ranking(dataP){
		table= $('#table');
		//buy = $('#acheter');
		//mod = $('#game_model');
		//console.log(table);
		console.log(dataP);
		for (let i=0;i<dataP[0].length;i++){
			tmp = table.clone(); 
			//tmp = mod.clone();
			tmp.find('#ranking').text(dataP[0].length-i);
			tmp.find('#score').text(dataP[0][i][1]);
			tmp.find('#title').text(dataP[0][i][0]);
			tmp.find('#name').text(dataP[0][i][2]);
			console.log(dataP[0][i][1]);
			console.log(dataP[0][i][2]);
			console.log(dataP[0][i][0]); 
			table.after(tmp);
			//mod.parent().append(tmp); 
			
			/* Mtmp = Mmod.clone();
			Mtmp.attr('id', 'play'+dataP[0][i][0]);
			Mtmp.find('h4').text(dataP[0][i][1]);
			Mtmp.find('h6').text(dataP[0][i][1]);
			Mtmp.find('source').attr('src', `static/Application/${dataP[0][i][4]}`);
			Mtmp.find('.text-muted').text(dataP[0][i][3]);
			Mtmp.find('.pricemodal').text(makespace(dataP[0][i][5]) + " Ar");
			Mtmp.find('.achatB').attr('href','#acheter'+ dataP[0][i][0]);
			Mtmp.find('.coeurIcon').attr('id', 'coeurIconModal' + dataP[0][i][0]); */

			/* Mmod.after(Mtmp);

			$('#listSearch').append('<option style="color:red;">' + dataP[0][i][1] + '</option>')

			buyTmp = buy.clone();
			buyTmp.attr('id', 'acheter' + dataP[0][i][0]);
			buyTmp.find('img').attr('src', `static/Application/${dataP[0][i][2]}`);
			buyTmp.find('img').attr('alt', dataP[0][i][1]);
			buyTmp.find('.test').text(dataP[0][i][1]);
			
			buy.after(buyTmp); */ 
		}
		table.remove();
		closeAndPauseEvent();
	}


});


		
function search_game(value){
	window.location = '#' + value;
	$("[id='" + value + "']").find('h6>a').animate({color:'red', fontSize:'30px'}, 500, function (){
		$(this).animate({color:'#212529', fontSize:'17.6px'}, 500)
	});	
}


function closeAndPause(){
	$(".videoplay").each(function(){
		$(this).get(0).pause();
	});
}


function closeAndPauseEvent(){
	$('.playvideo').each(function (){
		$(this).on('hide.bs.modal', function (){
			closeAndPause();
		});
	});
}


function heartMe(val){
	$('#' + val).animate({fontSize: 25, opacity: 2}, 400, function(){
		$(this).animate({fontSize:14, opacity: 15}, 300);
	});
}
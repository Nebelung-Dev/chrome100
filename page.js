var xhttp = new XMLHttpRequest(),
	firmwareSelect=document.getElementById('firmware-select'),
	mpRegex=/mp(?:-v\d{1,})?(\.bin\.zip$)/gi;

xhttp.onreadystatechange=((e)=>{
	if(xhttp.readyState == 4 && xhttp.status == 200){
		//console.log(xhttp.responseText);
		
		var data=JSON.parse(xhttp.responseText);

		data.platforms.forEach((e,i)=>{
			var tr=document.createElement('tr'),
				cn=document.createElement('td'),
				cna=document.createElement('span'),
				files=document.createElement('td'),
				brands=document.createElement('td'),
				codeVal=e.code,
				brandsVal=e.brands,
				working=e.working,
				workingComp=Number(e.working.replace(/\D/g,'')); // returns a number to compare stuff
			if(typeof brandsVal == 'undefined')return;
			document.getElementById('listTBODY').appendChild(tr);
			tr.appendChild(cn);
			tr.id=codeVal;
			cn.appendChild(cna);
			cna.innerHTML=codeVal;
			tr.appendChild(files);
			tr.appendChild(brands);
			
			Object.entries(data.baseDLs).forEach(e=>{
				var dl=document.createElement('a'),
					href=e[1].replace(/asuka/gi,codeVal.toLowerCase().trim()),
					version=Number(e[0]);
				files.appendChild(dl);
				if(working.match(/>=$/g) && workingComp > version)return; // has a =< at the end
				if(href == 'SKIPPED'){ // google has removed this version purposely
					dl.title = 'Version skipped by Google';
					dl.setAttribute('class','notable disabled');
				}else{
					dl.href=href
				}
				dl.innerHTML=version;
				dl.outerHTML+=' ';
			});
			brandsVal.forEach(ee=>{
				if(e.brands.length>=2){
					brands.innerHTML+=ee+', ';
					return;
				}
				brands.innerHTML+=ee;
			});
		});
		
	}
});

xhttp.open('GET','data.json', true);
xhttp.send();

firmwareSelect.addEventListener('change',e=>{
	var mp=firmwareSelect.value;
	Array.from(document.getElementsByTagName('a')).forEach((e,i)=>{ // loop through all links with the mp-stuff in it
		var href=e.getAttribute('href');
		if(href == null)return;
		if(href.match(mpRegex))e.setAttribute('href', href.replace(mpRegex,mp+'$1') ); // has the mp stuff so give the new one
	});
});

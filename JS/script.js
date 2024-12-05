document.getElementById('test').innerHTML = 'Carregando...';

Sleep(1000).then(() => {
	initializeMap();	
	document.getElementById('test').innerHTML = '';
});
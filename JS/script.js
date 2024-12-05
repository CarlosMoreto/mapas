async function initializeMap() {
	try {
		var map = undefined;        
		const urlMap = '" & [dax_txt_urlMap] & "';
		const shapeFile = await Load_JSON(urlMap);

		if(map != undefined)
			map.remove();

		map = L.map('map', {
			zoomControl: false,
			zoomSnap: 0.1
		});

		const feature = L.geoJson(shapeFile);
		const mapBounds = feature.getBounds();
		const ctrlScale = L.control.scale({ imperial: false, position: 'bottomright' });

		ctrlScale.addTo(map);
		const divScale = ctrlScale.getContainer().parentElement;

		divScale.style.position = 'absolute';
		divScale.style.margin = 'auto';
		divScale.style.bottom = '0';
		divScale.style.right = '5%';
		divScale.style.translate = '0px 20px';

		map.fitBounds(mapBounds);

		const minZoom = map.getZoom();
		map.setMinZoom(minZoom);
		map.setMaxBounds(mapBounds);
		map.on('drag', function() {
			map.panInsideBounds(mapBounds, {animate: false});
		});

		geojson = L.geoJson(shapeFile, {
			style: Style,
			onEachFeature: On_Each_Feature
		}).addTo(map);

		const legend = L.control({position: 'bottomleft'});
		legend.onAdd = function() {
			const div = L.DomUtil.create('div', 'info legend');
			const labels = [];
			const ary_values = [minVal];

			for (let i = 1; i <= ary_mapColors.length; i++)
				ary_values[i] = ary_values[i - 1] + step;

			ary_values[0] = ary_values[0] - 1;
			ary_values[ary_values.length - 1] = maxVal;
			div.innerHTML = '<span class=""title"">Legenda</span><br>';

			for (let i = 0; i < ary_values.length - 1; i++) {
				div.innerHTML +=
					`<i style=""background:${ary_mapColors[i]}""></i> ` +
					`${ary_values[i] + 1} &ndash; ${ary_values[i + 1]}<br><br>`;
			}

			return div;
		};

		legend.addTo(map);

	} catch (error) {
		document.getElementById('test').innerHTML = 'Error loading the GeoJSON file: ' + error;
		console.error('Error loading the GeoJSON file:', error);
	}
}
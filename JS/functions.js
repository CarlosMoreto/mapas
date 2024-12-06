// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: \\
//                       FUNCTIONS - 2024-12-06                        \\
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: \\
// =========================================================== \\
//                 CREATE COMPASS - 2024-12-05                 \\
// =========================================================== \\
function Create_Compass() {
	let imgCompass = document.createElement('img');
	
	imgCompass.id = 'compass';
	imgCompass.src = 'https://raw.githubusercontent.com/CarlosMoreto/mapas/refs/heads/main/Icons/compass.png';
	imgCompass.style.opacity = 1;
	
	document.getElementById('map').appendChild(imgCompass);
}
// =========================================================== \\


// =========================================================== \\
//                     SLEEP - 2024-11-25                      \\
// =========================================================== \\
function Sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// =========================================================== \\


// =========================================================== \\
//                   LOAD JSON - 2024-12-06                    \\
// =========================================================== \\
function Load_JSON(url) {
    return new Promise((resolve, reject) => {
		$.ajax({
			type: 'GET',
			url: url,
			crossDomain: true,
			dataType: 'json',
			success: resolve,
			error: reject
		});
    });
}
// =========================================================== \\


// =========================================================== \\
//                    GET MIN - 2024-12-06                     \\
// =========================================================== \\
function Get_Min(values) {
    let minVal = Math.min(...values.filter(val => val !== undefined));
    let size = 10**Math.trunc(Math.log10(minVal));
    let minValFinal = size * Math.floor(minVal / size);

    return minValFinal < 10 ? 0 : minValFinal;
}
// =========================================================== \\


// =========================================================== \\
//                    GET MAX - 2024-12-06                     \\
// =========================================================== \\
function Get_Max(values) {
    let maxVal = Math.max(...values.filter(val => val !== undefined));
    let size = 10**Math.trunc(Math.log10(maxVal));
    let maxSizeFinal = size * Math.ceil(maxVal / size);

    return maxSizeFinal;
}
// =========================================================== \\


// =========================================================== \\
//                 GET VALUE DICT - 2024-11-27                 \\
// =========================================================== \\
function Get_Value_Dict(cod) {
    let ary_dicts = dic_mapValues.filter(item => item.cod == cod);

    if(ary_dicts.length > 0)
        return ary_dicts[0];
    
    return {'cod': 0, 'val': undefined, 'txt': 'erro'};
}
// =========================================================== \\


// =========================================================== \\
//                   GET COLOR - 2024-12-06                    \\
// =========================================================== \\
function Get_Color(cod) {
    const dic_local = Get_Value_Dict(cod);
 
    if(dic_local.cod !== 0 && dic_local.val !== undefined) {
        const idx = Math.trunc((dic_local.val - minVal) / step);

        return ary_mapColors[idx];
    }
 
    return '#FFF';
}
// =========================================================== \\


// =========================================================== \\
//                     STYLE - 2024-12-05                      \\
// =========================================================== \\
function Style(feature) {
    const color = Get_Color(feature.properties[geoLvlCod]);

    return {
        fillColor: color,
        weight: 0.5,
        opacity: 1,
        color: '#AAA',
        dashArray: '',
        fillOpacity: color === '#FFF' ? 0 : 1
    };
}
// =========================================================== \\


// =========================================================== \\
//               HIGHLIGHT FEATURE - 2024-11-27                \\
// =========================================================== \\
function Highlight_Feature(e) {
    let layer = e.target;

    layer.setStyle({
        fillColor: '#CCC',
        weight: 3,
        color: '#D96',
        dashArray: '',
        fillOpacity: 1
    });
    
    // map.setMaxBounds(mapBounds.pad(1));
    layer.bringToFront();
    layer.openTooltip();
    // layer.openPopup();
}
// =========================================================== \\


// =========================================================== \\
//                RESET HIGHLIGHT - 2024-11-27                 \\
// =========================================================== \\
function Reset_Highlight(e) {
    let layer = e.target;

    layer.closeTooltip();
    // layer.closePopup();
    geojson.resetStyle(layer);
    // map.setMaxBounds(mapBounds);
}
// =========================================================== \\


// =========================================================== \\
//                ZOOM TO FEATURE - 2024-11-19                 \\
// =========================================================== \\
function Zoom_To_Feature(e) {
    map.fitBounds(e.target.getBounds());
}
// =========================================================== \\


// =========================================================== \\
//                TOOLTIP MESSAGE - 2024-12-06                 \\
// =========================================================== \\
function Tooltip_Message(dict) {
    let value = dict.val;

    if(value !== undefined) {
        if(calcAbv == 'num_profs')
            value = (value).toLocaleString('pt-BR', {maximumFractionDigits: 0});
        else
            value = (value).toLocaleString('pt-BR', {maximumFractionDigits: 2});
    } else
        value = 'NA';

    let msgCod = 'Código: ' + dict.cod;
    let msgLocal = geoLvlName + ': ' + dict.txt;
    let msgValue = calcName + ': ' + value;
    let msg = msgCod + '<br>' + msgLocal + '<br>' + msgValue;

    return msg;
}
// =========================================================== \\


// =========================================================== \\
//                ON EACH FEATURE - 2024-12-05                 \\
// =========================================================== \\
function On_Each_Feature(feature, layer) {
    //document.getElementById('test').innerHTML += 'test, '; //feature.properties." & SELECTEDVALUE(d_geoLevel[txt_levelCol]) & " + ', ';
    const dict = Get_Value_Dict(feature.properties[geoLvlCod]);
    
    if(dict.cod !== 0) {
        layer.bindTooltip(Tooltip_Message(dict), {className: 'anim-tooltip'});
        // layer.bindPopup(msg, {closeButton: false, offset: L.point(0, -20)});
        layer.on({
            mouseover: Highlight_Feature,
            mouseout: Reset_Highlight,
            click: Zoom_To_Feature
        });
    }
}
// =========================================================== \\
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: \\
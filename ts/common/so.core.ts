import {init as initBase} from './so.base';

declare function require(package:string):any|undefined;

/////////////////
// Preferences //
/////////////////
export enum SOLanguage {
	EN = 1,
	PT,
}
export enum SOTheme {
	LIGHT = 1,
	DARK,
}
export enum SOAListStyle {
	MINIMAL = 1,
	BAR,
	DOCK,
}
export enum SOGraphicsQuality {
	MIN = 1,
	MID,
	MAX,
}
export enum SOStyle {
	DESKTOP = 1,
	MOBILE,
	TABLET,
};
export enum SOBool {
	ON = 1,
	OFF
}
export interface SOPrefs {
	language?:SOLanguage;
	theme?:SOTheme;
	style?:SOStyle;
	acrillic?:SOBool;
	
	autoHiddenMenu?:SOBool;

	appListStyle?:SOAListStyle;
	graphics?:SOGraphicsQuality;
	
	cookies?:SOBool;
	incookieTmp?:SOBool;
};

export type PrefChangCallBack = (vnew:SOPrefs, vall:SOPrefs)=>void;
var prefCBs = new Map<number, PrefChangCallBack>();
var prefCBID = 0;
function prefChange(vnew:SOPrefs, vall:SOPrefs) {
	[...prefCBs.values()].forEach((cb)=>cb(vnew, vall));
}
function prefAddEvent(cb:PrefChangCallBack):number {
	prefCBID++;
	prefCBs.set(prefCBID, cb);
	return prefCBID;
}
function prefRemoveEvent(id:number) {
	prefCBs.delete(id);
}

var prefLast:SOPrefs = {};
function prefInvalid() {
	var raster:SOPrefs = {};
	var it = [prefs.default, prefs.user, prefs.page];
	it.forEach((p)=>{
		if (p.language) raster.language = p.language;
		if (p.theme) raster.theme = p.theme;
		if (p.style) raster.style = p.style;
		if (p.acrillic) raster.acrillic = p.acrillic;
		if (p.autoHiddenMenu) raster.autoHiddenMenu = p.autoHiddenMenu;
		if (p.appListStyle) raster.appListStyle = p.appListStyle;
		if (p.graphics) raster.graphics = p.graphics;
		if (p.cookies) raster.cookies = p.cookies;
		if (p.incookieTmp) raster.incookieTmp = p.incookieTmp;
	});
	var vnew:SOPrefs = {};
	if (prefLast.language != raster.language) vnew.language = raster.language;
	if (prefLast.theme != raster.theme) vnew.theme = raster.theme;
	if (prefLast.style != raster.style) vnew.style = raster.style;
	if (prefLast.acrillic != raster.acrillic) vnew.acrillic = raster.acrillic;
	if (prefLast.autoHiddenMenu != raster.autoHiddenMenu) vnew.autoHiddenMenu = raster.autoHiddenMenu;
	if (prefLast.appListStyle != raster.appListStyle) vnew.appListStyle = raster.appListStyle;
	if (prefLast.graphics != raster.graphics) vnew.graphics = raster.graphics;
	if (prefLast.cookies != raster.cookies) vnew.cookies = raster.cookies;
	if (prefLast.incookieTmp != raster.incookieTmp) vnew.incookieTmp = raster.incookieTmp;
	prefLast = raster;
	prefs.rastered = prefLast;

	prefChange(vnew, raster);
}


export var prefs = {
	rastered:{} as SOPrefs,
	page:{} as SOPrefs,
	user:{} as SOPrefs,
	default:{
		language:SOLanguage.EN,
		theme:SOTheme.LIGHT,
		style:SOStyle.DESKTOP,
		acrillic:SOBool.ON,
		autoHiddenMenu:SOBool.OFF,
		appListStyle:SOAListStyle.MINIMAL,
		graphics:SOGraphicsQuality.MID,
		cookies:SOBool.OFF,
		incookieTmp:SOBool.ON,
	} as SOPrefs,
	invalid:prefInvalid,
	addEvent:prefAddEvent,
	removeEvent:prefRemoveEvent,
};
prefs.addEvent((pref:SOPrefs)=>{
	var classes = (document.body.getAttribute('class') || "").split(' ').filter((x)=>x!='');
	if (pref.theme) {
		classes = classes.filter((x)=>x.indexOf('so_t_')!=0);
		classes.push('so_t_'+((pref.theme == SOTheme.LIGHT)?'light':'dark'));
	}
	if (pref.graphics) {
		classes = classes.filter((x)=>x.indexOf('so_gl_')!=0);
		switch (pref.graphics) {
		case SOGraphicsQuality.MIN:
			classes.push('so_gl_min');break;
		case SOGraphicsQuality.MID:
			classes.push('so_gl_mid');break;
		case SOGraphicsQuality.MAX:
			classes.push('so_gl_max');break;
		}
	}
	if (pref.appListStyle) {
		classes = classes.filter((x)=>x.indexOf('so_bs_')!=0);
		switch (pref.appListStyle) {
		case SOAListStyle.MINIMAL:
			classes.push('so_bs_minimal');break;
		case SOAListStyle.BAR:
			classes.push('so_bs_bar');break;
		case SOAListStyle.DOCK:
			classes.push('so_bs_dock');break;
		}
	}
	if (pref.style) {
		classes = classes.filter((x)=>x.indexOf('so_ss_')!=0);
		switch (pref.style) {
		case SOStyle.DESKTOP:
			classes.push('so_ss_desktop');break;
		case SOStyle.MOBILE:
			classes.push('so_ss_mobile');break;
		case SOStyle.TABLET:
			classes.push('so_ss_tablet');break;
		}
	}
	console.log(classes);
	document.body.setAttribute('class', classes.join(' '));
});

////////////////////
// prefs.defaults //
////////////////////

function isMob() {
	let check = false;
	//@ts-ignore
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};
function isMobTablet() {
	let check = false;
	//@ts-ignore
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};


if (window.matchMedia) {
	if (window.matchMedia('(prefers-color-scheme: dark)').matches)
		prefs.default.theme = SOTheme.DARK;
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
		prefs.default.theme = event.matches ? SOTheme.DARK : SOTheme.LIGHT;
	});
}
//@ts-ignore
if (isMob() || (navigator && navigator.userAgentData && navigator.userAgentData.mobile && window.innerWidth <= 800)) {
	prefs.default.style = SOStyle.MOBILE;
	prefs.default.graphics = SOGraphicsQuality.MIN;
} else if (isMobTablet())
	prefs.default.style = SOStyle.TABLET;
else if (window.innerWidth <= 800 && window.innerHeight <= 600) {
	prefs.default.graphics = SOGraphicsQuality.MIN;
	prefs.default.style = SOStyle.MOBILE;
} else if (window.innerWidth <= 1000)
	prefs.default.style = SOStyle.TABLET;
else
	prefs.default.style = SOStyle.DESKTOP;

if (window.localStorage && window.localStorage.getItem("enabled") == "true") {
	var uprefs = window.localStorage.getItem("userPreferences");
	if (uprefs) {
		//@ts-ignore
		prefs.user = JSON.parse(uprefs);
	}
}
prefs.invalid();

//////////////////
// Apps & Pages //
//////////////////
export interface AppInstance {
	package:string,
	title:string,
	icon:string,
	fixed:boolean,
	minimized:boolean,
	finalize:()=>void,
}
export interface ToolRef {
	package:string,
	title:string,
	icon:string,
};
export interface ToolInitPref {
	fixed?:{
		node:HTMLElement,
		width?:number,
		hieght?:number,
		top?:number,
		left?:number,
	}
};
export async function ensurePackage (name:string):Promise<boolean> {
	while (name.indexOf(".") == 0 || name.indexOf('\\') == 0 || name.indexOf('\/') == 0)
		name = name.substr(1);
	//@ts-ignore
	name = pathResolve(name);

	if (require('../'+name))
		return true;

	var file = await download('/'+name);

	if (file.code == 200) {
		var ns = document.createElement('script');
		ns.innerHTML = file.txt;
		document.head.appendChild(ns);
		//@ts-ignore Call amd to resolve
		defines_solve();
		return true;
	}
	return false;
}
var download_cache = new Map<string, string>();
export async function download(url:string, cache?:true):Promise<{code:number,txt:string}> {
	if (download_cache.has(url))
		return {code:200, txt:download_cache.get(url) as string};
	return await (new Promise((resolve)=>{
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					if (cache)
						download_cache.set(url, xhttp.responseText);
					resolve({code:200, txt:xhttp.responseText});
				} else
					resolve({code:this.status, txt:''});
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}));
}
function extractBodyFromPage(txt:string):string {
	var i = txt.indexOf('<!--page.body-->');
	var e = txt.indexOf('<!--page./body-->',i);
	if (i > 0 && e > 0)
		return txt.substring(i+16, e);
	return txt;
}
export var toolInstances:AppInstance[] = [];
export var currentPage:(AppInstance | null) = null;
export var toolList:ToolRef[] = [

];
export async function runPage(pageURL:string):Promise<boolean> {
	if (pageURL == 'index.html') pageURL = '';
	{
		var i = pageURL.lastIndexOf('index.html');
		if (i >= 0 && i + 10 == pageURL.length)
			pageURL = pageURL.substring(0, i);
	}
	while(pageURL.indexOf('/') == 0) pageURL = pageURL.substr(1);
	while(pageURL.length > 0 && pageURL.lastIndexOf('/') == pageURL.length - 1) pageURL = pageURL.substr(0, pageURL.length - 1);

	var packageURL = 'page/'+(pageURL==''?'index':pageURL).replace(/\//g,'_')+".js";
	var dataURL = pageURL;
	if (dataURL.indexOf('/') != 0)
		dataURL = '/'+dataURL;
	if (dataURL != 'index.html' && (dataURL.length < 11 || dataURL.length - 11 != dataURL.lastIndexOf('/index.html'))) {
		if (dataURL.length < 1 || dataURL.lastIndexOf('/') != dataURL.length-1)
			dataURL += '/';
		dataURL += 'index.html';
	}
	console.log("[SO]runPage: "+pageURL + " => "+dataURL + " : "+packageURL);
	var page_html = await download(dataURL, true);
	if (page_html.code != 200)
		return false;
	var page_content = extractBodyFromPage(page_html.txt);
	if (!await ensurePackage(packageURL))
		return false;

	var ibody = page_html.txt.indexOf('<!--page.body-->');
	ibody = ibody>=0?ibody+16:0;
	var ebody = page_html.txt.indexOf('<!--page./body-->');
	if (ebody < 0) ebody = page_html.txt.length;

	var rt = require('../'+packageURL);
	if (rt)
		await (rt.pageInit(page_html.txt.substring(ibody, ebody).trim()));
	else
		//@ts-ignore
		document.getElementById('content').innerHTML = page_html.txt.substring(ibody, ebody).trim();
	return true;
}
//> pageInit(body:string)
export async function runTool(packageURL:string):Promise<boolean> {
	if (!await ensurePackage(packageURL))
		return false;
	return (await (require('../'+packageURL).toolInit())) as boolean;
}
//> toolInit(pref?:ToolInitPref):boolean

// run current page with local body data or 404
async function main() {
	var url = window.location.href;
	var i = url.indexOf('/', url.indexOf('https://')==0?8:(url.indexOf('http://')==0?7:0));
	url = i<0?'':url.substr(i);

	initBase();

	if (!(await runPage(url))) runPage('/404');
}
main();
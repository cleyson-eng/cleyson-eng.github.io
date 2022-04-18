import * as fs from 'fs';
import * as path from 'path';
import * as uglify from 'uglify-js';
import * as HTMLMinify from 'html-minifier';
//@ts-ignore
const minify = require('@node-minify/core');
//@ts-ignore
const cleanCSS = require('@node-minify/clean-css');

var base_dst = path.resolve(__dirname, '../../docs');
function _getFiles(folder:string, relative:string):string[] {
	if (!fs.existsSync(folder))
		return [];
	var r:string[] = [];
	fs.readdirSync(folder).forEach((v)=>{
		v = path.resolve(folder, v);
		if (fs.statSync(v).isDirectory())
			r.push(..._getFiles(v, relative));
		else
			r.push(v);
	});
	return r;
}
function getFiles(folder:string, relative:string):string[] {
	return _getFiles(folder, relative).map((x)=>path.relative(relative, x));
}
function mkdir(folder:string) {
	if (fs.existsSync(folder))
		return;
	mkdir(path.resolve(folder, '..'));
	fs.mkdirSync(folder);
}
function wfile(local:string, txt:string) {
	mkdir(path.resolve(local,'..'));
	fs.writeFileSync(local, txt);
}
function uglifyJS(code:string):string {
	if (true)
		return uglify.minify(code).code
	else
		return code;
}
////////////////
// Typescript //
////////////////
var base_src_ts = path.resolve(__dirname, '../../ts-out');
var files_ts = getFiles(base_src_ts, base_src_ts).map((v)=>{
	var ctt = fs.readFileSync(path.resolve(base_src_ts, v), 'utf-8');
	return {ctt, v};
});
var snippets:{txt:string,files:number[]}[] = [];
function registerSnippets(txt:string, fileIndex:number) {
	for (var i = 0; i < snippets.length; i++) {
		if (snippets[i].txt.trim() == txt.trim()) {
			snippets[i].files.push(fileIndex);
			return;
		}
	}
	snippets.push({txt, files:[fileIndex]});
}
//add package name to defines and register snippets
files_ts.forEach((v, i)=>{
	var i = v.ctt.indexOf('define([');
	if (i > 100)
		registerSnippets(v.ctt.substr(0,),i);
	if (i >= 0)
		v.ctt = v.ctt.substr(0, i+7) + `"${v.v.replace(/\\/g,'/')}",` +v.ctt.substr(i+7);

});
//remove repeated snippets
snippets = snippets.filter((v)=>v.files.length>2);
snippets.forEach((v)=>{
	v.files.forEach((i)=>{
		files_ts[i].ctt = files_ts[i].ctt.substr(v.txt.length);
	});
});
//uglify and save to output
files_ts.forEach((v)=>{
	console.log(path.resolve(base_dst, v.v));
	wfile(path.resolve(base_dst, v.v), uglifyJS(v.ctt));
});
//save snippets in a dedicated file
if (snippets.length > 0) {
	var ugout = uglifyJS(snippets.map((v)=>v.txt).join(';\n'));
	wfile(path.resolve(base_dst, 'common/utils.js'), ugout);
}
///////////////////////
// build common html //
///////////////////////
var incs = getFiles(path.resolve(base_dst,'common'), base_dst);
console.log('incs:');
console.log(incs);
var inc_css = incs.filter((v)=>v.lastIndexOf('.css') == v.length - 4)
	.map((v)=>`<link rel="stylesheet" href="/${v.replace(/\\/g,'/')}">`).join('');
var inc_js =  incs.filter((v)=>v.lastIndexOf('.js') == v.length - 3)
	.sort((a,b)=>b.indexOf('nano-amd.js')-a.indexOf('nano-amd.js'))
	.map((v)=>`<script src="/${v.replace(/\\/g,'/')}"></script>`).join('');

var htmlTemplate = HTMLMinify.minify(fs.readFileSync(path.resolve(__dirname, '../template.html'), 'utf-8'));

////////////////////
// copy resources //
////////////////////
var base_src_rsc = path.resolve(__dirname, '../../rsc');
console.log("rsc:");
getFiles(base_src_rsc,base_src_rsc).forEach((v)=>{
	console.log(v);
	switch(path.extname(v)) {
	case '.less':
	case '.ts':
		//ignore extensions
		break;
	case '.js':
		fs.writeFileSync(
			path.resolve(base_dst, v),
			uglifyJS(
				fs.readFileSync(path.resolve(base_src_rsc, v), 'utf-8')
			)
		);
		break;
	case '.html': {
			var txt = fs.readFileSync(path.resolve(base_src_rsc, v), 'utf-8');
			var i = txt.indexOf('<!--body-->');
			var head = i>=0?txt.substr(0,i).trim():'';
			var body = i>=0?txt.substr(i+11).trim():txt.trim();
			var dst = path.resolve(base_dst, v);
			if (path.basename(dst) != "index.html") {
				dst = dst.replace('.html','');
				dst = path.resolve(dst,"index.html");
			}
			head = HTMLMinify.minify(head);
			body = HTMLMinify.minify(body);
			wfile(
				dst,
				htmlTemplate
					.replace('${head}', head)
					.replace('${inc}', inc_css + inc_js)
					.replace('${body}', `<!--page.body-->${body}<!--page./body-->`)
				);
		}break;
	case '.css':
		mkdir(path.resolve(base_dst, v, '..'));
		minify({
			compressor: cleanCSS,
			input: path.resolve(base_src_rsc, v),
			output: path.resolve(base_dst, v),
			//@ts-ignore
			callback: function(err, min) {}
		});
		break;
	default:
		mkdir(path.resolve(base_dst, v, '..'));
		fs.copyFileSync(path.resolve(base_src_rsc, v), path.resolve(base_dst, v));
	}
});
fs.copyFileSync(path.resolve(base_dst, '404/index.html'), path.resolve(base_dst, '404.html'));
fs.copyFileSync(path.resolve(base_dst, '404/index.html'), path.resolve(base_dst, '../404.html'));
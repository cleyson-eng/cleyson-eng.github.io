var defines = [];

function define(name, imports, func) {
	defines.push({
		solved: !1,
		name,
		imports,
		func,
		exports: {}
	})
}

function path_resolve(path) {
	var opath = path;
	var r = "";
	do {
		r = path;
		path = r.replace(/\\/g, "/")
			.replace(/\/\//g, "/")
			.replace(/\/\.\//g, "/");
		var i = r.indexOf('/../');
		if (i > 0) {
			var i2 = r.lastIndexOf('/',i-1);
			if (i2 == -1) i2 = 0;
			path = path.substr(0,i2)+path.substr(i+3);
		}
		while (path.indexOf("/") == 0 || path.indexOf('.') == 0)
			path = path.substr(1);
		while (path.length > 0 && path.lastIndexOf("/") == path.length - 1)
			path = path.substr(0, path.length - 1);
	} while (path != r);
	console.log("[AMD]"+opath + " => " + r);
	return r;
}

function defines_require(base, name) {
	name = path_resolve(base + "/../" + name);
	if (name.length < 3 || name.indexOf(".js") != name.length-3)
		name += '.js';
	for (var i = 0, e = defines.length; i < e; i++)
		if (defines[i].name == name && defines[i].solved)
			return defines[i].exports;

	console.log('[AMD]failed to request: '+name);
	return null
}

function defines_solve() {
	console.log("[AMD]started");
	var solveds = false;//e
	var tries = 0;
	do {
		solveds = true;
		for (i = 0, e = defines.length; i < e; i++) {
			if (!defines[i].solved) {
				var r = [];
				var ii = 0,
					ie = defines[i].imports.length;
				var sub_solveds = true;
				for (;ii < ie; ii++) {
					var cur = defines[i].imports[ii];
					if (cur == "require") {
						var cdef = defines[i].name;
						r.push(function() {
							return defines_require(cdef, ...arguments)
						});
					} else if (cur == "exports")
						r.push(defines[i].exports);
					else {
						var imp =  defines_require(defines[i].name, cur);
						if (imp == null) {
							solveds = false;
							sub_solveds = false;
							break
						}
						r.push(imp)
					}
				}
				if (ii == ie  && sub_solveds) {
					defines[i].func(...r);
					defines[i].solved = true;
				}
			}
		}
		tries++;
	} while (!solveds && tries < 100);
	if (!solveds) {
		var unsolveds = [];
		var solvedsp = [];
		for (i = 0, e = defines.length; i < e; i++) {
			if (!defines[i].solved)
				unsolveds.push(defines[i].name + " => " + defines[i].imports.join(','));
			else
				solvedsp.push(defines[i].name + " => " + defines[i].imports.join(','));
		}
		console.log("[AMD]unsolveds:");
		console.log(unsolveds);
		console.log("[AMD]solveds:");
		console.log(solvedsp);
	}
	console.log("[AMD]End");
}
window.pathResolve = path_resolve;
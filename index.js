/**
 * @fileoverview File Combine Base on Config 监听文件改变,自动合并
 * 用法 node index.js
 * @author loviselu
 */

//避免异常退出
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

var config = require('./config'),
	util   = require('./util'),
	fs     = require('fs'),
	path   = require('path'),
	configFile = [],
	configObjectMap = {},
	listenFileMap   = {},
	undefined;

/*
 *Step1:找出配置文件
 */
config.listenDir.forEach(function(v,k){
	//console.log(v);
	configFile = configFile.concat(util.getFileList(v,config.configFileFilter));
})

/*
 *Step2:解析配置文件,找出要监听的文件及把对应的配置关联上
 */
//console.dir(configFile);

configFile.forEach(function(v,k){
	var configStr = fs.readFileSync(v, 'utf-8');
	if(typeof config.configObjectFilter === 'function'){		
		configStr = config.configObjectFilter(configStr);
	}
	//console.log(configStr);

	try{
		eval('var configObjects='+configStr);
	}catch(e){
		console.log('ERROR:configObject parse error:\n',v);
		return;
	}

	var parentDir = path.dirname(v);
	for(var key in configObjects){
		var target = configObjects[key].target = path.resolve(parentDir,config.targetDir+'/',configObjects[key].target);
		configObjectMap[target] = configObjects[key];
		configObjectMap[target].include.forEach(function(v,k){
			var includeFile = configObjectMap[target].include[k] = path.resolve(parentDir,v);
			//console.log(includeFile);
			!listenFileMap[includeFile] && (listenFileMap[includeFile] = []);
			listenFileMap[includeFile].push(target);
		})
	}
	//console.log(configObjectMap);
})

/*
 *Step3:监听文件
 */
var cache = {};
for(var key in listenFileMap){
	if(cache[key]){
		return;
	}
	cache[key] = true;

	console.log(key);

	try{
		fs.watch(key,(function(key){
			return function(event,filename){		
				//如果文件改变
		        if (event == 'change') {
		        	var filePath = path.resolve(path.dirname(key),filename);
		        	var now =  Date.now();
		        	if(cache[filePath] && now - cache[filePath] < 100){
						return;
					}
		        	cache[filePath] = now;   	
		        	console.log('File change:',filePath);
		        	listenFileMap[filePath].forEach(function(v,k){
		        		mergeFiles(configObjectMap[v]);
		        	});
		        }
		}})(key))
	}catch(e){
		 console.log(e);
	}	
}
console.log('Start listening the files above!');
/*
 *Step4:合并文件
 */
function mergeFiles(configObject){
	//console.dir(configObject);	
	var output = [];
	var encoding = 'utf-8';
	configObject.include.forEach(function(v,k){
		if(fs.existsSync(v)){
             output.push(fs.readFileSync(v,encoding));
		}
	});
	var dirname = path.dirname(configObject.target);
	if(!fs.existsSync(dirname)){
		fs.mkdirSync(dirname);
	}
	fs.writeFileSync(configObject.target, output.join('\n\r'),encoding);
	console.log('Merge complete: ',configObject.target);
}
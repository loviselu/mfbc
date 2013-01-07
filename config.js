//监听文件目录
this.listenDir = [
	'./demo'
]
//排除掉的目录
this.excludeForder = /(?:\.svn|_svn)$/i;

//排除掉的文件
this.excludeFile = /\.ignore\b/i;

//配置文件特征
this.configFileFilter = /\.(?:rhino)$/i;

/*配置对象特征,规范如下
{	
	"projectName1" : {
		target : "out/min.js",
		include :[
			"file1.js",
			"file2.js",
			"file3.js"
		]
	},
	"projectName2" : {
		target : "out/min.js",
		include :[
			"file1.js",
			"file2.js",
			"file3.js"
		]
	}
}
*/
this.configObjectFilter = function(content){
	return content;
}

//生成文件目录,相对路径针对配置文件
this.targetDir = './script';

var	fs	= require("fs"),
	config	= require('./config.js'),
	i;

/**
 * 
 * 递归读取一个目录下所有文件
 * @param {String} root 开始目录
 * @param {Regex} filter 过滤器
 */
this.getFileList = function(root,filter,base,res){
	
	var res		= res || [],
		base	= base || root+'/',
		filter	= filter || /.*/,
		that	= this,
		tmp,
		stat;
	
	tmp = fs.readdirSync(root);	
	
	tmp.forEach(function(n,i){
		try{			
			stat = fs.statSync(root + '/' + n);			
			if(stat.isFile()){				
				if(filter.test(n)){					
					res.push(base + n);
				}
			}else if(stat.isDirectory()){
				if (!config.excludeForder.test(n)) {
					that.getFileList(root + '/' + n, filter, base + n + '/', res);
				}
			}
		}catch(e){
			
		}
	});
	
	return res;
};
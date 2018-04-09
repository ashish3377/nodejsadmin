var http = require('http');
var fs = require("fs");
var mysql = require("mysql");
var qs = require('querystring');
var nodemailer = require('nodemailer');
var formidable = require('formidable');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejsadmin"
});
http.createServer(function(req, res) {
	
	if(req.url === "/index"){
		sendFileContent(res, "view/index.html", "text/html");
	}else if(req.url === "/index?&#pagename"){
		sendFileContentabout(res, "view/index.html", "text/html");
	}else if(req.url === "/admin"){
		sendFileContentabout(res, "view/login.html", "text/html");
	}else if(req.url === "/admin-dashboard"){
		sendFileContentabout(res, "view/dashboard.html", "text/html");
	}else if(req.url === "/cmspagelist"){
		sendFileContentabout(res, "view/pagelist.html", "text/html");
	}else if(req.url === "/cmspageedit"){
		sendFileContentabout(res, "view/pageedit.html", "text/html");
	}else if(req.url === "/cmspageadd"){
		sendFileContentabout(res, "view/pageadd.html", "text/html");
	}else if(req.url === "/menu"){
		sendFileContent(res, "menu.html", "text/html");
	}else if(req.url === "/test"){
		test(res, "view/test.html", "text/html");
	}else if(req.url === "/ajaxload"){
		var html    = "";
		con.query('SELECT * FROM employees',function(err,rows){
		  for (var i = 0; i < rows.length; i++) {
			 html += "<p>Photo:" + rows[i].name + " "+ rows[i].location + "</p>";	  
		};
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();
     });
		
	}else if(req.url === "/ajaxpageload"){
		var html    = "";
		var j=0;
		con.query('SELECT * FROM cms_page',function(err,rows){
		  for (var i = 0; i < rows.length; i++) {
			  var counter = ++j;
			 
			  
			 html += "<tr><td>"+counter+"</td> <td>"+rows[i].title+"</td> <td>"+rows[i].pubdate+"</td> <td><a href=javascript:void(0) onclick=editpage("+rows[i].id+")>Edit</a></td></tr>";	  
		};
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();
     });
		
	}else if(req.url === "/pageedit"){
		if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 3e6)
                req.connection.destroy();
        });

        req.on('end', function () {
			var html  = "";	
			
            var post  = qs.parse(body);
			var sql   = 'SELECT * FROM cms_page WHERE id='+mysql.escape(post.parone);
			//var sql = 'SELECT * FROM tbl_admin ';
			//console.log(sql);	
			con.query(sql,function(err,rows,fields){
					var i = 0;
					res.writeHead(200, {'Content-Type': 'application/json'});
					var employee = {title:rows[i].title,author:rows[i].author,pubdate:rows[i].pubdate,photo:rows[i].photo,photourl:rows[i].photourl};
					//console.log(employee);
					//res.write(employee.toString());
		            res.end(JSON.stringify(employee));
					
					/*var otherArray = ["item1", "item2"];
					var otherObject = {title:rows[i].title,content:rows[i].content};
					var json = JSON.stringify({ 
					  anObject: otherObject, 
					  anArray: otherArray, 
					  another: "item"
					});
					res.end(json);*/
					
			});
			//console.log(employee);
			        
        });
		/*  var html    = "";
		 html += "<p>Photo:Tknak you</p>";	
	   res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();    */    
				 
    }	
		
	}else if(req.url === "/pageblockedit"){
		if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 3e6)
                req.connection.destroy();
        });

        req.on('end', function () {
			var html  = "";	
			
            var post  = qs.parse(body);
			var sql   = 'SELECT * FROM cms_page_block WHERE cmspkid='+mysql.escape(post.parone)+' order by blockid asc';
			//var sql = 'SELECT * FROM tbl_admin ';
			//console.log(sql);	
			con.query(sql,function(err,rows,fields){
					var i = 0;
					res.writeHead(200, {'Content-Type': 'application/json'});
					var employee = {title:rows};
					//console.log(employee);
					//res.write(employee.toString());
		            res.end(JSON.stringify(employee));
					
					/*var otherArray = ["item1", "item2"];
					var otherObject = {title:rows[i].title,content:rows[i].content};
					var json = JSON.stringify({ 
					  anObject: otherObject, 
					  anArray: otherArray, 
					  another: "item"
					});
					res.end(json);*/
					
			});
			//console.log(employee);
			        
        });
		/*  var html    = "";
		 html += "<p>Photo:Tknak you</p>";	
	   res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();    */    
				 
    }	
		
	}else if(req.url === "/lastblockinsertid"){
		if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 3e6)
                req.connection.destroy();
        });

        req.on('end', function () {
			var html  = "";	
			
            var post  = qs.parse(body);
			var sql   = 'SELECT MAX(blockid) as tot FROM cms_page_block WHERE cmspkid='+mysql.escape(post.parone);
			//var sql = 'SELECT * FROM tbl_admin ';
			//console.log(sql);	
			con.query(sql,function(err,rows,fields){
								  
					var i = 0;
					res.writeHead(200, {'Content-Type': 'application/json'});
					var employee = {title:rows[i].tot};
					//console.log(employee);
					//res.write(employee.toString());
		            res.end(JSON.stringify(employee));
					
					/*var otherArray = ["item1", "item2"];
					var otherObject = {title:rows[i].title,content:rows[i].content};
					var json = JSON.stringify({ 
					  anObject: otherObject, 
					  anArray: otherArray, 
					  another: "item"
					});
					res.end(json);*/
					
			});
			//console.log(employee);
			        
        });
		/*  var html    = "";
		 html += "<p>Photo:Tknak you</p>";	
	   res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();    */    
				 
    }	
		
	}else if(req.url === "/logincheck"){
		if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 3e6)
                req.connection.destroy();
        });

        req.on('end', function () {
			var html    = "";					
            var post = qs.parse(body);
			var employee = { email: post.parone, password: post.partwo };
			var sql = 'SELECT * FROM tbl_admin WHERE loginid='+mysql.escape(post.parone)+' and loginpassword='+mysql.escape(post.partwo);
			//var sql = 'SELECT * FROM tbl_admin ';
			//console.log(sql);	
			con.query(sql,function(err,rows,fields){
					//console.log(rows);
				  if(rows.length==1){
				     var i = 0;
					console.log(rows[i].ipaddress);
				  }else if(rows.length==0){	
				  
				  }
					
					html += rows.length;			   
					//console.log(html);
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(html);
		            res.end();
			});
			//console.log(employee);
			        
        });
		/*  var html    = "";
		 html += "<p>Photo:Tknak you</p>";	
	   res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();    */    
				 
    }	
		
	}else if(req.url === "/pageblockupdate"){
		if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            
            if (body.length > 3e6)
                req.connection.destroy();
        });

        req.on('end', function () {
			var html    = "";					
            var post = qs.parse(body);
			var sql = "SELECT * FROM cms_page_block WHERE blockid='"+post.blockid+"' AND cmspkid='"+post.pageid+"'";
			con.query(sql,function(err,rows,fields){
				  if(rows.length==1){
				     var i = 0;
				     var sql = "UPDATE cms_page_block SET title='"+post.title+"', description='"+post.contentdesc+"' WHERE id='"+rows[i].id+"'";
					  con.query(sql,function(err,rows,fields){
						if(err) throw err;
						 console.log(rows.affectedRows + " record(s) updated");
					  });
					
				  }else if(rows.length==0){	
					 var employee = {blockid:post.blockid, cmspkid:post.pageid, title:post.title, description:post.contentdesc, elementtype:post.elementtype };
					   con.query('INSERT INTO cms_page_block SET ?', employee, function(err,rows,fields){
					 });
				  
				  }
					
					html += "Record Updated";			   
					console.log(html);
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(html);
		            res.end();
			});
			
			        
        });
		
				 
    }	
		
	}else if(req.url === "/readmoreoneblockupdate"){
		if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            
            if (body.length > 3e6)
                req.connection.destroy();
        });

        req.on('end', function () {
			var html    = "";					
            var post = qs.parse(body);
			var sql = "SELECT * FROM cms_page_block WHERE blockid='"+post.blockid+"' AND cmspkid='"+post.pageid+"'";
			con.query(sql,function(err,rows,fields){
				  if(rows.length==1){
				     var i = 0;
				     var sql = "UPDATE cms_page_block SET readmoreheading='"+post.readmoreheading+"', readmoreonetitle='"+post.title+"', readmoreoneurl='"+post.url+"' WHERE id='"+rows[i].id+"'";
					  con.query(sql,function(err,rows,fields){
						if(err) throw err;
						 console.log(rows.affectedRows + " record(s) updated");
					  });
					
				  }else if(rows.length==0){	
					 var employee = {blockid:post.blockid, cmspkid:post.pageid, readmoreonetitle:post.title, readmoreoneurl:post.url, readmoreheading:post.readmoreheading,elementtype:post.elementtype };
					   con.query('INSERT INTO cms_page_block SET ?', employee, function(err,rows,fields){
					 });
				  
				  }
					
					html += "Record Updated";			   
					console.log(html);
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(html);
		            res.end();
			});
			
			        
        });
		
				 
    }	
		
	}else if(req.url === "/readmoretwoblockupdate"){
		if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            
            if (body.length > 3e6)
                req.connection.destroy();
        });

        req.on('end', function () {
			var html    = "";					
            var post = qs.parse(body);
			var sql = "SELECT * FROM cms_page_block WHERE blockid='"+post.blockid+"' AND cmspkid='"+post.pageid+"'";
			con.query(sql,function(err,rows,fields){
				  if(rows.length==1){
				     var i = 0;
				     var sql = "UPDATE cms_page_block SET readmoreheading='"+post.readmoreheading+"', readmoretwotitle='"+post.title+"', readmoretwourl='"+post.url+"' WHERE id='"+rows[i].id+"'";
					  con.query(sql,function(err,rows,fields){
						if(err) throw err;
						 console.log(rows.affectedRows + " record(s) updated");
					  });
					
				  }else if(rows.length==0){	
					 var employee = {blockid:post.blockid, cmspkid:post.pageid, readmoretwotitle:post.title, readmoretwourl:post.url, readmoreheading:post.readmoreheading,elementtype:post.elementtype };
					   con.query('INSERT INTO cms_page_block SET ?', employee, function(err,rows,fields){
					 });
				  
				  }
					
					html += "Record Updated";			   
					console.log(html);
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(html);
		            res.end();
			});
			
			        
        });
		
				 
    }	
		
	}else if(req.url === "/readmorethreeblockupdate"){
		if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            
            if (body.length > 3e6)
                req.connection.destroy();
        });

        req.on('end', function () {
			var html    = "";					
            var post = qs.parse(body);
			var sql = "SELECT * FROM cms_page_block WHERE blockid='"+post.blockid+"' AND cmspkid='"+post.pageid+"'";
			con.query(sql,function(err,rows,fields){
				  if(rows.length==1){
				     var i = 0;
				     var sql = "UPDATE cms_page_block SET readmoreheading='"+post.readmoreheading+"', readmorethreetitle='"+post.title+"', readmorethreeurl='"+post.url+"' WHERE id='"+rows[i].id+"'";
					  con.query(sql,function(err,rows,fields){
						if(err) throw err;
						 console.log(rows.affectedRows + " record(s) updated");
					  });
					
				  }else if(rows.length==0){	
					 var employee = {blockid:post.blockid, cmspkid:post.pageid, readmorethreetitle:post.title, readmorethreeurl:post.url, readmoreheading:post.readmoreheading,elementtype:post.elementtype };
					   con.query('INSERT INTO cms_page_block SET ?', employee, function(err,rows,fields){
					 });
				  
				  }
					
					html += "Record Updated";			   
					console.log(html);
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(html);
		            res.end();
			});
			
			        
        });
		
				 
    }	
		
	}else if(req.url === "/readmorefourblockupdate"){
		if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            
            if (body.length > 3e6)
                req.connection.destroy();
        });

        req.on('end', function () {
			var html    = "";					
            var post = qs.parse(body);
			var sql = "SELECT * FROM cms_page_block WHERE blockid='"+post.blockid+"' AND cmspkid='"+post.pageid+"'";
			con.query(sql,function(err,rows,fields){
				  if(rows.length==1){
				     var i = 0;
				     var sql = "UPDATE cms_page_block SET readmoreheading='"+post.readmoreheading+"', readmorefourtitle='"+post.title+"', readmorefoururl='"+post.url+"' WHERE id='"+rows[i].id+"'";
					  con.query(sql,function(err,rows,fields){
						if(err) throw err;
						 console.log(rows.affectedRows + " record(s) updated");
					  });
					
				  }else if(rows.length==0){	
					 var employee = {blockid:post.blockid, cmspkid:post.pageid, readmorefourtitle:post.title, readmorefoururl:post.url, readmoreheading:post.readmoreheading,elementtype:post.elementtype };
					   con.query('INSERT INTO cms_page_block SET ?', employee, function(err,rows,fields){
					 });
				  
				  }
					
					html += "Record Updated";			   
					console.log(html);
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(html);
		            res.end();
			});
			
			        
        });
		
				 
    }	
		
	}else if(req.url === "/imageblockupdate"){
		if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
            
            if (body.length > 3e6)
                req.connection.destroy();
        });

        req.on('end', function () {
			var html    = "";					
            var post = qs.parse(body);
			var sql = "SELECT * FROM cms_page_block WHERE blockid='"+post.blockid+"' AND cmspkid='"+post.pageid+"'";
			con.query(sql,function(err,rows,fields){
				  if(rows.length==1){
				     var i = 0;
				     var sql = "UPDATE cms_page_block SET photoscms='"+post.photo+"' WHERE id='"+rows[i].id+"'";
					  con.query(sql,function(err,rows,fields){
						if(err) throw err;
						 console.log(rows.affectedRows + " record(s) updated");
					  });
					
				  }else if(rows.length==0){	
					 var employee = {blockid:post.blockid, cmspkid:post.pageid, photoscms:post.photo, elementtype:post.elementtype };
					   con.query('INSERT INTO cms_page_block SET ?', employee, function(err,rows,fields){
					 });
				  
				  }
					
					html += "Record Updated";			   
					console.log(html);
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(html);
		            res.end();
			});
			
			        
        });
		
				 
    }	
		
	}else if(req.url === "/pageadd"){
		
		
	   if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            if (body.length > 6e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
			var employee = { title:post.heading, author:post.author, pubdate:post.date, photo:post.image, photourl:post.imageurl };
			con.query('INSERT INTO cms_page SET ?', employee, function(err,rows,fields){
			  //console.log(rows.insertId);
			    var html    = "";
				html += rows.insertId;	
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(html);
				res.end();
			  
			});
			        
        });
		
    }	
		
		/*var html    = "";
		html += "<p>Record Update</p>";	
	    res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();*/
		
	}else if(req.url === "/pageupdate"){
		
		
	   if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 6e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
			var employee = { title:post.heading, author:post.author, pubdate:post.date, photo:post.image, photourl:post.imageurl };
			var sql = "UPDATE cms_page SET title='"+post.heading+"', author='"+post.author+"', pubdate='"+post.date+"', photo='"+post.image+"', photourl='"+post.imageurl+"' WHERE id='"+post.pageidedit+"'";
			//console.log(sql);
			con.query(sql,function(err,rows,fields){
			  if(err) throw err;
			   console.log(rows.affectedRows + " record(s) updated");
			});
			        
        });
		
    }	
		
		var html    = "";
		html += "<p>Record Update</p>";	
	    res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();
		
	}else if(req.url === "/pageblockdelete"){
		
		
	   if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            if (body.length > 6e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
			var employee = { title:post.heading, author:post.author, pubdate:post.date, photo:post.image, photourl:post.imageurl };
			
			var sql = "DELETE FROM cms_page_block WHERE blockid='"+post.blockid+"' AND cmspkid='"+post.pageid+"'";
			
			con.query(sql,function(err,rows,fields){
			  //console.log(rows.insertId);
			        html += "Record Updated";			   
					console.log(html);
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(html);
		            res.end();
			  
			});
			        
        });
		
    }	
		
		/*var html    = "";
		html += "<p>Record Update</p>";	
	    res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();*/
		
	}else if(req.url === "/formsubmit"){
		
		
	   if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);
			var employee = { name: post.parone, location: post.partwo };
			con.query('INSERT INTO employees SET ?', employee, function(err,res){
			  if(err) throw err;
			  
			});
			        
        });
		
    }	
		
		
		 //console.log(req);
		var html    = "";
		 html += "<p>Photo:Tknak you</p>";	
	   res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(html);
		res.end();
	}
	
	else if(req.url === "/"){
		//res.writeHead(200, {'Content-Type': 'text/html'});
		//res.write('<b>Hey there!</b><br /><br />This is the default res. reqed URL is: ' + req.url);
		sendFileContent(res, "view/index.html", "text/html");
	}
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(req.url.toString())){
		
		sendFileContent(res, req.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "text/css");
	}
	else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "image/jpg");
	}
	else if(/^\/[a-zA-Z0-9\/]*.png$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "image/png");
	}
	else if(/^\/[a-zA-Z0-9\/]*.gif$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "image/gif");
	}
	else if(/^\/[a-zA-Z0-9\/]*.jpeg$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "image/jpeg");
	}
	else if(/^\/[a-zA-Z0-9\/]*.ttf$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "application/x-font-ttf");
	}
	else if(/^\/[a-zA-Z0-9\/]*.woff$/.test(req.url.toString())){
		sendFileContent(res, req.url.toString().substring(1), "application/font-woff");
	}
	else{
		console.log("Not Found! reqed URL is: " + req.url);
		res.end();
	}
}).listen(5001);

function sendFileContent(res, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			res.writeHead(404);
			res.write("Not Found!");
		}
		else{
			res.writeHead(200, {'Content-Type': contentType});
			res.write(data);
		}
		res.end();
	});
}
function sendFileContentabout(res, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			res.writeHead(404);
			res.write("Not Found!");
		}
		else{
			res.writeHead(200, {'Content-Type': contentType});
			res.write(data);
		
		}
		res.end();
	});
}

function test(res, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			res.writeHead(404);
			res.write("Not Found!");
		}
		else{
			res.write(templateEngine(data.toString(), {
       name: 'Ryan Dahl',
       node: process.versions.node,
       v8: process.versions.v8,
       time: new Date(),
       url: res.url
    }));
            
		}
		res.end();
	});
}

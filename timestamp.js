

var express = require('express')
var path = require('path')
//var logger = require('morgan')

var port=8080
var app=express()

var months =['January','February','March','April','May',
          'June','July','August','September','October','November','December'];

function unixToNatural(unix){
      var date = new Date(unix * 1000);
              
      var month = months[date.getMonth()];
      var day = date.getDate();
      var year = date.getFullYear();
    
      var result = month + ' ' + day + ', ' + year;
      return result;
    }

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/:time',function(req,res){
    //res.send(req.params.time)	
    var r=req.params.time
    var datum=r.split(' ')
    var rd
    var unixtime,natural
    var jsonreturn
    
    if(checkNatural(r))
     {//res.send("datum.length "+datum.length+" "+datum[0]+"!"+datum[1]+"!"+datum[2]) 
	  rd=convertDate(r)	 // gets natural Date in numbers instead of string 
	  
	  //converts to Unix Time ! ! ! 
	  unixtime=new Date(rd.year,rd.month,rd.day,0,0,0,0).getTime() / 1000	 
	  
	  natural=r 
	  jsonreturn={"unix": unixtime, "natural": natural }
	  console.log(rd.year+"-"+rd.month+"-"+rd.day)
	  console.log("Date return "+unixtime)	  
	 }
    else
     {  unixtime=parseInt(r)
		if( !isNaN(unixtime) )
		  { natural=unixToNatural(unixtime)
                    jsonreturn={"unix": unixtime, "natural": natural } }
		else	  
		 {jsonreturn={"unix": null, "natural": null }}
	 }
	 console.log("json return "+jsonreturn.unix+" "+jsonreturn.natural) 
         res.json(jsonreturn)
})

app.listen(port, function(err) {

if (err) {return console.log('something bad happened', err)}
console.log('server is listening on '+port)
})

function checkNatural(t){
	var datum=t.split(' ')
	var day,l
    
    if(datum.length==3)
     {l=datum[1].length
	  if(l==2)
	    {day=datum[1][0]
		 day=parseInt(day)}
	  if(l==3)
	   {day=datum[1][0]+datum[1][1]
		 day=parseInt(day)} 	 
	  if( (l!=2) && (l!=3)){return false}	 
	  console.log("day "+day)	 
	  
	  if(months.indexOf(datum[0])<0){return false} 
	  
	  //compatibility with 32bit unix time which ends in 2038 and goes back to 1901
	  if(parseInt(datum[2])<1902){return false}
	  console.log("year "+datum[2])	 
	  return true	  
	 }	
    else
     {return false } 	 
}

function convertDate(t)
  { var datum=t.split(' ')
	var day,l,year,month
    
    if(datum.length==3)
     {l=datum[1].length
	  if(l==2)
	    {day=datum[1][0]
		 day=parseInt(day)}
	  if(l==3)
	   {day=datum[1][0]+datum[1][1]
		 day=parseInt(day)} 	 
	  if( (l!=2) && (l!=3)){return false}	 
	
	  
	  if(months.indexOf(datum[0])<0){return false} 
	  
	  //compatibility with 32bit unix time which ends in 2038 and goes back to 1901
	  if(parseInt(datum[2])<1902){return false}
     }
    else{return false}  	
   month=months.indexOf(datum[0])+1	
   year=parseInt(datum[2])
   
   return {year: year, month: month, day: day}	  
 }	  


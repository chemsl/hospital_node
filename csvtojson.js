var csv = require("csvtojson");

// Convert a csv file with csvtojson
csv()
  .fromFile('./test.csv')
  .then(function(jsonArrayObj){ //when parse finished, result will be emitted here.
     console.log(jsonArrayObj); 
   })
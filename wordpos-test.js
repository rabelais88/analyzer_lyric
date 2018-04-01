const wordpos = require('wordpos');
const wp = new wordpos();

wp.getNouns('The angry bear chased the frightened little squirrel.', function(result){
  console.log(result);
});

wp.getAdjectives('The angry bear chased the frightened little squirrel.', function(result){
  console.log(result);
});

console.log(wordpos.stopwords.indexOf('that'))
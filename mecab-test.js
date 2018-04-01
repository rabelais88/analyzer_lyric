//mecab-ko test linux + mecab-ko + mecab-ko-dic required

var fs = require('fs')
var execSync = require('child_process').execSync
var srcText = `It's the, it's the 2011년을 여는 anthem
I'll be the killer. K 두 개로 널 터는 래퍼
Casino dealer. I'll be the leader. 선은 내꺼
하나를 질러 이 판을 키워 열을 챙겨
I'll take you to school. 학교로 가지, lost ones
Nigga fake들은 나를 만날 때는 no luck
지금 이 테이블에 게임은 내가 따른 hold up
내 카드를 똑바로 봐. 내 손의 패는 포커`

parse(srcText,result=>{
  for(var i in result){
    var word = result[i][0]
    var pos = result[i][1]
    if (word=="EOS") continue
    if (pos.includes("NNG")){
      console.log(word+":"+pos)
    }
  }
})

function parse(text,cb){
  fs.writeFileSync('TMP_INPUT_FILE',text,"UTF-8")

  var cmd = [
    'mecab',
    'TMP_INPUT_FILE',
    '--output=TMP_OUTPUT_FILE'
  ].join(" ")

  var opt = {encoding:'UTF-8'}
  var res = []
  try{
    execSync(cmd,opt)
    res = fs.readFileSync("TMP_OUTPUT_FILE",'UTF-8')
  }
  catch(e) { console.log(e)}
  

  res = res.replace(/\r/g, "")
  res = res.replace(/\s+$/, "")
  var lines = res.split("\n")

  var res = lines.map(line=>{
    return line.replace('\t',',').split(',')
  })
  cb(res)
}
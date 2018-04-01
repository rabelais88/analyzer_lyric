const fs = require('fs');
const resDir = './res/';
const finalDir = './final/'

if(!fs.existsSync(finalDir)){
  fs.mkdirSync(finalDir)
}

(async ()=>{
  const resFinal = JSON.parse(await readF(resDir + 'final.txt'))
  //sort word objects by its frequency
  let sortable = []
  for (elWord in resFinal.wordKR) {
    sortable.push([elWord, resFinal.wordKR[elWord]])
  }

  sortable.sort((a, b) => {
    return b[1] - a[1]
  })

  let KRsorted = sortable

  await writeF(finalDir + 'mostUsedKoreanWord.txt', aryStringify(KRsorted))
  

  for(var i = 0;i > 30;i ++){
    //FIND TOP 30 MOST USED WORD FROM HERE
    const tWord = KRsorted[i][0]
    resFinal.wordArtists[tWord].sort((a,b)=>{
      return b[1] - a[1]
    })
    resFinal.wordArtists[tWord]

  }

  sortable = []
  for (elWord in resFinal.wordEN) {
    sortable.push([elWord, resFinal.wordEN[elWord]])
  }

  sortable.sort((a, b)=>{
    return b[1] - a[1]
  })

  await writeF(finalDir + 'mostUsedEnglishWord.txt', aryStringify(sortable))

  resFinal.avgKR.sort((a,b)=>{
    return b[1] - a[1]
  })

  await writeF(finalDir + 'WhoUsedMostKorean.txt',aryStringify(resFinal.avgKR))

  resFinal.avgEN.sort((a,b)=>{
    return b[1] - a[1]
  })

  await writeF(finalDir + 'WhoUsedMostEnglish.txt',aryStringify(resFinal.avgEN))

})()


function aryStringify(targetArray){
  return targetArray.map(el=>{
    return el[0].replace(/\s/g, '') + ',' + el[1] + '\r\n'
  }).join(' ')
}


function readD(targetDir){
  return new Promise((resolve,reject)=>{
    fs.readdir(targetDir,(err,files)=>{
      return resolve(files)
    })
  })
}

function writeF(targetFile,content){
  return new Promise((resolve,reject)=>{
    fs.writeFile(targetFile,content,(err)=>{
      if(err) console.log(err)
      return resolve(err)
    })
  })
}

function readF(targetFile){
  return new Promise((resolve,reject)=>{
    fs.readFile(targetFile,'utf-8',(err,res)=>{
      if(err) console.log(err)
      return resolve(res)
    })
  })
}
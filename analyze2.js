const fs = require('fs');
const resDir = './res/';
const finalDir = './final/'

if(!fs.existsSync(finalDir)){
  fs.mkdirSync(finalDir)
}

(async ()=>{
  const resFinal = JSON.parse(await readF(resDir + 'final.txt'))


  resFinal.trackPublished.sort((a,b)=>{
    return b[1] - a[1]
  })
  await writeF(finalDir + 'totalNumberOfTracks.txt',aryStringify(resFinal.trackPublished))

  
  resFinal.wordTotal.sort((a,b)=>{
    return b[1] - a[1]
  })
  await writeF(finalDir + 'WhoIsMostVerbose.txt',aryStringify(resFinal.wordTotal))

  resFinal.avgUnique.sort((a,b)=>{
    return b[1] - a[1]
  })
  await writeF(finalDir + 'WhoIsMostCreative.txt',aryStringify(resFinal.avgUnique))

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
  
  let lover = resFinal.wordArtists['사랑'].sort((a,b)=>{
    return b[1] - a[1]
  })
  await writeF(finalDir + 'WhoLovesTheMost.txt',aryStringify(lover))
  lover = []


  let dick = resFinal.wordArtists['좆'].sort((a,b)=>{
    return b[1] - a[1]
  })
  await writeF(finalDir + 'WhoDickTheMost.txt',aryStringify(dick))
  dick = []

  let poop = resFinal.wordArtists['똥'].sort((a,b)=>{
    return b[1] - a[1]
  })
  await writeF(finalDir + 'WhoPoopTheMost.txt',aryStringify(poop))
  poop = []

  let money = resFinal.wordArtists['돈'].sort((a,b)=>{
    return b[1] - a[1]
  })
  await writeF(finalDir + 'WhoMoneyTheMost.txt',aryStringify(money))
  money = []

  let friend = resFinal.wordArtists['친구'].sort((a,b)=>{
    return b[1] - a[1]
  })
  await writeF(finalDir + 'WhoFriendTheMost.txt',aryStringify(friend))
  friend = []

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
    //return el[0].replace(/\s/g, '') + ',' + el[1] + '\n'
    return `"${el[0]}",${el[1]}\r\n`
  }).join('')
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
    fs.writeFile(targetFile,'\uFEFF' + content, { encoding: 'utf8' },(err)=>{
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
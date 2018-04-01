const fs = require('fs');
const resDir = './res/';
const analyzer = require('./mecab-mod.js');

(async () =>{
  console.log(`------lyric analyzer -----------------------`)
  let artists = await readD(resDir)
  artists = artists.filter(elArtist=>{
    return !elArtist.includes('.txt')
  })
  console.log(`------${artists.length} artist(s) total`)
  const resFinal = {
     word:{}
  }
  for(var i=0;i < artists.length; i++){
     console.log(`-------analyzing ${i+ 1} / ${artists.length + 1} artists------------`)
    //loading up individual artist
    const tracks = await readD(resDir + artists[i])

    let resArtist = {
      totalAmount: 0,
      averageAmount : 0,
      word: {}, //all unique word repetitions
      tracks:[] //how many unique words are used per a track(later calculated into average)
    }    

    for(var j=0;j < tracks.length; j++){
      console.log(`analyzing ${j + 1} / ${tracks.length + 1} tracks...`)
      const targetLyric = await readF(resDir + artists[i] + '/' + tracks[j])

      //lyrics analyzation
      let resAnal = await analyze(targetLyric)
      //unique words per track
      let trackWord = {

      }
      let trackTotal = 0 //amount of total words per track

      resAnal.map(elMorp=>{
        if(elMorp[1] === 'NNG'){ //if the word is a distinctive noun

          //for track
          if(trackWord[elMorp[0]]){
            trackWord[elMorp[0]]++
          }else{
            trackWord[elMorp[0]]=1
            trackTotal ++ // increase unique number of word per track
          }

          //for artists
          if(resArtist.word[elMorp[0]]){
            resArtist.word[elMorp[0]]++
          }else{
            resArtist.word[elMorp[0]] = 1
          }

          //for total
          if(resFinal.word[elMorp[0]]){
            resFinal.word[elMorp[0]]++
          }else{
            resFinal.word[elMorp[0]] = 1
          }
        }
      })
      resArtist.tracks.push(trackTotal)
    }
    //console.log(resArtist)
    //SUM UP INDIVIDUAL RESULT WITH REST
    await writeF(resDir + artists[i] + '.txt', JSON.stringify(resArtist))

  }
  //console.log(resFinal)
  //WRITE FINAL RESULT HERE
  await writeF(resDir + '/final.txt', JSON.stringify(resFinal))
})()

function analyze(txt){
  return new Promise((resolve,reject)=>{
    analyzer(txt,(res)=>{
      return resolve(res)
    })
  })
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
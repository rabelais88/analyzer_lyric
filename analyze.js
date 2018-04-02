const fs = require('fs');
const resDir = './res/';
const analyzer = require('./mecab-mod.js');
const wordpos = require('wordpos');
const wp = new wordpos();

(async () =>{
  console.log(`------lyric analyzer -----------------------`)
  let artists = await readD(resDir)
  artists = artists.filter(elArtist=>{
    return !elArtist.includes('.txt')
  })
  console.log(`------${artists.length} artist(s) total`)
  const resFinal = {
     wordKR:{},
     wordEN:{},
     wordArtists:{},
     avgEN:[],
     avgKR:[],
     avgUnique:[],
     trackPublished:[],
     wordTotal:[]
  }

  for(var i=0;i < artists.length; i++){
     console.log(`-------analyzing ${i+ 1} / ${artists.length + 1} artists------------`)
    //loading up individual artist
    const tracks = await readD(resDir + artists[i])

    let resArtist = {
      wordTotal: 0,
      avgEN: [],
      avgKR: [],
      wordKR: {}, //all unique word repetitions
      wordEN: {},
      avgTrack:[], //how many unique words are used per a track(later calculated into average)
      trackPublished: tracks.length,
      avgUnique:[]
    }    
    resFinal.trackPublished.push([artists[i],tracks.length])

    for(var j=0;j < tracks.length; j++){
      console.log(`analyzing ${j + 1} / ${tracks.length + 1} tracks...`)
      const targetLyric = await readF(resDir + artists[i] + '/' + tracks[j])

      //lyrics analyzation
      let resAnal = await analyze(targetLyric)
      //unique words per track
      let trackWordKR = {

      }
      let trackWordENtmp = []
      let trackUniqueTotal = 0 //amount of total words per track
      let trackEN = 0
      let trackKR = 0
      let trackTotal = 0

      resAnal.map(elMorp=>{
        const targetType = elMorp[1]
        const targetWord = elMorp[0]
        if(targetType === 'NNG'){ //if the word is a distinctive noun
          trackKR ++
          trackTotal ++
          resArtist.wordTotal++
          //for track
          if(trackWordKR[targetWord]){
            trackWordKR[targetWord]++
          }else{
            trackWordKR[targetWord]=1
            trackUniqueTotal ++ // increase unique number of word per track
          }

          //for artists
          if(resArtist.wordKR[targetWord]){
            resArtist.wordKR[targetWord]++
          }else{
            resArtist.wordKR[targetWord] = 1
          }

          //for total
          if(resFinal.wordKR[targetWord]){
            resFinal.wordKR[targetWord]++
          }else{
            resFinal.wordKR[targetWord] = 1
          }
        }else if(targetType === 'SL' && targetWord.length > 2){
          trackEN ++
          trackTotal ++
          resArtist.wordTotal ++
          if( wordpos.stopwords.indexOf(targetWord) === -1) { // if the targetted english word is not stopword
            if(resArtist.wordEN[targetWord]){
              resArtist.wordEN[targetWord] ++
            }else{
              resArtist.wordEN[targetWord] = 1
            }
            
            if(resFinal.wordEN[targetWord]){
              resFinal.wordEN[targetWord] ++
            }else{
              resFinal.wordEN[targetWord] = 1
              trackUniqueTotal++
            }
          }
        }
      })
      resArtist.avgTrack.push(trackTotal)
      
      //average KR/EN ratio per a track
      resArtist.avgEN.push(trackEN / trackTotal)
      resArtist.avgKR.push(trackKR / trackTotal)

      //average number of unique words per a track
      resArtist.avgUnique.push(trackUniqueTotal / trackTotal)
    }
    //console.log(resArtist)
    //SUM UP INDIVIDUAL RESULT WITH REST
    //await writeF(resDir + artists[i] + '.txt', JSON.stringify(resArtist))

    for(var k=0;k<Object.keys(resArtist.wordKR).length;k++){
      const tWord = Object.keys(resArtist.wordKR)[k]
      if(resFinal.wordArtists[tWord]){
        resFinal.wordArtists[tWord].push([artists[i],resArtist.wordKR[tWord]])
      }else{
        resFinal.wordArtists[tWord] = []
        resFinal.wordArtists[tWord].push([artists[i], resArtist.wordKR[tWord]])
      }
    }

    for(var k=0;k<Object.keys(resArtist.wordEN).length;k++){
      const tWord = Object.keys(resArtist.wordEN)[k]
      if(resFinal.wordArtists[tWord]){
        resFinal.wordArtists[tWord].push([artists[i],resArtist.wordEN[tWord]])
      }else{
        resFinal.wordArtists[tWord] = []
        resFinal.wordArtists[tWord].push([artists[i],resArtist.wordEN[tWord] ])
      }
    }
    
    //total number of words of the artist
    resFinal.wordTotal.push([artists[i],resArtist.wordTotal])

    //average Korean/English ratio of the artist

    resArtist.avgEN = resArtist.avgEN.reduce((total,num)=>{return total + num}) / resArtist.avgEN.length
    resArtist.avgKR = resArtist.avgKR.reduce((total,num)=>{return total + num}) / resArtist.avgKR.length

    //average unique words ratio per a track of an artist
    resArtist.avgUnique = resArtist.avgUnique.reduce((total,num)=>{return total + num}) / resArtist.avgUnique.length

    resFinal.avgEN.push([artists[i],resArtist.avgEN])
    resFinal.avgKR.push([artists[i],resArtist.avgKR])
    resFinal.avgUnique.push([artists[i],resArtist.avgUnique])
    console.log(`the ${artists[i]} average of KR vs EN : ${resArtist.avgKR} vs ${resArtist.avgEN}`)
   //resFinal[artists[i]] = Object.assign(resArtist)
    resFinal.trackPublished.push([artists[i],tracks.length])

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
export let getActor = (data) => {
  console.log('...getActor...')
   let tmpStr = '';
   data.map(function(dData, index){
     if(index == 0){
       tmpStr += dData.name;
     }
     else{
       tmpStr += ' / ' + dData.name;
     }
   })
   return tmpStr;
}

export let getGenres = (data) => {
  return data.join('/');
}

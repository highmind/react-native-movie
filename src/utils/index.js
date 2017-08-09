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

export let getScore = (data) => {
  return data==0 ? '暂无评分' : `${data}分`;
}

export let getDirector = (data) => {
  let director = '';
  if(data.length > 0){  //当导演数据为空的时候，进行数据处理
    director = data[0].name;
  }else{
     director = '未知';
  }
  return director;
}

export let trim = (data) => {
  return data.replace(/^\s+|\s+$/gm,'');
}

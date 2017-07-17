import { combineReducers } from 'redux'  //导入合并reducer方法
import { TEST,
} from '../actions/actions' //导入需要的actionType


let testData = {
  text:'test redux'
}

function testReducer(state= testData, action){
  switch(action.type){
    case TEST:
      return action.payload
    default:
      return state
  }
}

//合并多个reducer,大型项目中，合并拆分成文件的 reducer，方便维护
const rootReducer = combineReducers({
  testReducer,
})

export default rootReducer

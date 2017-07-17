
/*
 * action 类型
 */
export const TEST = 'TEST';


export function testAction(data){
  return {
    type: TEST,
    payload:{
      text:'test redux'
    }
  }
}

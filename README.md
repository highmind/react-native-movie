### 环境要求：
  node版本：6.0以上
  * Java sdk
  * android sdk
  * android studio
  * react-native-cli

### 调试
  * 安卓模拟器，开启js远程调试
### 使用样式
  * 使用StyleSheet创建
  * 组件中使用style
  ``` javascript
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22
    },
    title:{
      fontSize:20
    }
  });
  <View style={styles.title}></View>
  ```

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

  ### 界面问题
    * 界面内容超过一屏，则使用scrollView

  ### 组件相关
    * Text组件
      1. 可以嵌套使用，可以css继承
        ``` javascript
        <Text style={styles.whiteTxt}>
          <Text style={styles.movieName}>{title}{'\n'}</Text>
          <Text>{aka[0]}{'\n'}</Text>
        </Text>
        ```
      2. \n 可以实现换行
      3. numberOfLines 控制文本行数，超出行数 显示...
    * FlatList
      1. 支持下拉刷新
      2. 支持上拉加载
      3. keyExtractor属性指定使用id作为列表每一项的key

  ### 性能优化
    * 使用  PureComponent

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

### 问题
  1. FlatList问题
    * onEndReached在数据为空的时候，或者在返回数据不足一屏高度时，会再次触发
  2. TextInput实时搜索问题
    * 快速输入和删除问题
    * 需要使用lodash.debounce
    * 节流控制
    * 请求时序控制
  3. ImageBackground使用本地图片高度无法自适应问题
    * 加上没有宽度和颜色的边框
    ``` javascript
     <ImageBackground
     style={{borderWidth:0,borderColor:'rgba(0,0,0,0)'}}
     source={require('../assets/celbg.png')}>
     </ImageBackground>
     ```
  4. 绝对定位元素 不加样式之前，无法实现 width 100%
### 路由和界面切换
  1. 使用react-navigation
    * StackNavigator 堆栈式
    * TabNavigator tab切换式
      1. 和StackNavigator混用问题：TabNavigator配置完成以后，直接导出，在StackNavigator的 screen中使用即可
### 性能优化
    * 使用  PureComponent

### 安卓打包
   ``` javascript
   ./gradlew assembleRelease
   ```
### 视频播放
  * react-native-video
  * Slider 实现进度条

### 实现功能
  1. 即将上映
  2. 正在热映
  3. 电影详情
  4. 短评

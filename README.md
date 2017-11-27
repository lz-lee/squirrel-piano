### npm install

### 开发 npm run dev

### 打包 npm run build


#### first-child 无效
```
  html
  <div class="wrap">
    <h1 class="title">title</h1>
    <p>文字</p>
    <p>文字</p>
    <p>文字</p>
  </div>

  css

  p:first-child{
    color: red;
  }

```
* 原因： first-child，为父元素下第一个子元素，前面不能出现兄弟节点

* 改进： 使用first-of-type 伪类，或者 nth-child(2)
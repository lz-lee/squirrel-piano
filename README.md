### 一、开始

  ### npm install

  ### 开发 npm run dev

  ### 打包公共模块 npm run dll

  ### 打包 npm run build


### 二、DLL(动态链接库) 打包优化

#### 1、 利用 [dll-plugin](https://doc.webpack-china.org/plugins/dll-plugin/) 把公用代码打成一个dll.js 文件，生产manifest.json 作为共用代码的映射，以在DllReferencePlugin里使用

#### 2、在业务代码的配置文件中，用DllReferencePlugin并进行编译，达到利用DllReferencePlugin让业务代码和Dll文件实现关联的目的。

#### 3、多入口需要在head中手动引入dll.js 以及css目录下的dll.css

#### 4、使用 [add-asset-html-webpack-plugin](https://github.com/SimenB/add-asset-html-webpack-plugin) 插件完成自动引入dll文件. 
function createElement(type, config={}, children) { 
      // type 节点  config 是节点  的属性 children 是节点的内容 
      let props={}; 
      // 遍历 config  设置props
      for(let propsName in config){
        props[propsName]=config[propsName]
      };
      let childrenLength = arguments.length-2;
      if(childrenLength==1){
        props.children=children
      }else if( childrenLength >1){
        props.children=Array.from(arguments).slice(2)
      }
      let element={type,props}
      return element // 虚拟dome对象
  }
  
  // 把创建的虚拟啊dome对象转为真实DOM元素最后插入到页面中
  function render(virtureDOM, container, callback) {
    let { type, props } = virtureDOM || {};
    let realDom = document.createElement(type);
  
    for (let attr in props) {
      if (!props.hasOwnProperty(attr)) break; // 如果不是私有属性 直接跳出 说明已经遍历到原型上了
      if (!props[attr]) continue; // 如果这个attr没有有效值，那么继续找下一个
      const val = props[attr];
      // 处理classname变成class
      if (attr === 'className') realDom.setAttribute('class', val);
  
      else if (attr === 'children') { // 处理children
        if (typeof val === 'string') { // 如果只有一个字符串children 那么直接渲染text出来
          let text = document.createTextNode(val);
          realDom.appendChild(text);
        }
        else if (val instanceof Array) { // 如果children是数组， 那么就得遍历这个数组分情况再渲染
          for (let i = 0; i < val.length; i++) {
            if (typeof val[i] === 'string') {
              let text = document.createTextNode(val[i]);
              realDom.appendChild(text);
            } else {
              render(val[i], realDom);
            }
          }
        }
        else { // 如果children只有一个且不是数组也不是字符串 那么应该是createElement出来的虚拟dom。递归
          render(val, realDom);
        }
      }
  
      else if (attr === 'style') { // 处理style属性
        if (val === '') continue; // style 有可能值为空字符串
        for (let sty in val) {
          if (val.hasOwnProperty(sty)) realDom['style'][sty] = val[sty];
        }
      } else realDom.setAttribute(attr, val); // 基于setAttribute可以让设置的属性表现在html的结构上
    }
    container.appendChild(realDom);
    callback && callback();
  }
  
  const virtureDom2= createElement('span',
    {}, 'age is 18!');
  
  const virtureDom = createElement('div',
    {
      id: 'box',
      className: 'lp',
      style: { color: 'red' },
      key: 12,
      ref: 'refs'
    }, 'my name is LanPang ', virtureDom2);
  
  
  render(virtureDom, document.getElementById('app'), () => console.log('finish'));
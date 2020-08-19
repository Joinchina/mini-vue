class Compiler {
    constructor(vm){
        this.el=vm.$el
        this.vm=vm
        this.compile(this.el)
    }
    //编译模板处理文本模板和元素节点
    compile(el){
        let childNode = el.childNodes
        Array.from(childNode).forEach(node=>{
            //处理文本节点
            if(this.isTextNode(node)){
                this.complieText(node)
            }else if(this.isElementNode(node)){
                this.compileElement(node)
            }

            //判断是否有子节点，如果有则递归调用自己
            if(node.childNodes&&node.childNodes.length!=0){
                this.compile(node)
            }
        })
    }
    //编译元素节点处理指令
    compileElement(node){
        Array.from(node.attributes).forEach(attr=>{
            //判断是否时指令
            let attrName = attr.name
            if(this.isDirective(attrName)){
                attrName =attrName.substr(2)
                let key = attr.value
                this.update(node,key,attrName)
            }
        })
    }
    update(node,key,attrName){
        let updateFn = this[attrName+'Updater']
        updateFn && updateFn.call(this,node,this.vm[key],key)
    }
    //编译v-text
    textUpdater(node,value,key){
        node.textContent=value
        //创建watcher对象
        new Watcher(this.vm,key,(newValue)=>{
            node.textContent = newValue
        })
    }
    //编译modeo指令
    modelUpdater(node,value,key){
        node.value=value
        //创建watcher对象
        new Watcher(this.vm,key,(newValue)=>{
            node.value = newValue
        })
        //为node注册时间实现双向绑定
        node.addEventListener('input',()=>{
            this.vm[key] = node.value
        })
    }
    //编译文本节点，处理差值表达式
    complieText(node){
        console.dir(node)
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if(reg.test(value)){
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg,this.vm[key])
            //创建watcher对象
            new Watcher(this.vm,key,(newValue)=>{
                node.textContent = newValue
            })
        }
    }
    //判断元素属性是否时指令
    isDirective(attrName){
        return attrName.startsWith('v-')
    }
    //判断节点是否时文本节点
    isTextNode(node){
        return node.nodeType ===3
    }
    //判断节点是否时元素节点
    isElementNode(node){
        return node.nodeType ===1
    }
}

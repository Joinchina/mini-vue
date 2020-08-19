class Observer {
    constructor(data){
        this.walk(data)
    }
    //遍历所有data中的属性
    walk(data){
        //判断是否时对象
        if(!data || typeof data != 'object'){
            return
        }
        //遍历对象的所有属性
        Object.keys(data).forEach(key=>{
            this.defineReacttive(data,key,data[key])
        })
    }
    defineReacttive(obj,key,val){
        let _this=this
        //创建dep对象
        let dep= new Dep()
        //如果时对象则转化为响应式数据
        this.walk(val)
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                //收集依赖
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set(newValue){
                if(newValue === val){
                    return
                }
                val = newValue
                _this.walk(val)
                //数据变化了需要发送通知
                dep.notify()
            }
        })
    }
}

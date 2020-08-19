class Watcher {
    constructor(vm,key,cb){
        this.vm=vm;
        //data中的属性
        this.key=key;
        //回调函数更新试图
        this.cb=cb;
        //把watcher对象记录到dep的静态属性target中
        Dep.target = this;
        //促发get方法，再get方法中调用addsub
        this.oldValue=vm[key];
        Dep.target=null
    }
    //当属性变化时更新视图
    update(){
        let newValue=this.vm[this.key]
        if(this.oldValue === newValue){
            return
        }
        this.cb(newValue)
    }
}

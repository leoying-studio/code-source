const ObjectSimulator(function() {
    
  function create(o) {
     function F(){}
     F.prototype = o;
     return new F();
  }

  function getPrototypeOf(f) {
    return f.constructor.prototye;
  }
    
  /* a {}
   * b function
   */
  function instanceOf(a, b) {
     const proto = getPrototypeOf(a);
     const prototype = b.prototype;
     
     while(true) {
        if (!proto) {
          return false;
        }
        if (proto === prototype) {
           return true;
        }
         
        proto = getPrototypeOf(proto)
     }
  }
    
    
  return {
    create,
    getPrototypeOf,
    instanceOf
  }
})()

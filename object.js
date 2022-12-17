const object = (function() {
    
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
     let proto = getPrototypeOf(a);
     let prototype = b.prototype;
     
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

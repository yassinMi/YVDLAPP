//02ev the purpose of creating this rather trivial module is avoiding cyclic import
//this aims to provide a bench of utlis that are required anywere else
// BUT without importing anything from the src modules


export function verbo(str:any, degree=1,write_log=true,force_log=false) {
    let log_flag = false
    
        console.log(str)
       

    return
    /*
    if(force_log||log_flag){
        if(str!==null && typeof str ==='object'){
            str = JSON.stringify(str,null," ")
        }
        fn.appendFile(( LOG_FILE),"\r\n"+((str.toString()+"").replace(/\\n/g,"\\r\\n"))) 
    }
    */
   
    
}
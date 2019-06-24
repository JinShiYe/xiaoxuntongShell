import React, { Component } from 'react';
import storekeyname from '../storeKeyName';
import Store from '../store';

var tempV = Store.get(storekeyname.APPCODE);
console.log('tempV:'+JSON.stringify(tempV));
class PageOne extends Component{
    render(){
        return(
            <h3>page 1</h3>      
        )
    }
}
export default PageOne;
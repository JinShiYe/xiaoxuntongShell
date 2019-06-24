import React, { Component } from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './App';
import PageOne from './pages/PageOne';
import PageTwo from './pages/PageTwo';
import PageThree from './pages/PageThree';
class Routers extends Component {
    render(){
        return(
            <Router history={ browserHistory }>
                <Route path="/" component={App}>
                    <IndexRoute component={PageOne} />
                    <Route path="page1" component={PageOne} />
                    <Route path="page2" component={PageTwo} />
                    <Route path="page3" component={PageThree} />    
                </Route>
            </Router> 
        )
    }   
}
export default Routers;
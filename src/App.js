import React, {Component} from 'react';
import routes from "./routes";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";

class App extends Component {
    render(){
        return (
            <div className="app-wrapper">
                <div className="header">
                    <Header />
                </div>
                { routes }
                <div className="footer">
                    <Footer />
                </div>
            </div>
        );
    }
}

export default App;

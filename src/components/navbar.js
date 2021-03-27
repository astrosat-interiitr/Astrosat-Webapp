import React, { Component } from 'react';
import gitlogo from './github.png' 

class Navbar extends Component {
    render() { 
        return (  
            <nav class="navbar navbar-expand-lg scrolling-navbar sticky-top" style={{color:'black', background:'#c0b9b924'}}>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <a class="navbar-brand" style={{color:"#000"}} href="#"><strong>CosmoScope</strong></a>

                <div class="collapse navbar-collapse"  id="navbarTogglerDemo03">
                    <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li class="nav-item">
                        <a class="nav-link pr-4" style={{color:"#000"}} href="#">About Us</a>
                    </li>
                    </ul>
                    <a href="https://github.com/astrosat-interiitr" target="_blank" >
                        <img className="image" src={gitlogo} alt="Github Icon" width="32px" height="32px"/>
                    </a>
                </div>
        </nav>
        );
    }
}
 
export default Navbar;
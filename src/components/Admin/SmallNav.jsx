import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
// import Logo from '../Images/technavis_logo.png'
// import Logs from '../Images/bgg.png';


function SmallNav() {
  return (
    <div className='smallnav montserrat-400'>
         <Navbar expand="lg" style={{backgroundColor:'#0B0B24'}}>
      <Container>
        {/* <Navbar.Brand className='col-10 m-0'><img className='logo-sm' src={Logs} alt="" /></Navbar.Brand> */}
        <Navbar.Toggle className='col-2' style={{color:'#2f3454', backgroundColor:'white'}} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mt-4">
            <Link style={{textDecoration:'none', color:'black'}} to='/categories'>
            <Nav className='text-light' >Categories</Nav>
            </Link>
            <Link style={{textDecoration:'none', color:'black'}} to='/dishes'>
            <Nav className='text-light' >Dishes</Nav>
            </Link>
            <Link style={{textDecoration:'none', color:'black'}} to='/'>
            <Nav className='text-light' >To client side</Nav>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}

export default SmallNav




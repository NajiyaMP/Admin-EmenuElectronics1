import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Logs from '../Images/bgg.png';
import { FiLogOut } from 'react-icons/fi'; // Import the logout icon


function SideNav() {
  const  backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
  const navigate = useNavigate(); // Initialize navigate function
  const handleLogout = async () => {
    try {
      const response = await axios.post(`${backendUrl}/admin/logout`, {}, { withCredentials: true });

      if (response.status === 200) {
        navigate('/', { replace: true }); // Redirect to the login page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout', error);
    }
  };


  return (
    <div className="container">
      <div>
        <div className="side-nav">
          {/* <div className="sn1section mt-3">
            <img className="logo" src={Logs} alt="Logo" />
          </div> */}

          <div className="sn2section mt-5">
            <ul className="montserrat-400">
              <Link to="/home" className="link" activeClassName="active">
                <li className="py-3" >
                  <span className="icon">📂</span> {/* replace with your icon */}
                  <span className="text">Dashboard</span>
                </li>
              </Link>
              <Link to="/banners" className="link" activeClassName="active">
                  <li className="py-3" >
                    <span className="icon">📂</span> {/* replace with your icon */}
                    <span className="text">Banner</span>
                  </li>
                </Link>
              {/* <Link to="/home" className="link" activeClassName="active">
                <li className="py-3" >
                  <span className="icon">📂</span> 
                  <span className="text">DASHBOARD</span>
                </li>
              </Link> */}
              <Link to="/maincategories" className="link" activeClassName="active">
                <li className="py-3" >
                  <span className="icon">📂</span> {/* replace with your icon */}
                  <span className="text">MainCategories</span>
                </li>
              </Link>
              <Link to="/categories" className="link" activeClassName="active">
                <li className="py-3" >
                  <span className="icon">📂</span> {/* replace with your icon */}
                  <span className="text">Categories</span>
                </li>
              </Link>
              <Link to="/subcategories" className="link" activeClassName="active">
                <li className="py-3" >
                  <span className="icon">📂</span> {/* replace with your icon */}
                  <span className="text">Subcategories</span>
                </li>
              </Link>
              <Link to="/coupon" className="link" activeClassName="active">
                <li className="py-3" >
                  <span className="icon">📂</span> {/* replace with your icon */}
                  <span className="text">Coupon</span>
                </li>
              </Link>
              <Link to="/demo" className="link" activeClassName="active">
                <li className="py-3">
                  <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gem" viewBox="0 0 16 16">
                      <path d="M3.1.7a.5.5 0 0 1 .4-.2h9a.5.5 0 0 1 .4.2l2.976 3.974c.149.185.156.45.01.644L8.4 15.3a.5.5 0 0 1-.8 0L.1 5.3a.5.5 0 0 1 0-.6zm11.386 3.785-1.806-2.41-.776 2.413zm-3.633.004.961-2.989H4.186l.963 2.995zM5.47 5.495 8 13.366l2.532-7.876zm-1.371-.999-.78-2.422-1.818 2.425zM1.499 5.5l5.113 6.817-2.192-6.82zm7.889 6.817 5.123-6.83-2.928.002z"/>
                    </svg>
                    
                  </span> {/* replace with your icon */}
                  <span className="text">Items</span>
                </li>
              </Link>
              <Link to="/settings" className="link" activeClassName="active">
                <li className="py-3">
                  <span className="icon">📂</span>
                  <span className="text">Settings</span>
                </li>
              </Link>
                     
            </ul>
              {/* <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: 'none', backgroundColor: '#f44336', color: 'white', borderRadius: '4px', cursor: 'pointer' ,marginTop:'4rem',marginLeft:'3rem'}}>
                <FiLogOut size={20} />
                Logout
              </button> */}
              <button  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: 'none', backgroundColor: 'black', color: 'red', borderRadius: '4px', cursor: 'pointer' ,marginTop:'4rem',marginLeft:'3rem'}}>
                <FiLogOut size={20} />
                <a href='/' style={{color:'red'}}>Logout</a>
              </button> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;







// import React from 'react'
// import Logs from '../Images/bgg.png';
// import {Link} from 'react-router-dom'
// function SideNav() {
//   return (
//     <div>
//         <div className="container">
//             <div className="row">
//                 <div className="col-3 side-nav" style={{width:'15%'}}>
//                   <div className="sn1section mt-3">
//                         <img className='logo' src={Logs} alt="" />
//                   </div>
//                   <div>
//                     {/* <h3 style={{color:"#b20769"}}>Dashboard</h3> */}
//                   </div>
//                   <div className='sn2section mt-5'>
//                     <ul className='montserrat-400'  style={{listStyle:'none', cursor:'pointer'}}>
                        
//                        {/* <Link style={{textDecoration:'none'}} to='/categories'><li className='py-3 text-light'>DASHBORD</li></Link>  */}
//                        <Link style={{textDecoration:'none'}} to='/categories'><li className='py-3' style={{color:"#b20769"}}><b>CATEGORIES</b></li></Link> 
//                        <Link style={{textDecoration:'none'}} to='/dishes'><li className='py-3' style={{color:"#b20769"}}><b>ITEMS</b></li></Link> 
//                     </ul>
//                   </div>
//                 </div>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default SideNav

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Card, Row, Col } from 'react-bootstrap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import SideNav from './SideNav';

// Register the necessary chart components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Home = () => {
    const chartRef = useRef(null);
    const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;

    const [mainCategoryCount, setMainCategoryCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [dishCount, setDishCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const mainCategoryRes = await axios.get(`${backendUrl}/admin/maincategoriescount`);
                const categoryRes = await axios.get(`${backendUrl}/admin/categoriescount`);
                const cartRes = await axios.get(`${backendUrl}/admin/cartcount`);
                const dishRes = await axios.get(`${backendUrl}/admin/dishescount`);

                setMainCategoryCount(mainCategoryRes.data.count);
                setCategoryCount(categoryRes.data.count);
                setCartItemCount(cartRes.data.count);
                setDishCount(dishRes.data.count);
            } catch (err) {
                console.error('Error fetching counts:', err);
            }
        };

        fetchCounts();
    }, []);

    const data = {
        labels: ['Total Items', 'Items in Cart', 'Main Categories', 'Categories'],
        datasets: [
            {
                label: 'Counts',
                data: [dishCount, cartItemCount, mainCategoryCount, categoryCount],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Admin Dashboard Metrics',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    useEffect(() => {
        // Properly cleanup the chart instance
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className='big' style={{ backgroundColor: "white", height: '100vh' }}>
            <SideNav />
            <div className="whole">
                <div>
                    <div className="pl-3 row main-row">
                        <div
                            className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <h2 style={{ color: "black" }}><b>ADMIN DASHBOARD</b></h2>
                        </div>
                    </div>
                    <Row className="mt-4">
                        <Col md={3}>
                            <Card style={{ color: "white", backgroundColor: "#b0d5dd", border: 'none' }}>
                                <Card.Body>
                                    <Card.Title>Total Items</Card.Title>
                                    <Card.Text>{dishCount}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card style={{ color: "white", backgroundColor: "rgb(202 176 221)", border: 'none' }}>
                                <Card.Body>
                                    <Card.Title>Items in Cart</Card.Title>
                                    <Card.Text>{cartItemCount}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card style={{ color: "white", backgroundColor: "rgb(239 205 143)", border: 'none' }}>
                                <Card.Body>
                                    <Card.Title>Main Categories</Card.Title>
                                    <Card.Text>{mainCategoryCount}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3}>
                            <Card style={{ color: "white", backgroundColor: "#ec9fa6", border: 'none' }}>
                                <Card.Body>
                                    <Card.Title>Categories</Card.Title>
                                    <Card.Text>{categoryCount}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <div className="mt-5">
                        <Bar ref={chartRef} data={data} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;


// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { Card, Row, Col } from 'react-bootstrap';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import SideNav from './SideNav';

// // Register the necessary chart components
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
// );

// const Home = () => {
//     const chartRef = useRef(null);
//     const [mainCategoryCount, setMainCategoryCount] = useState(0);
//     const [categoryCount, setCategoryCount] = useState(0);
//     const [cartItemCount, setCartItemCount] = useState(0);
//     const [dishCount, setDishCount] = useState(0);
    
    
    
//     useEffect(() => {
//         const fetchCounts = async () => {
//             try {
//                 const mainCategoryRes = await axios.get('/admin/maincategoriescount');
//                 const categoryRes = await axios.get('/admin/categoriescount');
//                 const cartRes = await axios.get('/admin/cartcount');
//                 const dishRes = await axios.get('/admin/dishescount');
    
//                 setMainCategoryCount(mainCategoryRes.data.count);
//                 setCategoryCount(categoryRes.data.count);
//                 setCartItemCount(cartRes.data.count);
//                 setDishCount(dishRes.data.count);
//             } catch (err) {
//                 console.error('Error fetching counts:', err);
//             }
//         };
    
//         fetchCounts();
//     }, []);

//     const data = {
//         labels: ['Total Items', 'Items in Cart', 'Main Categories', 'Categories'],
//         datasets: [
//             {
//                 label: 'Counts',
//                 data: [dishCount, cartItemCount, mainCategoryCount, categoryCount],
//                 backgroundColor: [
//                     'rgba(75, 192, 192, 0.2)',
//                     'rgba(153, 102, 255, 0.2)',
//                     'rgba(255, 159, 64, 0.2)',
//                     'rgba(255, 99, 132, 0.2)',
//                 ],
//                 borderColor: [
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(153, 102, 255, 1)',
//                     'rgba(255, 159, 64, 1)',
//                     'rgba(255, 99, 132, 1)',
//                 ],
//                 borderWidth: 1,
//             },
//         ],
//     };
    
//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: 'Admin Dashboard Metrics',
//             },
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };
    

//     useEffect(() => {
//         return () => {
//             if (chartRef.current) {
//                 chartRef.current.chartInstance.destroy();
//             }
//         };
//     }, []);

//     return (
//         <div className='big' style={{ backgroundColor: "white", height: '100vh' }}>
//             <SideNav />
//             <div className="whole">
//                 <div>
//                     <div className="pl-3 row main-row">
//                         <div
//                             className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//                             style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                             }}
//                         >
//                             <h2 style={{ color: "black" }}><b>ADMIN DASHBOARD</b></h2>
//                         </div>
//                     </div>
//                     <Row className="mt-4">
//                         <Col md={3}>
//                             <Card style={{ color: "white", backgroundColor: "#b0d5dd", border: 'none' }}>
//                                 <Card.Body>
//                                     <Card.Title>Total Items</Card.Title>
//                                     <Card.Text>{dishCount}</Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={3}>
//                             <Card style={{ color: "white", backgroundColor: "rgb(202 176 221)", border: 'none' }}>
//                                 <Card.Body>
//                                     <Card.Title>Items in Cart</Card.Title>
//                                     <Card.Text>{cartItemCount}</Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={3}>
//                             <Card style={{ color: "white", backgroundColor: "rgb(239 205 143)", border: 'none' }}>
//                                 <Card.Body>
//                                     <Card.Title>Main Categories</Card.Title>
//                                     <Card.Text>{mainCategoryCount}</Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={3}>
//                             <Card style={{ color: "white", backgroundColor: "#ec9fa6", border: 'none' }}>
//                                 <Card.Body>
//                                     <Card.Title>Categories</Card.Title>
//                                     <Card.Text>{categoryCount}</Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>
//                     <div className="mt-5">
//                         <Bar ref={chartRef} data={data} options={options} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Home;


// import React, { useEffect, useState,useRef } from 'react';
// import axios from 'axios';


// import { Card, Row, Col } from 'react-bootstrap';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import SideNav from './SideNav';

// // Register the necessary chart components
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
// );

// const Home = () => {
//     const chartRef = useRef(null);
//     const [mainCategoryCount, setMainCategoryCount] = useState(0);
//     const [categoryCount, setCategoryCount] = useState(0);
//     const [cartItemCount, setCartItemCount] = useState(0);
//     const [dishCount, setDishCount] = useState(0);

//     useEffect(() => {
//         const fetchCounts = async () => {
//             try {
//                 const mainCategoryRes = await axios.get('/admin/maincategoriescount');
//                 const categoryRes = await axios.get('/admin/categoriescount');
//                 const cartRes = await axios.get('/admin/cartcount');
//                 const dishRes = await axios.get('/admin/dishescount');

//                 setMainCategoryCount(mainCategoryRes.data.count);
//                 setCategoryCount(categoryRes.data.count);
//                 setCartItemCount(cartRes.data.count);
//                 setDishCount(dishRes.data.count);
//             } catch (err) {
//                 console.error('Error fetching counts:', err);
//             }
//         };

//         fetchCounts();
//     }, []);


//     // // Mock data for the demo
//     // const totalItems = 150;
//     // const itemsInCart = 45;
//     // const mainCategories = 10;
//     // const categories = 25;

//     const data = {
//         labels: ['Items', 'In Cart', 'Main Categories', 'Categories'],
//         datasets: [
//             {
//                 label: 'Counts',
//                 data: [totalItems, itemsInCart, mainCategories, categories],
//                 backgroundColor: [
//                     'rgba(75, 192, 192, 0.2)',
//                     'rgba(153, 102, 255, 0.2)',
//                     'rgba(255, 159, 64, 0.2)',
//                     'rgba(255, 99, 132, 0.2)',
//                 ],
//                 borderColor: [
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(153, 102, 255, 1)',
//                     'rgba(255, 159, 64, 1)',
//                     'rgba(255, 99, 132, 1)',
//                 ],
//                 borderWidth: 1,
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             title: {
//                 display: true,
//                 text: 'Admin Dashboard Metrics',
//             },
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//             },
//         },
//     };

//     useEffect(() => {
//         return () => {
//             if (chartRef.current) {
//                 chartRef.current.chartInstance.destroy();
//             }
//         };
//     }, []);

//     return (
//         <div className='big' style={{ backgroundColor: "white", height: '100vh' }}>
//             <SideNav />
//             <div className="whole">
//                 <div>
//                     <div className="pl-3 row main-row">
//                         <div
//                             className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//                             style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                             }}
//                         >
//                             <h2 style={{ color: "black" }}><b>ADMIN DASHBOARD</b></h2>
//                         </div>
//                     </div>
//                     <Row className="mt-4">
//                         <Col md={3}>
//                             <Card style={{color:"white",backgroundColor:"#b0d5dd",border:'none'}}>
//                                 <Card.Body>
//                                     <Card.Title>Total Items</Card.Title>
//                                     <Card.Text>{dishCount}</Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={3}>
//                             <Card style={{color:"white",backgroundColor:"rgb(202 176 221)",border:'none'}}>
//                                 <Card.Body>
//                                     <Card.Title>Items in Cart</Card.Title>
//                                     <Card.Text>{cartItemCount}</Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={3}>
//                             <Card style={{color:"white",backgroundColor:"rgb(239 205 143)",border:'none'}}>
//                                 <Card.Body>
//                                     <Card.Title>Main Categories</Card.Title>
//                                     <Card.Text>{mainCategoryCount}</Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                         <Col md={3}>
//                             <Card style={{color:"white",backgroundColor:"#ec9fa6",border:'none'}}>
//                                 <Card.Body>
//                                     <Card.Title>Categories</Card.Title>
//                                     <Card.Text> {categoryCount}</Card.Text>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     </Row>
//                     <div className="mt-5">
//                         <Bar ref={chartRef} data={data} options={options} />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Home;




// // src/components/Home.js
// import React from 'react';
// import SideNav from './SideNav';

// const Home = () => {

  

//     return (
//         <div className='big' style={{backgroundColor:"white",height:'100vh'}}> 
//             <SideNav />
//             <div className="whole">
//                 <div>
//                     <div className="pl-3 row main-row">
//                         <div
//                             className="col-12 my-sm-0 my-md-5 p-3 montserrat-400"
//                             style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                             }}
//                         >
//                             <h2 style={{color:"black"}}><b>ADMIN DASHBOARD</b></h2>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default Home;




// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthService from '../../services/authService'; // Adjusted path
// import SideNav from './SideNav';

// const Home = () => {
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         await AuthService.logout();
//         navigate('/admin/login');
//     };

//     return (
//         <div>
//             <SideNav/>
//             <h2>Welcome to the Admin Dashboard</h2>
//             <button onClick={handleLogout}>Logout</button>
//         </div>
//     );
// };

// export default Home;

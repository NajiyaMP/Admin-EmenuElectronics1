import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryDropdowns = () => {
    const backendUrl = process.env.REACT_APP_MACHINE_TEST_1_BACKEND_URL;
    const [mainCategories, setMainCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [mainCategory, setMainCategory] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);

    // Fetch main categories, categories, and subcategories on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mainResponse, catResponse, subResponse] = await Promise.all([
                    axios.get(`${backendUrl}/admin/getmaincategories`),
                    axios.get(`${backendUrl}/admin/getcategories`),
                    axios.get(`${backendUrl}/admin/getsubcategories`)
                ]);

                setMainCategories(mainResponse.data);
                setCategories(catResponse.data);
                setSubCategories(subResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [backendUrl]);

    // Update filtered categories based on selected main category
    useEffect(() => {
        if (mainCategory) {
            const filteredCats = categories.filter(cat => cat.maincategoriesData._id === mainCategory);
            setFilteredCategories(filteredCats);
            setCategory(''); // Reset category selection
            setSubcategory(''); // Reset subcategory selection
        } else {
            setFilteredCategories([]);
            setCategory('');
            setSubcategory('');
        }
    }, [mainCategory, categories]);

    // Update filtered subcategories based on selected category
    useEffect(() => {
        if (category) {
            const filteredSubs = subCategories.filter(sub => sub.category && sub.category._id === category);
            setFilteredSubcategories(filteredSubs);
            setSubcategory(''); // Reset subcategory selection
        } else {
            setFilteredSubcategories([]);
            setSubcategory('');
        }
    }, [category, subCategories]);

    return (
        <div>
            {/* Dropdown for selecting Main Category */}
            <select
                className="my-3 input-style"
                onChange={(e) => setMainCategory(e.target.value)}
                value={mainCategory}
                style={{ width: "100%", marginBottom: '1rem' }}
            >
                <option value="">Select Main Category</option>
                {mainCategories.map((mainCat) => (
                    <option key={mainCat._id} value={mainCat._id}>
                        {mainCat.name}
                    </option>
                ))}
            </select>

            {/* Dropdown for selecting Category */}
            <select className="my-3 input-style" onChange={(e) => setCategory(e.target.value)} value={category} style={{ width: "100%", marginBottom: '1rem' }}>
                <option value="">Select Category</option>
                {filteredCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            {/* Dropdown for selecting Subcategory */}
            <select className="my-3 input-style" onChange={(e) => setSubcategory(e.target.value)} value={subcategory} style={{ width: "100%", marginBottom: '1rem' }}>
                <option value="">Select Subcategory</option>
                {filteredSubcategories.map((subCat) => (
                    <option key={subCat._id} value={subCat._id}>
                        {subCat.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryDropdowns;


// import React, { useState } from 'react';

// function MapEmbedder() {
//     const [mapLink, setMapLink] = useState('');
//     const [embedCode, setEmbedCode] = useState('');
//     const [error, setError] = useState(null);

//     const handleInputChange = (event) => {
//         setMapLink(event.target.value);
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         try {
//             // Extract latitude and longitude from the Google Maps link
//             const { latitude, longitude } = extractCoordinates(mapLink);

//             // Construct the embed code for Google Maps iframe
//             const embedCode = `<iframe
//                 width="600"
//                 height="450"
//                 frameborder="0"
//                 style="border:0"
//                 src="https://maps.google.com/maps?q=${latitude},${longitude}&output=embed"
//                 allowfullscreen
//             ></iframe>`;
//             setEmbedCode(embedCode);
//             setError(null); // Clear any previous errors
//         } catch (error) {
//             console.error('Error generating embed code:', error);
//             setEmbedCode('');
//             setError('Failed to generate embedded map. Please check the link and try again.');
//         }
//     };

//     const extractCoordinates = (link) => {
//         // Extract latitude and longitude from the Google Maps link
//         const coordinatesRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
//         const match = link.match(coordinatesRegex);
//         if (!match || match.length < 3) {
//             throw new Error('Invalid Google Maps link format.');
//         }
//         const latitude = match[1];
//         const longitude = match[2];
//         return { latitude, longitude };
//     };

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <label>
//                     Google Maps Link:
//                     <input
//                         type="text"
//                         value={mapLink}
//                         onChange={handleInputChange}
//                         placeholder="Enter Google Maps link"
//                         required
//                     />
//                 </label>
//                 <button type="submit">Generate Embed Code</button>
//             </form>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {embedCode && (
//                 <div>
//                     <h2>Embedded Map:</h2>
//                     <div dangerouslySetInnerHTML={{ __html: embedCode }} />
//                 </div>
//             )}
//         </div>
//     );
// }

// export default MapEmbedder;
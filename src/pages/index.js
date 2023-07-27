import React, { useEffect } from 'react';
import axios from '@/utils/api';
import { useOpenCv } from 'opencv-react';

function Dashboard({ posts }) {
    // Load opencv on initial render of application
    useOpenCv();

    useEffect(() => {
        fetchData();
    }, []);

    // Function to fetch data from the API
    const fetchData = async () => {
        try {
            const res = await axios.get('posts')
            const posts = await res.data;
            console.log(posts);
            return posts;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className='card'>
                    <div>
                    </div>
                    <section className='col-12 text-center'>
                        <span className="block text-6xl font-bold mb-1" onClick={() => fetchData()}>Dashboard</span>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

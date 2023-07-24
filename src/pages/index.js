import React, { useEffect } from 'react';
import { useRouter } from 'next/router'
import axios from '@/utils/api';

function Dashboard({ posts }) {
    const router = useRouter();

    useEffect(() => {
        console.log(posts);
        // fetchData();
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
                    <section className='col-12 text-center'>
                        <span className="block text-6xl font-bold mb-1" onClick={() => fetchData()}>Dashboard</span>
                    </section>
                </div>
            </div>
        </div>
    );
}



export async function getServerSideProps(context) {
    // Api calls

    // Fetch
    // const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    // const posts = await res.json()

    // Axios
    const res = await axios.get('posts')
    const posts = await res.data;

    // Perform any server-side checks or authentication here.
    // If the condition for redirection is met, use the redirect method.
    // For example, let's say you want to redirect to /redirect-page if some condition is true.
    const shouldRedirect = false; // Replace this with your actual condition.
    if (shouldRedirect) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false, // Set this to true if the redirection is permanent
            },
        };
    }
    return {
        props: { posts }, // If no redirection is needed, return an empty object.
    };
}

export default Dashboard;

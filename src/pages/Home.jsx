import React, { useState, useEffect } from 'react';
import { Loader, Card, FormField } from '../components';


const RenderCards = ({ data, title }) => {  //creating this component separartely primarily for reusability
    if (data?.length > 0) {
        return data.map((post) => <Card key={post._id} {...post} />
        )
    }
    return(
        <h2 className='mt-5 font-bold text-[#6469ff] text-xl uppercase'>
            {title}  
        </h2> // title that we passed dynamically into this component through props
    )
} //so if data is greater than 0 then we'll map over the data and render all of the cards while passing all of the post data to each individual card otherwise we simply return a title

const Home = () => {

    const [loading, setLoading] = useState(false);  // decides the state of loader ie the loading animation
    const [allPosts, setAllPosts] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [searchedResults, setSearchedResults] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);
    //useEffect(() => {
        const fetchPosts= async () => {
            setLoading(true);

            try {
                const response = await fetch('https://joy-ai-imaginator.onrender.com/api/v1/post',{
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json',
                    },
                })

                if(response.ok){
                    const result = await response.json();

                    setAllPosts(result.data.reverse());
                }
            } catch (error) {
                alert(error)
            } finally{
                setLoading(false)
            }
        }
     //   fetchPosts();
    //},[]);
    useEffect(() => {fetchPosts()},[]);

    const handleSearchChange =(e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        setSearchTimeout(
        setTimeout(() => {
            const searchResults= allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase())); // filtering prompts to check if theyve been made already or they are from any of the surpriseme prompta ,in either case we'll render cards and if neither is true ie the post is not created and not even there in the prompts then we give a message called post not created yet
            
            setSearchedResults(searchResults);
        }, 500));
    }

    return (
        <section className='max-w-7xl mx-auto'>
            <div>
                <h1 className='font-extrabold text-[#222328] text-[32px]'>The Community Showcase</h1>
                <p className='mt-2 text-[#666e75] text-[16px] max-w[500px]'>Browse through a collecction of imaginative and visually stunning images generated by DALL-E AI</p>
            </div>
            <div className='mt-16'>
                <FormField
                    
                    labelName="Search Posts"
                    type="text"
                    name="text"
                    placeholder="Search posts..."
                    value={searchText}
                    handleChange={handleSearchChange}
                 />
            </div>
            <div className='mt-10'>
                {loading ? (
                    <div className='flex justify-center items-center'>
                        <Loader />
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                                Showing results for <span className='text-[#222328]'>
                                    {searchText}
                                </span>
                            </h2>
                        )}
                        <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
                            {searchText ? (   // if searchtext exists then we render cards and pass data to it called search results and if there are no search results then we provide it a title called no search results
                                <RenderCards 
                                    data={searchedResults}
                                    title='Post not created yet'
                                />
                            ) :(             // if we are not searching for smthing and rendering all the posts then we can again render cards but with difrrent data called all posts and the title can be no posts found if there are really no posts
                                <RenderCards 
                                    data={allPosts}
                                    title='No posts found'
                                />
                            )}
                        </div>
                    </>

                )}
            </div>
        </section>
    )
}

export default Home;

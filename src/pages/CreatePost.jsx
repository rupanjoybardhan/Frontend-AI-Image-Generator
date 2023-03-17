import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../Assets/assets';
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from '../components';
const CreatePost = () => {

    const navigate = useNavigate(); // this is going to allow us to navigate back to the home page once the post is created
    const [form, setForm] = useState({
        name: '',
        prompt: '',
        photo: '',

    });
    const [generatingImg, setgeneratingImg] = useState(false); //is used while we are making contact with our api and while we're waiting to get back the image
    const [loading, setloading] = useState(false);

    const generateImage = async () => {  // this is going to call our backend
        if (form.prompt) {
            try {
                setgeneratingImg(true);
                const response = await fetch('https://joy-ai-imaginator.onrender.com/api/v1/dalle', {  // we are passing all of the needed data to our backend to then get back the response which is going to be the ai generated image
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: form.prompt })
                })

                const data = await response.json(); //parsing the data in order to be able tp see it

                setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` }) // once we received the data we can set it to the state.this is the way how we will save and render our image
            } catch (error) {
                alert(error);
            } finally {
                setgeneratingImg(false); // set the loading state of the setgenerating image to false
            }
        } else { alert('please enter a prompt') }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();  // to check that the browser doesnot automatically reload our application
        if (form.prompt && form.photo) { // checking if we have the prompt and the photo before we submit
            setloading(true);

            try {
                const response = await fetch('https://joy-ai-imaginator.onrender.com/api/v1/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form)
                })
                await response.json(); //getting the response carefully
                navigate('/'); //navigating back to home to see the image
            } catch (err) {
                alert(err)
            } finally {
                setloading(false);
            }
        } else{ alert('please enter a prompt and generate an image')}
    }

    const handleChange = (e) => {   //takin the keypress event and calling setform state .there we want to spread the entire form and well target the specific property gicing it the value typed in
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({ ...form, prompt: randomPrompt })
    }
    return (
        <section className='max-w-7xl mx-auto'>
            <div>
                <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
                <p className='mt-2 text-[#666e75] text-[16px] max-w[500px]'>Create imaginative and visulally stunning images through DALL-E AI and share them with the Community</p>
            </div>

            <form className='mt-10 max-w-3xl' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-5'>
                    <FormField
                        labelName="Your name"
                        type='text'
                        name='name'
                        placeholder='john doe'
                        value={form.name}
                        handleChange={handleChange}

                    />
                    <FormField
                        labelName=" Create a prompt"
                        type='text'
                        name='prompt'
                        placeholder='A plush toy robot sitting against a yellow wall'
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe     // Based on this additional prop we cam know whether we wan to show an additional button with this formfield
                        handleSurpriseMe={handleSurpriseMe}
                    />

                    <div className='relative bg-gray-50 border border-gray-300 text-gray-900 sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
                        {form.photo ? (
                            <img
                                src={form.photo}
                                alt={form.prompt}
                                className='w-full h-full object-contain'
                            />
                        ) : (
                            <img
                                src={preview}
                                alt='preview'
                                className='w-9/12 h-9/12 object-contain opacity-40'
                            />
                        )}
                        {generatingImg && (
                            <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>
                <div className='mt-5 flex gap-5'>
                    <button
                        type='button'
                        onClick={generateImage}
                        className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
                        {generatingImg ? 'Generating...' : 'Generate'}
                    </button>
                </div>
                <div className='mt-10'>
                    <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image you want, you may choose to share it with others in the community</p>
                    <button
                        type='submit'
                        className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
                    >
                        {loading ? 'sharing...' : 'Share with the community'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default CreatePost

// implement all the UI to generate different images
// the div with classname as 'relative' : we're creating a place where an AI generated image will be shown but also we'll show a preview of image incase the image is yet not generated
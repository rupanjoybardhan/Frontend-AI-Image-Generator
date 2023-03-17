//utility functions aka utils - a file where u can create diff functions and then reuse across application
import FileSaver from 'file-saver';
import {surpriseMePrompts} from '../constants';


export function getRandomPrompt(prompt){
    const randomIndex=Math.floor(Math.random()*surpriseMePrompts.length); // essentially we are getting the random index from 1 to 49
    const randomPrompt=surpriseMePrompts[randomIndex]; // retrieving the random prompt by saying randomprompt -"go into the surprisemeprompt and use the random index to pick any "

    if(randomPrompt === prompt ) return getRandomPrompt(prompt); // avoiding two consective same randomprompts ie if the two promots are same then we'll call the getrandomprompt function again
    return randomPrompt; //returning a random prompt
}

export async function downloadImage(_id,photo){ //we are using the file saver library that we used before
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
}
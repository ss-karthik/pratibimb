'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyA9jgY9UGGB2Z3lmyB8nQh3nzDsQLqe9CY';
if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY environment variable is not set');
}
const genAI = new GoogleGenerativeAI(API_KEY);

export async function medChat(prompt){
    console.log('Question: ', prompt);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Initialized Gemini model');
    try {
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const text = response.text();
        console.log('Raw API Response:', text);
        return text;
    } catch(err){
        console.log("Error calling API", err);
    }
}
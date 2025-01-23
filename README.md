# WBNB 🌩️
The Weather but not boring app is a react / redux app build using realtime weather information and the power of the ChatGPT API to create a 3D animation of the city´s weather and also give clothing and activity recommendations for the day. You can access it [here.](https://jpzp2001.github.io/wbnb/)

## Security
For security reasons I am hosting a version on which the ChatGPT API features are not functional, for full operation you just need to clone the repo and use you own Open AI key on the .env file.

## Features
- 3D City Animation
- Dynamic lighting
- Realtime weather data
- Activity recommendations 
- Clothing recommendations

## Getting started
Follow these steps to set up the project locally:

1. **Clone the repo**:
   ```bash
   git clone https://github.com/JPZP2001/wbnb.git
2. **Install dependencies**:
   ```bash
   npm install
3. **Run locally
   ```bash
   npm run dev

## Redux Store
- **weatherSlice**: handles the current city, loading status, and any errors, while allowing asynchronous fetching of weather information for a specified city.

## Purpose
This app was built as my first React JS project to gain hands-on experience with building modern web applications. It also served as a learning opportunity to explore state management using Redux, asynchronous data fetching, and managing complex application state. Through this project, I aimed to improve my understanding of React's component-based architecture, best practices for building scalable and maintainable applications, and integrating third-party APIs.

## Acknowledgments
- [React documentation](https://react.dev/learn)
- [React-redux documentation](https://react-redux.js.org/introduction/getting-started)
- [Open AI API](https://platform.openai.com)
- [Open Weather Map API](https://openweathermap.org)



## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

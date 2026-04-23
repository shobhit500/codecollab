import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import LandingPage from './components/LandingPage';
import EditorPage from './components/EditorPage';
import About from './components/About';
import FAQs from './components/FAQs';
import HowItWorks from './components/HowItWorks';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <div>
      <Toaster  position='top-center'></Toaster>
    </div>
    <Routes>
     <Route path='/' element={ <LandingPage /> } />
     <Route path='/join' element={ <Home /> } />
     <Route path='/editor/:roomId' element={ <EditorPage /> } />
     <Route path='/about' element={ <About /> } />
     <Route path='/faqs' element={ <FAQs /> } />
     <Route path='/how-it-works' element={ <HowItWorks /> } />
    </Routes>
    </>
  );
}

export default App;

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Demo from './components/Demo';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Demo />
      </main>
    </div>
  );
}

export default App;

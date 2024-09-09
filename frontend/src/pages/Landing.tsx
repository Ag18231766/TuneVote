import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center">
      {/* Header */}
      <header className="w-full py-4 bg-gray-800">
        <AppBar isLanding={true}></AppBar>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-12 text-center px-4 mt-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Share & Discover Music You Love
        </h1>
        <p className="text-lg md:text-xl text-gray-400">
          Add links to your favorite songs, upvote the best, and let the music rise to the top.
        </p>
      </main>

      {/* Features Section */}
      <section id="features" className="w-full py-12 bg-gray-800 mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-gray-700 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m2 8H7a2 2 0 01-2-2v-1a2 2 0 012-2h10a2 2 0 012 2v1a2 2 0 01-2 2zM14 8a2 2 0 110 4M10 8a2 2 0 110 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mt-4">Add Your Songs</h3>
              <p className="text-gray-400 text-center">Easily add links to your favorite tracks from any platform.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-700 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7M12 3v18" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mt-4">Upvote the Best</h3>
              <p className="text-gray-400 text-center">Upvote songs you love and see them climb the charts.</p>
            </div>
          </div>
        </div>
      </section>

      

      {/* Join Section */}
      <section id="join" className="w-full py-12 bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
          <p className="text-lg text-gray-400 mb-8">
            Ready to start sharing and discovering music? Join us today and be part of a growing community of music lovers.
          </p>
          <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700">
            Sign Up Now
          </a>
        </div>
      </section>

      
    </div>
  );
}

export function AppBar({isLanding}:{isLanding:boolean}){
  const {loginWithPopup,logout,getAccessTokenSilently} = useAuth0();
  const navigate = useNavigate();
  async function handleLogin(){
    await loginWithPopup();
    const token = await getAccessTokenSilently();
    localStorage.setItem('token',token);
    navigate('/dashboard');
  }
  
  return (
    <div>

        <nav className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">TuneVote</div>
          <ul className="flex space-x-6">
          <li>
          <button onClick={handleLogin}>Login</button>
          {!isLanding ? <Link to="/" className="hover:underline">Logout</Link> : null}
          </li>
          </ul>
          
        </nav>
        
    </div>
  )
}

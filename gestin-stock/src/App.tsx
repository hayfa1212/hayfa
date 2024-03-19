import { Provider } from 'react-redux';
import './App.css';
import VerifierAccount from './pages/auth/accountVerification';


import Authentifier from './pages/auth/authentifier';
import Account from './pages/auth/creeCompte';
import Verifier from './pages/auth/verification';
import AppRoutes from './routes/route';

function App() {
  return (
    <div className="App">
      <header className="App-header">

    <AppRoutes/>
  

      </header>
    </div>
  );
}

export default App;

import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-lazy-load-image-component/src/effects/blur.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return <RouterProvider router={router} />
}

export default App

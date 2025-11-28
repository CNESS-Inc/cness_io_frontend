import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from './routes'
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-lazy-load-image-component/src/effects/blur.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'ckeditor5/ckeditor5.css';

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  )
}

export default App

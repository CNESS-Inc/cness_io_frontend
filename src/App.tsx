import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import "@fortawesome/fontawesome-free/css/all.min.css";
//dummy commit to trigger the deployment
function App() {
  return <RouterProvider router={router} />
}

export default App

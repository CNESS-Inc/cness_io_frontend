import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
//dummy commit to trigger the deployment
function App() {
  return <RouterProvider router={router} />
}

export default App

import { createBrowserRouter } from 'react-router-dom';
import Main from '../MainLayout/Main';
import Inv from '../dashboard/Inv';
import Home from '../home/home';
import Sells from '../dashboard/Sells';
import Medicine from '../dashboard/Medicine';
import Customer from '../dashboard/Customer';
import Stock from '../dashboard/Stock';
import Commerce from '../dashboard/Commerce';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'inventory',
        element: <Inv />
      },
      {
        path: 'sells',
        element: <Sells />

      },
       {
         path:'medicine',
         element: <Medicine />


         },
         {
          path:'customer',
          element: <Customer />
         },
         {
          path:'stock',
          element: <Stock />
         },
         {
          path: 'commerce',
          element: <Commerce />
        }

    ]
  }
]);

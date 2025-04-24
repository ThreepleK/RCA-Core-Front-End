import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@repo/core-ui';
import { router } from './router';

import '@mantine/core/styles.css';
import './App.css'

export default function App(){
  return (
    <>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}

import { lazy, Suspense } from 'react'
import { Button } from '@repo/core-ui'

// @ts-ignore
// const RcaApp = lazy(() => import('rca/main') )

function App() {

  return (
    <>
      <button>aaaa</button>
      <Button />
      <hr />
      {/* <Suspense fallback={'Loading...'} >
        <RcaApp />
      </Suspense> */}
    </>
  )
}

export default App

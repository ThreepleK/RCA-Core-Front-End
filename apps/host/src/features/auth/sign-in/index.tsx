import AuthLayout from '../auth-layout'
import {UserAuthForm} from './components/user-auth-form'

export default function SignIn(){
  return <>
    <AuthLayout title='Login'>
      <div className='flex flex-col space-y-2 text-left'>
        <p className='text-sm text-muted-foreground'>
          Enter your id and password below <br />
          to log into your account
        </p>
      </div>
      <UserAuthForm className='mt-2' />
    </AuthLayout>
  </>;
}
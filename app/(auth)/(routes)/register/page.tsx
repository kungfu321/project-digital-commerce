'use client';

import Link from 'next/link';

import AuthContainer from '@/components/shared/auth-container';
import { cn } from '@/lib/utils';
import RegisterForm from '@/components/shared/register-form';

const RegisterPage = () => {
  return (
    <AuthContainer
      title='Sign up to OKeyXin'
      description='Enter your details below'
      headerTitle='Register to manage your account'
      image='/images/illustration-register.svg'
      >
      <RegisterForm />
      <div className={cn(
        'text-center mt-4 text-sm',
        'lg:absolute lg:top-14 lg:right-14'
      )}>
        <span className="mr-1">Already have an account? </span>
        <Link href="/login">Login</Link>
      </div>
      <div className='text-xs text-muted-foreground text-center mt-4'>
        <span>By signing up, I agree to OKeyXin <Link href="#">Terms of Service</Link>  and <Link href="#">Privacy Policy</Link>.</span>
      </div>
    </AuthContainer>
  )
}

export default RegisterPage;

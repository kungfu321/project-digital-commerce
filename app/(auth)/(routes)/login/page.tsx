'use client';

import Link from 'next/link';

import LoginForm from '@/components/shared/login-form';
import AuthContainer from '@/components/shared/auth-container';
import { cn } from '@/lib/utils';

const LoginPage = () => {
  return (
    <AuthContainer
      title='Sign in to OKeyXin'
      description='Enter your details below'
      image='/images/illustration-login.svg'
      headerTitle='Hi, Welcome back'
    >
      <LoginForm />
      <div className={cn(
        'text-center mt-4 text-sm',
        'lg:absolute lg:top-14 lg:right-14'
      )}>
        <span className="mr-1">{`Don’t have an account?`}</span>
        <Link href="/register">Get started</Link>
      </div>
    </AuthContainer>
  )
}

export default LoginPage;

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import GoogleButton from '../../components/auth/GoogleButton.jsx'
import useAuth from '../../hooks/useAuth.js'
import { emailPattern } from '../../utils/validators.js'
import { ROUTES } from '../../utils/constants.js'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const { signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      await signInWithEmail(data.email, data.password)
      navigate(location.state?.from?.pathname || ROUTES.HOME)
    } catch (err) {
      toast.error(err?.message || 'Unable to sign in. Check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <p className="eyebrow mb-3">Welcome back</p>
      <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-parchment-100 mb-2">
        Log in to your account
      </h1>
      <p className="text-sm text-ink-500 dark:text-parchment-400 mb-8">
        Continue where you left off with your legal assistant.
      </p>

      <GoogleButton label="Continue with Google" />

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-ink-900/10 dark:bg-parchment-100/10" />
        <span className="text-xs text-ink-400 dark:text-parchment-400">or continue with email</span>
        <div className="h-px flex-1 bg-ink-900/10 dark:bg-parchment-100/10" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required', pattern: emailPattern })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />

        <div className="flex justify-end">
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs font-medium text-brass-600 dark:text-brass-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={submitting} icon={LogIn} className="w-full">
          Log in
        </Button>
      </form>

      <p className="text-sm text-center text-ink-500 dark:text-parchment-400 mt-8">
        Don't have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="font-semibold text-brass-600 dark:text-brass-400 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}

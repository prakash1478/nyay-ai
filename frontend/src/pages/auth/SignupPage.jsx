import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'
import Input from '../../components/common/Input.jsx'
import Button from '../../components/common/Button.jsx'
import GoogleButton from '../../components/auth/GoogleButton.jsx'
import useAuth from '../../hooks/useAuth.js'
import { emailPattern, passwordRules, nameRules } from '../../utils/validators.js'
import { ROUTES } from '../../utils/constants.js'

export default function SignupPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const { signUpWithEmail } = useAuth()
  const navigate = useNavigate()
  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      await signUpWithEmail(data.name, data.email, data.password)
      navigate(ROUTES.HOME)
    } catch (err) {
      toast.error(err?.message || 'Unable to create your account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <p className="eyebrow mb-3">Get started</p>
      <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-parchment-100 mb-2">
        Create your account
      </h1>
      <p className="text-sm text-ink-500 dark:text-parchment-400 mb-8">
        Free to start. No credit card required.
      </p>

      <GoogleButton label="Sign up with Google" />

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-ink-900/10 dark:bg-parchment-100/10" />
        <span className="text-xs text-ink-400 dark:text-parchment-400">or sign up with email</span>
        <div className="h-px flex-1 bg-ink-900/10 dark:bg-parchment-100/10" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          placeholder="Anjali Rao"
          error={errors.name?.message}
          {...register('name', nameRules)}
        />
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
          {...register('password', passwordRules)}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <Button type="submit" isLoading={submitting} icon={UserPlus} className="w-full">
          Create account
        </Button>
      </form>

      <p className="text-xs text-center text-ink-400 dark:text-parchment-400 mt-6">
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </p>

      <p className="text-sm text-center text-ink-500 dark:text-parchment-400 mt-4">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-brass-600 dark:text-brass-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

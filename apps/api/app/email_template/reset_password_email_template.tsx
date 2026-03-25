import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'
import React from 'react'

interface ResetPasswordEmailProps {
  firstName: string
  resetPasswordLink: string
}

export function ResetPasswordEmailTemplate({
  firstName,
  resetPasswordLink,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Hi {firstName}, use this link to reset your password</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-20">
          <Container className="w-[680px] max-w-full mx-auto bg-white p-8">
            <Heading className="text-2xl font-bold text-gray-800">BeeBudget</Heading>
            <Heading className="text-2xl font-bold text-gray-800">Hello, {firstName}! 👋</Heading>
            <Text className="text-gray-600">
              It looks like you have requested to reset your password. Use the link below to reset
              your password.
            </Text>

            <Text className="text-gray-600 mt-6">
              <Link href={resetPasswordLink}>{resetPasswordLink}</Link>
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              If you didn't request a password reset, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

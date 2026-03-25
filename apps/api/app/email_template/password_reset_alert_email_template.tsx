import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'
import React from 'react'

interface PasswordResetAlertEmailProps {
  firstName: string
  resetAt: string
}

export function PasswordResetAlertEmailTemplate({
  firstName,
  resetAt,
}: PasswordResetAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Security alert: Your password was changed</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-20">
          <Container className="w-[680px] max-w-full mx-auto bg-white p-8">
            <Heading className="text-2xl font-bold text-gray-800">BeeBudget</Heading>
            <Heading className="text-2xl font-bold text-gray-800">Hello, {firstName}! 👋</Heading>
            <Text className="text-gray-600">
              Your password was changed on <strong>{resetAt}</strong>.
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              If you did not make this change, secure your account immediately.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

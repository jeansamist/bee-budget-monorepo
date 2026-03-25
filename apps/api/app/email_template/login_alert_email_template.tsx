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

interface LoginAlertEmailProps {
  firstName: string
  loggedInAt: string
}

export function LoginAlertEmailTemplate({ firstName, loggedInAt }: LoginAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Security alert: New login to your account</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-20">
          <Container className="w-[680px] max-w-full mx-auto bg-white p-8">
            <Heading className="text-2xl font-bold text-gray-800">BeeBudget</Heading>
            <Heading className="text-2xl font-bold text-gray-800">Hello, {firstName}! 👋</Heading>
            <Text className="text-gray-600">
              We detected a new login to your account on <strong>{loggedInAt}</strong>.
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-xs text-gray-400">
              If this was not you, reset your password immediately and contact support.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

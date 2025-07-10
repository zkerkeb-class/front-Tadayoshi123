"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "./index"
import { SocketProvider } from "@/lib/providers/SocketProvider"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SocketProvider>{children}</SocketProvider>
    </Provider>
  )
}

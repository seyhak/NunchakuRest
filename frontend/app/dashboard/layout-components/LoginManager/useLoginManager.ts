'use client'
import * as React from "react"
import hashString from "@/utils/crypto"
import { useForm } from "react-hook-form"
import {useCustomSWR} from "@/utils/use-swr"
import { User } from "@/types/user"
import { loginFetcher, signUpFetcher } from "@/fetchers/user"
import { AxiosError } from "axios"
import { useUser } from "@/providers/user-provider"
import { useSnackbar } from "@/providers/snackbar-provider"
import { useLoginManagerDrawer } from "./useLoginManagerDrawer"


type FormData = {
  password: string;
} & User;

export enum LoginManagerStates {
  LOGIN,
  SIGNUP,
}

type LoginManagerStatesValues =
  (typeof LoginManagerStates)[keyof typeof LoginManagerStates];

export const useLoginManager = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [loginManagerState, setLoginManagerState] =
    React.useState<LoginManagerStatesValues>(LoginManagerStates.LOGIN)
  const drawerState = useLoginManagerDrawer()

  const {isLoading: isUserLoading, refreshData: refreshMe, data: meData } = useCustomSWR<User>("/api/me/", {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })
  const userContext = useUser()
  const snackbarContext = useSnackbar()

  const form = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  })
  React.useEffect(() => {
    if(meData){
      userContext.setUser(meData)
    }
  }, [meData, userContext])
  React.useEffect(() => {
    if(meData){
      userContext.setUser(meData)
    }
  }, [meData, userContext])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (value: string) => {
    setOpen(false)
  }
  const handleCancel = () => {
    form.reset()
    setOpen(false)
  }

  const handleLogin = React.useCallback(
    async ({
      username,
      hashedPassword,
    }: {
      username: string;
      hashedPassword: string;
    }) => {
      return await loginFetcher({
        username: username,
        password: hashedPassword,
      })
    },
    []
  )

  const handleSignUp = React.useCallback(
    async ({
      data,
      hashedPassword,
    }: {
      data: FormData;
      hashedPassword: string;
    }) => {
      return await signUpFetcher({ ...data, password: hashedPassword })
    },
    []
  )
  const onSubmit = async (data: FormData) => {
    const hashedPassword = data.password
    // const hashedPassword = await hashString(data.password)

    let user: User
    const isLoggingIn = loginManagerState === LoginManagerStates.LOGIN
    try {
      setIsLoading(true)
      if (isLoggingIn) {
        user = await handleLogin({ username: data.username, hashedPassword })
      } else {
        user = await handleSignUp({ data, hashedPassword })
      }
      if (isLoggingIn) {
        userContext.setUser(user)
        form.reset()
        setOpen(false)
      } else {
        snackbarContext.showMessage("Sign In successful! You can Log in now")
        form.reset()
        setOpen(false)
      }
      // show success msg
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMsg = err?.response?.data?.message
        setErrorMsg(errorMsg)
      } else {
        console.error(err)
        snackbarContext.showMessage((err as Error).message, "error")
      }
    }
    setIsLoading(false)
  }
  const switchLoginManagerState = React.useCallback(() => {
    setLoginManagerState((prevState) =>
      prevState === LoginManagerStates.LOGIN
        ? LoginManagerStates.SIGNUP
        : LoginManagerStates.LOGIN
    )
  }, [])

  return {
    form,
    onSubmit,
    handleCancel,
    handleClose,
    handleClickOpen,
    open,
    loginManagerState,
    switchLoginManagerState,
    errorMsg,
    user: userContext.user,
    isLoading: isLoading || isUserLoading,
    drawer: {
      ...drawerState
    }
  }
}

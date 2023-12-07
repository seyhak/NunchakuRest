"use client"

import {
  DialogContent,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Avatar,
  IconButton,
  Typography,
  Drawer,
} from "@mui/material"
import { Controller } from "react-hook-form"
import { useLoginManager, LoginManagerStates } from "./useLoginManager"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import "./LoginManager.sass"

export type LoginManagerProps = {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
};

const STATE_MESSAGES = {
  [LoginManagerStates.SIGNUP]: "Already Have Account? Log In",
  [LoginManagerStates.LOGIN]: "Need Account? Sign Up",
}

export function LoginManager(props: LoginManagerProps) {
  const {
    form: { control, handleSubmit, formState },
    onSubmit,
    handleCancel,
    handleClose,
    handleClickOpen,
    open,
    loginManagerState,
    switchLoginManagerState,
    errorMsg, // todo show error, add pill or snackbar
    user,
    drawer,
    isLoading
  } = useLoginManager()

  const isSignUpForm = loginManagerState === LoginManagerStates.SIGNUP
  const isSignedIn = !!user

  return (
    <>
      {isSignedIn ? <>
      <IconButton onClick={drawer.toggleDrawer}>
        <Avatar>
          {`${user.firstName[0]}${user.lastName[1]}`.toUpperCase()}
        </Avatar>
      </IconButton>
      <Drawer
            className="user-drawer"
            anchor="right"
            open={drawer.isUserDrawerOpen}
            onClose={drawer.toggleDrawer}
          >
            <Button onClick={drawer.handleLogout}>Log out</Button>
          </Drawer>
      </>:
      <IconButton onClick={handleClickOpen}>
        <AccountCircleIcon fontSize="medium"/>
      </IconButton>
      }
      <Dialog onClose={handleClose} open={open} maxWidth="xs" fullWidth>
        {isLoading ? "loading" :
        <>
        <DialogTitle>Login Or Sign Up</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="content" dividers>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Login is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  id="username"
                  label="Login"
                  variant="outlined"
                  autoComplete="on"
                  margin="none"
                  error={!!formState.errors.username}
                  helperText={formState.errors.username?.message || " "}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  id="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  margin="none"
                  autoComplete="current-password"
                  error={!!formState.errors.password}
                  helperText={formState.errors.password?.message || " " || " "}
                />
              )}
            />
            {isSignUpForm && (
              <>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      type="email"
                      id="email"
                      label="Email"
                      variant="outlined"
                      autoComplete="email"
                      margin="none"
                      error={!!formState.errors.email}
                      helperText={formState.errors.email?.message || " "}
                    />
                  )}
                />
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      id="firstName"
                      label="First name"
                      variant="outlined"
                      autoComplete="given-name"
                      margin="none"
                      error={!!formState.errors.firstName}
                      helperText={formState.errors.firstName?.message || " "}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Last Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      id="lastName"
                      label="Last name"
                      variant="outlined"
                      autoComplete="family-name"
                      margin="none"
                      error={!!formState.errors.lastName}
                      helperText={formState.errors.lastName?.message || " "}
                    />
                  )}
                />
              </>
            )}
            <div className="change-form-wrapper">
              <Typography>{errorMsg}
                </Typography>
              <Button
                variant="text"
                size="small"
                onClick={switchLoginManagerState}
                className="switcher"
              >
                {STATE_MESSAGES[loginManagerState]}
              </Button>
            </div>

          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" autoFocus type="submit" disabled={isLoading}>
              {isSignUpForm ? "Sign Up" : "Login"}
            </Button>
          </DialogActions>
        </form></>}
      </Dialog>
    </>
  )
}

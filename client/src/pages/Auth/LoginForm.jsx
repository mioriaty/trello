
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import { EMAIL_RULE, PASSWORD_RULE, FIELD_REQUIRED_MESSAGE, PASSWORD_RULE_MESSAGE, EMAIL_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'


function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const submitLogIn = (data) => {
    console.log(data)
  }

  return (

    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}><TrelloIcon /></Avatar>
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', color: theme => theme.palette.grey[500] }}>
            Author: Mioriaty
          </Box>
          {/* <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
            <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
              Your email&nbsp;
              <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>trungquandev@gmail.com</Typography>
              &nbsp;has been verified.<br />Now you can login to enjoy our services! Have a good day!
            </Alert>
            <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
              An email has been sent to&nbsp;
              <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>trungquandev@gmail.com</Typography>
              <br />Please check and verify your account before logging in!
            </Alert>
          </Box> */}
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName="email" />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoComplete="off"
                fullWidth
                label="Enter Password..."
                type="password"
                variant="outlined"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName="password" />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              className="interceptor-loading"
            >
              Login
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main' }}>Create account!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm

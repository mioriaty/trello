import { useEffect } from 'react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

function AccountVerification() {
  // Lấy email và token từ url
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])
  const [verified, setVerified] = useState(false)


  useEffect(() => {
    verifyUserAPI({ email, token })
      .then(() => {
        setVerified(true)
      })
      .catch(() => {
        setVerified(false)
      })
  }, [email, token])

  if (!email || !token) {
    return <Navigate to="/404" />
  }

  if (!verified) {
    return <PageLoadingSpinner caption="Verifying account..." />
  }


  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification

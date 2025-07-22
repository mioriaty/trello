/* eslint-disable no-console */
// https://github.com/getbrevo/brevo-node
const SibApiV3Sdk = require('@getbrevo/brevo')
import { env } from '~/config/environment'

/**
* Có thể xem thêm phần docs cấu hình theo từng ngôn ngữ khác nhau tùy dự án ở Brevo Dashboard > Account > SMTP & API > API Keys
* https://github.com/getbrevo/brevo-node
*/
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

/**
 * Update kiến thức: Brevo mới update vụ Whitelist IP tương tự MongoDB Atlas, nếu bạn không gửi được mail thì cần phải config 0.0.0.0 hoặc uncheck cái review IP Address trong dashboard là được nhé.
 * https://app.brevo.com/security/authorised_ips
 */
const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  try {
    console.log('Preparing to send email to:', recipientEmail)
    console.log('Sender email configured:', env.ADMIN_EMAIL_ADDRESS)

    // Khởi tạo một cái sendSmtpEmail với những thông tin cần thiết
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

    // Tài khoản gửi mail: lưu ý địa chỉ admin email phải là cái email mà các bạn tạo tài khoản trên Brevo
    sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }

    // Những tài khoản nhận email
    // 'to' phải là một Array để sau chúng ta có thể tùy biến gửi 1 email tới nhiều user tùy tính năng dự án nhé
    sendSmtpEmail.to = [{ email: recipientEmail }]

    // Tiêu đề của email:
    sendSmtpEmail.subject = customSubject

    // Nội dung email dạng HTML
    sendSmtpEmail.htmlContent = customHtmlContent

    console.log('Sending email via Brevo API...')

    // Gọi hành động gửi mail
    // More info: thằng sendTransacEmail của thư viện nó sẽ return một Promise
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('Email sent successfully:', result)
    return result
  } catch (error) {
    console.error('Brevo API Error Details:')
    console.error('- Status code:', error.statusCode)
    console.error('- Message:', error.message)
    console.error('- Response body:', error.response?.body)

    // Check for common issues
    if (error.statusCode === 403) {
      console.error('403 Forbidden Error: This could be due to:')
      console.error('1. Invalid API key')
      console.error('2. API key without proper permissions')
      console.error('3. IP restriction issues (even with 0.0.0.0 added)')
      console.error('4. Sender email not verified in Brevo account')
      console.error('5. Account limitations or suspension')
    }

    throw error
  }
}

export const BrevoProvider = {
  sendEmail
}

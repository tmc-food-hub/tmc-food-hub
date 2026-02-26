<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { background-color: #2196F3; color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .highlight { background-color: #E3F2FD; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .highlight strong { color: #1976D2; }
        .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; }
        .button { display: inline-block; padding: 12px 30px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
      
        <div class="content">
            <p style="font-size: 16px;">Hi <strong>{{ $contact->name }}</strong>,</p>
            
            <p>Thank you for reaching out! We have received your message and typically respond within 24-48 hours during business days; if urgent, please contact us directly.</p>
            
                        
            <p style="margin-top: 30px;">Best regards,<br>
            <strong>{{ config('app.name') }} Team</strong></p>
        </div>
        
        <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
            <p>If you did not submit this form, please disregard this email.</p>
        </div>
    </div>
</body>
</html>
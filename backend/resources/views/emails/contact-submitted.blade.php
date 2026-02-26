<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { background-color: #4CAF50; color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px 20px; }
        .info-row { margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 4px; }
        .label { font-weight: bold; color: #555; display: inline-block; width: 100px; }
        .value { color: #333; }
        .message-box { background-color: #f5f5f5; padding: 20px; margin-top: 20px; border-radius: 4px; }
        .message-box .label { display: block; margin-bottom: 10px; }
        .footer { padding: 20px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1> New Contact Form Submission</h1>
        </div>
        
        <div class="content">
            <p style="font-size: 16px; color: #555;">You have received a new message from your website contact form:</p>
            
            <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">{{ $contact->name }}</span>
            </div>
            
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">{{ $contact->email }}</span>
            </div>
            
            <div class="info-row">
                <span class="label">Subject:</span>
                <span class="value">{{ $contact->subject }}</span>
            </div>
            
           
            
            <div class="message-box">
                <span class="label">Message:</span>
                <div style="color: #333; line-height: 1.6;">{{ $contact->message }}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>To respond to this inquiry, reply directly to: <strong>{{ $contact->email }}</strong></p>
            <p>This is an automated notification from your Laravel application.</p>
        </div>
    </div>
</body>
</html>
/*
 Incoming message looks like:
 {
recipient: 'game1@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org',
  sender: 'thekevinscott@gmail.com',
  subject: 'Re:',
  from: 'Kevin Scott <thekevinscott@gmail.com>',
  'X-Mailgun-Incoming': 'Yes',
  'X-Envelope-From': '<thekevinscott@gmail.com>',
  Received:
   [ 'from mail-oi0-f48.google.com (mail-oi0-f48.google.com [209.85.218.48]) by mxa.mailgun.org with ESMTP id 56fed6c3.7fe670b23bf0-in1; Fri, 01 Apr 2016 20:14:59 -0000 (UTC)',
     'by mail-oi0-f48.google.com with SMTP id d205so121078136oia.0        for <game1@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org>; Fri, 01 Apr 2016 13:14:59 -0700 (PDT)' ],
  'Dkim-Signature': 'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:references:in-reply-to:from:date:message-id:subject:to;        bh=Ac9Mr0A6kdLR+PUNbQI2MW5YRLfFPxufc5dItZAg30U=;        b=mJQvLBG1lx/p9IVL5uiJLinhsdzXgxRm/mMCJJr8KXeypCZ36XP6mYxqDhsenTr2nO         4tbbU63BRfLraDj7zZ4THlVJPhnIAouOn9uESvsQPQsLua419g+wiAw3QDyqeZF5ZwkB         vLuX/lvOzEN9CymXlTyEEsp8VObK4tkYhhJtP6tUrgC26b7bOXSZ9hkQFRybGR3YEtw8         btU1kHHGabPpx38hd3v7B/awonHZbtfSv5XJvDxoKTcr+fILwRHnzwux5qruQ5R1Y7j7         EumFY8i0t7y3C69mVFt/tonEDXfAUL7Mk5fxHvnJOPqunmPNZZt+HNyEKdEG+sJmOcLr         n1fw==',
  'X-Google-Dkim-Signature': 'v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20130820;        h=x-gm-message-state:mime-version:references:in-reply-to:from:date         :message-id:subject:to;        bh=Ac9Mr0A6kdLR+PUNbQI2MW5YRLfFPxufc5dItZAg30U=;        b=mFJ17vlHnMb267txoAiFIWRyttNxGjhJBL6YSyFMBZCFmU13O6HOEDeFPjYw/pVWE5         awX+txR9NgopG9Erw1CS9f0vY7x3LcfFzMXSDXgM95FaZrkaehEMsqgn5noyCVARQv82         KHWYMzdKStejqvM3toOBWuQunXaAOkMSdg20Ba7Si9qp5UwQfRPdUzA3DGYpapQNbj5d         Re9RRS58GXDcR9VKJe3j0B1LEBXMJBuDtGDzVERfG57UU2hhhwwGRYvAWlIuAbpPNUw0         q/4Lz8ErvKGi+cSY2pXY1xwi4u33uViG9EENMtkqj8j7DoxfrBfGt0n6wNuSKhcw+bWH         7FsQ==',
  'X-Gm-Message-State': 'AD7BkJIHknoYp9XEtUac/hkJsy/7xkeXinzzuetDSq9mXB47OiZ0qNg1CP7syKYf8enII5mR+E5R9p+YslQqXQ==',
  'X-Received': 'by 10.157.9.40 with SMTP id 37mr4022328otp.144.1459541699240; Fri, 01 Apr 2016 13:14:59 -0700 (PDT)',
  'Mime-Version': '1.0',
  References: '<20160401201332.49889.81279.5F768899@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org>',
  'In-Reply-To': '<20160401201332.49889.81279.5F768899@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org>',
  From: 'Kevin Scott <thekevinscott@gmail.com>',
  Date: 'Fri, 01 Apr 2016 20:14:48 +0000',
  'Message-Id': '<CAEdG8TdrUEP_kN5u8jgR3y=5v+crX_qnfjkQE8u0QWZzc-_BjQ@mail.gmail.com>',
  Subject: 'Re:',
  To: 'EmojiBot <game1@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org>',
  'Content-Type': 'multipart/alternative; boundary="94eb2c04f1d084b56d052f7208bd"',
  'message-headers': '[["X-Mailgun-Incoming", "Yes"], ["X-Envelope-From", "<thekevinscott@gmail.com>"], ["Received", "from mail-oi0-f48.google.com (mail-oi0-f48.google.com [209.85.218.48]) by mxa.mailgun.org with ESMTP id 56fed6c3.7fe670b23bf0-in1; Fri, 01 Apr 2016 20:14:59 -0000 (UTC)"], ["Received", "by mail-oi0-f48.google.com with SMTP id d205so121078136oia.0        for <game1@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org>; Fri, 01 Apr 2016 13:14:59 -0700 (PDT)"], ["Dkim-Signature", "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20120113;        h=mime-version:references:in-reply-to:from:date:message-id:subject:to;        bh=Ac9Mr0A6kdLR+PUNbQI2MW5YRLfFPxufc5dItZAg30U=;        b=mJQvLBG1lx/p9IVL5uiJLinhsdzXgxRm/mMCJJr8KXeypCZ36XP6mYxqDhsenTr2nO         4tbbU63BRfLraDj7zZ4THlVJPhnIAouOn9uESvsQPQsLua419g+wiAw3QDyqeZF5ZwkB         vLuX/lvOzEN9CymXlTyEEsp8VObK4tkYhhJtP6tUrgC26b7bOXSZ9hkQFRybGR3YEtw8         btU1kHHGabPpx38hd3v7B/awonHZbtfSv5XJvDxoKTcr+fILwRHnzwux5qruQ5R1Y7j7         EumFY8i0t7y3C69mVFt/tonEDXfAUL7Mk5fxHvnJOPqunmPNZZt+HNyEKdEG+sJmOcLr         n1fw=="], ["X-Google-Dkim-Signature", "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20130820;        h=x-gm-message-state:mime-version:references:in-reply-to:from:date         :message-id:subject:to;        bh=Ac9Mr0A6kdLR+PUNbQI2MW5YRLfFPxufc5dItZAg30U=;        b=mFJ17vlHnMb267txoAiFIWRyttNxGjhJBL6YSyFMBZCFmU13O6HOEDeFPjYw/pVWE5         awX+txR9NgopG9Erw1CS9f0vY7x3LcfFzMXSDXgM95FaZrkaehEMsqgn5noyCVARQv82         KHWYMzdKStejqvM3toOBWuQunXaAOkMSdg20Ba7Si9qp5UwQfRPdUzA3DGYpapQNbj5d         Re9RRS58GXDcR9VKJe3j0B1LEBXMJBuDtGDzVERfG57UU2hhhwwGRYvAWlIuAbpPNUw0         q/4Lz8ErvKGi+cSY2pXY1xwi4u33uViG9EENMtkqj8j7DoxfrBfGt0n6wNuSKhcw+bWH         7FsQ=="], ["X-Gm-Message-State", "AD7BkJIHknoYp9XEtUac/hkJsy/7xkeXinzzuetDSq9mXB47OiZ0qNg1CP7syKYf8enII5mR+E5R9p+YslQqXQ=="], ["X-Received", "by 10.157.9.40 with SMTP id 37mr4022328otp.144.1459541699240; Fri, 01 Apr 2016 13:14:59 -0700 (PDT)"], ["Mime-Version", "1.0"], ["References", "<20160401201332.49889.81279.5F768899@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org>"], ["In-Reply-To", "<20160401201332.49889.81279.5F768899@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org>"], ["From", "Kevin Scott <thekevinscott@gmail.com>"], ["Date", "Fri, 01 Apr 2016 20:14:48 +0000"], ["Message-Id", "<CAEdG8TdrUEP_kN5u8jgR3y=5v+crX_qnfjkQE8u0QWZzc-_BjQ@mail.gmail.com>"], ["Subject", "Re:"], ["To", "EmojiBot <game1@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org>"], ["Content-Type", "multipart/alternative; boundary=\\"94eb2c04f1d084b56d052f7208bd\\""]]',
  timestamp: '1459541701',
  token: '6038e7cc6604fe4c417fb8f895f8ef72ba9f5a48c0e87fcd92',
  signature: 'eb2efd0fe9e930ce19b4c365911edf08802bfc3ce3edac6cc657bd1878024aa5',
  'body-plain': 'GET OFF ME\r\n\r\nOn Fri, Apr 1, 2016 at 4:14 PM EmojiBot <\r\ngame1@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org> wrote:\r\n\r\n> ya mutha\r\n>\r\n',
  'body-html': '<div dir="ltr">GET OFF ME</div><br><div class="gmail_quote"><div dir="ltr">On Fri, Apr 1, 2016 at 4:14 PM EmojiBot &lt;<a href="mailto:game1@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org">game1@sandboxffe8ba4cf31144e79c809c7d8f3f499f.mailgun.org</a>&gt; wrote:<br></div><blockquote class="gmail_quote" style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex">ya mutha<br>\r\n</blockquote></div>\r\n',
  'stripped-html': '<html><body><div dir="ltr">GET OFF ME</div><br></body></html>',
  'stripped-text': 'GET OFF ME',
  'stripped-signature': '' }*/


module.exports = function parse(params) {
  // The email address being replied to
  const to = params.recipient;

  // The user who is responding
  const from = params.sender;

  const body = params['stripped-text'];

  return {
    body,
    to,
    from,
    data: JSON.stringify(params)
  };
};
